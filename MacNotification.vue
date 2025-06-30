```
<template>
  <v-layout row wrap>
    <v-flex sm12>
      <v-widget title="MAC Search" @breadpush="$router.push({ path: '/vision/mac', query: { type: 'macblock' } })" :breadnav="true">
        <div slot="widget-header"><span style="margin-left:-10px;color:#7f7f7f;font-weight:bold;font-size:14px;">/ NOTIFICATION</span></div>
        <div slot="widget-content">
          <v-flex>
            <!-- <v-alert v-model="alert" dismissible :color="alert_color" style="margin-bottom: 20px;font-size:14px;">
              {{ alert_message }}
            </v-alert> -->
            <toast ref="toast"></toast>
          </v-flex>
          <v-container fluid style="padding-top:10px;">
            <v-card-text class="px-0 pb-1 pt-0" style="display: flex;align-items: right;justify-content: right;margin-bottom:20px;">
              <!-- 标签 -->
              <v-tabs v-model="checktab" grow class="setTabs" active-class="active_tabs">
                <v-tabs-slider color="primary"></v-tabs-slider>
                <v-tab class="NewButton">Product Stage</v-tab>
                <v-tab class="NewButton">Alert Count</v-tab>
              </v-tabs>
              <v-spacer></v-spacer>
              <div v-if="checktab == 0" style="display: flex;justify-content: right;align-items: center;">
                <div style="width: 165px;">
                  <v-select v-model="bu" outline class="SelectBlockOffset" dense :items="buArray"
                    placeholder="BU" :menu-props="{ bottom: true, offsetY: true }" clearable @change="getProductStageData"></v-select>
                </div>
                <div style="width: 165px;margin-left:10px;">
                  <v-select v-model="project" outline class="SelectBlockOffset" dense :items="projectArray"
                    placeholder="Project" :menu-props="{ bottom: true, offsetY: true }" clearable @change="getProductStageData"></v-select>
                </div>
                <div style="width: 165px;margin-left:10px;">
                  <v-select v-model="product" outline class="SelectBlockOffset" dense :items="productArray"
                    placeholder="Product" :menu-props="{ bottom: true, offsetY: true }" clearable @change="getProductStageData">
                    <template v-slot:selection>
                      <div style="font-size: 14px; width: 91px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ product }}</div>
                    </template>
                  </v-select>
                </div>
                <div style="width: 165px;margin-left:10px;">
                  <v-select v-model="stage" outline class="SelectBlockOffset" dense :items="stageArray"
                    placeholder="Stage" :menu-props="{ bottom: true, offsetY: true }" clearable @change="getProductStageData"></v-select>
                </div>
                <v-btn v-if="checktab === 0" class="offsetButton setVButton" outline color="#333" style="height: 36px;" :loading="productStageLoading"
                  @click.exact="resetProductStage"><v-icon style="font-size: 18px;margin-right: 2px;">refresh</v-icon>Reset</v-btn>
              </div>
            </v-card-text>
             <!-- 表格 -->
            <v-layout row wrap>
              <v-flex sm12 v-if="checktab === 0">
                <v-card flat>
                  <product-stage-table :productStageData="productStageData" :loading="productStageLoading" :editStatus="editStatus" @editProductStage="editProductStage"></product-stage-table>
                </v-card>
              </v-flex>
              <v-flex sm12 v-if="checktab === 1">
                <v-card flat>
                  <alert-counttb :alertCountData="alertCountData" :loading="alertCountLoading" :editCount="editCount" @editAlertCount="editAlertCount"></alert-counttb>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
        </div>
      </v-widget>
    </v-flex>
  </v-layout>
</template>

<script>
import VWidget from '@/components/VWidget';
import ProductStageTable from '../components/macNotification/ProductStagetb.vue';
import AlertCounttb from '../components/macNotification/AlertCounttb.vue';
import Toast from '../components/Toast.vue';
import { getBuProductList, getProductAlertList, updateProductAlert } from '../api/productStage.js';
import { getAlertCountList, updateAlertCount } from '../api/alertCount.js';

export default {
  components: {
    VWidget,
    ProductStageTable,
    AlertCounttb,
    Toast
  },
  data() {
    return {
      name: '',
      macAccess: false,
      username: '',
      checktab: 0,
      bu: '',
      product: '',
      project: '',
      stage: '',
      buProjectList: [],
      buArray: [],
      projectArray: ['RB', 'MB'],
      stageArray: ['NPI', 'Sustaining', 'EOL'],
      alert: false,
      alert_color: 'warning',
      alert_message: 'it is error',
      productStageData: [],
      productStageLoading: false,
      alertCountData: [],
      alertCountLoading: false,
      editStatus: false,
      editCount: false,
    };
  },
  computed: {
    productArray() {
      let product = [];
      if (this.bu) product = this.buProjectList.map((item) => (item.bu === this.bu ? item.product : '')).filter(item => item !== '');
      if (!this.bu) product = this.buProjectList.map(item => item.product).filter(item => item !== '');
      return product;
    },
  },
  watch: {
    checktab(newValue) {
      if (newValue === 0) {
        this.getProductStageData();
      }
      if (newValue === 1) {
        this.getAlertCountData();
      }
    },
  },
  created () {
    this.getBuProduct();
    this.getProductStageData();
  },
  mounted() {
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
  },
  methods: {
    async getBuProduct() {
      const { data: res } = await getBuProductList();
      if (!res.status) {
        // eslint-disable-next-line no-return-assign, no-sequences
        // return this.alert = true, this.alert_color = 'red', this.alert_message = res.payload.message;
        this.$refs.toast.showError(`${res.payload.message}`);
        return; 
      }
      this.buProjectList = res.payload.data;
      this.buArray = this.buProjectList.map(item => item.bu);
    },
    async getProductStageData() {
      const { data: res } = await getProductAlertList({ bu: this.bu ? this.bu : 'ALL', project: this.project ? this.project : 'ALL', product: this.product ? this.product : 'ALL', stage: this.stage ? this.stage : 'ALL' });
      if (!res.status) {
        // eslint-disable-next-line no-return-assign, no-sequences
        // return this.alert = true, this.alert_color = 'red', this.alert_message = res.payload.message;
        this.$refs.toast.showError(`${res.payload.message}`);
        return; 
      }
      this.productStageData = res.payload.data;
      setTimeout(() => {
        this.editStatus = false;
      }, 300);
    },
    resetProductStage() {
      this.bu = '';
      this.project = '';
      this.product = '';
      this.stage = '';
      this.getProductStageData();
    },
    async editProductStage(data) {
      this.editStatus = true;
      data.set_by = this.name;
      const { data: res } = await updateProductAlert(data);
      if (!res.status) {
        // eslint-disable-next-line no-return-assign, no-sequences
        // return this.alert = true, this.alert_color = 'red', this.alert_message = res.payload.message;
        this.$refs.toast.showError(`${res.payload.message}`);
        return; 
      }
      // this.alert = true;
      // this.alert_color = 'green';
      // this.alert_message = 'Update sucessfully!!!!, ' + res.payload.time;
      this.$refs.toast.showSuccess(`${res.payload.message}`);
      this.getProductStageData();
    },
    async getAlertCountData() {
      const { data: res } = await getAlertCountList();
      if (!res.status) {
        // eslint-disable-next-line no-return-assign, no-sequences
        // return this.alert = true, this.alert_color = 'red', this.alert_message = res.payload.message;
        this.$refs.toast.showError(`${res.payload.message}`);
        return; 
      }
      this.alertCountData = res.payload.data;
      setTimeout(() => {
        this.editCount = false;
      }, 300);
    },
    async editAlertCount(data) {
      this.editCount = true;
      data.set_by = this.name;
      const { data: res } = await updateAlertCount(data);
      if (!res.status) {
        // eslint-disable-next-line no-return-assign, no-sequences
        // return this.alert = true, this.alert_color = 'red', this.alert_message = res.payload.message;
        this.$refs.toast.showError(`${res.payload.message}`);
        return; 
      }
      // this.alert = true;
      // this.alert_color = 'green';
      // this.alert_message = 'Update sucessfully, ' + res.payload.time;
      this.$refs.toast.showSuccess(`${res.payload.message}`);
      this.getAlertCountData();
    }
  },
};
</script>

<style lang='stylus' scoped>
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
/deep/ .active_tabs{
  color:#9d4edc;
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
