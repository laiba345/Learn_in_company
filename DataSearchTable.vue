```
<template>
  <div>
    <!-- 上半区域--输入板的参数进行搜索 -->
    <v-layout row wrap>
      <v-flex sm12>
        <v-container fluid style="padding: 0 0 24px 0">
          <v-form v-model="valid" ref="form" lazy-validation>
            <v-layout row wrap>
              <v-layout row wrap class="layout-margin">
                <div style="width: 45px; margin: 0 10px 0 0; font-weight: bold;" class="status-select">
                  Search:
                </div>

                <div class="search-input">
                  <v-textarea class="DataSearchText" outline rows="1" :label="'UUT Type - ' + uuttypeCount" v-model="uuttype"></v-textarea>
                </div>

                <div class="search-input">
                  <v-textarea class="DataSearchText" outline rows="1" :label="'Area - ' + areaCount" v-model="area"></v-textarea>
                </div>

                <div class="search-input">
                  <v-textarea class="DataSearchText" outline rows="1" :label="'Machine - ' + machineCount" v-model="machine"></v-textarea>
                </div>

                <div style="margin-right: 20px" class="search-input">
                  <v-textarea class="DataSearchText" outline rows="1" :label="'Serial Number - ' + sernumCount" v-model="sernum"></v-textarea>
                </div>
              </v-layout>
              <!-- 搜索时间段 -->
              <v-layout row wrap class="layout-margin">
                <div style="width: 35px; margin: 0 10px 0 0; font-weight: bold;" class="status-select">
                  Time:
                </div>
                <!-- 开始时间区域 -->
                <div class="search-input">
                  <v-menu ref="setStatDate" lazy :close-on-content-click="false"
                    v-model="startDateMenu" transition="scale-transition" offset-y full-width :nudge-bottom="-22"
                    max-width="290px" :return-value.sync="startDate">
                    <v-text-field slot="activator" label="Start Date" v-model="startDate" append-icon="event" readonly class="DataSearch" solo></v-text-field>
                    <!-- 开始时间段弹窗 -->
                    <v-date-picker v-model="startDate" no-title scrollable :allowed-dates="allowedStartDate" color="primary">
                      <v-spacer></v-spacer>
                      <v-btn flat color="primary" @click="startDateMenu = false">Cancel</v-btn>
                      <v-btn flat color="primary" @click="$refs.setStatDate.save(startDate)">OK</v-btn>
                    </v-date-picker>
                  </v-menu>
                </div>
                <!-- 结束时间区域 -->
                <div style="margin-right: 20px" class="search-input">
                  <v-menu ref="setEndDate" lazy :close-on-content-click="false" v-model="endDateMenu"
                    transition="scale-transition" offset-y full-width :nudge-bottom="-22" min-width="290px"
                    :return-value.sync="endDate">
                    <v-text-field slot="activator" label="End Date" v-model="endDate" append-icon="event" readonly class="DataSearch" solo></v-text-field>
                    <!-- 结束时间段弹窗 -->
                    <v-date-picker v-model="endDate" no-title scrollable :allowed-dates="allowedEndDate" color="primary">
                      <v-spacer></v-spacer>
                      <v-btn flat color="primary" @click="endDateMenu = false">Cancel</v-btn>
                      <v-btn flat color="primary" @click="$refs.setEndDate.save(endDate)">OK</v-btn>
                    </v-date-picker>
                  </v-menu>
                </div>
              </v-layout>
              <v-layout row wrap class="layout-margin">
                <!-- 勾选搜索的筛选框 -->
                <div style="width: 43px; margin: 0 10px 0 0; font-weight: bold;" class="status-select">
                  Status:
                </div>
                <div style="margin-right: 10px" class="status-select">
                  <v-checkbox :label="`Fail `" color="#9d4edc" :disabled="true" v-model="fail_box"></v-checkbox>
                </div>
                <div style="margin-right: 10px" class="status-select">
                  <v-checkbox :label="`Pass `" color="#9d4edc" :disabled="true" v-model="pass_box"></v-checkbox>
                </div>
                <div style=" margin-right: 10px" class="status-select">
                  <v-checkbox :label="`Abort `" color="#9d4edc" v-model="abort_box"></v-checkbox>
                </div>
                <div style="margin-right: 10px; margin-right: 20px" class="status-select">
                  <v-checkbox :label="`DEBUG `" color="#9d4edc" v-model="debug_box"></v-checkbox>
                </div>
              </v-layout>
              <v-layout row wrap class="layout-margin">
                <div style="width: 65px; margin: 0 10px 0 0; font-weight: bold;" class="status-select">
                  Download:
                </div>
                <div style="margin-right: 10px" class="status-select">
                  <v-checkbox :label="`All Fields `" color="#9d4edc" v-model="field_box"></v-checkbox>
                </div>
              </v-layout>
              <div style="width: 95px; height: 59px; padding: 5px 0 0 7px">
                <v-btn style="margin: 0" middle color="primary" :loading="loading" @click="getDataSummaryMethod" :disabled="loading">
                  Search
                  <span slot="loader">Loading...</span>
                </v-btn>
              </div>

              <!-- 加载提示弹窗 -->
              <v-flex>
                <div class="text-xs-center">
                  <v-dialog v-model="dialog" hide-overlay persistent width="300">
                    <v-card color="primary" dark>
                      <v-card-text>
                        Loading data, please wait...
                        <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                      </v-card-text>
                    </v-card>
                  </v-dialog>
                </div>
              </v-flex>

            </v-layout>
          </v-form>
        </v-container>
      </v-flex>
    </v-layout>

    <!-- 下半区域--搜索结果 -->
    <v-container grid-list-xl fluid style="padding: 24px 12px">
      <v-layout row wrap>
        <!-- First Yield 小窗数据 -->
        <v-flex lg4 md4 sm12 xs12 pt-0 pb-0 pl-0 pr-1>
          <v-card>
            <v-card-text>
              <div class="layout row ma-0 align-center justify-space-between">
                <div class="text-box">
                  <div class="subheading" @click="freshDataSummary('first_data')"><a><span class="black--text">First
                        Yield</span></a></div>
                  <span class="primary--text" v-if="firstDataSummary">
                    <span>{{ firstDataSummary.split('-')[0] }} (</span>
                    <a>
                      <span class="green--text" @click="SendSource('first_data', 'pass', firstDataSummary.split('-')[1])" :loading="loading"
                        @click.native="loading = true; dialog = true" :disabled="loading" >
                        {{ firstDataSummary.split('-')[1] }}
                      </span>
                    </a>/
                    <a>
                      <span class="red--text" @click="SendSource('first_data', 'fail', firstDataSummary.split('-')[2])">
                        {{ firstDataSummary.split('-')[2] }}
                      </span>
                    </a>/
                    <a>
                      <span @click="SendSource('first_data', 'all', firstDataSummary.split('-')[3])">
                        {{ firstDataSummary.split('-')[3] }}
                      </span>
                    </a> )
                  </span>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-flex>
        <!-- Test Yield 小窗数据 -->
        <!-- mini panel -->
        <v-flex lg4 md4 sm12 xs12 pt-0 pb-0 pl-0 pr-1>
          <v-card>
            <v-card-text>
              <div class="layout row ma-0 align-center justify-space-between">
                <div class="text-box">
                  <div class="subheading" @click="freshDataSummary('test_data')"><a><span class="black--text">Test
                        Yield</span></a></div>
                  <span class="primary--text" v-if="testDataSummary">
                    <span>{{ testDataSummary.split('-')[0] }} (</span>
                    <a>
                      <span class="green--text" @click="SendSource('test_data', 'pass', testDataSummary.split('-')[1])">
                        {{ testDataSummary.split('-')[1] }}
                      </span>
                    </a>/
                    <a>
                      <span class="red--text" @click="SendSource('test_data', 'fail', testDataSummary.split('-')[2])">
                        {{ testDataSummary.split('-')[2] }}
                      </span>
                    </a>/
                    <a>
                      <span @click="SendSource('test_data', 'all', testDataSummary.split('-')[3])">
                        {{ testDataSummary.split('-')[3] }}
                      </span>
                    </a> )
                  </span>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-flex>
        <!-- board Yield 小窗数据 -->
        <v-flex lg4 md4 sm12 xs12 pt-0 pb-0 pl-1 pr-0>
          <v-card>
            <v-card-text>
              <div class="layout row ma-0 align-center justify-space-between">
                <div class="text-box">
                  <div class="subheading" @click="freshDataSummary('board_data')"><a><span class="black--text">Board
                        Yield</span></a></div>
                  <span class="primary--text" v-if="boardDataSummary">
                    <span>{{ boardDataSummary.split('-')[0] }} (</span>
                    <!-- <a><span class="green--text" @click="downloadDataExcel('board', 'pass', '', '')">{{ boardDataSummary.split('-')[1] }}</span></a> / -->
                    <a>
                      <span class="green--text" @click="SendSource('board_data', 'pass',boardDataSummary.split('-')[1])">
                        {{ boardDataSummary.split('-')[1] }}
                      </span>
                    </a>/
                    <a>
                      <span class="red--text" @click="SendSource('board_data', 'fail',boardDataSummary.split('-')[2])">
                        {{ boardDataSummary.split('-')[2] }}
                      </span>
                    </a>/
                    <a>
                      <span @click="SendSource('board_data', 'all',boardDataSummary.split('-')[3])">
                        {{ boardDataSummary.split('-')[3] }}
                      </span>
                    </a> )
                  </span>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-flex>

        <!-- first data -->
        <v-layout row wrap>

          <!-- 第一个表详细的产品数据表 --DataTable3-- -->
          <v-flex lg12 sm12 xs12 id="test-data-matrix">
            <data-table-matrix :title="dataCategory" :titles="matrix_titles" :testDataSource="matrix_data"
              @downloadMatrixExcel="downloadMatrixExcel"></data-table-matrix>
          </v-flex>

          <v-flex lg6 md6 sm12 xs12 pr-1>
            <yield-chart :title="dataCategory + ' Yield/Throughput'" :chart-data="yieldThroughput" ref="yieldThroughput">
            </yield-chart>
          </v-flex>
          <v-flex lg6 md6 sm12 xs12 pl-0>
            <plato-chart :title="dataCategory + ' Analysis ' + timeCategory" :chart-data="yieldAnalysis"
              ref="yieldAnalysis">
            </plato-chart>
          </v-flex>

          <v-flex lg12 md12 sm12 xs12 pr-1 v-show="timeCategory !== 'Overall'">
            <yield-chart :title="dataCategory + ' Yield/Throughput By Hour ' + timeCategory"
              :chart-data="yieldThroughputByHour" ref="yieldThroughputByHour">
            </yield-chart>
          </v-flex>

          <v-flex lg6 sm12 xs12 pr-1>
            <fail-pie-chart :title="dataCategory + ' By Area ' + timeCategory" name="Daily"
              :chart-data="failureAnalysisByArea" ref="failureAnalysisByArea">
            </fail-pie-chart>
          </v-flex>
          <v-flex lg6 sm12 xs12 pl-0>
            <plato-chart :title="dataCategory + ' Analysis ' + areaSelect" :chart-data="yieldAnalysisByArea"
              ref="yieldAnalysisByArea">
            </plato-chart>
          </v-flex>

          <v-flex lg6 sm12 xs12 pr-1>
            <fail-pie-chart :title="dataCategory + ' By UUTTYPE ' + timeCategory" name="Daily"
              :chart-data="failureAnalysisByUuttype" ref="failureAnalysisByUuttype">
            </fail-pie-chart>
          </v-flex>

          <v-flex lg6 sm12 xs12 pl-0>
            <plato-chart :title="dataCategory + ' Analysis ' + uuttypeSelect" :chart-data="yieldAnalysisByUuttype"
              ref="yieldAnalysisByUuttype">
            </plato-chart>
          </v-flex>

          <v-flex lg6 sm12 xs12 pr-1>
            <fail-pie-chart :title="dataCategory + ' By Machine ' + timeCategory" name="Daily"
              :chart-data="failureAnalysisByMachine" ref="failureAnalysisByMachine">
            </fail-pie-chart>
          </v-flex>

          <v-flex lg6 sm12 xs12 pl-0>
            <plato-chart :title="dataCategory + ' Analysis ' + machineSelect" :chart-data="yieldAnalysisByMachine"
              ref="yieldAnalysisByMachine">
            </plato-chart>
          </v-flex>

          <v-flex lg12 sm12 xs12>
            <plato-chart :title="dataCategory + ' Analysis ' + machineSelect" :chart-data="yieldAnalysisByContainer"
              ref="yieldAnalysisByContainer">
            </plato-chart>
          </v-flex>
        </v-layout>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import EChart from '@/components/chart/echart';
import { getDataSummary, getDataDetails, getDataExcel, deleteDataCache, getDataMatrix } from '../../api/advanced.js';
import { getCurrentTime } from '../../../genius/api/getCurrentTime.js';
import Material from 'vuetify/es5/util/colors';
import MiniChart from '@/components/widgets/chart/MiniChart';
import BoxChart from '@/components/widgets/chart/BoxChart';
import VWidget from '@/components/VWidget';
import YieldChart from '../../components/YieldChart';
import PlatoChart from '../../components/PlatoChart';
import FailPieChart from '../../components/FailPieChart';
import DataTable from '../../components/DataTable2';
import DataTableMatrix from '../../components/DataTable3';
import moment from 'moment';

export default {
  name: 'advance2',

  components: {
    BoxChart,
    MiniChart,
    EChart,
    VWidget,
    YieldChart,
    PlatoChart,
    FailPieChart,
    DataTable,
    DataTableMatrix,
  },
  data() {
    return {
      alert: false,
      alert_color: 'warning',
      alert_message: 'it is error',
      valid: true,
      startDateMenu: false,
      endDateMenu: false,
      startDate: '',
      endDate: '',
      uuttype: '',
      area: '',
      machine: '',
      sernum: '',
      mode: '',
      result: '',
      test: '',
      loading: false,
      dialog: false,
      start_box: false,
      abort_box: false,
      fail_box: true,
      pass_box: true,
      debug_box: false,
      field_box: false,
      sernumCount: 0,
      uuttypeCount: 0,
      areaCount: 0,
      machineCount: 0,
      re: /\r\n|\n\r|\n|\r|,/g,

      responseData: {},
      model: {
        start_date: '',
        end_date: '',
        uuttype: '',
        sernum: '',
        area: '',
        machine: '',
        mode: '',
        result: '',
        test: '',
        field: '',
      },
      yieldThroughput: [],
      yieldThroughputByHour: [],
      failureAnalysis: [],
      failureAnalysisByArea: [],
      failureAnalysisByUuttype: [],
      failureAnalysisByMachine: [],
      yieldAnalysis: [],
      yieldAnalysisByArea: [],
      yieldAnalysisByUuttype: [],
      yieldAnalysisByMachine: [],
      yieldAnalysisByContainer: [],

      dataSelect: 'first_data',  // first_data,test_data,board_data
      indexSelect: 100,
      dataCategory: 'First',  // First, Test, Board
      timeCategory: 'Overall',  // Overall, 20190909
      areaSelect: '',
      machineSelect: '',
      uuttypeSelect: '',

      tableSource: [],
      dataSearch: '',
      color: Material,
      time_stamp: '',
      firstDataSummary: '',
      testDataSummary: '',
      boardDataSummary: '',
      matrix_titles: [],
      matrix_data: [],

      SendTableSourceTotalure: [],
      SendTableSourceFailure: [],
      SearchData: [],
      SendSourceData: [],
      EtePassArr: [],
      EteFailArr: [],
      EteTotalArr: [],
      areaList: [],
    };
  },
  watch: {
    sernum() {
      if (!this.sernum.trim()) {
        this.sernumCount = 0;
      } else {
        this.sernumCount = this.sernum.trim().split(this.re).length;
      }
    },
    area() {
      if (!this.area.trim()) {
        this.areaCount = 0;
      } else {
        this.areaCount = this.area.trim().split(this.re).length;
      }
    },
    uuttype() {
      if (!this.uuttype.trim()) {
        this.uuttypeCount = 0;
      } else {
        this.uuttypeCount = this.uuttype.trim().split(this.re).length;
      }
    },
    machine() {
      if (!this.machine.trim()) {
        this.machineCount = 0;
      } else {
        this.machineCount = this.machine.trim().split(this.re).length;
      }
    },
  },

  created() {
    const params = this.$route.query;
    if (params.machine) { this.machine = params.machine }
    if (params.uuttype) { this.uuttype = params.uuttype }
    if (params.area) { this.area = params.area }
    if (params.sernum) { this.sernum = params.sernum }
    if (params.test) { this.test = params.test }
    if (params.startDate) { this.startDate = params.startDate }
    if (params.endDate) { this.endDate = params.endDate }
  },
  beforeDestroy() {
    this.deleteDataCacheMethod();
  },
  mounted() {
    this.$refs.yieldThroughput.chartInstance.on('click', evt => {
      const name = evt.name;
      this.dataSearch = '';

      let indexSelect = 0;
      this.responseData[this.dataSelect].daily.forEach(function (element, index, self) {
        if (element.name === name) {
          indexSelect = index;
        }
      });
      this.indexSelect = indexSelect;

      this.timeCategory = name;
      this.failureAnalysisByArea = this.responseData[this.dataSelect].daily[this.indexSelect].analysis.area;
      this.failureAnalysisByUuttype = this.responseData[this.dataSelect].daily[this.indexSelect].analysis.uuttype;
      this.failureAnalysisByMachine = this.responseData[this.dataSelect].daily[this.indexSelect].analysis.machine;
      this.yieldAnalysis = this.responseData[this.dataSelect].daily[this.indexSelect].analysis.overall;
      this.getDataDetailsMethod(name);
    });
    this.$refs.yieldAnalysis.chartInstance.on('click', evt => {
      const name = evt.name;
      this.dataSearch = name;
    });
    this.$refs.failureAnalysisByArea.chartInstance.on('click', evt => {
      const name = evt.name;
      this.areaSelect = name;
      this.dataSearch = name;
      if (this.indexSelect === 1000) {
        this.yieldAnalysisByArea = this.responseData[this.dataSelect].analysis.by_area[name];
      } else {
        this.yieldAnalysisByArea = this.responseData[this.dataSelect].daily[this.indexSelect].analysis.by_area[name];
      }
    });
    this.$refs.failureAnalysisByMachine.chartInstance.on('click', evt => {
      const name = evt.name;
      this.machineSelect = name;
      this.dataSearch = name;
      if (this.indexSelect === 1000) {
        this.yieldAnalysisByMachine = this.responseData[this.dataSelect].analysis.by_machine[name];
        this.yieldAnalysisByContainer = this.responseData[this.dataSelect].analysis.by_container[name];
      } else {
        this.yieldAnalysisByMachine = this.responseData[this.dataSelect].daily[this.indexSelect].analysis.by_machine[name];
        this.yieldAnalysisByContainer = this.responseData[this.dataSelect].daily[this.indexSelect].analysis.by_container[name];
      }
    });
    this.$refs.failureAnalysisByUuttype.chartInstance.on('click', evt => {
      const name = evt.name;
      this.uuttypeSelect = name;
      this.dataSearch = name;
      if (this.indexSelect === 1000) {
        this.yieldAnalysisByUuttype = this.responseData[this.dataSelect].analysis.by_uuttype[name];
      } else {
        this.yieldAnalysisByUuttype = this.responseData[this.dataSelect].daily[this.indexSelect].analysis.by_uuttype[name];
      }
    });
    this.$refs.yieldAnalysisByArea.chartInstance.on('click', evt => {
      this.dataSearch = evt.name;
    });
    this.$refs.yieldAnalysisByUuttype.chartInstance.on('click', evt => {
      this.dataSearch = evt.name;
    });
    this.$refs.yieldAnalysisByMachine.chartInstance.on('click', evt => {
      this.dataSearch = evt.name;
    });
    this.$refs.yieldAnalysisByContainer.chartInstance.on('click', evt => {
      this.dataSearch = evt.name;
    });
    this.getCurrentTimes();
  },
  methods: {
    allowedStartDate(val) {
      if (this.endDate) {
        let cur = new Date(val).getTime();
        let end = new Date(this.endDate).getTime();
        return cur <= end;
      }
      return false;
    },
    allowedEndDate(val) {
      if (this.startDate) {
        let cur = new Date(val).getTime();
        let curs = new Date().getTime();
        let end = new Date(this.startDate).getTime();
        return cur >= end && cur <= curs;
      }
      return false;
    },
    // 路由传参跳转
    SendSource(SendDataSelect, sourcestatue, showData) {

      this.loading = true;
      this.dialog = true;
      showData = Number(showData);
      let data_type = 'first';
      let dateStamp = 'overall';
      if (SendDataSelect === 'first_data') { data_type = 'first' }
      if (SendDataSelect === 'test_data') { data_type = 'test' }
      if (SendDataSelect === 'board_data') { data_type = 'board' }

      if (data_type === 'first' && sourcestatue === 'pass' && this.EtePassArr > showData) { showData = this.EtePassArr }
      if (data_type === 'first' && sourcestatue === 'fail' && this.EteFailArr > showData) { showData = this.EteFailArr }
      if (data_type === 'first' && sourcestatue === 'all' && this.EteTotalArr > showData) { showData = this.EteTotalArr }

      this.$router.push({ name: 'SernumList', params: { time_stamp: this.time_stamp, dataStamp: dateStamp, data_type: data_type, sourcestatue: sourcestatue }});
      this.loading = false;  // for search button
      this.dialog = false;  // for loading window

      setTimeout(() => {  // set time out to make sure all charts are inited.
        this.loading = false;  // for search button
        this.dialog = false;  // for loading window
      }, 2000);
    
    },
    async getCurrentTimes() {
      const { data: res } = await getCurrentTime();
      if (res.status) {
        this.endDate = res.payload.current_time.split('T')[0];
        this.startDate = moment(this.endDate).subtract(6, 'day').format('YYYY-MM-DD');
      }
    },
    handleTabChange(val, e) {
      // make sure the chart resized while parent from hidden to show
      window.dispatchEvent(new Event('resize'));
    },
    // 数据请求和赋值的方法
    getDataSummaryMethod() {
      let cur = new Date(this.startDate).getTime();
      let end = new Date(this.endDate).getTime();
      if (end - cur <= 31536000000) {
        this.model.start_date = this.startDate + ' 00:00:00';
        this.model.end_date = this.endDate + ' 23:59:59';
        this.model.uuttype = this.uuttype;
        this.model.sernum = this.sernum;
        this.model.area = this.area;
        this.model.machine = this.machine;
        this.model.mode = '';
        this.model.result = '';
        this.model.field = '';
        if (!this.debug_box) { this.model.mode = 'PROD' } else { this.model.mode = 'PROD,DEBUG' }
        if (this.pass_box) { this.model.result += 'P' }
        if (this.fail_box) { this.model.result += ' F' }
        if (this.start_box) { this.model.result += ' S' }
        if (this.abort_box) { this.model.result += ' A' }
        if (this.field_box) { this.model.field = 'ALL' }

        const params = {
          'start_date': this.model.start_date,
          'end_date': this.model.end_date,
          'uuttype': this.model.uuttype,
          'sernum': this.model.sernum,
          'area': this.model.area,
          'machine': this.model.machine,
          'result': this.model.result,
          'mode': this.model.mode,
          'test': this.model.test,
          'field': this.model.field,
        };

        this.loading = true;
        this.dialog = true;

        this.deleteDataCacheMethod();

        // 数据请求赋值
        getDataSummary(params)
          .then(response => {
            this.alert = true;
            if (!response.data.status) {
              this.alert_color = 'warning';
              this.alert_message = response.data.payload.message;
              this.$emit('showAlert', { alert: this.alert, alert_color: this.alert_color, alert_message: this.alert_message });
            }
            else {
              this.alert_color = 'success';
              this.responseData = response.data.payload.data;
              this.time_stamp = this.responseData.time_stamp;
              //  yiekd 产量栏数据的赋值
              this.firstDataSummary = this.responseData.first_data.yield;
              this.testDataSummary = this.responseData.test_data.yield;
              this.boardDataSummary = this.responseData.board_data.yield;

              this.freshDataSummary('first_data');
              this.alert_message = response.data.payload.message + ',' + response.data.payload.time;
              this.$emit('showAlert', { alert: this.alert, alert_color: this.alert_color, alert_message: this.alert_message });
            }
            this.model.result = '';
            this.model.mode = '';

            setTimeout(() => {  // set time out to make sure all charts are inited.
              this.loading = false;  // for search button
              this.dialog = false;  // for loading window
            }, 1000);
          })
          .catch(e => {
            console.log(e);
            this.alert = true;
            this.alert_color = 'red';
            this.alert_message = 'Service Error, Please Contact Genius Team.';
            this.$emit('showAlert', { alert: this.alert, alert_color: this.alert_color, alert_message: this.alert_message });
            this.loading = false;
            this.dialog = false;
            this.model.result = '';
            this.model.mode = '';
          });
      } else {
        this.loading = false;  // for search button
        this.dialog = false;  // for loading window
        this.$message.error('Time range cannot exceed one year');
      }
      
      
    },
    // 表头标题的选择
    freshDataSummary(dataSelect) {
      this.dialog = true;  // for loading window

      this.dataSelect = dataSelect;
      this.dataSearch = '';
      if (!this.responseData) {
        return false;
      }
      if (this.dataSelect === 'first_data') { this.dataCategory = 'First' }
      if (this.dataSelect === 'test_data') { this.dataCategory = 'Test' }
      if (this.dataSelect === 'board_data') { this.dataCategory = 'Board' }
      this.timeCategory = 'Overall';
      this.indexSelect = 1000;
      this.yieldThroughput = this.responseData[this.dataSelect].daily;
      this.failureAnalysisByArea = this.responseData[this.dataSelect].analysis.area;
      this.failureAnalysisByUuttype = this.responseData[this.dataSelect].analysis.uuttype;
      this.failureAnalysisByMachine = this.responseData[this.dataSelect].analysis.machine;
      this.yieldAnalysis = this.responseData[this.dataSelect].analysis.overall;

      this.getDataDetailsMethod('overall');
      this.getDataMatrixMethod();
    },
    getDataDetailsMethod(dateStamp) {
      let data_type = 'first';
      if (this.dataSelect === 'first_data') { data_type = 'first' }
      if (this.dataSelect === 'test_data') { data_type = 'test' }
      if (this.dataSelect === 'board_data') { data_type = 'board' }
      getDataDetails(this.time_stamp, dateStamp, data_type)
        .then(response => {
          if (!response.data['status']) {
            this.alert = true;
            this.alert_color = 'warning';
            this.alert_message = response.data.payload.message;
            this.$emit('showAlert', { alert: this.alert, alert_color: this.alert_color, alert_message: this.alert_message });
          }
          else {
            this.tableSource = response.data.payload.data.failure;
            this.yieldThroughputByHour = response.data.payload.data.by_hour;
          }
          this.model.result = '';
          this.model.mode = '';
          setTimeout(() => {
            this.dialog = false;  // for loading window
          }, 1000);

        })
        .catch(e => {
          console.log(e);
          this.alert = true;
          this.alert_color = 'red';
          this.alert_message = 'Service Error, Please Contact Genius Team.';
          this.$emit('showAlert', { alert: this.alert, alert_color: this.alert_color, alert_message: this.alert_message });
          this.dialog = false;
          this.model.result = '';
          this.model.mode = '';
        });
    },
    getDataMatrixMethod() {
      this.dialog = true;
      // 上为备注
      let data_type = 'first';
      if (this.dataSelect === 'first_data') { data_type = 'first' }
      if (this.dataSelect === 'test_data') { data_type = 'test' }
      if (this.dataSelect === 'board_data') { data_type = 'board' }
      this.dialog = true;
      getDataMatrix(this.time_stamp, data_type)
        .then(response => {
          if (!response.data['status']) {
            this.alert = true;
            this.alert_color = 'warning';
            this.alert_message = response.data.payload.message;
            this.$emit('showAlert', { alert: this.alert, alert_color: this.alert_color, alert_message: this.alert_message });
          }
          else {
            this.matrix_titles = response.data.payload.data.titles;
            this.matrix_data = response.data.payload.data.matrix;
            this.areaList = this.matrix_titles.slice(2);
            this.dialog = false;
            this.EtePassArr = response.data.payload.ETE_pass_data;
            this.EteFailArr = response.data.payload.ETE_fail_data;
            this.EteTotalArr = response.data.payload.ETE_total_data;
          }
          this.dialog = false;  // for loading window
          this.model.result = '';
          this.model.mode = '';
        })
        .catch(e => {
          console.log(e);
          this.alert = true;
          this.alert_color = 'red';
          this.alert_message = 'Service Error, Please Contact Genius Team.';
          this.$emit('showAlert', { alert: this.alert, alert_color: this.alert_color, alert_message: this.alert_message });
          this.dialog = false;
          this.model.result = '';
          this.model.mode = '';
        });
    },
    downloadDataExcel(data_type, result, uuttype, area, count) {
      count = Number(count);
      // console.log(data_type, result, uuttype, area, count);
      if (data_type === 'first' && area === 'ETE' && result === 'pass' && this.EtePassArr > count) { count = this.EtePassArr }
      if (data_type === 'first' && area === 'ETE' && result === 'fail' && this.EteFailArr > count) { count = this.EteFailArr }
      if (data_type === 'first' && area === 'ETE' && result === 'all' && this.EteTotalArr > count) { count = this.EteTotalArr }
      if (!this.time_stamp) { return false }
      this.dialog = true;
      getDataExcel(this.time_stamp, data_type, result, uuttype, area)
        .then(response => {
          if (!response.data['status']) {
            this.alert = true;
            this.alert_color = 'warning';
            this.alert_message = response.data.payload.message;
            this.$emit('showAlert', { alert: this.alert, alert_color: this.alert_color, alert_message: this.alert_message });
          }
          else {
            if (uuttype === 'matrix' || area === 'ETE') {
              // console.log("下载");
              let url = response.data.payload.data.url;
              window.location.href = url;
            } else {
              // console.log("跳转");
              this.SendSourceData = response.data.payload.result;
              this.$router.push({ name: 'SernumList', params: { testDataSource: this.SendSourceData }});
            }
          }
          this.dialog = false;  // for loading window
          this.model.result = '';
          this.model.mode = '';
          setTimeout(() => {
            this.dialog = false;  // for loading window
          }, 1500);
        })
        .catch(e => {
          console.log(e);
          this.alert = true;
          this.alert_color = 'red';
          this.alert_message = 'Service Error, Please Contact Genius Team.';
          this.$emit('showAlert', { alert: this.alert, alert_color: this.alert_color, alert_message: this.alert_message });
          this.dialog = false;
          this.model.result = '';
          this.model.mode = '';
        });
    },
    deleteDataCacheMethod() {
      if (!this.time_stamp) {
        return false;
      }
      deleteDataCache(this.time_stamp)
        .then(response => {
          this.time_stamp = '';
        })
        .catch(e => {
          console.log(e);
        });
    },
    downloadMatrixExcel(uuttype, area, result, count) {

      let data_type = 'first';
      let dateStamp = 'overall';
      if (this.dataSelect === 'first_data') { data_type = 'first' }
      if (this.dataSelect === 'test_data') { data_type = 'test' }
      if (this.dataSelect === 'board_data') { data_type = 'board' }

      this.downloadDataExcel(data_type, result, uuttype, area, count);
    }
  },
};
</script>
<style lang='stylus' scoped>
.layout-margin.layout {
  flex: none;
}
.search-input {
  width: 164px;
  margin-right: 10px;
}
.status-select {
  height: 59px;
  display: flex;
  align-items: center;
  justify-items: start;
}
/deep/ .DataSearchText.v-textarea textarea {
  min-height: 33px;
}
</style>
```
