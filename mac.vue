<template>
  <v-layout row wrap>
    <v-flex sm12>
      <v-widget title="MAC Search">
        <!-- <div slot="widget-header-action">
          <v-btn color="primary" v-show="macAccess && isadmin" @click="$router.push({path:'/vision/mac-management'})"><v-icon style="transform: scaleX(-1);">reply</v-icon>MAC Management</v-btn>
          <v-btn color="primary" v-show="macAccess" @click="$router.push({path:'/vision/mac-oui-fa'})"><v-icon style="transform: scaleX(-1);">reply</v-icon> MAC OUI FAI</v-btn>
        </div> -->
        <div slot="widget-content">
          <v-flex>
            <v-alert
              v-model="alert"
              dismissible 
              :color="alert_color"  
            >
              {{ alert_message }}
            </v-alert>
          </v-flex>
          <v-container fluid style="padding-top:10px;">
            <!-- 页签 -->
            <v-card-text class="px-0 pb-1 pt-0" style="display: flex;align-items: right;justify-content: right;margin-bottom:20px;">
              <v-tabs show-arrows v-model="checktab" grow :style="macAccess ? 'width:30%':'width:10%'" class="setTabs" active-class="active_tabs">
                <v-tabs-slider color="primary"></v-tabs-slider>
                <v-tab style="color:#000;font-weight:bolder;" class="NewButton">MAC Search</v-tab>
                <v-tab style="color:#000;font-weight:bolder;" class="NewButton" :disabled="!macAccess" v-show="macAccess">MAC Block</v-tab>
                <v-tab style="color:#000;font-weight:bolder;" class="NewButton" :disabled="!macAccess" v-show="macAccess">Block Offset</v-tab>
                <v-tab style="color:#000;font-weight:bolder;" class="NewButton" :disabled="!macAccess" v-show="macAccess">MAC OUI FAI</v-tab>
              </v-tabs>
              <v-spacer></v-spacer>
              <!-- macsearch -->
              <div style="display:flex;justify-content:right;align-items: center;" v-if="checktab < 2">
                <div style="width:280px;height: 36px;">
                  
                  <div style="height:36px;" class="testSearch">
                    <!-- <v-text-field class="hidden-sm-and-down MacManageSearch" solo name="addressNumber"
                      placeholder="search" value="" v-model="search" color="primary" clearable v-on:keyup.enter="getMacSearchData" v-if="checktab===0">
                      <template slot="append">
                        <button id="searchButton" @click="getMacSearchData">
                          <i class="iconfont icon-search" style="font-size: 18px;"></i>
                        </button>
                      </template>
                    </v-text-field> -->
                     <v-text-field class="hidden-sm-and-down MacManageSearch" solo name="addressNumber"
                      placeholder="search" value="" @input="input" v-model="search" color="primary" clearable v-on:keyup.enter="getMacSearchData" v-if="checktab===0">
                      <template slot="append">
                        <button id="searchButton" @click="getMacSearchData">
                          <i class="iconfont icon-search" style="font-size: 18px;"></i>
                        </button>
                      </template>
                    </v-text-field>
                    <v-text-field class="hidden-sm-and-down MacManageSearch" solo name="addressNumber"
                      placeholder="search" value="" v-model="blockpoolsearch" v-on:keyup.enter="getBlockPoolData(blockpoolsearch)" color="primary" clearable v-if="checktab===1">
                      <template slot="append">
                        <button id="searchButton">
                          <i class="iconfont icon-search" style="font-size: 18px;" @click="getBlockPoolData(blockpoolsearch)"></i>
                        </button>
                      </template>
                    </v-text-field>
                    <v-text-field class="hidden-sm-and-down MacManageSearch" solo name="addressNumber"
                      placeholder="SN/CHIP_SN/Cloud ID/MAC" value="" @input="input" v-model="merakiSearch" color="primary" clearable v-on:keyup.enter="getMerakiMacSearchData" v-if="checktab===4">
                      <template slot="append">
                        <button id="searchButton" @click="getMerakiMacSearchData">
                          <i class="iconfont icon-search" style="font-size: 18px;"></i>
                        </button>
                      </template>
                    </v-text-field>
                  </div>
                </div>
                <v-btn class="offsetButton setVButton" color="primary" v-if="checktab === 1 && isadmin" @click="$router.push({ path:'/vision/mac-management' })">APPLICATION</v-btn>
                <v-btn class="offsetButton setVButton purpleButton" v-if="checktab === 1 && macAccess && isadmin" @click="$router.push({ path:'/vision/mac-notification' })">NOTIFICATION</v-btn>               
                <!-- <v-btn class="offsetButton setVButton" color="primary" @click="getMacSearchData" v-if="checktab === 0">Search</v-btn> -->
              </div>
              
              <!-- macblock macoffset macouifai -->
              <div style="display: flex;justify-content: right;align-items: center;" v-if="checktab >= 2 && checktab !== 4">
                <div style="width: 130px;">
                  <v-select v-model="navbu" outline class="SelectBlockOffset" dense :items="bu"
                    placeholder="BU" :menu-props="{ bottom: true, offsetY: true }"></v-select>
                </div>
                <div style="width: 130px;margin-left:10px;">
                  <v-select v-model="offsetreq.project" outline class="SelectBlockOffset v-autocomplete__content" dense :items="project"
                    placeholder="Project" :menu-props="{ bottom: true, offsetY: true }"></v-select>
                </div>
                <div style="width: 130px;margin-left:10px;">
                  <v-select v-model="offsetreq.product" outline dense class="SelectBlockOffset" :items="product"
                  placeholder="Product" :menu-props="{ bottom: true, offsetY: true }"></v-select>
                </div>
                <div style="width: 130px;margin-left:10px;" v-if="checktab === 3">
                  <v-select v-model="offsetreq.statustext" outline dense class="SelectBlockOffset" :items="['Pending','Pass','Fail']"
                    placeholder="Status" :menu-props="{ bottom: true, offsetY: true }"></v-select>
                </div>
                <v-btn class="offsetButton setVButton" outline color="#333" style="height: 36px;"
                  @click="offsetreq = {page_size: 'all' }, alert = false, navbu = ''"><v-icon style="font-size: 18px;margin-right: 2px;">refresh</v-icon>Reset</v-btn>
                <v-btn class="offsetButton setVButton" color="primary" @click="$refs.offsetDialog.showDialog" v-if="checktab === 2 && macAccess && isadmin">ADD</v-btn>
              </div>

              <!-- <div style="display: flex;justify-content: right;align-items: center;" v-if="checktab === 3">
                <div style="width: 130px;">
                  <v-select v-model="macouirnavbu" outline class="SelectBlockOffset" dense :items="bu"
                    placeholder="BU" :menu-props="{ bottom: true, offsetY: true }"></v-select>
                </div>
                <div style="width: 130px;margin-left:10px;">
                  <v-select v-model="macouireq.project" outline class="SelectBlockOffset v-autocomplete__content" dense :items="project"
                    placeholder="Project" :menu-props="{ bottom: true, offsetY: true }"></v-select>
                </div>
                <div style="width: 130px;margin-left:10px;">
                  <v-select v-model="macouireq.product" outline dense class="SelectBlockOffset" :items="product"
                  placeholder="Product"></v-select>
                </div>
                <div style="width: 130px;margin-left:10px;">
                  <v-select v-model="macouireq.statustext" outline dense class="SelectBlockOffset" :items="['Pending','Pass','Fail']"
                    placeholder="Status"></v-select>
                </div>
                <v-btn class="offsetButton setVButton" outline color="#333" style="height: 36px;"
                  @click="macouireq = {page_size: 'all' }, alert = false, macouirnavbu = ''"><v-icon style="font-size: 18px;margin-right: 2px;">refresh</v-icon>Reset</v-btn>
              </div> -->
            </v-card-text>

            <!-- table -->
            <v-layout row wrap>
              <v-flex sm12 v-if="checktab === 0">
                <v-card flat>
                  <mac-search-table :username="name" :testDataSource="macsearchData" :macAccess="macAccess"></mac-search-table>
                </v-card>
              </v-flex>
              <v-flex sm12 v-if="checktab === 1">
                <v-card flat>
                  <block-bool-table :searchFilter="blockpoolsearch" :username="name" @disableMac="disableMac"
                    :testDataSource="poolData" :isadmin="isadmin">
                  </block-bool-table>
                </v-card>
              </v-flex>
              <v-flex sm12 v-if="checktab === 2">
                <v-card flat>
                  <block-offset-table :searchFilter="search" :username="name" :testDataSource="blockoffsetData" @updateList="disableMac"
                    :macAccess="macAccess" :isadmin="isadmin">
                  </block-offset-table>
                </v-card>
              </v-flex>
              <v-flex sm12 v-if="checktab === 3">
                <v-card flat>
                  <mac-oui-fai-table :username="username" @disableMac="disableMac" :macAccess="macAccess"
                    :testDataSource="macouifaiList">
                  </mac-oui-fai-table>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
        </div>
      </v-widget>
    </v-flex>
    <addoffset-dialog ref="offsetDialog" @disableMac="disableMac" :username="name"></addoffset-dialog>
  </v-layout>
