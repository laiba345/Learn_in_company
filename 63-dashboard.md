```
<template>
  <div class="dashboard-layout">
    <el-container>
      <el-header class="header">
        <div class="title">Genius Cloud</div>
        <div class="datetime">
          <span class="curDay">{{ datePart }}</span>
          <span class="weekday">{{ weekdayPart }}</span>
          <span class="curTime">{{ currentTime }}</span>
          <el-dropdown placement="bottom-end">
            <el-icon :size="30" color="#FFFFFF" class="headIcon">
              <User />
            </el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="goBackendManagement">
                  <el-icon> <Monitor /> </el-icon>
                  <span style="margin-left: 5px">Backend Management</span>
                </el-dropdown-item>
                <el-dropdown-item  @click="logOut">
                  <i class="iconfont icon-line-signout"></i>
                  <span style="margin-left: 5px">Log out</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-container>
        <el-aside style="flex-basis: 25%" class="left-sidebar">
          <div class="small-panel"><span>Core Server Usage</span></div>
          <div class="chart-panel">
            <HDDStorage :hdd-usage-data="hddUsageData" /> 
          </div>
          <div class="chart-panel">
            <LineChart :chart-data="transformedServerMetrics"/>
          </div>
          <div class="chart-panel">
            <LineChart  chartTitle="RAM Usage" :chart-data="transformedRamServerMetrics" />
          </div>
          <div class="button-group">
           <button 
              v-for="(group, index) in serverGroups" 
              :key="group"
              class="button"
              :class="[getButtonClass(index, serverGroups.length), { 'selected-button': group === selectedGroup }]"
              @click="handleServerGroupChange(group)"
            >
              {{ group }}
            </button>
          </div>
        </el-aside>

        <el-main class="main-content">
          <div class="world-map">
            <div class="map-box">
              <WorldChart @site-change="handleSiteChange" />
            </div>
            <div class="map-info-box">
              <span class="info-item">Normal<span class="number normal">{{ serverStatus.normal }}</span></span>
              <span class="info-item">Abnormal<span class="number abnormal">{{ serverStatus.abnormal }}</span></span>
              <span class="info-item">Offline<span class="number offline">{{ serverStatus.offline }}</span></span>
            </div>
          </div>
          <div class="status-info">
            <div class="info-box">
              <h2 class="table-title">Server Distribution</h2>
              <ServerDistribution :chart-data="serverDistribution"/>
            </div>
            <div class="info-box">
              <h2 class="table-title">Server Status By Group</h2>
              <ServerStatusByGroup :serverStatusByGroupList = "wsMessageStatusStore.core_server_status_by_group" />
            </div>
          </div>
        </el-main>

        <el-aside style="flex-basis: 25%" class="right-sidebar">
          <div class="panel">
            <div class="small-panel">
              <span>Test Server Distributon</span>
            </div>
            <div class="chart-panel">
              <TestServerDistribution :chart-data="wsMessageStatusStore.test_server_distribution"/>
            </div>
          </div>

          <div class="panel">
            <div class="small-panel">
              <span>Test Server Healthy Status</span>
            </div>
            <div class="chart-panel">
              <TestServerHealthStatus :testServerHealthyStatus="wsMessageStatusStore.tester_server_healthy_status" />
            </div>
          </div>
          <div class="panel">
            <div class="small-panel">
              <span>Alert</span>
            </div>
            <div class="chart-panel">
              <AlertSection :alertData="wsMessageStatusStore.alertData"/>
            </div>
          </div>
        </el-aside>
      </el-container>
      <el-footer>
        <div class="footer"></div>
      </el-footer>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import VueCookies from 'vue-cookies';
import HDDStorage from '@/components/dashboard/echarts/HDDStorage.vue';
import LineChart from '@/components/dashboard/echarts/LineChart.vue';
import WorldChart from '@/components/dashboard/echarts/WorldChart.vue';
import ServerDistribution from '@/components/dashboard/echarts/ServerDistribution.vue';
import ServerStatusByGroup from '@/components/dashboard/echarts/ServerStatusByGroup.vue';
import TestServerDistribution from '@/components/dashboard/echarts/TestServerDistribution.vue';
import TestServerHealthStatus from '@/components/dashboard/echarts/TestServerHealthStatus.vue';
import AlertSection from '@/components/dashboard/echarts/AlertSection.vue';

import { getAllStatusServer, getGroupList, getAllFactorySite, getServerDistribution, getCoreServerDistribution } from '@/api/dashboard/dashboard';
import { hostname } from '@/api/config';
import { WebSocketManager } from '@/utils/websocketManager';
import { timeZoneStore } from '@/stores/timeStore/timeZone';
import moment from 'moment';

const timezone = ref([8, 0]);
const datePart = ref('');
const weekdayPart = ref('');
const currentTime = ref('');
const router = useRouter();
const cookies: any = VueCookies; 

const wsManager = ref<WebSocketManager | null>(null);
const alertWsManager = ref<WebSocketManager | null>(null);
const hddUsageData = ref<Array<{hddName: string, hdd: number}>>([]);

// define Core Server Usage
const timeArray = ref<string[]>([]); 

// CPU Usage Data 
const serverMetrics = ref<Array<{
  name: string;
  data: string[];
}>>([]);

// RAM Usage Data 
const ramServerMetrics = ref<Array<{
  name: string;
  data: string[];
}>>([]);

const serverGroups = ref<string[]>([]);

// 监控数据推送  URL : wss://XX/ws/dashboard/status/
type WebSocketStatusMessage = {
  type: string;
  message: any;
};

// define alert data
interface AlertItem {
  hostname: string;
  indicator_type: 'resource' | 'service' | 'task';
  server_id: number;
  property: string;
}

// 定义监控数据的数据结构
interface WsMessageStatusStore {
  test_server_distribution?: ServerDistributionItem[];
  tester_server_healthy_status?: {
    [location: string]: {  // 如 FJZ
      [serverType: string]: {  // 如 PURE
        abnormal_resource: number;
        abnormal_service: number;
        abnormal_task: number;
        normal_resource: number;
        normal_service: number;
        normal_task: number;
      };
    };
  };
  core_server_status_by_group?: {
    [groupName: string]: boolean;  // 如 "G1-CISCO-FOL": true
  };
  resource_lastest_status?: {
    [groupName: string]: Array<{
      hostname: string;
      ip: string;
      resource: {
        hdd: number;
        ram: number;
        cpu: number;
      };
    }>;
  };
  alertData?: AlertItem[];
}

// define Test Server Distributon
interface TestServerDistributionItem {
  name: string;
  value: number;
}
type RawDistributionData = Record<string, Record<string, number>>;

const wsMessageStatusStore = reactive<WsMessageStatusStore>({
  alertData: [] 
});

// Initialize server status
const serverStatus = reactive({
  normal: 0,    
  abnormal: 0,  
  offline: 0    
});

interface ServerDistributionItem {
  name: string;
  value: number;
}
// Initialize server distribution
const serverDistribution = ref<ServerDistributionItem[]>([]);

// Initialize Site 
const currentSite = ref('FOL');
const currentServerGroup = ref('G1-CISCO-FVN'); 
const selectedGroup = ref('');

const coreServerDistributionTimer = ref<NodeJS.Timeout | null>(null);

const getButtonClass = (index: number, total: number) => {
  if (total === 1) return 'single-button';
  // odd && the last one
  if (total % 2 !== 0 && index === total - 1) return 'single-button';
  return index % 2 === 0 ? 'left-button' : 'right-button';
};

// first websocket
const initWebSocket = () => {
  let currentUrl = window.location.hash.substring(1) + '/status/';
  let currentHostName = 'https://' + hostname + '/api';
  let urlObj = new URL(currentHostName); 
  let wsUrl = urlObj.protocol === 'https:' ? 'wss:' : 'ws:'; 
  wsUrl += '//' + urlObj.hostname + '/ws' + currentUrl + '?site=' + currentSite.value; 
  wsManager.value = new WebSocketManager(wsUrl, router); 
   // 消息处理
  const removeHandler = wsManager.value.addMessageHandler((data: WebSocketStatusMessage) => {
     switch(data.type) {
      case 'test_server_distribution': {
        const rawData = data.message as RawDistributionData;
        wsMessageStatusStore.test_server_distribution = transformDistributionData(rawData);
        break;
      }
      case 'tester_server_healthy_status': {
        const rawData = data.message as { [location: string]: any };
        let curSite = currentSite.value; 
        // 提取 FJZ 的数据
        wsMessageStatusStore.tester_server_healthy_status = rawData[currentSite.value];
        break; 
      }
      case 'core_server_status_by_group':
      case 'resource_lastest_status':
        wsMessageStatusStore[data.type] = data.message;
        break;
      default:
        console.warn(`未知的消息类型: ${data.type}`, data);
    }
  });
};

// second websocket 
const initAlertWebSocket = () => {
  const currentHostName = 'https://' + hostname + '/api';
  const urlObj = new URL(currentHostName);
  const wsUrl = urlObj.protocol === 'https:' ? 'wss:' : 'ws:';
  const alertWsUrl = wsUrl + '//' + urlObj.hostname + '/ws/dashboard/alert/';

  alertWsManager.value = new WebSocketManager(alertWsUrl, router);
  alertWsManager.value?.addMessageHandler((data: WebSocketStatusMessage) => {
    if (data.type === 'alert_data') {
      wsMessageStatusStore.alertData = data.message;
    }
  });
}; 

// 获取CPU Usage 新数据
const transformedServerMetrics = computed(() => {
  return timeArray.value.map((time, index) => {
    const timePointData: Record<string, any> = { time };
    serverMetrics.value.forEach((server) => {
      timePointData[server.name] = server.data[index] || 0;
    });
    return timePointData;
  });
});

// 获取RAM Usage 新数据
const transformedRamServerMetrics = computed(() => {
  if (!timeArray.value.length || !ramServerMetrics.value.length) return [];
  return timeArray.value.map((time, index) => {
    const timePointData: Record<string, any> = { time };
    ramServerMetrics.value.forEach((server) => {
      timePointData[server.name] = server.data[index] || 0;
    });
    return timePointData;
  });
});

const updateTime = () => {
  const now = new Date();
  const dayMap = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  datePart.value = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(
    2,
    '0'
  )}.${String(now.getDate()).padStart(2, '0')}`;
  weekdayPart.value = dayMap[now.getDay()];
  currentTime.value = now.toLocaleTimeString('zh-CN', { hour12: false });
};

