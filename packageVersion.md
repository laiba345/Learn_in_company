```
<template>
  <v-layout row wrap>
    <v-flex xl12 pa-0>
      <div style="margin-top: -8px;">
        <span class="FontH3">Program Version</span>
        <div slot="widget-header">
          <span style="color: #7f7f7f;" class="FontH8">Latest Versions：{{ latestversionList.genius }}，{{ latestversionList.top }}</span>
        </div>
      </div>
      <div slot="widget-content">
        <v-layout row style="margin-top: 10px;">
          <div style="width: 130px;">
            <v-select v-model="params.bu" outline class="SelectBlockOffset" dense clearable :items="buList"
              placeholder="BU" :menu-props="{ bottom: true, offsetY: true }" @change="handleSearch">
              <template v-slot:selection>
                <div class="FontT1" style="width: 56px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ params.bu }}</div>
              </template>
            </v-select>
          </div>
          <div style="width: 150px;" class="mx-2">
            <v-autocomplete v-model="params.repository_name" outline class="SelectBlockOffset" dense clearable :items="tecodeList"
              placeholder="Repository" :menu-props="{ bottom: true, offsetY: true }" @change="handleSearch">
              <template v-slot:selection>
                <div class="FontT1" style="width: 76px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ params.repository_name }}</div>
              </template>
            </v-autocomplete>
          </div>
          <div style="width: 250px">
            <v-text-field class="hidden-sm-and-down MacManageSearch" color="primary" solo clearable
              placeholder="Server Name / IP Address" v-model="params.search" v-on:keyup.enter="handleSearch">
              <template slot="append">
                <button id="searchButton">
                  <i class="iconfont icon-search" style="font-size: 18px;" @click="handleSearch"></i>
                </button>
              </template>
            </v-text-field>
          </div>
          <v-spacer></v-spacer>
          <v-btn v-if="macAccess && isadmin" color="primary" class="btn_content" @click="addData">Add</v-btn>
          <v-tooltip bottom v-if="macAccess && isadmin">
            <template v-slot:activator="{ on }">
              <v-icon v-on="on" color="primary" class="refreshbtn" @click="refreshVersion" :disabled="refreshloading">refresh</v-icon>
            </template>
            <span>Refresh</span>
          </v-tooltip>
        </v-layout>
          <v-card flat style="margin-top: -3px;">
            <v-data-table
            :headers="headers"
            :pagination.sync="pagination"
            :items="programList.result"
            :rows-per-page-items="[15, 50, 100, 200, 500, 1000]"
            class="elevation-1 BlockOffsetTable ThemeTable TableNumber"
            :hide-actions="programList.res_count <= 15"
            :total-items="programList.res_count"
            :no-data-text="customNoDataText"
            >
            <template v-slot:headers="props">
              <tr class="text-md-left">
              <th>{{ props.headers[0].text }}</th>
              <th :class="['column sortable', pagination.descending ? 'desc' : 'asc', props.headers[1].value === pagination.sortBy ? 'active' : '']"
                @click="changeSort(props.headers[1].value)">
                <v-icon small>arrow_upward</v-icon>
                {{ props.headers[1].text }}
              </th>
              <th :class="['column sortable', pagination.descending ? 'desc' : 'asc', props.headers[2].value === pagination.sortBy ? 'active' : '']"
                @click="changeSort(props.headers[2].value)">
                <v-icon small>arrow_upward</v-icon>
                {{ props.headers[2].text }}
              </th>
              <th>{{ props.headers[3].text }}</th>
              <th>{{ props.headers[4].text }}</th>
              <th>{{ props.headers[5].text }}</th>
              <th>{{ props.headers[6].text }}</th>
              </tr>
            </template>
            <template slot="items" slot-scope="props">
              <tr>
                <td>{{ props.item.rowNum }}</td>
                <td style="padding-left: 43px;">{{ props.item.serverName }}</td>
                <td style="padding-left: 43px;">
                  <div class="ServerIpAddress">
                    <span @click="goNewUrl(props.item.ipAddress)">{{ props.item.ipAddress }}</span>
                  </div>
                </td>
                <td>
                  <!-- 有数据 -->
                  <div v-if="Object.keys(props.item.te_code).length > 0">
                    <!-- 不选te_code并且超过3条数据；选te_code并且超过1条数据 -->
                    <div v-if="(!params.repository_name && Object.keys(props.item.te_code).length > 3) ||
                      (params.repository_name && Object.keys(props.item.te_code).length > 1)">
                      <!-- 显示全部数据 -->
                      <div v-if="props.item.expand" style="display: flex;">
                        <div>
                          <div v-for="(key, index) in Object.keys(props.item.te_code)" :key="index">
                            <span :class="computeRepositoryColor(props.item.te_code[key].repository_current, props.item.te_code[key].last_version)">
                              {{ key }}: Current[{{ props.item.te_code[key].repository_current }}], Latest[{{ props.item.te_code[key].last_version }}]
                            </span>
                          </div>
                        </div>
                        <v-icon class="arrowclass" size="21" color="#9d4edc" @click="props.item.expand = false">arrow_drop_up</v-icon>
                      </div>
                      <!-- 收起数据 -->
                      <div v-else style="display: flex;">
                        <div>
                          <div v-for="(key, index) in Object.keys(props.item.te_code_shink)" :key="index">
                            <span v-if="key === 'placeholder'">......</span>
                            <span v-else :class="computeRepositoryColor(props.item.te_code_shink[key].repository_current, props.item.te_code_shink[key].last_version)">
                              {{ key }}: Current[{{ props.item.te_code_shink[key].repository_current }}], Latest[{{ props.item.te_code_shink[key].last_version }}]
                            </span>
                          </div>                                
                        </div>
                        <v-icon class="arrowclass" size="21" color="#9d4edc" @click="showTeCode(props.item.ipAddress)">arrow_drop_down</v-icon>
                      </div>                           
                    </div>
                    <!-- 其他情况 -->
                    <!-- <div v-else>
                      <div v-for="(key, index) in Object.keys(props.item.te_code)" :key="index">
                        <span>
                          {{ key }}
                          <span
                            :class="computeRepositoryColor(props.item.te_code[key].repository_current, props.item.te_code[key].last_version)"
                            :title="getVersionTooltip(
                              props.item.te_code[key].repository_current,
                              props.item.te_code[key].last_version
                            )"
                          >
                            ({{ props.item.te_code[key].repository_current || '-' }})
                          </span>
                        </span>
                      </div>                          
                    </div> -->
                    <div v-else>
                      <div v-for="(key, index) in Object.keys(props.item.te_code)" :key="index">
                        <span>{{ key }}</span>
                        <v-tooltip right :disabled="!getVersionTooltip(props.item.te_code[key].repository_current,props.item.te_code[key].last_version)">
                          <template v-slot:activator="{ on }">
                            <span v-on="on" :class="computeRepositoryColor(props.item.te_code[key].repository_current,props.item.te_code[key].last_version)">
                              ({{ props.item.te_code[key].repository_current || '-' }})
                            </span>
                          </template>
                          <span>
                            Latest Version:
                            {{ props.item.te_code[key].last_version }}
                          </span>
                        </v-tooltip>
                      </div>
                    </div>
                  </div>
                  <!-- 无数据 -->
                  <div v-else>
                    <span>-</span>
                  </div>
                </td>
                <td><span :class="computeVersionColor(props.item.geniusCurrent, latestversionList.genius.split('-')[1])">{{ props.item.geniusCurrent }}</span></td>
                <td><span :class="computeVersionColor(props.item.topCurrent, latestversionList.top.split('-')[1])">{{ props.item.topCurrent }}</span></td>
                <td>
                  <el-switch v-if="macAccess && isadmin" v-model="props.item.disabled" active-color="#9d4edc" @change="changeSelect(props.item)"></el-switch>
                  <span v-else> {{ props.item.disabled ? 'Enabled' : 'Disabled' }}</span>
                </td>
              </tr>
            </template>
            <template slot="actions-append">
              <div style="display: flex; align-items: center;">
                <span class="mx-4">{{ programList.res_start }}-{{ programList.res_end }} of {{ programList.res_count }}</span>
                <v-pagination v-model="page" :length="programList.page_num" :total-visible="5"></v-pagination>
                <span class="mx-1">Go to</span>
                <v-select class="SelectBlockOffset" style="width: 80px; margin-right: 10px;" v-model="page" outline dense
                  :items="pagesCount" :menu-props="{ bottom: true, offsetY: true }"></v-select>
              </div>
            </template>
            </v-data-table>
            <div v-if="programList.res_count > 0">
              <v-btn flat color="indigo" style="border-radius: 4px;" @click="exportExcel">
                <v-icon>flight_takeoff</v-icon> Export to Excel
              </v-btn>
            </div>
          </v-card>
      </div>
    </v-flex>
    <add-cell-lock ref="addcell" @updateList="updateList"></add-cell-lock>
  </v-layout>
</template>

<script>
import AddCellLock from '@/pages/gac/components/RuleSeting/AddCellLock.vue'; 
import JsonToExcel from '@/pages/gac/components/JsonToExcel.vue';
import VWidget from '@/components/VWidget';
import { debounce } from 'lodash';
import { latestversion, buList, tecodeList, versionList, versionupdate, updateServerList, downExcel } from '@/pages/gac/api/programversion';

export default {
  components: {
    JsonToExcel,
    AddCellLock,
    VWidget,
  },
  data() {
    return {
      username: '',
      macAccess: false,
      isadmin: false,
      refreshloading: false,
      latestversionList: {
        genius: 'genius-vx.x.x_xxxxxxxx',
        top: 'top-vx.x.xx_xxxxxxxx'
      },
      buList: [],
      tecodeList: [],
      page: 1,
      pagination: {
        descending: false,
        rowsPerPage: 15, 
        sortBy: ''
      },
      headers: [
        {
          text: 'ID',
          value: 'rowNum',
          sortable: false,
        },
        {
          text: 'Server Name',
          value: 'serverName',
        },
        {
          text: 'IP Address',
          value: 'ipAddress',
        },
        {
          text: 'Repository',
          value: 'te_code',
          sortable: false,
        },
        {
          text: 'Genius Version',
          value: 'geniusVersion',
          sortable: false,
        },
        {
          text: 'Top Version',
          value: 'topVersion',
          sortable: false,
        },
        {
          text: 'Enabled/Disabled',
          value: 'disabled',
          sortable: false,
        },
      ],
      params: {
        bu: '',
        repository_name: '',
        search: '',
        query: ''
      },
      programList: {
        result: [],
        res_count: 0,
        page_num: 0,
        res_start: 0,
        res_end: 0
      }
    };
  },
  computed: {
    pagesCount() {
      if (this.programList.page_num < 1) return [];
      return Array.from({ length: this.programList.page_num }, (_, index) => index + 1);
    },
    customNoDataText() {
      return this.params.query 
        ? 'No matching records found' 
        : 'No data available';
    }
  },
  watch: {
    page() {
      this.debouncedProgramList();
    },
    'pagination.rowsPerPage'() {
      this.page = 1;
      this.debouncedProgramList();
    },
    'params.bu'(newVal) {
      this.params.repository_name = '';
      this.tecodeList = [];
      if (newVal) this.getTEcodeList();
    },
    'params.search'(newVal, oldVal) {
      if (oldVal && !newVal) this.handleSearch();
    }
  },
  mounted() {
    this.getUsername();
    this.getLatestVersion();
    this.getBuList();
    // 使用防抖函数，防止短时间内接口多次调用
    this.debouncedProgramList = debounce(this.getProgramList, 50);
    this.debouncedProgramList();
  },
  beforeDestroy() {
    // 取消防抖队列中还未执行的定时器
    this.debouncedProgramList.cancel();
  },
  methods: {
    // 获取用户名
    getUsername() {
      const username = this.$cookies.get('username');
      this.role = this.$cookies.get('role');
      this.macAccess = this.role === 'engineer' ? true : false;
      if (username !== 'engineer') {
        this.username = username.split('(')[1].slice(0, -1);
      } else {
        this.username = username;
      }
      this.isadmin = Buffer.from(this.$cookies.get('admin'), 'base64').toString('utf-8') === 'true' ? true : false;
    },
    // 获取最新版本
    async getLatestVersion() {
      const { data: res } = await latestversion();
      if (res.status) this.latestversionList = res.payload.data;
    },
    // 获取buList
    async getBuList() {
      const { data: res } = await buList();
      if (res.status) this.buList = res.payload.data.filter(item => item !== '' && item.trim() !== '');
    },
    // 获取tecodeList
    async getTEcodeList() {
      const { data: res } = await tecodeList({ bu: this.params.bu });
      if (res.status) this.tecodeList = res.payload.data;
    },
    // 获取列表数据
    async getProgramList() {
      let params = { ...this.params };
      params.page_index = this.page;
      params.page_size = this.pagination.rowsPerPage;
      params.order_by = this.pagination.sortBy;
      params.order_rule = this.pagination.descending ? 'DESC' : 'ASC';
      await versionList(params)
        .then(response => {
          if (!response.data.status) {
            this.handleAlert('red', response.data.payload.message);
          }
          else {
            this.programList = response.data.payload;
            this.programList.result = response.data.payload.result.map(item => ({
              ...item,
              disabled: item.disabled === 0 ? true : false, // 0 -> enabled, 1 -> disabled
              expand: false,
              te_code: this.handleTeCode(item.te_code, this.params.repository_name),
              te_code_shink: this.handleTeCodeShink(this.handleTeCode(item.te_code, this.params.repository_name), this.params.repository_name)
            }));
          }
        })
        .catch(e => {
          this.handleAlert();
        });
    },
    // 开启/关闭按钮
    async changeSelect(item) {
      const params = {
        ip_address: item.ipAddress,
        disabled: item.disabled ? 0 : 1,
        username: this.username
      };
      await updateServerList(params)
        .then(response => {
          if (!response.data.status) {
            this.handleAlert('red', response.data.payload.message);
          }
          else {
            this.$message({
              showClose: true,
              message: response.data.payload.message,
              type: 'success', 
              customClass: 'custom-long-message' 
            });
            this.debouncedProgramList();
          }
        })
        .catch(e => {
          this.handleAlert();
        });
    },
    // 刷新程序版本监控列表
    async refreshVersion() {
      this.refreshloading = true;
      await versionupdate()
        .then(response => {
          if (!response.data.status) {
            this.handleAlert('red', response.data.payload.message);
          }
          else {
            this.page = 1;
            this.debouncedProgramList();
            this.handleAlert('success', response.data.payload.message);
          }
        })
        .catch(e => {
          this.handleAlert();
        });
      this.refreshloading = false;
    },
    // 下载Excel文件
    async exportExcel() {
      await downExcel(this.params)
        .then(response => {
          if (!response.data.status) {
            this.handleAlert('red', response.data.payload.message);
          }
          else {
            window.location.href = response.data.payload.data.url;
          }
        })
        .catch(e => { 
          this.handleAlert();
        });
    },
    // 选中机种的信息显示在第一行
    handleTeCode(obj, key) {
      if (!key) return { ...obj };
      if (obj.hasOwnProperty(key)) {
        const { [key]: prioritizedValue, ...rest } = obj;
        return { [key]: prioritizedValue, ...rest };
      }
      const keyArr = Object.keys(obj);
      const filterArr = keyArr.filter(item => item.includes(key));
      let shortestKey = filterArr[0];
      for (const item of filterArr) {
        if (item.length < shortestKey.length) shortestKey = item;
      }
      const { [shortestKey]: prioritizedValue, ...rest } = obj;
      return { [shortestKey]: prioritizedValue, ...rest };
    },
    // 处理收缩的te code
    handleTeCodeShink(obj, tecode) {
      const entries = Object.entries(obj);
      if (entries.length === 0) return {};
      const [firstKey, firstValue] = entries[0];
      const [lastKey, lastValue] = entries[entries.length - 1];
      if (!tecode) return { [firstKey]: firstValue, 'placeholder': '......', [lastKey]: lastValue };
      if (tecode) return { [firstKey]: firstValue };
    },
    handleSearch() {
      this.page = 1;
      this.pagination.sortBy = '';
      this.params.query = this.params.search;
      this.debouncedProgramList();
    },
    // 排序
    changeSort(column) {
      if (column === 'serverName' || column === 'ipAddress') {
        this.pagination.sortBy = column;
        this.pagination.descending = !this.pagination.descending;
        this.debouncedProgramList();
      }
    },
    // 跳转
    goNewUrl(IP) {
      let url = 'https://' + IP;
      window.open(url, '_blank');
    },
    // 添加
    addData() {
      this.$refs.addcell.showDialogs(this.username);
    },
    // 新增成功回调
    updateList(data) {
      if (!data.status) {
        this.handleAlert('red', data.payload.message);
      }
      else {
        this.page = 1;
        this.debouncedProgramList();
        this.handleAlert('success', data.payload.message);
      }
    },
    // 计算 repository列背景色
    computeRepositoryColor(str1, str2) {
      if (str2 === 'vx.x.x_xxxxxxxx') return '';
      if (!str1 || str1 === '-' || str1 !== str2) return 'version-status version-mismatch';
      return 'version-status version-match';
    }, 
    // 计算 Genius Version和Top Version列背景色
    computeVersionColor(str1, str2) {
      if (str1 === '-' || str2 === '-' || str2 === 'vx.x.x_xxxxxxxx') return '';
      if (str1 !== str2) return 'version-status version-mismatch';
      return 'version-status version-match';
    }, 
    // 展开完整Te Code数据
    showTeCode(ipAddress) {
      this.programList.result = this.programList.result.map(item => {
        return {
          ...item,
          expand: item.ipAddress === ipAddress ? true : false
        };
      });
    },
    getVersionTooltip(current, latest) {
      if (current === '' || current === '-') return latest;
      if (current !== latest) return latest;
      return '';
    },
    // 失败/成功提示语
    handleAlert(status, message) { 
      if (status === 'success') {
        this.$message({
          showClose: true,
          message,
          type: 'success'
        });
      } else if (status === 'red') {
        this.$message({
          showClose: true,
          message,
          type: 'error', 
          duration: 0, 
          customClass: 'custom-long-message' 
        });
      } else if (status === 'warning') {
        this.$message({
          showClose: true,
          message,
          type: 'warning', 
        }); 
      } else {
        this.$message({
          showClose: true,
          message: 'Service Error, Please Contact Genius Team',
          type: 'error', 
          duration: 0, 
          customClass: 'custom-long-message' 
        });
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.refreshbtn {
  font-size: 40px;
  align-items: flex-start;
}
.refreshbtn :hover {
  cursor: pointer;
}
/deep/ .arrowclass.v-icon {
  align-items: flex-start;
  margin-left: 8px;
  height: 21px;
}
.version-status {
  display: inline-block;
  padding: 2px 6px;
  line-height: 1.1;
  border-radius: 8px;
}
.version-match {
  background: #e8faf0;
}
.version-mismatch {
  background: #fbe6e9;
}
</style>
```