</template>

<script>
import VWidget from '@/components/VWidget';
import MacTable from '../components/MacTable';
import { BlockOffsetList, getMacBlock, getMacRecord, getMacAccess, getMerakiMacRecord, offsetItemList, macblockFile, MacOuiFaiList } from '../api/macblock';
import BlockBoolTable from '../components/macManage/BlockBooltb.vue';
import BlockOffsetTable from '../components/macManage/BlockOffsettb.vue';
import MacOuiFaiTable from '../components/macManage/MacOuiFaitb.vue';
import AddoffsetDialog from '../components/macManage/AddoffsetDialog.vue';
import MacSearchTable from '../components/macManage/MacSearchtb.vue';

import store from '../store';

export default {
  components: {
    VWidget,
    MacTable,
    store,
    BlockBoolTable,
    BlockOffsetTable,
    MacSearchTable,
    AddoffsetDialog,
    MacOuiFaiTable,
  },
  data () {
    return {
      username: '',
      // for alert
      alert: false,
      alert_color: 'warning',
      alert_message: 'it is error',
      role: '',
      
      checktab: 0,
      search: '',
      merakiSearch: '',
      name: '',
      blockoffsetData: [],
      poolData: [],
      macsearchData: [],
      macMerakiData: [], 
      isadmin: false,
      offsetreq: { page_size: 'all' },
      // macouireq: { page_size: 'all' },
      navbu: '',
      bu: [],
      project: [],
      product: [],
      macblockList: [],
      macouifaiList: [],
      macAccess: '',
      // rawText: '', // 原始输入值
      // filteredText: '', // 过滤后的值，只包含英文字符
      // errorMessages: [] // 错误消息数组
      // rawInput: '',
      // filteredInput: ''
      regex: /^[a-zA-Z0-9!@#$%^&*()\-_=+{};:,<.>\/?]+$/,
      blockpoolsearch: '',
    };
  },
  computed: {
    fulloffsetreq() {
      return {
        ...this.offsetreq,
      };
    },
    // fullmacouireq() {
    //   return {
    //     ...this.macouireq,
    //   };
    // },
  },
  watch: {
    checktab() {
      this.search = '';
      this.merakiSearch = ''; 
      this.blockpoolsearch = '';
      // this.offsetreq.project = '';
      // this.offsetreq.product = '';
      this.navbu = '';
      this.$set(this.offsetreq, 'project', '');
      this.$set(this.offsetreq, 'product', '');
      this.$set(this.offsetreq, 'statustext', '');
      // this.macouireq.project = '';
      // this.macouireq.product = '';
      // this.macouirnavbu = ''; 
    },
    // blockpoolsearch() {
    //   this.getBlockPoolData(this.blockpoolsearch);
    // },
    fulloffsetreq() {
      this.updateFile();
      this.getblockoffsetList();
      this.getBlockPoolData();
      this.getMacOUIFAIList();
    },
    // fullmacouireq() {
    //   this.updateFile();
    //   // this.getblockoffsetList();
    //   // this.getBlockPoolData();
    //   this.getMacOUIFAIList();
    // },
    navbu: {
      handler() {
        this.getOffsetItemList({ bu: this.navbu });
        this.updateFile();
        this.getblockoffsetList();
        this.getBlockPoolData();
        this.getMacOUIFAIList();
      },
    },
    // macouirnavbu: {
    //   handler() {
    //     this.getOffsetItemList({ bu: this.macouirnavbu });
    //     // this.updateFile();
    //     // this.getblockoffsetList();
    //     // this.getBlockPoolData();
    //     this.getMacOUIFAIList();
    //   },
    // },
  },

  mounted () {
    // console.log(this.$route.query);
    if (this.$route.query.type) {
      this.checktab = 1;
    }
    this.username = this.$cookies.get('username');
    this.role = this.$cookies.get('role');
    // eslint-disable-next-line no-unused-expressions
    this.role === 'engineer' ? this.macAccess = true : this.macAccess = false;
    if (!this.username) {
      this.$router.replace('/genius/login');
    }
    // 报错区域
    if (this.username !== 'genius' && this.username !== 'engineer') {
      this.name = this.username.split('(')[1].slice(0, -1);
    } else {
      this.name = this.username;
    }
    this.getOffsetItemList(this.offsetreq);
    this.getblockoffsetList();
    this.getBlockPoolData(this.blockpoolsearch);
    this.getMacOUIFAIList();
    this.isAdmin();
  },
  methods: {
    input(value) {
      this.$nextTick(() => {
        const safeValue = value || ''; 
        this.search = safeValue.replace(/[^a-zA-Z0-9!@#$%^&*()\-_=+{};:,<.>\/?]/g, '');
        this.merakiSearch = safeValue.replace(/[^a-zA-Z0-9!@#$%^&*()\-_=+{};:,<.>\/?]/g, '');
      });
    },  
    // 更新文件macblockFile
    async updateFile() {
      const { data: res } = await macblockFile();
      if (!res.status) {
        // eslint-disable-next-line no-return-assign, no-sequences
        return this.alert = true, this.alert_color = 'red', this.alert_message = res.payload.message;
      }
    },
    // 权限判断
    async isAdmin() {
      const { data: res } = await getMacAccess(this.name);
      console.log('res', res);
      if (res.status) {
        this.isadmin = true;
      }
    },
    // 获取offset下拉搜索数据
    async getOffsetItemList(parms) {
      const { data: res } = await offsetItemList(parms); 
      if (!res.status) {
        // eslint-disable-next-line no-return-assign, no-sequences
        return this.alert = true, this.alert_color = 'red', this.alert_message = res.payload.message;
      }
      const datas = res.payload.data;
      this.bu = datas.bus;
      this.project = datas.project;
      this.product = datas.product;
      this.mac_set_list = datas.mac_set_list;
    },
    // 获取getblockpoollist数据
    async getBlockPoolData(parms) {
      const { data: res } = await getMacBlock({ search: parms });
      if (!res.status) {
        // eslint-disable-next-line no-return-assign, no-sequences
        return this.alert = true, this.alert_color = 'red', this.alert_message = res.payload.message;
      }
      let count = 0;
      // eslint-disable-next-line array-callback-return
      res.payload.data.map((item) => {
        item.index = count;
        count++;
      });
      // this.poolData = res.payload.data;
      this.$set(this, 'poolData', res.payload.data);
    },
    // 获取getblockoffsetList数据
    async getblockoffsetList() {
      this.offsetreq.bu = this.navbu;
      const { data: res } = await BlockOffsetList(this.offsetreq);
      if (!res.status) {
        // eslint-disable-next-line no-return-assign, no-sequences
        return this.alert = true, this.alert_color = 'red', this.alert_message = res.payload.message;
      }
      // this.blockoffsetData = res.payload.data.mac_block_set_list;
      this.$set(this, 'blockoffsetData', res.payload.data.mac_block_set_list);
      // this.$nextTick(() => {
      //   this.blockoffsetData = res.payload.data.mac_block_set_list;
      // });
    },
    // 获取macouifai列表
    async getMacOUIFAIList() {
      this.offsetreq.bu = this.navbu;
      // eslint-disable-next-line no-unused-expressions
      // this.offsetreq.statustext === 'Pass' ? this.offsetreq.status = 1 : this.offsetreq.statustext === 'Fail' ? this.offsetreq.status = 2 : this.offsetreq.status = 0;
      switch (this.offsetreq.statustext) {
        case 'Pending':
          this.offsetreq.status = 0;
          break;
        case 'Pass':
          this.offsetreq.status = 1;
          break;
        case 'Fail':
          this.offsetreq.status = 2;
          break;
        default:
          this.offsetreq.status = '';
          break;
      }
      const { data: res } = await MacOuiFaiList(this.offsetreq);
      if (!res.status) {
        // eslint-disable-next-line no-return-assign, no-sequences
        return this.alert = true, this.alert_color = 'red', this.alert_message = res.payload.message;
      }
      // this.macouifaiList = res.payload.data;
      this.$set(this, 'macouifaiList', res.payload.data);
    },
    // 获取Macsearch数据
    async getMacSearchData() {
      let newMac = '';
      if (this.search) {
        newMac = this.macDataConvertFormat(this.search);
        if (newMac === false) {
          newMac = this.search;
        }
      }
      const { data: res } = await getMacRecord({ 'data': { 'mac': newMac }, service: 'get-mac-record' });
      if (!res.status) {
        // eslint-disable-next-line no-return-assign, no-sequences
        return this.alert = true, this.alert_color = 'red', this.alert_message = res.payload.message;
      }
      this.macsearchData = res.payload.data;
      this.alert = true;
      this.alert_color = 'success';
      this.alert_message = res.payload.message + ', ' + res.payload.time;
    },
    // 获取Meraki Mac Search数据
    async getMerakiMacSearchData() {
      let newMerakMac = '';
      if (this.merakiSearch) {
        newMerakMac = this.macDataConvertFormat(this.merakiSearch);
        if (newMerakMac === false) {
          newMerakMac = this.merakiSearch;
        }
      }
      const { data: res } = await getMerakiMacRecord({ 'data': { 'query': newMerakMac }, service: 'get-meraki-mac' });
      console.log('res', res);
      if (!res.status) {
        // eslint-disable-next-line no-return-assign, no-sequences
        return this.alert = true, this.alert_color = 'red', this.alert_message = res.payload.message;
      }
      this.macMerakiData = res.payload.data;
      this.alert = true;
      this.alert_color = 'success';
      this.alert_message = res.payload.message + ', ' + res.payload.time;
    },
    macDataConvertFormat(macData) {
      // 11-22-33-44-55-66格式的正则表达式
      const normalRegex = /^[a-zA-Z0-9]{12}$/;
      // 11:22:33:44:55:66格式的正则表达式
      const colonRegex = /^([a-zA-Z0-9]{2}):([a-zA-Z0-9]{2}):([a-zA-Z0-9]{2}):([a-zA-Z0-9]{2}):([a-zA-Z0-9]{2}):([a-zA-Z0-9]{2})$/;
      // 11-22-33-44-55-66格式的正则表达式
      const dashRegex = /^([a-zA-Z0-9]{2})-([a-zA-Z0-9]{2})-([a-zA-Z0-9]{2})-([a-zA-Z0-9]{2})-([a-zA-Z0-9]{2})-([a-zA-Z0-9]{2})$/;
      // 1122.3344.5566格式的正则表达式,.为特殊字符，需要加上反斜杠（\）进行转义
      const periodRegex = /^([a-zA-Z0-9]{4})\.([a-zA-Z0-9]{4})\.([a-zA-Z0-9]{4})$/;

      if (macData === '' || normalRegex.test(macData)) {
        return macData;
      } else if (colonRegex.test(macData)) {
        return macData.replace(/:/g, '');
      } else if (dashRegex.test(macData)) {
        return macData.replace(/-/g, '');
      } else if (periodRegex.test(macData)) {
        return macData.replace(/\./g, '');
      } 
      // this.alert = true;
      // this.alert_color = 'red';
      // this.alert_message = 'Wrong format, please input correct MAC address!';
      return false;
      
    },
    disableMac(data, type) {
      if (!data.status) {
        this.alert = true;
        this.alert_color = 'red';
        this.alert_message = data.payload.message;
      }
      else {
        this.alert = true;
        this.alert_color = 'success';
        this.alert_message = data.payload.message + ', ' + data.payload.time;
        if (type === 'offset') {
          this.getblockoffsetList();
        } else {
          this.getBlockPoolData();
          this.getMacOUIFAIList();
        }
      }
    },
  }
}; 
</script>

<style lang='stylus' scoped>
.NewButton{
    width:25%;
    font-size: 14px;
    // font-weight:bold;
    height:28px;
    margin:auto;
    border-radius:2px;
    text-transform:none;
}
.NewButton:hover{
    // background-color:#f1d9f7;
    background-color:#F8E8FF;
    border-radius:8px;
}
/deep/ .active_tabs{
  color:#9d4edc;
}

.purpleButton {  
  color: #9d4edc !important;
  border-color: #9d4edc !important;
  background-color: white;
}
</style>