const logOut = () => {
  cookies.remove('username');
  cookies.remove('role');
  cookies.remove('token');
  cookies.remove('pid');
  cookies.remove('adrole');
  cookies.remove('bu');
  cookies.remove('fromRouter');
  cookies.remove('toRouter');
  localStorage.removeItem('token');
  router.push('/login');
};

const getAllStatus = async () => {
  try {
    const { data: res } = await getAllStatusServer();
    if (res.status) {
      serverStatus.normal = res.payload.data.normal_server_count;
      serverStatus.abnormal = res.payload.data.abnormal_server_count;
      serverStatus.offline = res.payload.data.offline_server;
    }
  } catch (error) {
    console.error('Error fetching all status:', error);
  }
};

const getServerGroupList = async () => {
  try {
    const { data: res } = await getGroupList({ site: currentSite.value });
    if (res.status) {
      serverGroups.value = res.payload.data;
      if (serverGroups.value.length > 0) {
        selectedGroup.value = serverGroups.value[0];
        currentServerGroup.value = serverGroups.value[0];
      }
    }
  } catch (error) {
    console.error('Error fetching server group list:', error);
  }
};

const getAllFactorySiteData = async () => {
  try {
    const { data: res } = await getAllFactorySite();
    if (res.status) {
      return; 
    }
  } catch (error) {
    console.error('Error fetching factory sites:', error);
  }
};

