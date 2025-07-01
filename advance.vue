# advanced.vue
```
<template>
  <v-layout row wrap>
    <v-flex sm12>
      <v-widget title="Pass Rates">
        <div slot="widget-content">
          <v-flex>
            <!-- <v-alert v-model="alert" dismissible :color="alert_color" style="margin-bottom: 20px; font-size: 14px;">
              {{ alert_message }}
            </v-alert> -->
            <toast ref="toast"></toast>
          </v-flex>
          <v-container fluid style="padding-top: 10px;">
            <v-layout row style="height: 64px;">
              <v-tabs v-model="checktab" grow :style="engineer ? 'width: 300px' : 'width: 140px'" class="setTabs" active-class="active_tabs">
                <v-tabs-slider color="primary"></v-tabs-slider>
                <v-tab class="NewButton">Data Search</v-tab>
                <v-tab v-if="engineer" class="NewButton">Product Report</v-tab>
              </v-tabs>
              <v-spacer></v-spacer>
              <div v-if="checktab === 1" style="width: 250px;">
                <v-text-field class="hidden-sm-and-down MacManageSearch" solo placeholder="UUT Type" v-model="params.uut_type"
                  v-on:keyup.enter="getProductReportList" color="primary" clearable>
                  <template slot="append">
                    <button id="searchButton">
                      <i class="iconfont icon-search" style="font-size: 18px;" @click="getProductReportList"></i>
                    </button>
                  </template>
                </v-text-field>
              </div>
              <v-btn v-if="checktab === 1 && engineer && admin" class="offsetButton setVButton" color="primary" @click="addReport">ADD</v-btn>
            </v-layout>
            <!-- 表格 -->
            <v-layout row wrap>
              <v-flex sm12 v-show="checktab === 0">
                <data-search-table @showAlert="showAlert"></data-search-table>
              </v-flex>
              <v-flex sm12 v-if="checktab === 1">
                <v-card flat>
                  <product-report-table :productReportData="productReportList" :operationAccess="engineer && admin" :pageNumber="pageNumber" :taskNameList="taskNameList" :username="name" @showAlert="showAlert"></product-report-table>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
        </div>
      </v-widget>
    </v-flex>
    <add-product-report-dialog ref="addDialog" :taskNameList="taskNameList" :username="name" @showAlert="showAlert"></add-product-report-dialog>
  </v-layout>
</template>

<script>
import VWidget from '@/components/VWidget';
import DataSearchTable from '../components/passRates/DataSearchTable.vue';
import ProductReportTable from '../components/passRates/ProductReportTable.vue';
import AddProductReportDialog from '../components/passRates/AddProductReportDialog.vue';
import Toast from '../components/Toast.vue';
import publicWays from '../../../store/publicWays';
import { getAdminAccess, productReportList } from '../api/productReport';

export default {
  components: {
    VWidget,
    DataSearchTable,
    ProductReportTable,
    AddProductReportDialog, 
    Toast
  },
  data() {
    return {
      checktab: 0,
      alert: false,
      alert_color: 'warning',
      alert_message: '',
      name: '',
      engineer: false,
      admin: false,
      params: {
        uut_type: '',
        timezone: publicWays.setTimeZone()
      },
      debounceTimer: null,
      productReportList: [],
      pageNumber: -1
    };
  },
  computed: {
    taskNameList() {  
      return this.productReportList.map(item => item.task_name);
    }
  },
  watch: {
    checktab: {
      handler(newVal, oldVal) {
        if (newVal !== oldVal && newVal === 1) this.getProductReportList();
      }
    },
    'params.uut_type'(newVal, oldVal) {
      if (oldVal !== newVal) {
        // 使用防抖，防止频繁请求接口
        if (this.debounceTimer) clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
          this.pageNumber = 1;
          this.getProductReportList().then(
            setTimeout(() => {
              this.pageNumber = -1;
            }, 1000)
          );
        }, 500);
      }
    }
  },
  mounted() {
    let username = this.$cookies.get('username');
    let role = this.$cookies.get('role');
    this.engineer = role === 'engineer' ? true : false;
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
      const { data: res } = await getAdminAccess({ username: this.name });
      if (res.status) {
        this.admin = true;
      }
    },
    // 查询product report 列表
    async getProductReportList() {
      const { data: res } = await productReportList(this.params);
      if (!res.status) {
        // eslint-disable-next-line no-return-assign, no-sequences
        // return this.alert = true, this.alert_color = 'red', this.alert_message = res.payload.msg;
        this.$refs.toast.showError(`${res.payload.msg}`);
        return; 
      }
      this.productReportList = res.payload.data;
    },
    // 接收子组件传递的警告信息用于展示
    showAlert(params) {
      // this.alert = params.alert;
      // this.alert_color = params.alert_color;
      // this.alert_message = params.alert_message;
      if (this.alert_color === 'warning') {
        this.$refs.toast.showWarning(`${params.alert_message}`);
      } else if (this.alert_color === 'success') {
        this.$refs.toast.showSuccess(`${params.alert_message}`);
      } else {
        this.$refs.toast.showError(`${params.alert_message}`);
      }
      if (this.alert_color === 'success') {
        if (params.operation === 'EDIT' || 'DELETE') this.getProductReportList();
        if (params.operation === 'ADD') {
          this.pageNumber = 1;
          this.getProductReportList().then(
            setTimeout(() => {
              this.pageNumber = -1;
            }, 1000)
          );
        }
      }
    },
    addReport() {
      this.$refs.addDialog.showDialogs('ADD', {});
    },
  }
};
</script>

<style lang="stylus" scoped>
/deep/ .active_tabs {
  color: #9d4edc;
}
.NewButton {
  font-size: 14px;
  height: 28px;
  margin: auto;
  border-radius: 2px;
  text-transform: none;
}
.NewButton:hover {
  background-color: #F8E8FF;
  border-radius: 8px;
}
</style>
```
