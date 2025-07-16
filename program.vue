```
<template>
  <v-layout row wrap>
    <v-flex sm12>
      <v-widget title="Program Version">
        <div slot="widget-header"><span style="margin-left: -10px; color: #7f7f7f; font-size: 14px; font-weight: bold;">
          / {{ latestversionList.genius }} / {{ latestversionList.top }}</span></div>
        <div slot="widget-content">
          <v-container fluid style="padding-top: 10px;">
            <v-layout row>
              <v-spacer></v-spacer>
              <div style="width: 130px;">
                <v-select v-model="params.bu" outline class="SelectBlockOffset" dense clearable :items="buList"
                  placeholder="BU" :menu-props="{ bottom: true, offsetY: true }" @change="handleSearch">
                  <template v-slot:selection>
                    <div style="font-size: 14px; width: 56px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ params.bu }}</div>
                  </template>
                </v-select>
              </div>
              <div style="width: 150px;" class="mx-2">
                <v-select v-model="params.repository_name" outline class="SelectBlockOffset" dense clearable :items="tecodeList"
                  placeholder="TE Code" :menu-props="{ bottom: true, offsetY: true }" @change="handleSearch">
                  <template v-slot:selection>
                    <div style="font-size: 14px; width: 76px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ params.repository_name }}</div>
                  </template>
                </v-select>
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
              <v-btn class="offsetButton setVButton" outline color="#333" style="height: 36px;" @click="resetParams">
                <v-icon style="font-size: 18px; margin-right: 2px;">refresh</v-icon>RESET
              </v-btn>
              <v-btn v-if="macAccess && isadmin" color="primary" class="setVButton ml-2" @click="addData">ADD</v-btn>
              <v-tooltip bottom v-if="macAccess && isadmin">
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on" color="primary" class="refreshbtn" @click="refreshVersion" :disabled="refreshloading">refresh</v-icon>
                </template>
                <span>Refresh</span>
              </v-tooltip>
            </v-layout>
            <v-card flat>
              <v-data-table
                :headers="headers"
                :pagination.sync="pagination"
                :items="programList.result"
                :rows-per-page-items="[15, 50, 100, 200, 500, 1000]"
                class="elevation-1 BlockOffsetTable"
                :hide-actions="programList.res_count <= 15"
                :total-items="programList.res_count"
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
                                  <span :class="computeColor(props.item.te_code[key].repository_current, props.item.te_code[key].last_version)">
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
                                  <span v-else :class="computeColor(props.item.te_code_shink[key].repository_current, props.item.te_code_shink[key].last_version)">
                                    {{ key }}: Current[{{ props.item.te_code_shink[key].repository_current }}], Latest[{{ props.item.te_code_shink[key].last_version }}]
                                  </span>
                                </div>                                
                              </div>
                              <v-icon class="arrowclass" size="21" color="#9d4edc" @click="showTeCode(props.item.ipAddress)">arrow_drop_down</v-icon>
                            </div>                           
                        </div>
                        <!-- 其他情况 -->
                        <div v-else>
                          <div v-for="(key, index) in Object.keys(props.item.te_code)" :key="index">
                            <span :class="computeColor(props.item.te_code[key].repository_current, props.item.te_code[key].last_version)">
                              {{ key }}: Current[{{ props.item.te_code[key].repository_current }}], Latest[{{ props.item.te_code[key].last_version }}]
                            </span>
                          </div>                          
                        </div>
                      </div>
                      <!-- 无数据 -->
                      <div v-else>
                        <span>-</span>
                      </div>
                    </td>
                    <td> 
                      <span :class="computeColor(props.item.geniusCurrent, latestversionList.genius.split('-')[1])">{{ props.item.geniusCurrent }}</span>
                    </td>
                    <td>
                      <span :class="computeColor(props.item.topCurrent, latestversionList.top.split('-')[1])">{{ props.item.topCurrent }}</span>
                    </td>

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
                <v-btn flat color="indigo" @click="exportExcel">
                  <v-icon>flight_takeoff</v-icon> Export to Excel
                </v-btn>
              </div>
            </v-card>
          </v-container>
        </div>
      </v-widget>  
    </v-flex>
    <add-cell-lock ref="addcell" @updateList="updateList"></add-cell-lock>
  </v-layout>
</template>

<script>
import AddCellLock from '../components/RuleSeting/AddCellLock.vue';
import JsonToExcel from '../components/JsonToExcel.vue';
import VWidget from '@/components/VWidget';
import publicWays from '../../../store/publicWays';
import { getMacAccess } from '../../vision/api/macblock';
import { latestversion, buList, tecodeList, versionList, versionupdate, updateServerList, downExcel } from '../api/programversion';

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
          text: 'TE Code',
          value: 'te_code',
          sortable: false,
        },
        {
          text: 'Genius Current',
          value: 'geniusCurrent',
          sortable: false,
        },
        {
          text: 'Top Current',
          value: 'topCurrent',
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
  },
  watch: {
    page() {
      this.debouncedProgramList();
    },
    'pagination.rowsPerPage'() {
      this.page = 1;
      this.debouncedProgramList();
    },
    'params.search'(newVal, oldVal) {
      if (newVal !== oldVal && !newVal) this.handleSearch();
    }
  },
  mounted() {
    this.getUsername();
    this.getLatestVersion();
    this.getTEcodeList();
    this.getBuList();
    // 使用防抖函数，防止短时间内接口多次调用
    this.debouncedProgramList = publicWays.debounce(this.getProgramList, 50);
    this.debouncedProgramList();
  },
  methods: {
    // 获取用户名
    getUsername() {
      const username = this.$cookies.get('username');
      this.role = this.$cookies.get('role');
      this.macAccess = this.role === 'engineer' ? true : false;
      if (!username) {
        this.$router.replace('/genius/login');
      }
      if (username !== 'engineer') {
        this.username = username.split('(')[1].slice(0, -1);
      } else {
        this.username = username;
      }
      this.isAdmin();
    },
    // 权限判断
    async isAdmin() {
      const { data: res } = await getMacAccess(this.username);
      if (res.status) this.isadmin = true;
    },
    // 获取最新版本
    async getLatestVersion() {
      const { data: res } = await latestversion();
      if (res.status) this.latestversionList = res.payload.data;
    },
    // 获取buList
    async getBuList() {
      const { data: res } = await buList();
      if (res.status) this.buList = res.payload.data;
    },
    // 获取tecodeList
    async getTEcodeList() {
      const { data: res } = await tecodeList();
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
            this.$message.success(response.data.payload.message);
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
            this.handleAlert('success', response.data.payload.message + ',' + response.data.payload.time);
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
      if (!obj.hasOwnProperty(key)) return { ...obj };
      const { [key]: prioritizedValue, ...rest } = obj;
      return { [key]: prioritizedValue, ...rest };
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
      let url = 'http://' + IP;
      window.open(url, '_blank');
    },
    // 重置按钮，查询参数重置
    resetParams() {
      this.page = 1;
      this.pagination = {
        descending: false,
        rowsPerPage: 15,
        sortBy: ''
      };
      this.params = {
        bu: '',
        repository_name: '',
        search: '',
        query: ''
      };
      this.debouncedProgramList();
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
        this.handleAlert('success', data.payload.message + ', ' + data.payload.time);
      }
    },
    // 文字是否为红
    computeColor(str1, str2) {
      if (str1 === '-' || str2 === '-' || str2 === 'vx.x.x_xxxxxxxx') return '';
      if (str1 !== str2) return 'red--text';
      return '';
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
    // 失败/成功提示语
    handleAlert() { 
      // this.$refs.toast.showError('Service Error, Please Contact Genius Team');
      this.$message({
        showClose: true,
        message: 'Service Error, Please Contact Genius Team',
        type: 'error', 
        duration: 0, 
        customClass: 'custom-long-message' 
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
/deep/ table.v-table thead tr {
  background: #F8E8FF !important;
}
/deep/ button.v-btn.v-btn--flat.v-btn--icon.theme--light {
  display: none !important;
}
.refreshbtn {
  font-size: 40px;
  align-items: flex-start;
}
.refreshbtn :hover {
  cursor: pointer;
}
/deep/ .BlockOffsetTable .v-datatable__actions__range-controls {
  display: none !important;
}
/deep/ .SelectBlockOffset .v-icon.v-icon--link {
  font-size: 18px;
  cursor: pointer;
}
/deep/ .SelectBlockOffset .v-input__append-inner {
  margin-left: auto;
  padding-left: 0;
}
/deep/ .arrowclass.v-icon {
  align-items: flex-start;
  margin-left: 8px;
  height: 21px;
}
</style>
```