const getServerDistributionList = async () => {
  try {
    const { data: res } = await getServerDistribution();
    if (res.status) {
      serverDistribution.value = Object.entries(res.payload.data.server_distribution).map(
        ([name, value]) => ({ 
          name, 
          value: Number(value)
        })
      );
    }
  } catch (error) {
    console.error('Error fetching server distribution:', error);
  }
};

const getCoreServerDistributionList = async () => {
  try {
    const { data: res } = await getCoreServerDistribution({ site: currentSite.value, server_group: currentServerGroup.value });
    if (res.status) {
      const serverData = res.payload.data[currentSite.value][currentServerGroup.value];
      // First Extract Time Array
      processTimeArray(serverData);
      // Second Extract CPU Usage Data
      processServerMetrics(serverData);
      // Third Extract RAM Usage Data
      processRamUsageData(serverData); 
      // Fourth Extract HDD Usage Data 
      hddUsageData.value = Object.entries(serverData).map(([serverName, serverInfo]) => ({
        hddName: serverName,
        hdd: convertHddValue((serverInfo as { hdd: string | number }).hdd)
      }));
      // console.log(res.payload.data);
      // const line = [{ n: '01:55', CPU: '10%', RAM: '10%', HDD: '10%' }, { n: '02:00', CPU: '10%', RAM: '10%', HDD: '10%' }];
      // let showdata = line.map((item) => {
      //   return {
      //     // 使用2025-10:04 10:00
      //     time: moment(item.n)
      //       .add(timezone.value[0] * timezone.value[1], 'hours')
      //       .add(timezone.value[0] * timezone.value[2], 'minutes')
      //       .format('HH:mm'),
      //      CPU: item.CPU
      //   };
      // });
      // console.log(showdata);
    }
  } catch (error) {
    console.error('Error fetching server distribution:', error);
  }
};

