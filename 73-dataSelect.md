# dataSelect
```
<template>
  <!-- 使用form是为了可以使用confirm方法 -->
  <v-form ref="form" @submit.prevent>
    <!-- 时间区域 -->
    <v-menu ref="setDate" lazy :close-on-content-click="false"
      v-model="dateMenu" transition="scale-transition" offset-y full-width :nudge-bottom="-12"
      max-width="360px" :return-value.sync="date">
      <v-text-field slot="activator" :label="label" v-model="date" append-icon="event" readonly class="hidden-sm-and-down MacManageSearch"
        :rules="[validateNotEmpty]" solo></v-text-field>
      <div style="width: 500px;height: 600px;">
          <v-text-field style="width:250px; margin: 6px;" class="hidden-sm-and-down MacManageSearch" solo name="addressNumber"
             value="" color="primary" clearable>
            <template slot="append">
                <button id="searchButton">
                    <i class="iconfont icon-search" style="font-size: 18px;"></i>
                </button>
            </template>
        </v-text-field>
        <i class="iconfont icon-search" style="font-size: 18px;"></i>
      </div>
    </v-menu>
  </v-form>
</template>

<script>

export default {
  props: {
    label: {
      type: String,
      default: 'Start Date'
    },
    // 没选日期，是否要报错，true为报错，false为不报错
    showError: {
      type: Boolean,
      default: false
    },
    // 开始日期
    startDate: {
      type: String,
      default: ''
    },
    // 结束日期
    endDate: {
      type: String,
      default: ''
    },
    // 最晚可选择的日期
    lastDate: {
      type: String,
      default: ''
    },
    // 默认日期/选中的日期
    confirmValue: {
      type: String,
      default: ''
    },
  },
  data () {
    return {
      dateMenu: false,
      date: '',
    };
  },
  watch: {
    dateMenu(newValue, oldValue) {
      // 时间选择器打开后关闭，如果showError为true，根据是否选择了日期进行是否报错
      if (!newValue && oldValue) this.confirm();
    },
    // 把confirmValue的值赋值给date
    confirmValue() {
      this.date = this.confirmValue;
    }
  },
  mounted() {
    this.date = this.confirmValue;
    // 阻止v-text-field__details的默认行为，避免日期选择器打开
    const detailsElement = this.$el.querySelector('.v-text-field__details');
    if (detailsElement) {
      detailsElement.addEventListener('click', (event) => {
        event.stopPropagation();
      });
    }
  },
  methods: {
    allowedDate(val) {
      let cur = new Date(val).getTime();
      let curs = new Date(this.lastDate).getTime();
      // 选择结束日期：有startDate，只可以选择startDate和lastDate之间的日期范围
      if (this.startDate) {
        let start = new Date(this.startDate).getTime();
        return cur >= start && cur <= curs;
      }
      // 选择开始日期：有endDate，只可以选择endDate之前的日期
      if (this.endDate) {
        let end = new Date(this.endDate).getTime();
        return cur <= end;
      }
      // 以上情况都不符，可以选择lastDate之前的日期
      return cur <= curs;
    },
    // 根据showError判断是否显示报错信息
    validateNotEmpty(value) {
      if (this.showError) return !!value || 'Item is required';
      return true;
    },
    // 保存日期，发送值到父组件
    saveDate() {
      this.confirm();
      if (this.date) {
        this.$refs.setDate.save(this.date);
        this.$emit('saveDate', this.date);
      }
      this.dateMenu = false;
    },
    confirm() {
      if (!this.showError) return;
      if (this.$refs.form && !this.$refs.form.validate()) {
        this.$refs.form.validate(true);
        return false;
      }
    }
  }
};
</script>

<style lang='stylus' scoped>
/deep/ .v-input__slot {
  margin-bottom: 0;
}
/deep/ .v-menu__activator * {
  cursor: text;
}
/deep/ .v-menu__activator .v-icon {
  cursor: pointer;
}
/deep/ .v-text-field.v-text-field--enclosed .v-text-field__details {
  margin-bottom: 0;
}

.MacManageSearch.v-text-field.v-text-field--solo:not(.v-input--is-focused) > .v-input__control > .v-input__slot {
  border: 1px solid #a5a3a3;
  border-left: none;
  -webkit-box-shadow: unset !important;
  box-shadow: unset !important;
  border-radius: 3px;
}
</style>

你好上述代码中，我的图标<i class="iconfont icon-search" style="font-size: 18px;"></i>
想要和内容框<v-text-field style="width:250px; margin: 6px;" class="hidden-sm-and-down MacManageSearch" solo name="addressNumber"
             value="" color="primary" clearable>
                <template slot="append">
                    <button id="searchButton">
                        <i class="iconfont icon-search" style="font-size: 18px;"></i>
                    </button>
                </template>
            </v-text-field>

在同一行显示，该如何修改代码呢
```

