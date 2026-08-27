# SNFind
```
<template>
  <div>
    <v-layout row wrap>
      <v-flex sm12>
        <v-container fluid style="padding: 0">
          <v-form ref="form" lazy-validation>
            <v-layout row wrap>
              <v-layout row wrap class="layout-margin">
                <div class="search-input">
                  <div class="border-with-text" :style="{ padding: '0 0 0 12px', '--border-text': `'${ sernumCount }'` }">
                    <textarea class="no-border-textarea" v-model="sernum" @input="removePercent('sernum')"></textarea>
                  </div>
                </div>
                <div class="search-input">
                  <div class="border-with-text" :style="{ padding: '0 0 0 12px', '--border-text': `'${ uuttypeCount }'` }">
                     <textarea class="no-border-textarea" v-model="uuttype" @input="removePercent('uuttype')"></textarea>
                  </div>
                </div>
                <div class="search-input">
                  <div class="border-with-text" :style="{ padding: '0 0 0 12px', '--border-text': `'${ machineCount }'` }">
                    <textarea class="no-border-textarea" v-model="machine" @input="removePercent('machine')"></textarea>
                  </div>
                </div>
                <div class="search-input mr-20">
                  <div class="border-with-text" :style="{ padding: '0 0 0 12px', '--border-text': `'${ areaCount }'` }">
                    <textarea class="no-border-textarea" v-model="area" @input="removePercent('area')"></textarea>
                  </div>
                </div>
              </v-layout>

              <!-- 搜索时间段 -->
              <v-layout row wrap class="layout-margin">
                <div class="status-select status-label-time FontH8">
                  Time:
                </div>
                <!-- 开始时间区域 -->
                <div class="search-input">
                  <date-picker :endDate="endDate" :confirmValue="startDate" @saveDate="saveStartDate"></date-picker>
                </div>
                <!-- 结束时间区域 -->
                <div class="search-input mr-20">
                  <date-picker :startDate="startDate" :lastDate="currenTtime.split('T')[0]" :confirmValue="endDate" @saveDate="saveEndDate"></date-picker>
                </div>
              </v-layout>

              <v-layout row wrap class="layout-margin">
                <!-- 勾选搜索的筛选框 -->
                <div class="status-select status-label FontH8">
                  Result:
                </div>
                <div class="status-select mr-10">
                  <v-checkbox v-model="result" value="S" :label="`Start `" color="#9d4edc"></v-checkbox>
                </div>
                <div class="status-select mr-10">
                  <v-checkbox v-model="result" value="P" :label="`Pass `" color="#9d4edc"></v-checkbox>
                </div>
                <div class="status-select mr-10">
                  <v-checkbox v-model="result" value="F" :label="`Fail `" color="#9d4edc"></v-checkbox>
                </div>
                <div class="status-select mr-20">
                  <v-checkbox v-model="result" value="A" :label="`Abort `" color="#9d4edc"></v-checkbox>
                </div>
              </v-layout>
              <v-layout row wrap class="layout-margin">
                <div class="status-select status-label FontH8">
                  Mode:
                </div>
                <div class="status-select mr-10">
                  <v-checkbox v-model="mode" :label="`DEBUG `" color="#9d4edc"></v-checkbox>
                </div>
                <div :style="{ width: '105px', height: '36px', padding: '0 0 0 7px', 'margin-left': '10px' }">
                  <v-btn class="btn_content" color="primary" :loading="recordLoading" @click="handleSearch" :disabled="recordLoading">
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
            :items="Array.isArray(recordData.data) ? recordData.data : []"
            :pagination.sync="pagination"
            :rows-per-page-items="[15, 50, 100, 200, 500, 1000]"
            :total-items="recordData.data_sum"
            class="elevation-1 BlockOffsetTable ThemeTable TableNumber"
            :hide-actions="recordData.data_sum <= 15"
            :no-data-text="noDataText"
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
              <div style="display: flex; align-items: center;">
                <span class="mx-4">{{ recordData.start_index }}-{{ recordData.end_index }} of {{ recordData.data_sum }}</span>
                <v-pagination v-model="page" :length="recordData.page_sum" :total-visible="5"></v-pagination>
                <span class="mx-1">Go to</span>
                <v-select v-model="page" outline dense class="SelectBlockOffset" :items="pagesCount" 
                  style="width: 80px; margin-right: 10px;" :menu-props="{ bottom: true, offsetY: true }"></v-select>
              </div>
            </template>
          </v-data-table>
          <div v-if="recordData.data_sum > 0">
            <v-btn flat color="indigo" style="border-radius: 4px;" @click="exportExcel">
              <v-icon>flight_takeoff</v-icon> Export to Excel
            </v-btn>
          </div>
        </v-flex>            
      </v-layout>
    </v-card>

    <v-layout justify-center>
      <v-dialog v-model="dialog" persistent width="300">
        <v-card color="primary" dark>
          <v-card-text>
            <div style="display: flex; justify-content: space-between;">
              <span>Loading data, please wait...</span>
              <v-icon v-if="recordLoading || downloadLoading" style="font-size: 18px; cursor: pointer" color="#FFFFFF" @click="closeLoadingData">close</v-icon>
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
            <span>{{ dialogSernum }}: {{ message }}</span>
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
import DatePicker from '@/components/common/VDatePicker.vue';
import store from '../../../vision/store';
import { getTestLogList } from '../../api/getTestLog';
import { getCurrentTime } from '../../../genius/api/getCurrentTime.js';
import { getTestRecordList, getTestRecordListBySn, getTestRecordDetail, downloadTestRecords } from '../../api/basic.js';
import moment from 'moment';

export default {
  components: {
    JsonToExcel,
    DatePicker,
    store
  },
  props: {
    username: {
      type: String,
      default: ''
    }, 
    currenTtime: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      openDialogs: false,
      page: 1,
      pagination: {
        rowsPerPage: 15, 
        descending: true,
      },
      message: '',
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
      sernum: '',
      dialogSernum: '',
      uuttype: '',
      machine: '',
      area: '',
      result: ['S', 'P', 'F', 'A'],
      mode: '',
      re: /\r\n|\n\r|\n|\r|,/g,
      recordLoading: false,
      downloadLoading: false,
      recordData: {
        data: [],
        data_sum: 0,
        page_sum: 0,
        start_index: 0,
        end_index: 0
      },
      testLogs: [],
      // 上一次成功触发Search时的条件
      queryParams: {},
      pollingTimer: null
    };
  },
  computed: {
    // 动态生成 Go to 选项数组：[1, 2, 3, ..., totalPages]
    pagesCount() {
      return Array.from({ length: this.recordData.page_sum }, (_, index) => index + 1);
    },
    noDataText() {
      return Object.keys(this.queryParams).length ? 'No matching records found' : 'No data available';
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
      return this.recordLoading || this.downloadLoading;
    },
    formattedResult() {
      if (!this.result || this.result.length === 0) return '';
      return this.result.join(', ');
    }, 
    isOnlySernumSearch() {
      return this.sernum.trim() && !this.uuttype.trim() && !this.machine.trim() && !this.area.trim(); 
    }
  },
  watch: {
    '$route' (to, from) {
      // 路由发生变化页面刷新
      this.sernum = to.query.sernum.split(',').map(item => item.trim()).join('\n');
      if (this.sernum) this.handleSearch();
    },
    page() {
      this.searchRecord();
    },
    'pagination.rowsPerPage'() {
      this.page = 1;
      this.searchRecord();
    }, 
    currenTtime() {
      this.handleTime();
    }
  },
  created () {
    // let path = JSON.parse(sessionStorage.getItem('route'));
    const params = this.$route.query;
    if (params.sernum) {
      this.sernum = params.sernum.split(',').map(item => item.trim()).join('\n');
    }
    this.handleTime();
  }, 
  methods: {
    handleTime() {
      if (!this.currenTtime || !this.currenTtime.length || this.endDate) return;
      this.endDate = this.currenTtime.split('T')[0];
      this.startDate = moment(this.endDate).subtract(6, 'month').format('YYYY-MM-DD');
      // if (this.$route.query.sernum && JSON.parse(sessionStorage.getItem('route')).from !== '/') this.handleSearch();
      if (this.$route.query.sernum) this.handleSearch();
    },
    removePercent(field) {
      this[field] = this[field].replace(/%/g, '');
    }, 
    async getTestLog(data) {
      const time_stamp = data.testtime;
      const machine = data.machine;
      const container = data.container;
      const parms = {
        time_stamp: time_stamp,
        machine: machine,
        container: container,
      };
      this.dialogSernum = data.sernum;
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
      this.recordLoading = false;
      this.downloadLoading = false; 
      if (this.pollingTimer) {
        clearTimeout(this.pollingTimer);
        this.pollingTimer = null;
      }
    },
    // 点击表格数据展开后端属性数据
    async toggleRowExpand(props) {
      props.expanded = !props.expanded;
      if (!props.expanded || props.item.partnum) return; 
      const item = props.item;
      try {
        const params = {
          id: item.id,
          recttime: item.recttime
        };
        const { data: res } = await getTestRecordDetail(params);
        if (res.status) {
          const dataArray = res.payload.data || [];
          if (dataArray.length > 0) {
            const detailData = dataArray[0];
            Object.keys(detailData).forEach(key => {
              this.$set(item, key, detailData[key]);
            });
          } 
        }
      } catch (error) {
        console.error('Fetch attribute error:', error);
      }
    },
    async getCurrentTime() {
      try {
        const { data: res } = await getCurrentTime();
        if (res.status) return moment(res.payload.current_time).format('YYYYMMDD_HHmmssSSS');
        this.$message({
          showClose: true,
          message: res.payload.message || 'Service Error, please contact Genius Team',
          type: 'error',
          duration: 3000
        });        
        return '';
      } catch (e) {
        console.error(e);
        this.$message({
          showClose: true,
          message: 'Service Error, please contact Genius Team',
          type: 'error',
          duration: 3000
        });
        return '';
      }
    },
    async searchDataSummary() {
      const fixedTimestamp = await this.getCurrentTime();
      if (!fixedTimestamp) return;
      const params = {
        ...this.queryParams,
        username: this.username,
        start_date: this.startDate + ' 00:00:00',
        end_date: this.endDate + ' 23:59:59',
        timestamp: fixedTimestamp,
        page_num: this.page,
        page_size: this.pagination.rowsPerPage
      };
      this.recordLoading = true;
      // 定义一个内部的递归轮询函数
      const pollData = async() => {
        if (!this.recordLoading) return;
        try {
          const { data: res } = await getTestRecordList({ ...params });
          if (!res.status) {
            this.$message({
              showClose: true,
              message: res.msg || 'Service Error, please contact Genius Team',
              type: 'error',
              duration: 3000
            });
            this.recordLoading = false;
            return;
          }
          const status = res.payload.data.status;
          const isPolling = status === 'ADDED' || status === 'PENDING';
          if (isPolling) {
            this.pollingTimer = setTimeout(pollData, 2000);
          } else if (status === 'SUCCESS') {
            this.recordData = res.payload.data.result || {};
          } else if (status === 'FAILURE') {
            this.$message({
              showClose: true,
              message: 'Service Error, please contact Genius Team',
              type: 'error',
              duration: 3000
            });
          }
          if (!isPolling) this.recordLoading = false;
        } catch (error) {
          this.recordLoading = false;
          return this.$message({
            showClose: true,
            message: 'Service Error, please contact Genius Team',
            type: 'error',
            duration: 3000
          });
        }
      };
      pollData();
    },
    async searchDataDirectly() {
      const fixedTimestamp = await this.getCurrentTime();
      if (!fixedTimestamp) return;
      const params = {
        ...this.queryParams,
        username: this.username,
        start_date: this.startDate + ' 00:00:00',
        end_date: this.endDate + ' 23:59:59',
        timestamp: fixedTimestamp,
        page_num: this.page,
        page_size: this.pagination.rowsPerPage
      };
      try {
        const { data: res } = await getTestRecordListBySn(params);
        if (!res.status) {
          this.$message({
            showClose: true,
            message: res.msg || 'Service Error, please contact Genius Team',
            type: 'error',
            duration: 3000
          });
          return;
        }
        const data = res.payload.data;
        if (data.status === 'SUCCESS') this.recordData = data.result || {};
      } catch (error) {
        console.error(error);
        this.$message({
          showClose: true,
          message: 'Service Error, please contact Genius Team',
          type: 'error',
          duration: 3000
        });
      }
    },
    searchRecord() {
      if (this.isOnlySernumSearch) {
        this.searchDataDirectly();
      } else {
        this.searchDataSummary();
      }
    },
    async exportExcel() {
      const fixedTimestamp = await this.getCurrentTime();
      if (!fixedTimestamp) return;
      const params = {
        ...this.queryParams,
        username: this.username,
        start_date: this.startDate + ' 00:00:00',
        end_date: this.endDate + ' 23:59:59',
        timestamp: fixedTimestamp, 
      };
      this.downloadLoading = true;
      const pollDownloadData = async () => {
        try {
          const { data: res } = await downloadTestRecords({ ...params });
          if (!res.status) {
            this.$message({
              showClose: true,
              message: res.msg || 'Service Error, please contact Genius Team',
              type: 'error', 
              duration: 3000
            });
            this.downloadLoading = false;
            return; 
          }
          const status = res.payload.data.status; 
          if (status === 'ADDED' || status === 'PENDING' || status === 'RECEIVED') {
            // 任务还在执行，等待 2 秒后继续下一次轮询
            this.pollingTimer = setTimeout(pollDownloadData, 2000);
          } else if (status === 'SUCCESS') {
            this.downloadLoading = false;
            const url = res.payload.data.result.url;
            if (!url) {
              this.$message({
                showClose: true,
                message: res.payload.data.result.msg,
                type: 'error', 
                duration: 3000, 
              });
              return;
            }
            window.location.href = url; 
          } 
        } catch (error) {
          console.error('Download polling error:', error);
          this.downloadLoading = false;
          return this.$message({
            showClose: true,
            message: 'Service Error, please contact Genius Team',
            type: 'error',
            duration: 3000
          });
        }
      };
      pollDownloadData();
    },
    handleSearch() {
      if (!this.uuttype.trim() && !this.area.trim() && !this.machine.trim() && !this.sernum.trim()) {
        return this.$message({
          showClose: true,
          message: 'Please enter one or more contents of UUT Type/Machine/Area/SN',
          type: 'warning'
        });
      }
      this.page = 1; 
      this.pagination.rowsPerPage = 15;
      this.queryParams = {
        sernum: this.sernum,
        uuttype: this.uuttype,
        machine: this.machine,
        area: this.area,
        result: this.formattedResult,
        mode: this.mode ? 'DEBUG' : ''
      };
      this.searchRecord();
    },
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
.status-label {
  width: 45px
  margin-right: 11px
}
.status-label-time {
  width: 36px
  margin-right: 15px
}
.mr-10 {
  margin-right: 10px
}
.mr-20 {
  margin-right: 20px
}
/deep/ .v-label {
  font-size: 14px;
}
</style>
```