// 转换hdd数据格式或类型
const convertHddValue = (hddValue: string | number): number => {
  if (typeof hddValue === 'number') return hddValue;
  return hddValue === '-' || hddValue.trim() === '' ? 0 : Number(hddValue) || 0;
};

// 处理site变化
const handleSiteChange = async(newSite: string) => {
  currentSite.value = newSite;
  wsManager.value?.close(); 
  initWebSocket();

  await getAllStatus();
  await getServerGroupList();
  await getCoreServerDistributionList();
};


// 3. 定义转换函数
function transformDistributionData(rawData: RawDistributionData): ServerDistributionItem[] {
  const result: ServerDistributionItem[] = [];
  const fjzData = rawData[currentSite.value] || {};
  for (const [name, value] of Object.entries(fjzData)) {
    result.push({ name, value });
  }
  return result;
}

const goBackendManagement = () => {
  router.push('/monitoring'); 
}; 

const goHomePage = () => {
  router.push('/monitoring');
};

// Extract Time Array
const processTimeArray = (serverData: Record<string, any>) => {
  timeArray.value = []; 
  const firstServer = Object.values(serverData)[0];
  if (firstServer?.line?.resource) {
    const rawTimes = firstServer.line.resource.map((item: any) => item.n.trim());
    timeArray.value = rawTimes.map((timeStr: string) => {
      return moment(timeStr)
        .add(timezone.value[0] * timezone.value[1], 'hours')
        .add(timezone.value[0] * timezone.value[2], 'minutes')
        .format('HH:mm');
    });
  }
};

// 根据站点调整时间的函数（保持不变）
// const adjustTimeBySite = (timeStr: string, site: string): string => {
//   const [hours, minutes] = timeStr.split(':').map(Number);
  
//   let offset = 0;
//   switch(site) {
//     case 'FOL': offset = 8; break;
//     case 'FVN': offset = 7; break;
//     case 'FCZ': offset = 1; break;
//     case 'FJZ': 
//     case 'FTX': 
//       offset = -6; 
//       break;
//     default: offset = 0;
//   }
  
//   let newHours = hours + offset;
//   if (newHours >= 24) newHours -= 24;
//   else if (newHours < 0) newHours += 24;
  
//   return `${String(newHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
// };