# dataselect 第二版
```
<template>
  <!-- 使用form是为了可以使用confirm方法 -->
  <v-form ref="form" @submit.prevent style="background-color: white;">
    <!-- 时间区域 -->
    <v-menu ref="setDate" lazy :close-on-content-click="false"
      v-model="dateMenu" transition="scale-transition" offset-y full-width :nudge-bottom="-12"
      max-width="500px" :return-value.sync="date">
      <v-text-field slot="activator" :label="label" v-model="date" append-icon="event" readonly class="hidden-sm-and-down MacManageSearch"
        :rules="[validateNotEmpty]" solo></v-text-field>
    <div>
      <div style="display: flex; align-items: center; padding: 6px;">  <!-- 添加Flex布局 -->
          <v-text-field style="flex: 1; margin-right: 10px;" class="hidden-sm-and-down MacManageSearch" solo name="addressNumber"
             value="" color="primary" clearable>
            <template slot="append">
                <button id="searchButton">
                    <i class="iconfont icon-search" style="font-size: 18px;"></i>
                </button>
            </template>
        </v-text-field>
        <i class="iconfont icon-search" style="font-size: 18px; margin-top: -10px;"></i>
      </div>
       <div style="display: flex; align-items: center; padding: 6px;">  <!-- 添加Flex布局 -->
          <v-text-field style="flex: 1; margin-right: 10px;" class="hidden-sm-and-down MacManageSearch" solo name="addressNumber"
             value="" color="primary" clearable>
            <template slot="append">
                <button id="searchButton">
                    <i class="iconfont icon-search" style="font-size: 18px;"></i>
                </button>
            </template>
        </v-text-field>
        <i class="iconfont icon-search" style="font-size: 18px; margin-top: -10px;"></i>
      </div>
       <div style="display: flex; align-items: center; padding: 6px;">  <!-- 添加Flex布局 -->
          <v-text-field style="flex: 1; margin-right: 10px;" class="hidden-sm-and-down MacManageSearch" solo name="addressNumber"
             value="" color="primary" clearable>
            <template slot="append">
                <button id="searchButton">
                    <i class="iconfont icon-search" style="font-size: 18px;"></i>
                </button>
            </template>
        </v-text-field>
        <i class="iconfont icon-search" style="font-size: 18px; margin-top: -10px;"></i>
      </div>
        <v-divider style="color: blueviolet;"></v-divider>
    </div>
    </v-menu>
  </v-form>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: 'Start Date'
    },
    // 没选日期，是否要报错，true为报错，false为不报错
    showError: {
      type: Boolean,
      default: false
    },
    // 开始日期
    startDate: {
      type: String,
      default: ''
    },
    // 结束日期
    endDate: {
      type: String,
      default: ''
    },
    // 最晚可选择的日期
    lastDate: {
      type: String,
      default: ''
    },
    // 默认日期/选中的日期
    confirmValue: {
      type: String,
      default: ''
    },
  },
  data () {
    return {
      dateMenu: false,
      date: '',
    };
  },
  watch: {
    dateMenu(newValue, oldValue) {
      // 时间选择器打开后关闭，如果showError为true，根据是否选择了日期进行是否报错
      if (!newValue && oldValue) this.confirm();
    },
    // 把confirmValue的值赋值给date
    confirmValue() {
      this.date = this.confirmValue;
    }
  },
  mounted() {
    this.date = this.confirmValue;
    // 阻止v-text-field__details的默认行为，避免日期选择器打开
    const detailsElement = this.$el.querySelector('.v-text-field__details');
    if (detailsElement) {
      detailsElement.addEventListener('click', (event) => {
        event.stopPropagation();
      });
    }
  },
  methods: {
    allowedDate(val) {
      let cur = new Date(val).getTime();
      let curs = new Date(this.lastDate).getTime();
      // 选择结束日期：有startDate，只可以选择startDate和lastDate之间的日期范围
      if (this.startDate) {
        let start = new Date(this.startDate).getTime();
        return cur >= start && cur <= curs;
      }
      // 选择开始日期：有endDate，只可以选择endDate之前的日期
      if (this.endDate) {
        let end = new Date(this.endDate).getTime();
        return cur <= end;
      }
      // 以上情况都不符，可以选择lastDate之前的日期
      return cur <= curs;
    },
    // 根据showError判断是否显示报错信息
    validateNotEmpty(value) {
      if (this.showError) return !!value || 'Item is required';
      return true;
    },
    // 保存日期，发送值到父组件
    saveDate() {
      this.confirm();
      if (this.date) {
        this.$refs.setDate.save(this.date);
        this.$emit('saveDate', this.date);
      }
      this.dateMenu = false;
    },
    confirm() {
      if (!this.showError) return;
      if (this.$refs.form && !this.$refs.form.validate()) {
        this.$refs.form.validate(true);
        return false;
      }
    }
  }
};
</script>

<style lang='stylus' scoped>
/deep/  .v-menu__content {
  z-index: 2000 !important;
}

/deep/ .v-input__slot {
  margin-bottom: 0;
}
/deep/ .v-menu__activator * {
  cursor: text;
}
/deep/ .v-menu__activator .v-icon {
  cursor: pointer;
}
/deep/ .v-text-field.v-text-field--enclosed .v-text-field__details {
  margin-bottom: 0;
}

.MacManageSearch {
    background-color: white;
}

.MacManageSearch.v-text-field.v-text-field--solo:not(.v-input--is-focused) > .v-input__control > .v-input__slot {
  border: 1px solid #a5a3a3;
  border-left: none;
  -webkit-box-shadow: unset !important;
  box-shadow: unset !important;
  border-radius: 3px;
}
</style>
```
