# Measurment.vue
```
<!-- <template>
  <v-layout row wrap>
    <v-flex sm12>
      <v-widget title="Measurment">
        <div slot="widget-content">
          <v-flex>
            <toast ref="toast"></toast>
          </v-flex>
          <v-container fluid style="padding-top:10px;">
            <v-layout row>
              <v-spacer></v-spacer>
              <date-select class="pr-2" :endDate="params.endDate" :lastDate="nowDate" :confirmValue="params.startDate" @saveDate="saveStartDate"></date-select>
              <date-select class="pr-2" :startDate="params.startDate" :lastDate="nowDate" :confirmValue="params.endDate" @saveDate="saveEndDate"></date-select>
              <div style="width: 250px;" class="pr-2">
                <v-text-field class="hidden-sm-and-down MacManageSearch" solo v-model="search" placeholder="Serial Number or UUT Type"
                  v-on:keyup.enter="inputSearch" color="primary" clearable>
                  <template slot="append">
                    <button id="searchButton">
                      <i class="iconfont icon-search" style="font-size: 18px;" @click="inputSearch"></i>
                    </button>
                  </template>
                </v-text-field>
              </div>
            </v-layout>
            <v-layout row wrap>
              <v-flex sm12>
                <v-card flat>
                  <measurment-table :search="params" :dataSource="measurmentList" :downData="downData" @changeQuery="changeQuery"></measurment-table>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
        </div>
      </v-widget>
    </v-flex>
  </v-layout>
</template> -->

<!-- <script>
import VWidget from '@/components/VWidget';
import DateSelect from '../../../components/common/DatePicker.vue';
import MeasurmentTable from '../components/measurment/MeasurmentTable.vue';
import Toast from '../components/Toast.vue';
import moment from 'moment';
import { getCurrentTime } from '../../genius/api/getCurrentTime.js';
import { getMeasurmentList } from '../api/measurment.js';

export default {
  components: {
    VWidget,
    DateSelect,
    MeasurmentTable, 
    Toast
  },
  data() {
    return {
      nowDate: '',
      search: '',
      params: {
        startDate: '',
        endDate: '',
        search: '',
        tablesearch: '',
        page: 1,
        page_size: 15,
        download: 0,
        message: false,
        limitName: [],
        status: [],
        testStep: [],
        station: []
      },
      measurmentList: {},
      downData: []
    };
  },
  created() {
    this.resetMeasurmentList();
    this.resetDownData();
  },
  mounted() {
    this.resetMeasurmentList();
    this.resetDownData();
    this.getCurrentTimes();
    this.debouncedMeasurmentList = this.debounce(this.getMeasurmentList, 50);
  },
  methods: {
    // measurmentList的初始值
    resetMeasurmentList() {
      this.measurmentList = {
        data: [],
        data_sum: 0,
        start_index: 0,
        end_index: 0,
        page_sum: 0,
        select: {
          limit_name: [],
          station: [],
          status: [],
          test_step: []
        }
      };
    },
    // resetDownData的初始值
    resetDownData() {
      this.downData = [{
        'Record Time': '',
        'Serial Number': '',
        'UUT Type': '',
        'Limit Name': '',
        'Status': '',
        'Measure': '',
        'Limit Def': '',
        'Test Step': '',
        'Station': ''        
      }];
    },
    // 保存时间，如果输入框有值，进行请求
    saveStartDate(date) {
      this.params.startDate = date;
      if (this.params.search) {
        this.params.message = true;
        this.debouncedMeasurmentList();
        this.downloadMeasurment();
      }
    },
    saveEndDate(date) {
      this.params.endDate = date;
      if (this.params.search) {
        this.params.message = true;
        this.debouncedMeasurmentList();
        this.downloadMeasurment();
      }
    },
    // 防抖函数
    debounce(fn, wait) {
      let timer = null;
      return function() {
        if (timer !== null) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          fn.apply(this);
        }, wait);
      };
    },
    inputSearch() {
      let search = (this.search || '').trim();
      this.params.tablesearch = search + Date.now();
      this.params.search = search;
      if (!search) {
        this.$refs.toast.showWarning('Please enter search content'); // 原先 Please input Serial Number or UUT Type
        this.resetMeasurmentList();
        this.resetDownData();
        return;
      }
      this.params.message = true;
      this.debouncedMeasurmentList();
      this.downloadMeasurment();
    },
    changeQuery(page, page_size, tableSearch) {
      this.params.page = page;
      this.params.page_size = page_size;
      this.params.limitName = tableSearch.limitName;
      this.params.status = tableSearch.status;
      this.params.testStep = tableSearch.testStep;
      this.params.station = tableSearch.station;
      if (this.params.search) this.debouncedMeasurmentList();
    },
    async getCurrentTimes() {
      const { data: res } = await getCurrentTime();
      if (res.status) {
        this.nowDate = res.payload.current_time.split('T')[0];
        this.params.endDate = res.payload.current_time.split('T')[0];
        this.params.startDate = moment(this.params.endDate).subtract(6, 'month').format('YYYY-MM-DD');
      }
    },
    async getMeasurmentList() {
      this.params.download = 0;
      await getMeasurmentList(this.params)
        .then(response => {
          const res = response.data;
          this.alert = false;
          if (res.status && this.params.message) {
            this.$refs.toast.showSuccess(`${res.payload.message}`);
          }
          this.measurmentList = res.payload.data;
        })
        .catch(e => {
          console.log(e);
          this.$refs.toast.showError('Service Error, please contact Genius Team');
          this.resetMeasurmentList();
        });
      this.params.message = false;
    },
    async downloadMeasurment() {
      this.params.download = 1;
      const { data: res } = await getMeasurmentList(this.params);
      this.resetDownData();
      if (res.status && res.payload.data.length > 0) {
        this.downData = res.payload.data.map(item => {
          return {
            'Record Time': item.record_time ? item.record_time.replace('T', ' ').slice(0, 19) : '',
            'Serial Number': item.sernum,
            'UUT Type': item.uuttype,
            'Limit Name': item.limit_name,
            'Status': item.pass_fail,
            'Measure': item.actual_result,
            'Limit Def': item.limit_def,
            'Test Step': item.test_step,
            'Station': item.station
          };
        });
      }
    }
  }
};
</script> -->

<!-- <style lang="stylus" scoped>
</style> -->

<template>
  <v-layout row wrap>
    <v-flex sm12>
      <v-widget title="Measurment">
        <div slot="widget-content">
          <v-flex>
            <toast ref="toast"></toast>
          </v-flex>
          <!-- 表格 -->
          <v-container fluid style="padding-top:10px;">
            <v-layout row style="height: 65px;">
              <!-- 标签 -->
              <v-tabs v-model="checktab" grow class="setTabs" active-class="active_tabs">
                <v-tabs-slider color="primary"></v-tabs-slider>
                <v-tab style="color:#000;font-weight:bolder;" class="NewButton">CPK Analysis</v-tab>
                <v-tab style="color:#000;font-weight:bolder;" class="NewButton">Measurment Data</v-tab>
              </v-tabs>
              <v-spacer></v-spacer>
              <!-- <div style="width:245px;" v-if="checktab === 0">
                 <v-text-field style="margin-right: 2px;" class="hidden-sm-and-down MacManageSearch" solo placeholder="Serial Number" v-model="snSearchQuery.sn" v-on:keyup.enter="handleSn" color="primary" clearable>
                </v-text-field>
                <v-text-field style="margin-right: 2px;" class="hidden-sm-and-down MacManageSearch" solo placeholder="Serial Number" v-model="snSearchQuery.sn" v-on:keyup.enter="handleSn" color="primary" clearable>
                  <template slot="append">
                    <button id="searchButton">
                      <i class="iconfont icon-search" style="font-size: 18px;" @click="handleSn"></i>
                    </button>
                  </template>
                </v-text-field>
              </div> -->
              <div v-if="checktab === 0" style="display: flex;justify-content: right;align-items: center;">

                <!-- <div class="border-with-text" :style="{ padding: '0 0 0 12px', '--border-text': `'${ uuttypeCount }'` }">
                  <textarea class="no-border-textarea" placeholder="UUT TYPE" v-model="uuttype"></textarea>
                </div> -->
              <div>                
                  <div class="border-with-text" :style="{ padding: '0 0 0 12px', '--border-text': `'${ uuttypeCount }'` }">
                    <textarea class="no-border-textarea" placeholder="UUT TYPE" v-model="uuttype"></textarea>
                  </div>
              </div>
                <!-- 上述v-textarea是vuetify组件中的输入框，目前输入框中有UUT Type - 的内容，我现在我一输入该内容就动画到边框中显示，我记得vuetify中好像有属性专门的这方面实施的，可以帮我看看吗 -->
                <!-- <div class="search-input" style="width: 150px;">
                  <v-textarea class="DataSearchText" style="margin-right: 10px;" rows="1" solo placeholder="UUT Type" v-model="snSearchQuery.sn" v-on:keyup.enter="handleSn" color="primary" clearable></v-textarea>
                </div> -->
                <div style="width: 150px;">
                  <v-text-field style="margin-right: 10px;" class="hidden-sm-and-down MacManageSearch" solo placeholder="UUT Type" v-on:keyup.enter="handleSn" color="primary" clearable></v-text-field>
                </div>
                <div style="width: 150px;">
                    <v-text-field style="margin-right: 10px;" class="hidden-sm-and-down MacManageSearch" solo placeholder="Serial Number" v-on:keyup.enter="handleSn" color="primary" clearable></v-text-field>
                </div>
                <div style="width: 150px;">
                    <v-text-field style="margin-right: 10px;" class="hidden-sm-and-down MacManageSearch" solo placeholder="Area" v-on:keyup.enter="handleSn" color="primary" clearable></v-text-field>
                </div>
                <div style="width: 300px;">
                    <v-text-field style="margin-right: 10px;" class="hidden-sm-and-down MacManageSearch" solo placeholder="Test Item" v-on:keyup.enter="handleSn" color="primary" clearable></v-text-field>
                </div>
                <div style="width: 200px;">
                    <v-text-field style="margin-right: 10px;" class="hidden-sm-and-down MacManageSearch" solo placeholder="Container" v-on:keyup.enter="handleSn" color="primary" clearable></v-text-field>
                </div>
                <div style="width: 150px;">
                    <v-text-field style="margin-right: 10px;" class="hidden-sm-and-down MacManageSearch" solo placeholder="Serial Number" v-on:keyup.enter="handleSn" color="primary" clearable></v-text-field>
                </div>
                <div style="width: 100px; margin-top: -28px;">
                  <v-btn color="primary" class="hidden-sm-and-down MacManageSearch" dark style="border-radius: 6px;">CPK</v-btn>
                </div>
              </div>
            </v-layout>
            <!-- 表格 -->
            <v-layout row wrap>
              <v-flex sm12 v-if="checktab === 0">
                <v-card flat>
                  <cpk-analysis-table :pageQuery="snSearchQuery" :snSearchObj="snSearchObj" @getSNSearchQuery="handleSNSearchQuery"></cpk-analysis-table>
                </v-card>
              </v-flex>
              <v-flex sm12 v-if="checktab === 1">
                <v-card flat>
                  <measurment-data-table :templateObj="templateObj" :attributesList="attributesList" @getTemplateQuery="handleTemplateQuery" @getSNAttributes="getSNAttributesData"></measurment-data-table>
                </v-card>
              </v-flex>
            </v-layout>
<!-- 
            <v-layout row wrap>
              <v-flex sm12 v-show="checktab === 0">
                <cpk-analysis @showAlert="showAlert"></cpk-analysis>
              </v-flex>
              <v-flex sm12 v-if="checktab === 1">
                <v-card flat>
                  <measurment-data :productReportData="productReportList" :operationAccess="engineer && admin" :pageNumber="pageNumber" :taskNameList="taskNameList" :username="name" @showAlert="showAlert"></measurment-data>
                </v-card>
              </v-flex>  
            </v-layout> -->
          </v-container>
        </div>
      </v-widget>  
    </v-flex>
  </v-layout>
</template>

<script>
import VWidget from '@/components/VWidget';
// import SnSearchTable from '../components/snattribute/SNSearchTable.vue';
// import TemplateTable from '../components/snattribute/TemplateTable.vue';
import CpkAnalysisTable from '../components/measurment/CpkAnalysisTable.vue';
import MeasurmentDataTable from '../components/measurment/MeasurmentDataTable.vue';
import CpkAnalysis from '../components/measurment/CpkAnalysis.vue';
import MeasurmentData from '../components/measurment/MeasurmentData.vue';
import Toast from '../components/Toast.vue';
import publicWays from '../../../store/publicWays';
import { getAccess, snSearchList, templateList, attributesDetail, pullAttributes } from '../api/snAttributes';

export default {
  components: {
    VWidget,
    // SnSearchTable,
    // TemplateTable,
    CpkAnalysisTable, 
    MeasurmentDataTable, 
    CpkAnalysis, 
    MeasurmentData, 
    Toast
  },
  data() {
    return {
      name: '',
      uuttype: '',          // 绑定输入值
      uuttypeCount: 0,         // 示例计数
      pullAccess: false,
      admin: false,
      checktab: 0,
      pullLoading: false,
      templateQuery: {
        page: 1,
        page_size: 15,
        time_zone: publicWays.setTimeZone()
      },
      snSearchQuery: {
        page: 1,
        page_size: 15,
        sn: ''
      },
      snSearchObj: {
        data: [],
        data_sum: 0,
        end_index: 0,
        page_sum: 1,
        start_index: 0
      },
      templateObj: {
        data: [],
        data_sum: 0,
        end_index: 0,
        page_sum: 1,
        start_index: 0
      },
      attributesList: []
    };
  },
  watch: {
    checktab(newtab, oldtab) {
      if (newtab === 1 && oldtab === 0) {
        this.getTemplateData(this.templateQuery);
      }
    },
  },
  mounted() {
    let username = this.$cookies.get('username');
    let role = this.$cookies.get('role');
    this.pullAccess = role === 'engineer' ? true : false;
    if (!username) {
      this.$router.replace('/genius/login');
    }
    if (username !== 'engineer') {
      this.name = username.split('(')[1].slice(0, -1);
    } else {
      this.name = username;
    }
    this.isAdmin();
  },
  methods: {
    // 管理员权限判断
    async isAdmin() {
      const { data: res } = await getAccess(this.name);
      if (res.status) {
        this.admin = true;
      }
    },
    // 改变页码和页大小后，赋值给相关参数，以便 输入 SN 后可以使用相关参数进行查询
    handleSNSearchQuery(obj) {
      if (this.snSearchQuery.page === obj.page && this.snSearchQuery.page_size === obj.page_size) return;
      this.snSearchQuery.page = obj.page;
      this.snSearchQuery.page_size = obj.page_size;
      this.getSNSearchData(this.snSearchQuery);
    },
    // 输入 SN 后点击查询，回到第一页
    handleSn() {
      if (!this.snSearchQuery.sn) {
        this.$refs.toast.showWarning('Please enter search content');
      }
      this.snSearchQuery.page = 1;
      this.getSNSearchData(this.snSearchQuery);
    },
    // 改变页码和页大小后，赋值给相关参数，以便 pull template 后可以使用相关参数进行查询
    handleTemplateQuery(obj) {
      this.templateQuery.page = obj.page;
      this.templateQuery.page_size = obj.page_size;
      this.getTemplateData(this.templateQuery);
    },
    // 查询SN Seach数据
    async getSNSearchData(paramsObj) {
      const { data: res } = await snSearchList(paramsObj);
      if (!res.status) {
        this.$refs.toast.showError(`${res.payload.message}`);
        return; 
      }
      this.snSearchObj = res.payload.data;
      this.$refs.toast.showSuccess(`${res.payload.message}`);
    },
    // 查询Template数据
    async getTemplateData(paramsObj) {
      const { data: res } = await templateList(paramsObj);
      if (!res.status) {
        this.$refs.toast.showError(`${res.payload.message}`);
        return;
      }
      this.templateObj = res.payload.data;
    },
    // 查询Template详情数据
    async getSNAttributesData(paramsObj) {
      const { data: res } = await attributesDetail(paramsObj);
      if (!res.status) {
        this.$refs.toast.showError(`${res.payload.message}`);
        return; 
      }
      this.attributesList = res.payload.data.attributes.map((item, index) => {
        return { id: index + 1, ...item };
      });
    },
    // 从Genius Cloud拉取数据
    async pullAttributesData() {
      this.pullLoading = true;
      const { data: res } = await pullAttributes({ username: this.name });
      this.pullLoading = false;
      if (!res.status) {
        this.$refs.toast.showError(`${res.payload.message}`);
        return; 
      }
      this.getTemplateData(this.templateQuery);
      this.$refs.toast.showSuccess(`${res.payload.message}`);
    }
  }
};
</script>

<style lang="stylus" scoped>
.NewButton {
  font-size: 14px;
  height:28px;
  margin:auto;
  margin-right: 20px;
  border-radius:2px;
  text-transform:none;
}
.NewButton:hover {
  background-color:#F8E8FF;
  border-radius:8px;
}
/deep/ .active_tabs {
  color:#9d4edc;
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
