# basic.vue
```
<template>
  <v-layout row wrap>
    <v-flex sm12>
      <v-widget title="SN Find">
        <div slot="widget-content">
          <v-container fluid style="padding-top: 10px;">
            <v-layout row>
              <!-- 标签 -->
              <v-tabs v-model="checktab" grow class="setTabs" active-class="active_tabs">
                <v-tabs-slider color="primary"></v-tabs-slider>
                <v-tab class="NewButton">Test Record</v-tab>
                <v-tab class="NewButton">Parent/Children</v-tab>
                <!-- sfcSupplement为true才有该功能，即第一、四、十套才有 -->
                <v-tab v-if="sfcSupplement" class="NewButton">Data Upload to SFC</v-tab>
              </v-tabs>
              <v-spacer></v-spacer>
              <!-- test data 搜索条件-->
              <div v-if="checktab === 0" style="display: flex; justify-content: space-between;">
                <date-picker class="pr-2" :endDate="endDate" :confirmValue="startDate" @saveDate="saveStartDate"></date-picker>
                <date-picker class="pr-2" :startDate="startDate" :lastDate="currenTtime[0]" :confirmValue="endDate" @saveDate="saveEndDate"></date-picker>
              </div>
              <div v-if="checktab === 0" style="width: 250px;" class="pr-2">
                <v-text-field class="hidden-sm-and-down MacManageSearch" solo placeholder="Serial Number" v-model="sernum"
                  v-on:keyup.enter="gettestdataList" color="primary" clearable>
                  <template slot="append">
                    <button id="searchButton">
                      <i class="iconfont icon-search" style="font-size: 18px;" @click="gettestdataList"></i>
                    </button>
                  </template>
                </v-text-field>
              </div>
              <!-- get parent/child 搜索条件 -->
              <div v-if="checktab === 1" style="display: flex; justify-content: space-between;">
                <date-picker class="pr-2" :endDate="parentEndDate" :confirmValue="parentStartDate" @saveDate="saveParentStartDate"></date-picker>
                <date-picker class="pr-2" :startDate="parentStartDate" :lastDate="currenTtime[0]" :confirmValue="parentEndDate" @saveDate="saveParentEndDate"></date-picker>
              </div>
              <div v-if="checktab === 1" style="width: 380px;" class="d-flex">
                <v-select v-model="option" outline color="primary" class="SelectBlockOffset" dense style="width: 130px;" :items="parentItems"
                  placeholder="BU" :menu-props="{ bottom: true, offsetY: true }" @change="changeType"></v-select>
                <v-text-field class="hidden-sm-and-down MacManageSearch" solo style="width: 250px; margin-left: -2px;" placeholder="Serial Number"
                  v-model="parentsernum" v-on:keyup.enter="getParentChildrens" color="primary" clearable>
                  <template slot="append">
                    <button id="searchButton">
                      <i class="iconfont icon-search" style="font-size: 18px;" @click="getParentChildrens"></i>
                    </button>
                  </template>
                </v-text-field> 
              </div>
              <!-- SEC 搜索条件 -->
              <div v-if="checktab === 2" style="display: flex; justify-content: space-between; margin-bottom: 16px;">
                <div style="width: 150px;">
                  <v-select v-model="bu" outline color="primary" class="SelectBlockOffset pr-2 pl-2" dense :items="buItems"
                    placeholder="BU" :menu-props="{ bottom: true, offsetY: true }" clearable @change="getSfcInfoByBu"></v-select>
                </div>
                <date-picker class="pr-2" :endDate="sfcEndDate" :confirmValue="sfcStartDate" @saveDate="saveSfcStartDate"></date-picker>
                <date-picker :startDate="sfcStartDate" :lastDate="currenTtime[0]" :confirmValue="sfcEndDate" @saveDate="saveSfcEndDate"></date-picker>
                <!-- Data Upload to SFC时，显示RESET按钮 -->
                <!-- Data Upload to SFC时，显示TRANSIT按钮 -->
                <v-btn class="offsetButton setVButton" outline color="#333" style="height: 36px;"
                  @click.exact="resetSFCInformation"><v-icon style="font-size: 18px; margin-right: 2px;">refresh</v-icon>Reset</v-btn>
                <v-btn v-if="isengineer && isadmin" color="primary" class="setVButton" @click.exact="addTransit">UPLOAD</v-btn>
              </div>
            </v-layout>
            <!-- 表格 -->
            <v-layout row wrap>
              <v-flex sm12 v-if="checktab === 0">
                <v-card flat>
                  <testdata-table :testDataSource="testdata" :loading="testdataLoading" :isEmptySearch="isEmptySearch"></testdata-table>
                </v-card>
              </v-flex>
              <v-flex sm12 v-if="checktab === 1">
                <v-card flat>
                  <parentdata-table :genealogyInfo="genealogyInfo" :loading="genealogyInfoLoading" :checkType="type" @clickSN="clickSN" :isEmptySearch="isEmptySearch"></parentdata-table>
                </v-card>
              </v-flex>
              <v-flex sm12 v-if="checktab === 2">
                <v-card flat>
                  <sfc-transmission-info :sfcTransmissionInfo="sfcTransmissionInfo"></sfc-transmission-info>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
        </div>
      </v-widget>
    </v-flex>
    <add-sfc-transmission ref="addTransmission" :bulist="buItems" :currenTtime="nowDateTime" @transitSFC="uploadDataToSFC"></add-sfc-transmission>
    <!-- <v-test></v-test> -->
  </v-layout>
</template>

<script>
import VWidget from '@/components/VWidget';
import moment from 'moment';
import TestdataTable from '../components/snFind/TestdataTable.vue';
import ParentdataTable from '../components/snFind/ParentdataTable.vue';
import SfcTransmissionInfo from '../components/snFind/SFCTransmissionTable.vue';
import AddSfcTransmission from '../components/snFind/AddSfcTransmission.vue';
import DatePicker from '../../../components/common/DatePicker.vue';
import { getBasic } from '../api/basic';
import { getParentChildren } from '../api/getParentChildren';
import { getCurrentTime } from '../../genius/api/getCurrentTime.js';
import { getServicePermission, getSFCInfor, transitSFCInfor, getBuList } from '../api/getSFCInformation.js';
import { getMacAccess } from '../api/macblock';
import store from '../store';

export default {
  components: {
    VWidget,
    TestdataTable,
    ParentdataTable,
    SfcTransmissionInfo,
    AddSfcTransmission,
    DatePicker,
    store
  },
  data() {
    return {
      checktab: 0,
      // Test Record 的查询参数
      startDate: '',
      endDate: '',
      sernum: '',
      // Parent/Children 的查询参数
      parentStartDate: '',
      parentEndDate: '',
      option: 'Get Child',
      parentsernum: '',
      SendSernum: '',
      // Data Upload to SFC的查询参数
      bu: '',
      sfcStartDate: '',
      sfcEndDate: '',
      buItems: [],
      parentItems: ['Get Parent', 'Get Child'],
      testdata: [],
      genealogyInfo: [],
      sfcTransmissionInfo: [],
      nowDateTime: '',
      currenTtime: '',
      testdataLoading: false,
      genealogyInfoLoading: false,
      setTimer: null,
      isengineer: false,
      isadmin: false,
      sfcSupplement: false,
      // Parent/Children 的是父查子还是子查父，传递给表格
      type: '',
      isEmptySearch: false
    };
  },
  watch: {
    '$route' (to, from) {
    // 路由发生变化页面刷新
      this.sernum = to.query.sernum;
      if (this.sernum) {
        this.gettestdataList();
      }
    },
    checktab(newtab) {
      this.isEmptySearch = false;
      if (newtab === 2 && this.sfcSupplement && this.sfcStartDate && this.sfcEndDate) this.getSfcInfoByBu();
    },
    sfcTransmissionInfo: {
      handler() {
        if (this.setTimer) {
          clearTimeout(this.setTimer);
          this.setTimer = null;
        }
        if (this.sfcTransmissionInfo.some(item => item.result === 'Running') && window.location.hash.includes('/vision/basic') && this.checktab === 2) {
          this.setTimer = setTimeout(this.getSfcInfoByBu, 2000);
        } else {
          clearTimeout(this.setTimer);
        }
      },
      deep: true, 
    }
  },
  created () {
    this.SendSernum = localStorage.getItem('SendSernum');
    const params = this.$route.query;
    if (params.sernum) {
      this.sernum = params.sernum;
    }
    if (this.sernum) {
      this.getCurrentTimes().then(res => { 
        this.endDate = res;
        this.startDate = moment(this.endDate).subtract(6, 'month').format('YYYY-MM-DD'); 
        this.gettestdataList();
      });
    }
    this.getServicePermissionInfor();
  }, 
  mounted() {
    this.getCurrentTimes().then(res => { 
      this.endDate = res;
      this.startDate = moment(this.endDate).subtract(6, 'month').format('YYYY-MM-DD'); 
    });
    if (this.SendSernum) {
      this.sernum = this.SendSernum;
      this.gettestdataList();
      localStorage.removeItem('SendSernum');
    }
    this.username = this.$cookies.get('username');
    this.role = this.$cookies.get('role');
    // eslint-disable-next-line no-unused-expressions
    this.role === 'engineer' ? this.isengineer = true : this.isengineer = false;
    if (!this.username) {
      this.$router.replace('/genius/login');
    }
    // 报错区域
    if (this.username !== 'genius' && this.username !== 'engineer') {
      this.name = this.username.split('(')[1].slice(0, -1);
    } else {
      this.name = this.username;
    }
    this.isAdmin();
    this.getBuList();
    this.getCurrentTimes();
  },
  beforeDestroy() {
    if (this.setTimer) {  
      clearInterval(this.setTimer);
      this.setTimer = null;
    }
  },
  methods: {
    saveStartDate(date) {
      this.startDate = date;
      if (this.sernum) this.gettestdataList();
    },
    saveEndDate(date) {
      this.endDate = date;
      if (this.sernum) this.gettestdataList();
    },
    saveParentStartDate(date) {
      this.parentStartDate = date;
      if (this.parentsernum) this.getParentChildrens();
    },
    saveParentEndDate(date) {
      this.parentEndDate = date;
      if (this.parentsernum) this.getParentChildrens();
    },
    saveSfcStartDate(date) {
      this.sfcStartDate = date;
      this.getSfcInfoByBu();
    },
    saveSfcEndDate(date) {
      this.sfcEndDate = date;
      this.getSfcInfoByBu();
    },
    // 权限判断
    async isAdmin() {
      const { data: res } = await getMacAccess(this.name);
      if (res.status) {
        this.isadmin = true;
      }
    },
    // 获取服务器信息
    async getServicePermissionInfor() {
      const { data: res } = await getServicePermission();
      if (res.status) this.sfcSupplement = res.payload.data;
    },    
    async getBuList() {
      const { data: res } = await getBuList();
      if (res.status) this.buItems = res.payload.data;
    },
    async getCurrentTimes() {
      let currenttime = '';
      const { data: res } = await getCurrentTime();
      if (res.status) {
        this.currenTtime = res.payload.current_time.split('T');
        // nowDateTime获取的是 “+0” 时间
        this.nowDateTime = moment(res.payload.current_time).subtract(8, 'hour').format('YYYY-MM-DD HH:00');
        this.endDate = this.currenTtime[0];
        this.startDate = moment(this.endDate).subtract(6, 'month').format('YYYY-MM-DD');
        this.parentEndDate = this.currenTtime[0];
        this.parentStartDate = moment(this.endDate).subtract(6, 'month').format('YYYY-MM-DD');
        this.sfcEndDate = this.currenTtime[0];
        this.sfcStartDate = moment(this.currenTtime[0]).subtract(6, 'month').format('YYYY-MM-DD');
        if (this.sfcSupplement && this.sfcTransmissionInfo.length < 1) this.getSfcInfoByBu();
        currenttime = res.payload.current_time.split('T')[0];
      }
      return currenttime;
    },

    async gettestdataList() {
      // if (!this.sernum) {
      //   this.$message({
      //     showClose: true,
      //     message: 'Please enter search content',
      //     type: 'warning', 
      //   }); 
      //   return; 
      // }
      this.isEmptySearch = this.sernum;
      this.testdataLoading = true;
      const { data: res } = await getBasic({ sernum: this.sernum, start_date: this.startDate + ' 00:00:00', end_date: this.endDate + ' 23:59:59' });
      if (!res.status) {
        this.testdataLoading = false;
        this.$message({
          showClose: true,
          message: res.msg,
          type: 'error', 
          duration: 0, 
          customClass: 'custom-long-message' 
        });
        return; 
      }
      // this.$message({
      //   showClose: true,
      //   message: res.msg,
      //   type: 'success'
      // });
      this.testdata = res.data.sort((a, b) => {
        // 将字符串转换为 Date 对象进行比较
        const dateA = new Date(a.recttime);
        const dateB = new Date(b.recttime);
        return dateB - dateA; // 倒序排列
      });
      this.testdataLoading = false;
    },
    async getParentChildrens() {
      // if (!this.parentsernum) {
      //   this.$message({
      //     showClose: true,
      //     message: 'Please enter search content',
      //     type: 'warning', 
      //   }); 
      //   return; 
      // }
      this.isEmptySearch = this.parentsernum;
      this.genealogyInfoLoading = true;
      const { data: res } = await getParentChildren({ serial_number: this.parentsernum, start_time: this.parentStartDate + ' 00:00:00', end_time: this.parentEndDate + ' 23:59:59', option: this.option });
      console.log('getParentChildrens', res.msg);
      if (!res.status) { 
        this.genealogyInfoLoading = false;
        this.$message({
          showClose: true,
          message: res.msg,
          type: 'error', 
          duration: 0, 
          customClass: 'custom-long-message' 
        });
        return; 
      }
      this.type = this.option;
      this.genealogyInfo = res.payload.data.sort((a, b) => {
        // 将字符串转换为 Date 对象进行比较
        const dateA = new Date(a.updated_at);
        const dateB = new Date(b.updated_at);
        return dateB - dateA; // 倒序排列
      });
      this.genealogyInfoLoading = false;
    },
    async getSfcInfoByBu() {
      let params = {
        start_time: this.sfcStartDate,
        end_time: this.sfcEndDate,
        option: this.bu ? this.bu : ''
      };
      const { data: res } = await getSFCInfor(params);
      if (!res.status) { 
        this.$message({
          showClose: true,
          message: res.payload.message,
          type: 'error', 
          duration: 0, 
          customClass: 'custom-long-message' 
        });
        return; 
      }
      this.sfcTransmissionInfo = res.payload.data;
    },
    async resetSFCInformation() {
      this.bu = '';
      this.sfcEndDate = this.currenTtime[0];
      this.sfcStartDate = moment(this.currenTtime[0]).subtract(6, 'month').format('YYYY-MM-DD');
      this.getSfcInfoByBu();
    },
    addTransit() {
      this.$refs.addTransmission.showTransmissionDialogs(this.name);
    },
    uploadDataToSFC(data) {
      this.uploadSFCData(data);
      setTimeout(this.getSfcInfoByBu, 100);
    },
    async uploadSFCData(transitData) {
      const { data: res } = await transitSFCInfor(transitData);
      if (!res.status) {
        this.$message({
          showClose: true,
          message: res.payload.message,
          type: 'error', 
          duration: 0, 
          customClass: 'custom-long-message' 
        });
        return; 
      }
      this.$message({
        showClose: true,
        message: res.payload.message,
        type: 'success'
      });
    },
    clickSN(sernum) {
      this.parentsernum = sernum;
      this.getParentChildrens();
    },
    changeType() {
      if (!this.parentsernum) {
        return;
      }
      this.getParentChildrens(); 
    }
  }
};
</script>

<style lang="stylus" scoped>
/deep/ .active_tabs {
  color:#9d4edc;
}
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
/deep/ .SelectBlockOffset .v-icon.v-icon--link {
  font-size: 18px;
  cursor: pointer;
}
/deep/ .SelectBlockOffset .v-input__append-inner {
  margin-left: auto;
  padding-left: 0;
}
</style>
```