const processMetricsData = (
  serverData: Record<string, any>,
  field: string // cpu' / 'ram'
) => {
  const fieldUpper = field.toUpperCase();
  return Object.entries(serverData).map(([name, info]) => ({
    name,
    data: (info.line?.resource || []).map((item: any) => {
      const value = item[fieldUpper] ?? item[field] ?? '-';
      return value === '-' ? 0 : Number(value) || 0;
    })
  }));
};

// 调用示例
const processServerMetrics = (serverData: Record<string, any>) => {
  serverMetrics.value = processMetricsData(serverData, 'cpu');
};

const processRamUsageData = (serverData: Record<string, any>) => {
  ramServerMetrics.value = processMetricsData(serverData, 'ram');
};

const handleServerGroupChange = (group: string) => {
  currentServerGroup.value = group;
  selectedGroup.value = group; 
  getCoreServerDistributionList();
};

onMounted(async() => {
  const time_zone = timeZoneStore().handletimeZone();
  const t = time_zone[0] === '+' ? 1 : -1;
  timezone.value = time_zone.substring(1).split(':').map(Number);
  timezone.value.unshift(t); 
  updateTime();
  initWebSocket(); 
  initAlertWebSocket(); 
  await getAllStatus(); 
  await getServerGroupList(); 
  getAllFactorySiteData();
  getServerDistributionList(); 
  await getCoreServerDistributionList(); 

  coreServerDistributionTimer.value = setInterval(getCoreServerDistributionList, 120000);
  
  const timer = setInterval(updateTime, 1000);
  onUnmounted(() => {
    if (coreServerDistributionTimer.value) {
      clearInterval(coreServerDistributionTimer.value);
    }
    clearInterval(timer);
  });
});
</script>

<style lang="scss" scoped>
.dashboard-layout {
  width: 100vw;
  min-height: 100vh;
  height: auto !important; 
  // overflow-x: hidden;
  overflow: auto;
  background: #0a0f14 url('@/assets/dashboard/PageBg.png') no-repeat 0 0 / 100% 100%;
}

.left-sidebar, .main-content, .right-sidebar {
  min-height: 88vh;
  height: auto;
}

.header {
  height: 8vh;
  display: flex;
  justify-content: space-between;
  background: url('@/assets/dashboard/HeadBg.png') no-repeat 0 0 / 100% 80%;
  //  no-repeat center/cover
  .title {
    margin: 0.5vh 0 0 0;
    color: #edf6ff;
    font-size: 36px;
    font-weight: 700;
  }
  .datetime {
    height: 3vh;
    margin: 1.9vh 1.4vw 0 0;
    display: flex;
    align-items: center;
    gap: 10px;
    .curDay {
      font: 400 22px Inter;
      color: #acc9e6;
    }
    .weekday {
      margin-top: -0.2vh;
      margin-left: 0.6vw;
      font: 400 21px Inter;
      color: #acc9e6;
    }
    .curTime {
      margin-left: 0.6vw;
      font: 400 32px Inter;
      color: #acc9e6;
    }
    .headIcon {
      margin-left: 1vw;
    }
    .headIcon:hover {
      cursor: pointer;
    }
  }
}

