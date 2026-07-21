# 最新的testDatatable
```
<template>
  <div>
    <v-layout row wrap>
      <v-flex sm12>
        <v-container fluid style="padding: 0">
          <v-form ref="form" lazy-validation>
            <v-layout row wrap v-if="isactived">
              <v-layout row wrap class="layout-margin">
                <div class="search-input">
                  <div class="border-with-text" :style="{ padding: '0 0 0 12px', '--border-text': `'${ sernumCount }'` }">
                    <textarea class="no-border-textarea" v-model="sernum"></textarea>
                  </div>
                </div>
                <div class="search-input">
                  <div class="border-with-text" :style="{ padding: '0 0 0 12px', '--border-text': `'${ uuttypeCount }'` }">
                     <textarea class="no-border-textarea" v-model="uuttype"></textarea>
                  </div>
                </div>
                <div class="search-input">
                  <div class="border-with-text" :style="{ padding: '0 0 0 12px', '--border-text': `'${ machineCount }'` }">
                    <textarea class="no-border-textarea" v-model="machine"></textarea>
                  </div>
                </div>
                <div style="margin-right: 20px" class="search-input">
                  <div class="border-with-text" :style="{ padding: '0 0 0 12px', '--border-text': `'${ areaCount }'` }">
                    <textarea class="no-border-textarea" v-model="area"></textarea>
                  </div>
                </div>
              </v-layout>

              <!-- 搜索时间段 -->
              <v-layout row wrap class="layout-margin">
                <div style="width: 36px; margin: 0 15px 0 0;" class="status-select FontH8">
                  Time:
                </div>
                <!-- 开始时间区域 -->
                <div class="search-input">
                  <date-picker :endDate="endDate" :confirmValue="startDate" @saveDate="saveStartDate"></date-picker>
                </div>
                <!-- 结束时间区域 -->
                <div style="margin-right: 20px" class="search-input">
                  <date-picker :startDate="startDate" :lastDate="currenTtime[0]" :confirmValue="endDate" @saveDate="saveEndDate"></date-picker>
                </div>
              </v-layout>

              <v-layout row wrap class="layout-margin">
                <!-- 勾选搜索的筛选框 -->
                <div style="width: 45px; margin: 0 11px 0 0;" class="status-select FontH8">
                  Result:
                </div>
                <div style="margin-right: 10px" class="status-select">
                  <v-checkbox v-model="selectedResults" value="S" :label="`Start `" color="#9d4edc"></v-checkbox>
                </div>
                <div style="margin-right: 10px" class="status-select">
                  <v-checkbox v-model="selectedResults" value="P" :label="`Pass `" color="#9d4edc"></v-checkbox>
                </div>
                <div style=" margin-right: 10px" class="status-select">
                  <v-checkbox v-model="selectedResults" value="F" :label="`Fail `" color="#9d4edc"></v-checkbox>
                </div>
                <div style="margin-right: 10px; margin-right: 20px" class="status-select">
                  <v-checkbox v-model="selectedResults" value="A" :label="`Abort `" color="#9d4edc"></v-checkbox>
                </div>
              </v-layout>
              <v-layout row wrap class="layout-margin">
                <div style="width: 45px; margin: 0 11px 0 0;" class="status-select FontH8">
                  Mode:
                </div>
                <div style="margin-right: 10px" class="status-select">
                  <v-checkbox v-model="mode" :label="`DEBUG `" color="#9d4edc"></v-checkbox>
                </div>
                <div :style="{ width: '105px', height: '36px', padding: '0 0 0 7px', 'margin-left': '10px' }">
                  <v-btn class="btn_content" color="primary" :loading="yeildLoading" @click="handleSearchClick" :disabled="yeildLoading">
                    Search
                    <span slot="loader">Loading...</span> 
                  </v-btn>
                </div>
              </v-layout>
            </v-layout>
          </v-form>
        </v-container>
      </v-flex>
    </v-layout>

    <v-card flat>
      <v-layout row wrap>   
        <v-flex xl12 sm12 md12 pa-0>
          <v-data-table
            :headers="headers"
            :pagination.sync="pagination"
            :items="testDataSource"
            :rows-per-page-items="[15, 50, 100, 200, 500, 1000]"
            class="elevation-1 BlockOffsetTable ThemeTable"
            item-key="id"
            :hide-actions="hidePage"
            :loading="loading"
            :no-data-text="customNoDataText"
            :total-items="totalItems"
            @update:pagination="watchVuetifyPageSize"
          >
            <!-- 表单内容 -->
            <template slot="items" slot-scope="props">
              <tr @click="toggleRowExpand(props)">
                <td>{{ props.item.recttime ? props.item.recttime.replace('T', ' ').split('.')[0] : '-' }}</td>
                <td>{{ props.item.sernum }}</td>
                <td>{{ props.item.uuttype }}</td>
                <td>{{ props.item.area }}</td>
                <td>{{ props.item.mode }}</td>
                <td>{{ props.item.result }}</td>
                <td>{{ props.item.test }}</td>
                <td>{{ props.item.tottime }}</td>
                <td>{{ props.item.machine }}</td>
                <td>{{ props.item.container }}</td>
              </tr>
            </template>

            <!-- 点击列表后出来的下拉区域 -->
            <template slot="expand" slot-scope="props">
              <v-card>
                  <v-card-text>
                    <v-container grid-list-xl fluid>
                      <v-layout row wrap>
                        <v-flex lg2 sm6 xs6>
                          <v-list>PartNum: {{ props.item.partnum }}</v-list>
                          <v-list>PartNum Rev: {{ props.item.partnumrev }}</v-list>
                          <v-list>TAN: {{ props.item.tannum }}</v-list>
                          <v-list>TAN Rev: {{ props.item.tannumrev }}</v-list>
                          <v-list>PID: {{ props.item.pid }}</v-list>
                          <v-list>VID: {{ props.item.vid }}</v-list>
                          <v-list>Username: {{ props.item.username }}</v-list>
                          <v-list>Parent: <a @click="clickSerialNumber(props.item.parentsernum)">{{ props.item.parentsernum }}</a></v-list>
                        </v-flex>
                        <v-flex lg2 sm6 xs6>
                          <v-list>Order: {{ props.item.order }}</v-list>
                          <v-list>LineID: {{ props.item.lineid }}</v-list>
                          <v-list>BlackFlush: {{ props.item.bflush }}</v-list>
                          <v-list>BitMap: {{ props.item.bitmap }}</v-list>
                        </v-flex>
                        <v-flex lg3 sm6 xs6>
                          <v-list>SW Rev: {{ props.item.swrev }}</v-list>
                          <v-list>Diag Rev: {{ props.item.diagrev }}</v-list>
                          <v-list>HW Rev: {{ props.item.hwrev }}</v-list>
                          <v-list>Deviation: {{ props.item.deviation }}</v-list>
                          <v-list>Label: {{ props.item.label }}</v-list>
                          <v-list>License: {{ props.item.license }}</v-list>
                        </v-flex>
                        <v-flex lg2 sm6 xs6>
                          <v-list>Str1Name: {{ props.item.str1name }}</v-list>
                          <v-list>Str2Name: {{ props.item.str2name }}</v-list>
                          <v-list>Str3Name: {{ props.item.str3name }}</v-list>
                          <v-list>Str4Name: {{ props.item.str4name }}</v-list>
                          <v-list>Str5Name: {{ props.item.str5name }}</v-list>
                          <v-list>Str6Name: {{ props.item.str6name }}</v-list>
                        </v-flex>
                        <v-flex lg3 sm6 xs6>
                          <v-list>Str1: {{ props.item.str1 }}</v-list>
                          <v-list>Str2: {{ props.item.str2 }}</v-list>
                          <v-list>Str3: {{ props.item.str3 }}</v-list>
                          <v-list>Str4: {{ props.item.str4 }}</v-list>
                          <v-list>Str5: {{ props.item.str5 }}</v-list>
                          <v-list>Str6: {{ props.item.str6 }}</v-list>
                        </v-flex>
                        <v-flex lg12 sm12 xs12 v-show="props.item.result !== 'S'">
                          <h5><v-icon>contact_phone</v-icon> <a @click="getTestLog(props.item)">Log Time: {{ props.item.testtime }}</a></h5>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card-text>
              </v-card>
            </template>

            <template slot="actions-append">
              <div style="display: flex;align-items: center;">
                <span class="mx-4">{{ startIndex }}-{{ endIndex }} of {{ totalItems }}</span>
                <v-pagination 
                  v-model="currentPageLocal" 
                  :length="totalPages" 
                  :total-visible="5"
                ></v-pagination>
                <span class="mx-1">Go to</span>
                <v-select 
                  v-model="currentPageLocal" 
                  outline       
                  dense 
                  class="SelectBlockOffset" 
                  :items="pagesCount" 
                  style="width:80px; margin-right:10px;" 
                  :menu-props="{ bottom: true, offsetY: true }"
                ></v-select>
              </div>
            </template>
          </v-data-table>
          <json-to-excel :disable-export="true" excelName="Test Record" @export-click="handleExportClick"></json-to-excel>
        </v-flex>            
      </v-layout>
    </v-card>

    <v-layout justify-center>
      <v-dialog v-model="dialog" persistent width="300">
        <v-card color="primary" dark>
          <v-card-text>
            <div style="display: flex; justify-content: space-between;">
              <span>Loading data, please wait...</span>
              <v-icon v-if="yeildLoading || downloadLoading" style="font-size: 18px; cursor: pointer" color="#FFFFFF" @click="closeLoadingData">close</v-icon>
            </div>
            <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>       
    </v-layout>

    <!-- Test Log List dialogs -->
    <v-layout row justify-center>
      <v-dialog v-model="openDialogs" persistent max-width="800">
        <v-card>
          <v-card-title class="FontH5">
            <span>{{ sernum }}: {{ message }}</span>
            <v-spacer></v-spacer>
            <v-icon @click="openDialogs = false">close</v-icon>
          </v-card-title>
          <v-card-text style="padding: 16px 16px 30px 16px;">
            <h5 class="FontT1" v-for="log of testLogs" :key="log.name">
              <a :href="log.url" target="_blank">{{ log.name }} ({{log.size}})</a>
            </h5>
            </v-card-text>
        </v-card>
      </v-dialog>
    </v-layout>
  </div>
</template>

<script>
import JsonToExcel from '../JsonToExcel.vue';
import { getTestLogList } from '../../api/getTestLog';
import { getCurrentTime } from '../../../genius/api/getCurrentTime.js';
import { getTestRecordList, getTestRecordListByAttribute, getTestRecordDownloadList } from '../../api/basic.js';
import moment from 'moment';
import DatePicker from '@/components/common/VDatePicker.vue';
import store from '../../../vision/store';

export default {
  components: {
    JsonToExcel,
    DatePicker,
    store
  },
  props: {
    loading: Boolean,
    isEmptySearch: Boolean,
    syncSernum: {
      type: String,
      default: ''
    }, 
    autoSearch: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      openDialogs: false,
      pagination: {
        rowsPerPage: 15, 
        descending: true,
        totalItems: 0
      },
      message: '',
      search: '',
      headers: [
        {
          text: 'Record Time',
          value: 'recttime',
          sortable: false,
        },
        {
          text: 'Serial Number',
          value: 'sernum',
          sortable: false,
        },
        {
          text: 'UUT Type',
          value: 'uuttype',
          sortable: false,
        },
        {
          text: 'Area',
          value: 'area',
          sortable: false,
        },
        {
          text: 'Mode',
          value: 'mode',
          sortable: false,
        },
        {
          text: 'Result',
          value: 'result',
          sortable: false,
        },
        {
          text: 'Fail Name',
          value: 'test',
          sortable: false,
        },
        {
          text: 'Test Time',
          value: 'tottime',
          sortable: false,
        },
        {
          text: 'Machine',
          value: 'machine',
          sortable: false,
        },
        {
          text: 'Container',
          value: 'container',
          sortable: false,
        },
      ],
      // 头部参数
      startDate: '',
      endDate: '',
      uuttype: '',
      machine: '',
      area: '',
      selectedResults: ['S', 'P', 'F', 'A'],
      result: '', 
      mode: '',
      timestamp: '',
      currenTtime: '',
      re: /\r\n|\n\r|\n|\r|,/g,
      fail_box: true,
      pass_box: true,
      abort_box: false,
      debug_box: false,
      field_box: false,
      closeLoading: false, 
      yeildLoading: false,
      downloadLoading: false,
      pageNum: 1,
      pageSize: 15,
      totalItems: 0,   // 总条数 (对应服务端的 data_sum)
      totalPages: 0,   // 总页数 (对应服务端的 page_sum)
      startIndex: 0,   // 当前页起始序号 (对应服务端的 start_index)
      endIndex: 0,     // 当前页结束序号 (对应服务端的 end_index)
      testLogs: [],
      isactived: true,
      testDataSource: [],
      // 上一次成功触发 Search 时的条件
      searchQuery: {
        sernum: '',
        uuttype: '',
        machine: '',
        area: '',
        result: '',
        mode: ''
      }, 
      hasSearched: false,
      pollingTimer: null
    };
  },
  computed: {
    // 动态生成 Go to 选项数组：[1, 2, 3, ..., totalPages]
    pagesCount() {
      return Array.from({ length: this.totalPages }, (_, index) => index + 1);
    },
    hidePage() {
      // 控制隐藏底部分页栏的是否显示问题
      return this.totalItems <= 15;
    }, 
    // 双向绑定当前页码，当用户点击分页或选择下拉框时，能触发请求
    currentPageLocal: {
      get() {
        return this.pageNum;
      },
      set(val) {
        // 当页码发生改变时
        if (this.pageNum !== val) {
          this.pageNum = val;
          // 页码变了，立刻重新触发后端查询获取新一页的数据
          this.searchDataSummary();
        }
      }
    },
    sernum: {
      get() {
        // 读取sernum时，直接读取父组件传递过来的最新值
        return this.syncSernum;
      },
      set(val) {
        // 把新值推送给父组件更新
        this.$emit('update:sernum', val);
      }
    },
    customNoDataText() {
      return this.isEmptySearch 
        ? 'No matching records found' 
        : 'No data available';
    },
    sernumCount() {
      if (!this.sernum.trim()) return 'Serial Number - 0';
      return 'Serial Number - ' + this.sernum.trim().split(this.re).length;
    },
    areaCount() {
      if (!this.area.trim()) return 'Area - 0';
      return 'Area - ' + this.area.trim().split(this.re).length;
    },
    uuttypeCount() {
      if (!this.uuttype.trim()) return 'UUT Type - 0';
      return 'UUT Type - ' + this.uuttype.trim().split(this.re).length;   
    },
    machineCount() {
      if (!this.machine.trim()) return 'Machine - 0';
      return 'Machine - ' + this.machine.trim().split(this.re).length;
    },
    dialog() {
      return this.yeildLoading || this.downloadLoading;
    },
    isShowAlert() {
      if (this.dialog) return false;
      return this.alert;
    }, 
    formattedResult() {
      if (!this.selectedResults || this.selectedResults.length === 0) {
        return '';
      }
      return this.selectedResults.join(', ');
    }, 
    // 提取工号
    workId() {
      const rawUsername = this.$cookies.get('username') || '';
      const match = rawUsername.match(/\(([^)]+)\)/);
      return match ? match[1] : rawUsername;
    }
  },
  watch: {
    '$route' (to, from) {
      const routeSernum = to.query.sernum;
      if (routeSernum) {
        // 同步到父组件
        this.$emit('update:sernum', routeSernum);
        this.$nextTick(() => {
          this.handleSearchClick();
        });
      }
    },
  },
  created () {
    this.getCurrentTimes();
  }, 
  mounted() {
    this.getCurrentTimes(); 
  },
  methods: {
    async getTestLog(data) {
      const time_stamp = data.testtime;
      const machine = data.machine;
      const container = data.container;
      const parms = {
        time_stamp: time_stamp,
        machine: machine,
        container: container,
      };
      this.sernum = data.sernum;
      this.testLogs = [];
      this.openDialogs = true;
      const { data: res } = await getTestLogList(parms);
      if (res.status) {
        this.message = res['payload']['message'];
        this.testLogs = res['payload']['data'];
      } else {
        this.message = res['payload']['message'];
      }
    },
    clickSerialNumber (sernum) {
      this.$router.push('/vision/basic');
      store.commit('changeSernum', sernum.replace(' ', ''));
    }, 
    saveStartDate(date) {
      this.startDate = date;
    },
    saveEndDate(date) {
      this.endDate = date;
    },
    closeLoadingData() {
      this.closeLoading = true;
      this.yeildLoading = false;
      this.downloadLoading = false; 
      if (this.pollingTimer) {
        clearTimeout(this.pollingTimer);
        this.pollingTimer = null;
      }
    },
    async getCurrentTimes() {
      const { data: res } = await getCurrentTime();
      if (res.status) {
        this.currenTtime = res.payload.current_time.split('T');
        this.endDate = res.payload.current_time.split('T')[0];
        this.startDate = moment(this.endDate).subtract(6, 'month').format('YYYY-MM-DD');
        if (this.autoSearch && this.sernum) this.handleSearchClick();
      }
    },
    watchVuetifyPageSize(val) {
      // 检测用户是否在左下角切换了每页显示条数（rowsPerPage）
      if (this.pageSize !== val.rowsPerPage) {
        this.pageSize = val.rowsPerPage;
        this.pageNum = 1;
        this.searchDataSummary(); 
      }
    },
    // 点击表格数据展开后端属性数据
    async toggleRowExpand(props) {
      props.expanded = !props.expanded;
      // 用户是否是收起行，或者当前行之前已经请求过数据了（通过 partnum 字段是否存在来判断），则直接返回，不再请求后端
      if (!props.expanded || props.item.partnum) return; 
      const item = props.item;
      try {
        const params = {
          id: item.id,
          recttime: item.recttime
        };
        const { data: res } = await getTestRecordListByAttribute(params);
        if (res.status) {
          const dataArray = res.payload.data || [];
          if (dataArray.length > 0) {
            const detailData = dataArray[0];
            Object.keys(detailData).forEach(key => {
              this.$set(item, key, detailData[key]);
            });
          } else {
            console.warn('后端返回的详情数组为空');
          }
        } else {
          console.error(res.payload.message || 'Fetch attributes failed');
        }
      } catch (error) {
        console.error('Fetch attribute error:', error);
      }
    },
    // 点击Search按钮后进行的校验和接口调用
    async searchDataSummary() {
      // 防止重复点击
      if (this.yeildLoading) return;
      this.yeildLoading = true;
      try {
        const { data: res } = await getCurrentTime();      
        const fixedTimestamp = moment(res.payload.current_time).format('YYYYMMDD_HHmmssSSS');

        // 定义一个内部的递归轮询函数
        const pollData = async () => {
          if (!this.yeildLoading) return;
          const params = {
            sernum: this.searchQuery.sernum,
            username: this.workId,
            start_date: this.startDate + ' 00:00:00',
            end_date: this.endDate + ' 23:59:59',
            uuttype: this.searchQuery.uuttype,
            machine: this.searchQuery.machine,
            area: this.searchQuery.area,
            result: this.searchQuery.result,
            mode: this.searchQuery.mode,
            timestamp: fixedTimestamp,
            page_num: this.pageNum, 
            page_size: this.pageSize,
          };
          try {
            const { data: recordRes } = await getTestRecordList({ ...params });
            if (!recordRes.status) {
              this.$message({
                showClose: true,
                message: recordRes.msg || 'Service Error, please contact Genius Team',
                type: 'error', 
                duration: 3000, 
                customClass: 'custom-long-message' 
              });
              this.yeildLoading = false;
              return; 
            }
            const status = recordRes.payload.data.status; 
            if (status === 'ADDED' || status === 'PENDING') {
              // 任务还在执行，等待2秒后继续下一次轮询
              this.pollingTimer = setTimeout(pollData, 2000);
            } else if (status === 'SUCCESS') {
              const resultSummary = recordRes.payload.data.result; 
              this.totalItems = resultSummary.data_sum || 0;   
              this.totalPages = resultSummary.page_sum || 0;   
              this.startIndex = resultSummary.start_index || 0; 
              this.endIndex = resultSummary.end_index || 0;
              const rawData = resultSummary.data || [];

              if (rawData.length > 0) {
                this.testDataSource = rawData.sort((a, b) => {
                  const dateA = new Date(a.recttime);
                  const dateB = new Date(b.recttime);
                  // 倒序排列
                  return dateB - dateA; 
                });
              } else {
                this.testDataSource = []; 
              }
              this.yeildLoading = false; 
            } else if (status === 'FAILURE') {
              console.error('任务执行失败');
              this.yeildLoading = false;
            } else {
              this.yeildLoading = false;
            }
          } catch (error) {
            this.yeildLoading = false; 
          }
        };
        await pollData();
      } catch (err) {
        console.error('获取系统时间失败:', err);
        this.yeildLoading = false;
      }
    },
    handleSearchClick() {
      if (!this.uuttype && !this.area && !this.machine && !this.sernum) {
        return this.$message({
          showClose: true,
          message: 'Please enter one or more contents of UUT Type/Machine/Area/SN',
          type: 'warning', 
          customClass: 'custom-long-message' 
        });
      }
      this.pageNum = 1; 
      this.pageSize = 15;
      if (this.pagination) this.pagination.rowsPerPage = 15;
      this.hasSearched = true;
      this.searchQuery = {
        sernum: this.sernum,
        uuttype: this.uuttype,
        machine: this.machine,
        area: this.area,
        result: this.formattedResult,
        mode: this.mode ? 'DEBUG' : ''
      };
      this.$emit('searched');
      this.searchDataSummary();
    },
    async handleExportClick() {
      // 防止用户连续点击下载
      if (this.downloadLoading) return;
      this.downloadLoading = true;
      try {
        const { data: res } = await getCurrentTime();      
        const fixedTimestamp = moment(res.payload.current_time).format('YYYYMMDD_HHmmssSSS');
        const pollDownloadData = async () => {
          const params = {
            sernum: this.hasSearched ? this.sernum : '', 
            uuttype: this.hasSearched ? this.uuttype : '',
            machine: this.hasSearched ? this.machine : '',
            area: this.hasSearched ? this.area : '',
            username: this.workId,
            start_date: this.startDate + ' 00:00:00',
            end_date: this.endDate + ' 23:59:59',
            timestamp: fixedTimestamp, 
            result: this.formattedResult, 
            mode: this.mode ? 'DEBUG' : ''
          };
          try {
            const { data: downloadRes } = await getTestRecordDownloadList({ ...params });
            if (!downloadRes.status) {
              this.$message({
                showClose: true,
                message: downloadRes.msg || 'Service Error, please contact Genius Team',
                type: 'error', 
                duration: 3000, 
                customClass: 'custom-long-message' 
              });
              this.downloadLoading = false;
              return; 
            }
            const status = downloadRes.payload.data.status; 
            if (status === 'ADDED' || status === 'PENDING' || status === 'RECEIVED') {
              // 任务还在执行，等待 2 秒后继续下一次轮询
              this.pollingTimer = setTimeout(pollDownloadData, 2000);
            } else if (status === 'SUCCESS') {
              this.downloadLoading = false;
              const url = downloadRes.payload.data.result.url;
              if (!url) {
                this.$message({
                  showClose: true,
                  message: downloadRes.payload.data.result.msg,
                  type: 'error', 
                  duration: 3000, 
                  customClass: 'custom-long-message' 
                });
                return;
              }
              window.location.href = url; 
            } 
          } catch (error) {
            console.error('Download polling error:', error);
            this.downloadLoading = false;
          }
        };
        await pollDownloadData();
      } catch (err) {
        console.error('获取系统下载时间失败:', err);
        this.downloadLoading = false;
      }
    }
  }
};
</script>

<style lang='stylus' scoped>
.layout-margin.layout {
  flex: none;
  margin-bottom: 23px;
}
.search-input {
  width: 167px;
  margin-right: 10px;
}
.status-select {
  height: 36px;
  display: flex;
  align-items: center;
  justify-items: start;
}
/deep/ .v-label {
  font-size: 14px;
}
</style>
```
