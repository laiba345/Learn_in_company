```
<template>
  <v-layout row wrap>
    <v-flex sm12>
      <v-widget title="Tester Server">
        <div slot="widget-content">
          <v-flex>
            <toast ref="toast"></toast>
          </v-flex>
          <v-container fluid style="padding-top:10px;">
              <v-layout row>
                <v-spacer></v-spacer>
                  <div style="width:300px;">
                    <v-text-field class="hidden-sm-and-down MacManageSearch" solo 
                      v-model="search" placeholder="Server Name / IP Address" color="primary" clearable>
                      <template slot="append">
                        <button id="searchButton" >
                          <i class="iconfont icon-search" style="font-size: 18px;"></i>
                        </button>
                      </template>
                    </v-text-field>
                  </div>
                <v-btn color="primary" class="setVButton ml-3" @click="add" v-if="macAccess">ADD</v-btn>
              </v-layout>
            <v-card flat> 
              <v-data-table
                :headers="headers"
                :items="desserts"
                :pagination.sync="pagination"
                :rows-per-page-items="[15, 50, 100, 200, 500, 1000]"
                :total-items="totalDesserts"
                class="elevation-1 BlockOffsetTable"
                :hide-actions="hidePage"
              >
                <template v-slot:headers="props">
                  <tr class="text-md-left">
                    <th>{{ props.headers[0].text }}</th>
                    <th :class="['column sortable', pagination.descending ? 'desc' : 'asc', props.headers[1].value === pagination.sortBy ? 'active' : '']" @click="changeSort(props.headers[1].value)">
                      <v-icon small>arrow_upward</v-icon>
                      {{ props.headers[1].text }}
                    </th>
                    <th :class="['column sortable', pagination.descending ? 'desc' : 'asc', props.headers[2].value === pagination.sortBy ? 'active' : '']" @click="changeSort(props.headers[2].value)">
                      <v-icon small>arrow_upward</v-icon>
                      {{ props.headers[2].text }}
                    </th>
                    <th>{{ props.headers[3].text }}</th>
                    <th>{{ props.headers[4].text }}</th>
                    <th>{{ props.headers[5].text }}</th>
                    <th>{{ props.headers[6].text }}</th>
                    <th>{{ props.headers[7].text }}</th>
                    <th>{{ props.headers[8].text }}</th>
                  </tr>
                </template>
                <template v-slot:items="props">
                  <tr>
                    <td>{{ props.item.id }}</td>
                    <td style="padding-left:43px;">
                      <span v-if="!props.item.showText">{{ props.item.serverName }}</span>
                      <v-text-field v-else outline class="changeText" ref="editfrom" v-model="changeServername" :rules="rules" required></v-text-field>
                    </td>
                    <td style="padding-left:43px;">
                      <div class="ServerIpAddress" v-if="!props.item.showText">
                        <span @click="goNewUrl(props.item.ipAddress)">{{ props.item.ipAddress }}</span>
                      </div>
                      <v-text-field v-else outline class="changeText" ref="editfrom1" v-model="changeIP" :rules="ipAddressrules" required></v-text-field>
                    </td>
                    <!-- 新增: product, testStation, remark字段 -->
                    <td>
                      <div v-if="!props.item.showText" class="product-width" @mouseenter="showTooltip(props.item.product, 'product-width', 'productTooltip', 'productWidth')" @mouseleave="productTooltip = false">
                        <v-tooltip v-if="productTooltip" bottom :max-width="productWidth">
                          <template v-slot:activator="{ on }">
                            <div v-on="on" class="tooltip-ellipsis">{{ props.item.product }}</div>
                          </template>
                          <div style="word-break: break-all">{{ props.item.product }}</div>
                        </v-tooltip>
                        <div v-else class="tooltip-ellipsis">{{ props.item.product }}</div>
                      </div>
                      <v-textarea v-else solo no-resize class="changeAddText" ref="editfrom2" v-model="changeProduct" :rules="productrules"></v-textarea>
                    </td>
                    <td>
                      <div v-if="!props.item.showText" class="station-width" @mouseenter="showTooltip(props.item.test_station, 'station-width', 'stationTooltip', 'stationWidth')" @mouseleave="stationTooltip = false">
                        <v-tooltip v-if="stationTooltip" bottom :max-width="stationWidth">
                          <template v-slot:activator="{ on }">
                            <div v-on="on" class="tooltip-ellipsis">{{ props.item.test_station }}</div>
                          </template>
                          <div style="word-break: break-all">{{ props.item.test_station }}</div>
                        </v-tooltip>
                        <div v-else class="tooltip-ellipsis">{{ props.item.test_station }}</div>
                      </div>
                      <v-textarea v-else solo no-resize class="changeAddText" ref="editfrom3" v-model="changeTestStation" :rules="productrules"></v-textarea>
                    </td>
                    <td>
                      <div v-if="!props.item.showText" class="remark-width" @mouseenter="showTooltip(props.item.remark, 'remark-width', 'remarkTooltip', 'remarkWidth')" @mouseleave="remarkTooltip = false">
                        <v-tooltip v-if="remarkTooltip" bottom :max-width="remarkWidth">
                          <template v-slot:activator="{ on }">
                            <div v-on="on" class="tooltip-ellipsis">{{ props.item.remark }}</div>
                          </template>
                          <div style="word-break: break-all">{{ props.item.remark }}</div>
                        </v-tooltip>
                        <div v-else class="tooltip-ellipsis">{{ props.item.remark }}</div>
                      </div>
                      <v-textarea v-else solo no-resize class="changeAddText" ref="editfrom4" v-model="changeRemark" :rules="productrules"></v-textarea>
                    </td>
                    <!-- 其他不变 -->
                    <td style="white-space: nowrap;">{{ props.item.created.replace('T', ' ').split('.')[0] }}</td>
                    <td style="white-space: nowrap;">{{ props.item.username }}</td>
                    <td v-if="macAccess">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-icon v-show="!props.item.showText" v-on="on" color="#9d4edc" @click="edit(props.item)">edit</v-icon>
                        </template>
                        <span>Edit</span>
                      </v-tooltip>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <i v-show="!!props.item.showText" v-on="on" class="iconfont icon-save" style="color: #9d4edc; font-size: 22px; font-weight: 900; margin-top: 5px; cursor: pointer" @click="confirmedit(props.item)"></i>
                        </template>
                        <span>Save</span>
                      </v-tooltip>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <i v-show="!!props.item.showText" v-on="on" class="iconfont icon-cancel-edit" style="color: grey; font-size: 22px; font-weight: 200; margin: 5px 0 0 10px; cursor: pointer" @click="$set(props.item, 'showText', false)"></i>
                        </template>
                        <span>Cancel</span>
                      </v-tooltip>
                    </td>
                  </tr> 
                </template>
                <template slot="actions-append">
                  <div style="display: flex;align-items: center;">
                    <span class="mx-4">{{startPage}}-{{endPage}} of {{totalDesserts}}</span>
                    <v-pagination v-model="pageIndex" :length="pages" :total-visible="5"></v-pagination>
                    <span class="mx-1">Go to</span>
                    <v-select v-model="pageIndex" outline dense class="SelectBlockOffset" :items="pagesCount" style="width:80px;margin-right:10px;" :menu-props="{ bottom: true, offsetY: true }"></v-select>
                  </div>
                </template>
              </v-data-table>
              <json-to-excel :jsonData="desserts" excelName="Tester Server"></json-to-excel>
            </v-card>
          </v-container>
        </div>
      </v-widget>
    </v-flex>

  <!-- 新增 -->
    <add-cell-lock ref="addcell" @updateList="updateList"></add-cell-lock>
    <v-flex>
      <div class="text-xs-center">
        <v-dialog
          v-model="tipsDialog"
          hide-overlay
          persistent
          width="300"
        >
          <v-card color="primary" dark>
            <v-card-text>
              Loading data, please wait...
              <v-progress-linear
                indeterminate
                color="white"
                class="mb-0"
              ></v-progress-linear>
            </v-card-text>
          </v-card>
        </v-dialog>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import VWidget from '@/components/VWidget';
import AddCellLock from '../components/RuleSeting/AddCellLock.vue';
import JsonToExcel from '../components/JsonToExcel.vue';
import Toast from '../../vision/components/Toast.vue';
import { serverList, updateServerList } from '../api/newTesterServer';
import publicWays from '../../../store/publicWays';

export default {
  components: {
    AddCellLock,
    JsonToExcel,
    VWidget, 
    Toast
  },
  data() {
    return {
      productTooltip: false,
      productWidth: 300,
      stationTooltip: false,
      stationWidth: 300,
      remarkTooltip: false,
      remarkWidth: 300,
      pagination: {
        rowsPerPage: 15, 
        sortBy: 'serverName'
      },
      headers: [
        {
          text: 'ID',
          value: 'id',
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
          text: 'Product',
          value: 'product',
          sortable: false,
        },
        {
          text: 'Test Station',
          value: 'test_station',
          sortable: false,
        },
        {
          text: 'Remark',
          value: 'remark',
          sortable: false,
        },
        {
          text: 'Edit Time',
          value: 'created',
          sortable: false,
        },
        {
          text: 'Username',
          value: 'username',
          sortable: false,
        },
        {
          text: 'Operation',
          value: 'operation',
          sortable: false,
        }
      ],
      totalDesserts: 0,
      desserts: [],
      search: '',
      hidePage: false,
      openDialogs: false,
      tabreq: {
        page_size: 'all',
      },
      name: '',
      macAccess: false,
      rules: [
        v => !!v || 'Item is required',
      ],
      ipAddressrules: [
        v => !!v || 'Item is required',
        v => /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/.test(v) || 'Ip Address must be valid',
      ],
      productrules: [
        v => v.length <= 200 || 'Item length should be less than 200',
      ],
      tipsDialog: false,
      oldIP: '',
      changeServername: '',
      changeIP: '',
      changeProduct: '',
      changeTestStation: '',
      changeRemark: '',
      pages: 0,
      pageIndex: 1,
      sortByName: 'serverName',
      // searchList: [],
      startPage: 0,
      endPage: 0,
      role: '',
    };
  },
  computed: {
    pagesCount() {
      return Array.from({ length: this.pages }, (_, index) => index + 1);
    },
  },
  watch: {
    desserts: {
      handler() {
        // eslint-disable-next-line no-unused-expressions
        this.totalDesserts > 15 ? this.hidePage = false : this.hidePage = true;
      },
      immediate: true,
      deep: true,
    },
    search(val) {
      this.tabreq.query = val;
      this.pageIndex = 1;
      this.getDataFromApi(this.pagination.rowsPerPage, this.pageIndex, this.sortByName);
    },
    'pagination': {
      handler (val) {
        this.pageIndex = 1;
        const { sortBy, descending, page, rowsPerPage } = val;
        this.getDataFromApi(rowsPerPage, page, this.sortByName);
      },
    },
    pageIndex: {
      handler(val) {
        this.getDataFromApi(this.pagination.rowsPerPage, val, this.sortByName);
      }
    },
    sortByName: {
      handler(val) {
        this.getDataFromApi(this.pagination.rowsPerPage, this.pageIndex, val);
      }
    },
  },
  mounted() {
    this.username = this.$cookies.get('username');
    this.role = this.$cookies.get('role');
    // eslint-disable-next-line no-unused-expressions
    this.role === 'engineer' ? this.macAccess = true : this.macAccess = false;
    if (!this.username) {
      this.$router.replace('/genius/login');
    }
    if (this.username !== 'engineer') {
      this.name = this.username.split('(')[1].slice(0, -1);
    } else {
      this.name = this.username;
    }
    // this.getTabList();
    // eslint-disable-next-line no-unused-expressions
    this.pagination.descending ? this.tabreq.order_rule = 'DESC' : this.tabreq.order_rule = 'ASC';
    this.getDataFromApi(this.pagination.rowsPerPage, this.pageIndex, this.sortByName);
  },
  methods: {
    async getDataFromApi (page_size, page_index, sortBy) {
      this.tabreq.page_size = page_size;
      this.tabreq.page_index = page_index;
      if (sortBy === 'serverName' || sortBy === 'ipAddress') {
        // eslint-disable-next-line no-unused-expressions
        sortBy === 'serverName' ? this.tabreq.order_by = 'serverName' : this.tabreq.order_by = 'ipAddress';
      }
      const { data: res } = await serverList(this.tabreq);
      if (!res.status) {
        this.$refs.toast.showError(`${res.payload.message}`);
        return; 
      }
      const { data: datas } = res.payload;
      this.desserts = datas.server_list;
      this.totalDesserts = datas.res_count;
      this.pages = datas.page_num;
      this.startPage = datas.res_start;
      this.endPage = datas.res_end;
    },
    // 设置表头只有升序和降序
    changeSort (column, props) {
      if (column === 'serverName' || column === 'ipAddress') {
        this.pagination.sortBy = column;
        this.sortByName = column;
        this.pagination.descending = !this.pagination.descending;
        // eslint-disable-next-line no-unused-expressions
        this.pagination.descending ? this.tabreq.order_rule = 'DESC' : this.tabreq.order_rule = 'ASC';
        this.getDataFromApi(this.pagination.rowsPerPage, this.pageIndex, this.sortByName);
      }
    },
    // 跳转
    goNewUrl(IP) {
      let url = 'http://' + IP;
      window.open(url, '_blank');
    },
    add() {
      this.$refs.addcell.showDialogs(this.name);
    },
    // 新增成功回调
    updateList(data) {
      if (!data.status) {
        this.$refs.toast.showError(`${data.payload.message}`);
      }
      else {
        // this.getTabList();
        this.getDataFromApi(this.pagination.rowsPerPage, this.pageIndex, this.sortByName);
        this.$refs.toast.showSuccess(`${data.payload.message}`); 
      }
    },
    edit(row) {
      this.desserts.forEach(item => {
        if (item.hasOwnProperty('showText')) {
          delete item.showText;
        }
      });
      this.$set(row, 'showText', true);
      this.changeServername = row.serverName;
      this.changeIP = row.ipAddress;
      this.oldIP = row.ipAddress;
      this.changeProduct = row.product ? row.product : '';
      this.changeTestStation = row.test_station ? row.test_station : '';
      this.changeRemark = row.remark ? row.remark : '';
    },
    async confirmedit(row) {
      this.changeProduct = this.changeProduct ? this.changeProduct : '';
      this.changeTestStation = this.changeTestStation ? this.changeTestStation : '';
      this.changeRemark = this.changeRemark ? this.changeRemark : '';
      // 验证表单
      if (this.$refs.editfrom && !this.$refs.editfrom.validate() || this.$refs.editfrom1 && !this.$refs.editfrom1.validate() || this.$refs.editfrom2 && !this.$refs.editfrom2.validate() || this.$refs.editfrom3 && !this.$refs.editfrom3.validate() || this.$refs.editfrom4 && !this.$refs.editfrom4.validate()) {
        this.$refs.editfrom.validate(true);
        return false;
      }
      this.tipsDialog = true;
      const { data: res } = await updateServerList({ server_ip: this.oldIP, update_server_name: this.changeServername, update_server_ip: this.changeIP, update_username: this.name, update_product: this.changeProduct, update_test_station: this.changeTestStation, update_remark: this.changeRemark });
      if (!res.status) {
        this.$refs.toast.showError(`${res.payload.message}`);
        return; 
      }
      // this.getTabList();
      this.getDataFromApi(this.pagination.rowsPerPage, this.pageIndex, this.sortByName);
      this.$set(row, 'showText', false);
      this.$nextTick(() => {
        this.tipsDialog = false;
      });
    },
    // 如果单元格一行显示不完整，则出现tooltip
    showTooltip(content, tdClass, tooltip, tooltipWidth) {
      const maxWidth = parseFloat(getComputedStyle(document.querySelector(`.${tdClass}`)).width);
      const result = publicWays.isshowTooltip(content, 'nowrap');
      this[tooltipWidth] = maxWidth;
      this[tooltip] = result.divWidth > maxWidth;
    }    
  }
};
</script>

<style lang="stylus" scoped>
/deep/ table.v-table thead tr {
  background: #F8E8FF !important;
}
.ServerIpAddress {
  color: #9d4edc;
}
.ServerIpAddress :hover {
  color: #165DFF;
  text-decoration: underline;
  cursor: pointer;
}
/deep/ table.v-table thead th {
  font-size: 14px;
}
/deep/ button.v-btn.v-btn--flat.v-btn--icon.theme--light {
  display: none !important;
}
/deep/ .v-datatable__actions__range-controls {
  display: none !important;  
}
.changeText {
  width: 150px;
}
/deep/ .changeText textarea {
  margin-top: 0 !important;
}

/deep/ .changeText .v-input__control .v-input__slot {
  border: 1px solid #d5d5d5 !important;
  border-radius: 3px !important;
  width: 100%;
  margin-top: 12px;
  margin-bottom: 0px;
}

/deep/ .changeText .v-input__control .v-text-field__details {
  margin-bottom: 0px;
}

/deep/ .changeText input {
  margin: auto 0 !important;
  padding: 6px 0 6px;
}

/deep/ .changeText>.v-input__control>.v-input__slot {
  min-height: 20px !important;
}

/deep/ .changeText.v-input input {
  max-height: 26px !important;
}

/deep/ .changeAddText.v-text-field.v-text-field--solo > .v-input__control > .v-input__slot {
  border: 1px solid #d5d5d5 !important;
  border-radius: 3px !important;
  -webkit-box-shadow:none;
  box-shadow:none;
  margin-top: 12px;
  margin-bottom: 0;
  background-color: rgba(255, 255, 255, 0);
}
/deep/ .changeAddText textarea {
  height: 70px;
  width: 186px;
  margin-top: 0 !important;
}
/deep/ .v-text-field.v-text-field--enclosed .v-text-field__details {
  margin-bottom: 0 !important;
}
.tooltip-ellipsis {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
}
</style>

```
