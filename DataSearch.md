# Demo
```
<template>
  <div>
    <!-- 上半区域--输入板的参数进行搜索 -->
    <v-layout row wrap>
      <v-flex sm12>
        <v-container fluid style="padding: 0">
          <v-form v-model="valid" ref="form" lazy-validation>
            <v-layout row wrap v-if="isactived">
              <v-layout row wrap class="layout-margin">
                <div style="width: 45px; margin: 0 15px 0 0; font-weight: bold;" class="status-select">
                  Search:
                </div>

                <div class="search-input">
                  <div class="border-with-text" :style="{ padding: '0 0 0 12px', '--border-text': `'${ uuttypeCount }'` }">
                    <textarea class="no-border-textarea" v-model="uuttype"></textarea>
                  </div>
                </div>

                <div class="search-input">
                  <div class="border-with-text" :style="{ padding: '0 0 0 12px', '--border-text': `'${ areaCount }'` }">
                    <textarea class="no-border-textarea" v-model="area"></textarea>
                  </div>
                </div>

                <div class="search-input">
                  <div class="border-with-text" :style="{ padding: '0 0 0 12px', '--border-text': `'${ machineCount }'` }">
                    <textarea class="no-border-textarea" v-model="machine"></textarea>
                  </div>
                </div>

                <div style="margin-right: 20px" class="search-input">
                  <div class="border-with-text" :style="{ padding: '0 0 0 12px', '--border-text': `'${ sernumCount }'` }">
                    <textarea class="no-border-textarea" v-model="sernum"></textarea>
                  </div>
                </div>
              </v-layout>
              <!-- 搜索时间段 -->
              <v-layout row wrap class="layout-margin">
                <div style="width: 35px; margin: 0 15px 0 0; font-weight: bold;" class="status-select">
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
                <div style="width: 45px; margin: 0 11px 0 0; font-weight: bold;" class="status-select">
                  Status:
                </div>
                <div style="margin-right: 10px" class="status-select">
                  <v-checkbox :label="`Fail `" color="#9d4edc" :disabled="true" v-model="fail_box"></v-checkbox>
                </div>
                <div style="margin-right: 10px" class="status-select">
                  <v-checkbox :label="`Pass `" color="#9d4edc" :disabled="true" v-model="pass_box"></v-checkbox>
                </div>
                <div v-if="!hiddenAbort.includes(username)" style=" margin-right: 10px" class="status-select">
                  <v-checkbox :label="`Abort `" color="#9d4edc" v-model="abort_box"></v-checkbox>
                </div>
                <div style="margin-right: 10px; margin-right: 20px" class="status-select">
                  <v-checkbox :label="`DEBUG `" color="#9d4edc" v-model="debug_box"></v-checkbox>
                </div>
              </v-layout>
              <v-layout row wrap class="layout-margin">
                <div style="width: 67px; margin: 0 11px 0 0; font-weight: bold;" class="status-select">
                  Download:
                </div>
                <div style="margin-right: 10px" class="status-select">
                  <v-checkbox :label="`All Fields `" color="#9d4edc" v-model="field_box"></v-checkbox>
                </div>
                <div :style="{ width: '105px', height: '36px', padding: '0 0 0 15px', 'margin-left': !hiddenAbort.includes(username) ? 0 : '78px' }">
                  <v-btn class="btn_content" style="margin: 0; height: 32px; width: 90px;" color="primary" :loading="yeildLoading" @click="searchDataSummary" :disabled="yeildLoading">
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

    <!-- 下半区域--搜索结果 -->
    <v-container grid-list-xl fluid style="padding: 10px 0 0;">
      <v-card>
        <v-card-text style="padding: 0;">
          <v-layout row wrap style="margin: 0;">
            <!-- First Yield 小窗数据 -->
            <yeild-card :yeilddata="firstDataSummary" :username="username" :timeStamp="time_stamp" :dataSelect="dataSelect"
              :startDate="startDate" :endDate="endDate" @changeYeild="changeYeild"></yeild-card>
            <!-- Test Yield 小窗数据 -->
            <yeild-card yeildtitle="Test Yield" :yeilddata="testDataSummary" :username="username" :timeStamp="time_stamp"
              :dataSelect="dataSelect" :startDate="startDate" :endDate="endDate" @changeYeild="changeYeild"></yeild-card>
            <!-- board Yield 小窗数据 -->
            <yeild-card yeildtitle="Board Yield" :yeilddata="boardDataSummary" :username="username" :timeStamp="time_stamp"
              :dataSelect="dataSelect" :startDate="startDate" :endDate="endDate" @changeYeild="changeYeild"></yeild-card>
          </v-layout>
          <v-layout row wrap mx-0>
            <v-flex style="padding: 12px 16px 16px;">
              <matrix-data-table :titles="matrix_titles" :testDataSource="matrix_data" @handleMatrix="handleMatrix"></matrix-data-table>
            </v-flex>
          </v-layout>
          <!-- 下载提示弹窗 -->
          <v-layout justify-center>
            <v-dialog v-model="dialog" persistent width="300">
              <v-card color="primary" dark>
                <v-card-text>
                  <div style="display: flex; justify-content: space-between;">
                    <span>Loading data, please wait...</span>
                    <v-icon v-if="yeildLoading || matrixLoading" style="font-size: 18px; cursor: pointer" color="#FFFFFF" @click="closeLoadingData">close</v-icon>
                  </div>
                  <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                </v-card-text>
              </v-card>
            </v-dialog>       
          </v-layout>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import VWidget from '@/components/VWidget.vue';
import DatePicker from '@/components/common/VDatePicker.vue';
import YeildCard from './YeildCard.vue';
import MatrixDataTable from './MatrixDataTable.vue';
import { getCurrentTime } from '../../../../genius/api/getCurrentTime.js';
import { getYield, getMatrix, getMatrixDownload } from '../../../api/advanced.js';
import moment from 'moment';

export default {
  components: {
    VWidget,
    DatePicker,
    YeildCard,
    MatrixDataTable,
  },
  data() {
    return {
      alert: false,
      alert_color: 'warning',
      alert_message: 'it is error',
      valid: true,
      currenTtime: '',
      // 头部参数
      startDate: '',
      endDate: '',
      uuttype: '',
      area: '',
      machine: '',
      sernum: '',
      fail_box: true,
      pass_box: true,
      abort_box: false,
      debug_box: false,
      field_box: false,
      re: /\r\n|\n\r|\n|\r|,/g,
      
      // 操作后参数
      dataSelect: '',
      username: '',
      time_stamp: '',
      firstDataSummary: '',
      testDataSummary: '',
      boardDataSummary: '',
      matrix_titles: [],
      matrix_data: [],
      yeildLoading: false,
      matrixLoading: false,
      matrixdownLoading: false,
      saveExistData: {},
      closeLoading: false,
      isactived: true,
      hiddenAbort: ['WNBUTE1'],
      statusCode: ['RECEIVED', 'ADDED', 'PENDING'],
      // isSearching: false 
    };
  },
  computed: {
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
      return this.yeildLoading || this.matrixLoading || this.matrixdownLoading;
    },
    isShowAlert() {
      if (this.dialog) return false;
      return this.alert;
    }, 
    // isAllLoadingDone() {
    //   return !this.yeildLoading && !this.matrixLoading && !this.matrixdownLoading;
    // }
  },
  watch: {
    isShowAlert(newVal) {
      if (newVal) {
        this.$emit('showAlert', { alert: true, alert_color: this.alert_color, alert_message: this.alert_message });
        this.alert = false;
      }
    }, 
    // 监测状态是否结束
    // isAllLoadingDone(newVal) {
    //   if (newVal && this.isSearching) {
    //     this.handleAlert('success', 'Search Successfully');
    //     this.isSearching = false;
    //   }
    // }
  },
  created() {
    const params = this.$route.query;
    if (params.machine) { this.machine = params.machine }
    if (params.uuttype) { this.uuttype = params.uuttype }
    if (params.area) { this.area = params.area }
    if (params.sernum) { this.sernum = params.sernum }
    if (params.startDate) { this.startDate = params.startDate }
    if (params.endDate) { this.endDate = params.endDate }
  },
  activated() {
    this.getUsername();
    const routeStr = sessionStorage.getItem('route');
    const route = routeStr ? JSON.parse(routeStr) : {};
    if (route.from === '/vision/advanced/sernumList') return;
    // 遍历所有数据属性并重置
    const initialData = this.$options.data.call(this);
    const excludeKeys = ['re', 'username'];
    Object.keys(initialData)
      .filter(key => !excludeKeys.includes(key))
      .forEach(key => {
        this[key] = JSON.parse(JSON.stringify(initialData[key]));
      });
    this.getCurrentTimes();
  },
  deactivated() {
    const routeStr = sessionStorage.getItem('route');
    const route = routeStr ? JSON.parse(routeStr) : {};
    if (route.to !== '/vision/advanced/sernumList') {
      this.isactived = false;
      this.closeLoading = true;
    }
  },
  methods: {
    saveStartDate(date) {
      this.startDate = date;
    },
    saveEndDate(date) {
      this.endDate = date;
    },
    // 获取用户工号
    getUsername() {
      let name = this.$cookies.get('username');
      if (!name) this.$router.replace('/genius/login');
      if (name !== 'genius' && name !== 'engineer') {
        this.username = name.split('(')[1].slice(0, -1);
      } else {
        this.username = name;
      }      
    },
    // 路由传参跳转
    goSernumList(data_type, result_type, count) {
      if (count === '0') return;
      const params = {
        data_type: data_type,
        user: this.username,
        time_stamp: this.time_stamp,
        result_type: result_type
      };
      this.$router.push({ name: 'SernumList', query: params });
    },
    async getCurrentTimes() {
      const { data: res } = await getCurrentTime();
      if (res.status) {
        this.currenTtime = res.payload.current_time.split('T');
        this.endDate = res.payload.current_time.split('T')[0];
        this.startDate = moment(this.endDate).subtract(6, 'day').format('YYYY-MM-DD');
      }
    },
    // 点击Search按钮后进行的校验和接口调用
    searchDataSummary() {
      // this.isSearching = true;
      this.closeLoading = false;
      if (!this.uuttype && !this.area && !this.machine && !this.sernum) {
        return this.handleAlert('warning', 'Please enter one or more contents of UUT Type/Machine/Area/SN');
      }
      let end = new Date(this.endDate).getTime();
      let last = new Date(moment(this.startDate).add(3, 'month')).getTime();
      if (end > last) {
        this.$message({
          showClose: true,
          message: `Time range can't exceed three months,please make a new selection`,
          type: 'error', 
          duration: 0, 
          customClass: 'custom-long-message' 
        });
        return;
      }
      this.saveExist();
      this.dataSelect = 'first';
      this.time_stamp = moment().format('YYYYMMDD_HHmmss');
      this.getYieldData();
      this.changeYeild({ dataSelect: 'first', summarydata: 'overall' }, true);
    },
    // 点击Yeild卡片后进行的接口调用
    changeYeild(params, returnkey = false) {
      if (!returnkey && params.dataSelect === this.dataSelect) return;
      if (!params.summarydata) return;
      this.closeLoading = false;
      this.saveExist();
      this.dataSelect = params.dataSelect;
      this.getMatrixData();
    },
    // 正在加载数据却取消进行的数据操作
    closeLoadingData() {
      if (this.matrixdownLoading) {
        this.closeLoading = true;
        this.matrixdownLoading = false;
        return;
      }
      this.closeLoading = true;
      this.yeildLoading = false;
      this.matrixLoading = false;
      // dataSelect需要修改
      this.dataSelect = this.saveExistData.dataSelect;
      this.matrix_titles = this.saveExistData.matrix_titles;
      this.firstDataSummary = this.saveExistData.firstDataSummary;
      this.testDataSummary = this.saveExistData.testDataSummary;
      this.boardDataSummary = this.saveExistData.boardDataSummary;
      this.matrix_data = this.saveExistData.matrix_data;
    },
    // 保存已经查询到的数据
    saveExist() {
      this.saveExistData = {
        dataSelect: this.dataSelect,
        matrix_titles: this.matrix_titles,
        firstDataSummary: this.firstDataSummary,
        testDataSummary: this.testDataSummary,
        boardDataSummary: this.boardDataSummary,
        matrix_data: this.matrix_data
      };
    },
    // 数据请求和赋值的方法
    async getYieldData() {
      let mode = '';
      let result = '';
      if (!this.debug_box) { mode = 'PROD' } else { mode = 'PROD,DEBUG' }
      if (this.pass_box) result += 'P';
      if (this.fail_box) result += ' F';
      if (this.abort_box) result += ' A';

      const params = {
        'start_date': this.startDate + ' 00:00:00',
        'end_date': this.endDate + ' 23:59:59',
        'uuttype': this.uuttype,
        'sernum': this.sernum,
        'area': this.area,
        'machine': this.machine,
        'result': result,
        'mode': mode,
        'field': this.field_box ? 'ALL' : '',
        user: this.username,
        time_stamp: this.time_stamp
      };
      this.yeildLoading = true;

      // Yeild数据请求赋值
      await getYield(params)
        .then(response => {
          if (this.closeLoading) return;
          if (!response.data.status) {
            this.yeildLoading = false;
          }
          else {
            let res = response.data.payload.data;
            if (this.statusCode.includes(res.status)) {
              setTimeout(() => {
                if (!this.closeLoading) this.getYieldData();
              }, 3500);
            } else {
              this.firstDataSummary = res.result.first_yield;
              this.testDataSummary = res.result.test_yield;
              this.boardDataSummary = res.result.board_yield;
              setTimeout(() => {
                this.yeildLoading = false;
              }, 1000);
            }
          }
        })
        .catch(e => {
          console.log(e);
          this.yeildLoading = false;
          this.handleAlert();
        });
    },
    // 获取良率矩阵
    async getMatrixData() {
      const params = {
        data_type: this.dataSelect,
        user: this.username,
        time_stamp: this.time_stamp
      };
      this.matrixLoading = true;
      await getMatrix(params)
        .then(response => {
          if (this.closeLoading) return;
          if (!response.data.status) {
            this.matrixLoading = false;
          }
          else {
            const res = response.data.payload.data;
            if (this.statusCode.includes(res.status)) {
              setTimeout(() => {
                if (!this.closeLoading) this.getMatrixData();
              }, 4500);
            } else {
              this.matrixLoading = false;
              this.matrix_titles = res.result.titles;
              this.matrix_data = res.result.matrix;
            }
          }
        })
        .catch(e => {
          console.log(e);
          this.matrixLoading = false;
          this.handleAlert(); 
        });
    },
    // 良率矩阵传递的方法
    handleMatrix(uuttype, area, result) {
      // 下载矩阵数据
      if (uuttype === 'matrix') {
        this.closeLoading = false;
        this.downloadMatrixExcel();
      } else {
        // 路由传参跳转
        const params = {
          data_type: this.dataSelect,
          user: this.username,
          time_stamp: this.time_stamp,
          uuttype: uuttype,
          area: area,
          result_type: result,
          startDate: this.startDate,
          endDate: this.endDate
        };
        this.$router.push({ name: 'SernumList', query: params });
      }
    },
    // 下载良率矩阵Excel
    async downloadMatrixExcel() {
      const params = {
        data_type: this.dataSelect,
        user: this.username,
        time_stamp: this.time_stamp
      };
      this.matrixdownLoading = true;
      await getMatrixDownload(params)
        .then(response => {
          if (this.closeLoading) return;
          if (!response.data.status) {
            this.matrixdownLoading = false;
            this.handleAlert('warning', response.data.payload.message);
          } else {
            window.location.href = response.data.payload.data.result.url;
            setTimeout(() => {
              this.matrixdownLoading = false;
            }, 2000);
          }
        })
        .catch(e => {
          console.log(e);
          this.matrixdownLoading = false;
          this.handleAlert();
        });
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
          customClass: 'custom-long-message' 
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
  },
};
</script>
<style lang='stylus' scoped>
.layout-margin.layout {
  flex: none;
  margin-bottom: 23px;
}
.search-input {
  width: 164px;
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
