# mac.vue
```
<template>
  <v-layout row wrap>
    <v-flex sm12>
      <v-widget title="MAC Search">
        <div slot="widget-content">
          <v-container fluid style="padding-top:10px;">
            <!-- 页签 -->
            <v-card-text class="px-0 pb-1 pt-0" style="display: flex;align-items: right;justify-content: right;margin-bottom:20px;">
              <v-tabs show-arrows v-model="checktab" grow :style="macAccess ? 'width: 30%' : 'width: 10%'" class="setTabs" active-class="active_tabs">
                <v-tabs-slider color="primary"></v-tabs-slider>
                <v-tab style="color:#000;font-weight:bolder;" class="NewButton">MAC Search</v-tab>
                <v-tab style="color:#000;font-weight:bolder;" class="NewButton" :disabled="!macAccess" v-show="macAccess">MAC Block</v-tab>
                <v-tab style="color:#000;font-weight:bolder;" class="NewButton" :disabled="!macAccess" v-show="macAccess">Block Offset</v-tab>
                <v-tab style="color:#000;font-weight:bolder;" class="NewButton" :disabled="!macAccess" v-show="macAccess">MAC OUI FAI</v-tab>
              </v-tabs>
              <v-spacer></v-spacer>
              <!-- macsearch -->
              <div v-if="checktab < 2" style="display:flex;justify-content:right;align-items: center;">
                <div style="height: 36px;">
                  <div style="display: flex; height:36px;" class="testSearch">
                    <div v-if="checktab === 0" style="width: 140px;">
                      <v-select v-model="macSearchSelect" outline dense class="SelectBlockOffset" :items="['MAC','Meraki MAC',]"
                        placeholder="MAC" :menu-props="{ bottom: true, offsetY: true }"></v-select>
                    </div>
                     <v-text-field style="width:250px" class="hidden-sm-and-down MacManageSearch" solo name="addressNumber"
                     :placeholder="macSearchSelect === 'Meraki MAC' ? 'SN/CHIP_SN/Cloud ID/MAC' : 'search'" value="" @input="input" v-model="search" color="primary" clearable v-on:keyup.enter="getMacSearchData" v-if="checktab===0">
                      <template slot="append">
                        <button id="searchButton" @click="getMacSearchData">
                          <i class="iconfont icon-search" style="font-size: 18px;"></i>
                        </button>
                      </template>
                    </v-text-field>
                    <v-text-field v-if="checktab === 1" class="hidden-sm-and-down MacManageSearch" solo name="addressNumber"
                      placeholder="search" value="" v-model="blockpoolsearch" v-on:keyup.enter="getBlockPoolData(blockpoolsearch)" color="primary" clearable>
                      <template slot="append">
                        <button id="searchButton">
                          <i class="iconfont icon-search" style="font-size: 18px;" @click="getBlockPoolData(blockpoolsearch)"></i>
                        </button>
                      </template>
                    </v-text-field>
                  </div>
                </div>
                <v-btn v-if="checktab === 1 && isadmin" class="offsetButton setVButton" color="primary" @click="$router.push({ path:'/vision/mac/management' })">APPLICATION</v-btn>
                <v-btn v-if="checktab === 1 && macAccess && isadmin" class="offsetButton setVButton purpleButton" @click="$router.push({ path:'/vision/mac/notification' })">NOTIFICATION</v-btn>
              </div>
              
              <!-- macblock macoffset macouifai -->
              <div v-if="checktab >= 2 && checktab !== 4" style="display: flex;justify-content: right;align-items: center;">
                <div style="width: 150px;">
                  <v-select v-model="navbu" outline class="SelectBlockOffset" dense :items="bu"
                    placeholder="BU" :menu-props="{ bottom: true, offsetY: true }" clearable></v-select>
                </div>
                <div style="width: 150px; margin-left: 10px;">
                  <v-select v-model="offsetreq.project" outline class="SelectBlockOffset v-autocomplete__content" dense :items="project"
                    placeholder="Project" :menu-props="{ bottom: true, offsetY: true }" clearable></v-select>
                </div>
                <div style="width: 150px; margin-left: 10px;">
                  <v-select v-model="offsetreq.product" outline dense class="SelectBlockOffset" :items="product"
                    placeholder="Product" :menu-props="{ bottom: true, offsetY: true }" clearable>
                    <template v-slot:selection>
                      <div style="font-size: 14px; width: 76px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ offsetreq.product }}</div>
                    </template>
                  </v-select>
                </div>
                <div v-if="checktab === 3" style="width: 150px; margin-left: 10px;">
                  <v-select v-model="offsetreq.statustext" outline dense class="SelectBlockOffset" :items="['Pending','Pass','Fail']"
                    placeholder="Status" :menu-props="{ bottom: true, offsetY: true }" clearable></v-select>
                </div>
                <v-btn class="offsetButton setVButton" outline color="#333" style="height: 36px;"
                  @click="offsetreq = { page_size: 'all' }, alert = false, navbu = ''"><v-icon style="font-size: 18px; margin-right: 2px;">refresh</v-icon>Reset</v-btn>
                <v-btn v-if="checktab === 2 && macAccess && isadmin" class="offsetButton setVButton" color="primary" @click="$refs.offsetDialog.showDialog">ADD</v-btn>
              </div>
            </v-card-text>

            <!-- table -->
            <v-layout row wrap>
              <v-flex v-if="checktab === 0 && macSearchSelect === 'MAC'" sm12>
                <v-card flat>
                  <mac-search-table :username="name" :testDataSource="macsearchData" :macAccess="macAccess" :isEmptySearch="isEmptySearch && macSearchSelect === 'MAC'"></mac-search-table>
                </v-card>
              </v-flex>
              <v-flex v-if="checktab === 0 && macSearchSelect === 'Meraki MAC'" sm12>
                <v-card flat>
                  <mac-meraki-table :username="name" :testDataSource="macMerakiData" :macAccess="macAccess" :isEmptySearch="isEmptySearch && macSearchSelect === 'Meraki MAC'"></mac-meraki-table>
                </v-card>
              </v-flex>
              <v-flex sm12 v-if="checktab === 1">
                <v-card flat>
                  <block-bool-table :searchFilter="blockpoolsearch" :username="name" @disableMac="disableMac" :isEmptySearch="isEmptySearch"
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
import MacMerakiTable from '../components/macManage/MacMerakitb.vue';

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
    MacMerakiTable, 
  },
  data () {
    return {
      username: '',
      role: '',
      checktab: 0,
      macSearchSelect: 'MAC', 
      search: '',
      name: '',
      blockoffsetData: [],
      poolData: [],
      macsearchData: [],
      macMerakiData: [], 
      isadmin: false,
      offsetreq: { page_size: 'all' },
      navbu: '',
      bu: [],
      project: [],
      product: [],
      macblockList: [],
      macouifaiList: [],
      macAccess: '',
      regex: /^[a-zA-Z0-9!@#$%^&*()\-_=+{};:,<.>\/?]+$/,
      blockpoolsearch: '',
      isEmptySearch: false,
    };
  },
  computed: {
    fulloffsetreq() {
      return {
        ...this.offsetreq,
      };
    },
  },
  watch: {
    checktab() {
      this.search = '';
      this.blockpoolsearch = '';
      this.macMerakiData = [];
      this.macsearchData = []; 
      this.isEmptySearch = false;
      this.navbu = '';
      this.$set(this.offsetreq, 'project', '');
      this.$set(this.offsetreq, 'product', '');
      this.$set(this.offsetreq, 'statustext', '');
    },
    fulloffsetreq() {
      this.updateFile();
      this.getblockoffsetList();
      this.getBlockPoolData();
      this.getMacOUIFAIList();
    },
    navbu: {
      handler() {
        this.getOffsetItemList({ bu: this.navbu });
        this.updateFile();
        this.getblockoffsetList();
        this.getBlockPoolData();
        this.getMacOUIFAIList();
      },
    },
    macSearchSelect(newVal, oldVal) {
      this.search = '';
      this.isEmptySearch = false; 
      if (newVal === 'MAC' || oldVal === 'MAC') {
        this.macMerakiData = [];
        this.macsearchData = []; 
      }
    },
  },

  mounted () {
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
      });
    },  
    // 更新文件macblockFile
    async updateFile() {
      const { data: res } = await macblockFile();
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
    },
    // 权限判断
    async isAdmin() {
      const { data: res } = await getMacAccess(this.name);
      if (res.status) {
        this.isadmin = true;
      }
    },
    // 获取offset下拉搜索数据
    async getOffsetItemList(parms) {
      const { data: res } = await offsetItemList(parms); 
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
      const datas = res.payload.data;
      this.bu = datas.bus;
      this.project = datas.project;
      this.product = datas.product;
      this.mac_set_list = datas.mac_set_list;
    },
    // 获取getblockpoollist数据
    async getBlockPoolData(parms) {
      this.isEmptySearch = parms;
      const { data: res } = await getMacBlock({ search: parms });
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
        this.$message({
          showClose: true,
          message: res.payload.message,
          type: 'error', 
          duration: 0, 
          customClass: 'custom-long-message' 
        });
        return; 
      }
      this.$set(this, 'blockoffsetData', res.payload.data.mac_block_set_list);
    },
    // 获取macouifai列表
    async getMacOUIFAIList() {
      this.offsetreq.bu = this.navbu;
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
        this.$message({
          showClose: true,
          message: res.payload.message,
          type: 'error', 
          duration: 0, 
          customClass: 'custom-long-message' 
        });
      }
      this.$set(this, 'macouifaiList', res.payload.data);
    },
    // 获取Macsearch数据
    async getMacSearchData() {
      const newMac = this.search ? this.macDataConvertFormat(this.search) || this.search : '';
      this.isEmptySearch = newMac;
      const serviceConfig = {
        'MAC': {
          service: 'get-mac-record',
          dataKey: 'mac',
          resultKey: 'macsearchData'
        },
        default: {
          service: 'get-meraki-mac',
          dataKey: 'query',
          resultKey: 'macMerakiData'
        }
      };
      const config = serviceConfig[this.macSearchSelect] || serviceConfig.default;
      const params = { data: { [config.dataKey]: newMac }, service: config.service };
      const { data: res } = await (this.macSearchSelect === 'MAC' 
        ? getMacRecord(params) 
        : getMerakiMacRecord(params));
      // if (!res.status) {
      //   this.$message({
      //     showClose: true,
      //     message: res.payload.message,
      //     type: 'error', 
      //     duration: 0, 
      //     customClass: 'custom-long-message' 
      //   });
      //   return;
      // }
      this[config.resultKey] = res.payload.data;
      // this.showSuccess('Search Successfully');
      // this.$message({
      //   showClose: true,
      //   message: 'Search Successfully',
      //   type: 'success'
      // });
      // this.showWarning(`${res.payload.message}`);
      // this.showError(`${res.payload.message}`);
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
      return false;
    },
    disableMac(data, type) {
      if (!data.status) {
        this.$message({
          showClose: true,
          message: data.payload.message,
          type: 'error', 
          duration: 0, 
          customClass: 'custom-long-message' 
        });
      }
      else {
        this.$message({
          showClose: true,
          message: data.payload.message,
          type: 'success'
        });
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
.NewButton {
  width:25%;
  font-size: 14px;
  height:28px;
  margin:auto;
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

.top-snackbar{
  border-radius: 50px !important;
  
  .v-snackbar__content {
    padding: 0;
  }

  .icon-left {
    margin: 0 0 0 -10px; 
  }

  .icon-right {
    color: rgb(91, 92, 105); 
    margin-right: -24px;
  }
  
  .v-icon {
    font-size: 18px;
  }
}

/deep/ .v-snack__content {
  color: black !important; 
}

/deep/ .v-snack__wrapper {
  height: 40px;
  border-radius: 6px !important;
}

.MacManageSearch.v-text-field.v-text-field--solo:not(.v-input--is-focused) > .v-input__control > .v-input__slot {
  border: 1px solid #a5a3a3;
  border-left: none;
  -webkit-box-shadow: unset !important;
  box-shadow: unset !important;
  border-radius: 3px;
}

.purpleButton {  
  color: #9d4edc !important;
  border-color: #9d4edc !important;
  background-color: white;
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