.left-sidebar {
  height: 88vh;
  padding: 0 1.2vh 1vh 1vh;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 1vh;
  overflow: hidden;

  .small-panel {
    margin-top: 0.3vh;
    height: 3.2vh;
    background: url('@/assets/dashboard/SideBg.png') no-repeat center/cover;
    span {
      display: inline-block;
      height: 30px;
      margin: 0.41vh 0 0 0.6vw;
      color: #edf6ff;
      font-size: 16px;
      font-weight: 700;
    }
  }
.button-group {
  display: flex;
  align-items: center;
  .button {
    width: 5vw;
    height: 1.9vh;
    margin-top: 0.6vh;
    color: #ffffff;
    font-size: 10px;
    font-weight: 400;
    cursor: pointer;
    border: none;
    outline: none;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background-color 0.2s, transform 0.1s;
    
    &.left-button {
      background-color: rgba(7, 106, 235, 0.3);
      border-top-left-radius: 0.8vh;
      border-bottom-left-radius: 0.8vh;
      border-right: 0.1vh solid transparent;
      
      &.selected-button {
        background-color: rgba(7, 106, 235, 0.5);
      }
    }
    
    &.right-button {
      background-color: rgba(7, 106, 235, 0.3);
      border-top-right-radius: 0.8vh;
      border-bottom-right-radius: 0.8vh;
      border-left: 0.1vh solid transparent;
      
      &.selected-button {
        background-color: rgba(7, 106, 235, 0.5);
      }
    }
    
    &.single-button {
      background-color: rgba(7, 106, 235, 0.3);
      border-radius: 0.8vh;
      border: 0.1vh solid transparent;
      
      &.selected-button {
        background-color: rgba(7, 106, 235, 0.5);
      }
    }
    
    &:active {
      transform: scale(0.95);
    }
  }
}
}

.main-content {
  height: 88vh;
  padding: 0 1.2vh 1vh 1vh;
  gap: 1.3vh;
  display: flex;
  flex-direction: column;

  color: #ffffff;
  overflow: hidden;

  // .world-map,
  // .status-info {
  //   // width: 100%;
  // }

  .world-map {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    height: 56vh;
    // margin-top: 5px;
    background: url('@/assets/dashboard/MapThree.png') no-repeat 0 0 / 100% 100%;
    // background-size: cover;
    .map-box {
      width: 39vw;
      height: 45vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .map-info-box {
      width: 27vw;
      height: 10vh;
      display: flex;
      margin-left: 3vw;
      align-items: center;
      justify-content: space-between;
      color: #ffffff;
      .info-item {
        display: flex;
        align-items: center;
        font: 400 15px Inter;
        .number {
          font: 500 28px Aldrich;
          font-family: 'Segoe UI', sans-serif;
          line-height: 3vh;
          margin-left: 1.5vw;
        }
      }
      .normal {
        color: #00a72f;
      }

      .abnormal {
        color: #ff0000;
      }

      .offline {
        color: #febc22;
      }
    }
  }
  .status-info {
    display: flex;
    gap: 1vw;
    .info-box {
      //  padding: 0.5vw;
      flex: 0 0 calc(50% - 0.5vw); 
      width: calc(50% + 0.5vw);   
      height: 28.8vh;
      background-color: rgba(7, 106, 235, 0.1);
      color: #ffffff;
      
      .table-title {
        background-color:  rgba(23, 40, 60, 0.45);
        color: #ffffff;
        font-size: 16px;
        font-weight: 600;
        padding: 0.5vw;
      }
    }
  }
}

.right-sidebar {
  height: 88vh;
  padding: 0 1.2vh 1vh 1vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .panel:nth-of-type(1) .small-panel {
    margin-top: 0.3vh;
  }

  .panel:nth-of-type(n + 2) .small-panel {  
    margin-top: 1.13vh;
  }

  .small-panel {
    height: 3.2vh;
    background: url('@/assets/dashboard/SideBg.png') no-repeat center/cover;
    span {
      display: inline-block;
      height: 30px;
      margin: 0.41vh 0 0 0.6vw;
      color: #edf6ff;
      font-size: 16px;
      font-weight: 700;
    }
  }
  .panel:nth-of-type(1) .chart-panel { 
    width: 100%;
    height: 22vh;
  }
  .panel:nth-of-type(2) .chart-panel {
    height: 30.2vh;
  }
  .panel:nth-of-type(3) .chart-panel {
    height: 21.8vh;
  }
}

.footer {
  width: 100%;
  height: 2vh;
  color: #ffffff;
  text-align: center;
  background: url('@/assets/dashboard/footer.png') no-repeat 0 0 / 100% 100%;
}

::v-deep .el-footer {
  --el-footer-padding: 0 10px;
  --el-footer-height: 20px;
}

::v-deep .el-icon,
::v-deep .el-space {
  outline: none;
  border: none;
  box-shadow: none;
}
</style>
```
