```
<template>
  <el-dialog
    v-model="dialog"
    width="900"
    align-center
    :show-close="false"
    :close-on-click-modal="false"
    class="operate-dialog"
  >
    <template #header="{ titleId, titleClass }">
      <div class="dialog-header">
        <div style="width: 30px;"></div>
        <h4 :id="titleId" :class="titleClass">{{ dialogType }}</h4>
        <el-icon @click="closeDialog(formRef)"><Close/></el-icon>
      </div>
    </template>
    <div class="dialog-body">
      <el-form :model="param" :rules="rules" ref="formRef" size="large" label-position="top">
        <el-row :gutter="20">
          <el-col :span="8" style="padding-right: 23px;">
            <el-form-item prop="site" label="Site">
              <el-select :disabled="dialogType === 'EDIT' ? true : false" v-model="param.site" placeholder="">
                <el-option
                  v-for="item in siteList"
                  :key="item+'A'"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="group_name" label="Group">
              <el-select :disabled="dialogType === 'EDIT' ? true : false" v-model="param.group_name" placeholder="">
                <el-option
                  v-for="item in groupList"
                  :key="item+'A'"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="padding-left: 23px;">
            <el-form-item prop="bu" label="BU">
              <el-select :disabled="dialogType === 'EDIT' ? true : false" v-model="param.bu" placeholder="">
                <el-option
                  v-for="item in buList"
                  :key="item+'A'"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="padding-right: 23px;">
            <el-form-item prop="mail_type" label="Type">
               <el-input :disabled="dialogType === 'EDIT' ? true : false" v-model="param.mail_type" @input="handleTypeInput" maxlength="50" show-word-limit></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="description" label="Description">
              <el-input v-model="param.description" @input="handleDescriptionInput" maxlength="100" show-word-limit></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" class="search-form-item">
            <el-form-item prop="search">
              <template #label>
                <span style="color: #f56c6c;">* </span>
                <span>To</span>
              </template>
              <div style="display: flex; flex-direction: row;">
                <div style="margin-right: 46px;" class="transfer-title">
                  Unselected
                  <el-input
                    style="width: 280px; height: 30px; margin-left: 5px"
                    v-model="param.search"
                    placeholder="EmployeeID / Name / Email"
                    @keyup.enter="handleRecipients"
                  >
                    <template #suffix>
                      <el-icon @click="handleRecipients">
                        <Search />
                      </el-icon>
                    </template>
                  </el-input>
                </div>
                <div class="transfer-title">Selected</div>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24" class="recipient-form-item">
            <el-form-item prop="recipient">
              <el-transfer v-model="param.recipient" :data="showRecipients">
                <template #default="{ option }" >
                  <div @mouseenter="showTooltip(option.label)" @mouseleave="recipientsTooltip = false">
                    <el-tooltip v-if="recipientsTooltip" placement="top">
                      <template #content> {{ option.label }} </template>
                      <div class="overflow-ellipsis"> {{ option.label }} </div>
                    </el-tooltip>
                    <div v-else class="overflow-ellipsis"> {{ option.label }} </div>
                  </div>
                </template>
              </el-transfer>
            </el-form-item>
          </el-col>        
          <el-col :span="24" class="search-form-item">
            <el-form-item prop="search">
              <template #label>
                <span>CC</span>
              </template>
              <div style="display: flex; flex-direction: row;">
                <div style="margin-right: 46px;" class="transfer-title">
                  Unselected
                  <el-input
                    style="width: 280px; height: 30px; margin-left: 5px"
                    v-model="param.searchCC"
                    placeholder="EmployeeID / Name / Email"
                    @keyup.enter="handleCc"
                  >
                    <template #suffix>
                      <el-icon style="cursor: pointer;" @click="handleCc">
                        <Search />
                      </el-icon>
                    </template>
                  </el-input>
                </div>
                <div class="transfer-title">Selected</div>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24" class="recipient-form-item">
            <el-form-item prop="cc">
              <el-transfer v-model="param.cc" :data="showCcData">
                <template #default="{ option }" >
                  <div @mouseenter="showTooltip(option.label)" @mouseleave="recipientsTooltip = false">
                    <el-tooltip v-if="recipientsTooltip" placement="top">
                      <template #content> {{ option.label }} </template>
                      <div class="overflow-ellipsis"> {{ option.label }} </div>
                    </el-tooltip>
                    <div v-else class="overflow-ellipsis"> {{ option.label }} </div>
                  </div>
                </template>
              </el-transfer>
            </el-form-item>
          </el-col>   
        </el-row>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button class="mr-3" @click="closeDialog(formRef)">Cancel</el-button>
        <el-button type="primary" @click="submitForm(formRef)">Confirm</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { publicWayStore } from '@/stores/publicWay';
import { siteOrbuList, getGroupList } from '@/api/user/user';
import { userEmailList, addNotification, editNotification, getGroupBySite } from '@/api/notification/notification';

const rules = {
  site: [
    { required: true, message: 'Item is required', trigger: 'change' }
  ],
  group_name: [
    { required: true, message: 'Item is required', trigger: 'change' }
  ],
  bu: [
    { required: true, message: 'Item is required', trigger: 'change' }
  ],
  mail_type: [
    { required: true, message: 'Item is required', trigger: 'change' },
    { 
      pattern: /^[A-Za-z0-9_]+$/, 
      message: 'Only English letters, numbers, and underscores are allowed', 
      trigger: 'blur' 
    }
  ],
  description: [
    { 
      pattern: /^[\x21-\x7E ]*$/, 
      message: 'Only English letters, numbers, and special characters are allowed', 
      trigger: 'blur' 
    }
  ],
  recipient: [
    { required: true, message: 'Item is required', trigger: 'change' }
  ]
};
let dialog = ref(false);
let dialogType = ref('ADD');
const formRef = ref();
let recipientsTooltip = ref(false);
let siteList = ref([]);
let buList = ref([]);
let groupList = ref([]);
let allGroupList = [];
let recipients = ref([]);
let isInitializing = ref(false);
let currentRowData = null;
let param = ref({
  site: '',
  group_name: '',
  bu: '',
  mail_type: '',
  description: '',
  search: '',
  searchCC: '',
  recipient: [],
  cc: [], // 选中的邮箱/工号字符串
  ccData: [] // 搜索出来的候选邮箱/工号字符串
});

const props = defineProps(['tableList']);
const emit = defineEmits(['updateList']);

// 穿梭框的数据由符合条件（1. site和bu, 2. 输入框）的邮件地址和已选择的邮件地址组成，去重
const showRecipients = computed(() => {
  const arr = [...recipients.value, ...param.value.recipient];
  const uniqueArr = [...new Set(arr)].sort();
  return uniqueArr.map((item) => ({ key: item, label: item }));
});

const showCcData = computed(() => {
  const arr = [...param.value.ccData, ...param.value.cc];
  const uniqueArr = [...new Set(arr)].sort();
  return uniqueArr.map((item) => ({ key: item, label: item }));
});

watch([() => param.value.site, () => param.value.bu], ([newSite, newBu], [oldSite, oldBu]) => {
  if (newSite && newBu && (newSite !== oldSite || newBu !== oldBu)) {
    handleRecipients();
    handleCc();
  } 
});

watch(() => param.value.site, async (newSite) => {
  if (dialogType.value !== 'EDIT' && !isInitializing.value) {
    param.value.group_name = '';
  }

  if (newSite && !isInitializing.value) {
    try {
      const { data: res } = await getGroupBySite({ site: newSite }); 
      if (!res.status) return publicWayStore().showElMessage(res.message);
      groupList.value = res.payload.data.filter((item) => !!item);
    } catch (error) {
      console.error('Fetch group by site error:', error);
    }
  }
});

// 挂载调用
onMounted (() => {
  getSiteOrBuList();
  getTableGroupList();
});

const open = async (type, editInfo) => {
  dialogType.value = type;
  dialog.value = true;
  
  if (type === 'EDIT') {
    param.value = editInfo;
    currentRowData = editInfo; 
    Object.assign(param.value, JSON.parse(JSON.stringify(editInfo)));
    param.value.ccData = editInfo.cc ? [...editInfo.cc] : [];
    handleCc(); 
  } else if (type === 'COPY') {
    isInitializing.value = true; 
    if (editInfo.site) {
      try {
        const { data: res } = await getGroupBySite({ site: editInfo.site });
        if (res.status) {
          groupList.value = res.payload.data.filter((item) => !!item);
        }
      } catch (e) {
        console.error('Fetch group on copy init error:', e);
      }
    }
    param.value = JSON.parse(JSON.stringify(editInfo));
    delete param.value.row_id;
    param.value.ccData = editInfo.cc ? [...editInfo.cc] : [];
    handleCc();
    nextTick(() => {
      isInitializing.value = false;
    });
  }
};

const closeDialog = (formRef) => {
  nextTick(() => {
    recipients.value = [];
    currentRowData = null;
    groupList.value = [...allGroupList];
    param.value = {
      site: '',
      group_name: '',
      bu: '',
      mail_type: '',
      description: '',
      search: '',
      searchCC: '',
      recipient: [],
      cc: [],
      ccData: []
    };
    formRef.resetFields();
    dialog.value = false;
  });
};

const handleTypeInput = (value) => {
  param.value.type = value.trim();
};

const handleDescriptionInput = (value) => {
  param.value.description = value.trim();
};

const submitForm = (formRef) => {
  formRef.validate(async (valid) => {
    if (!valid) return false;
    // 取工号传递给后端
    param.value.user_employee_id_list = param.value.recipient.map((item) => item.split(' (')[1].split(',')[0]);
    // 选择了CC，取工号传递给后端
    if (param.value.cc && param.value.cc.length > 0) {
      param.value.cc_employee_id_list = param.value.cc.map((item) => item.split(' (')[1].split(',')[0]);
    } else {
      param.value.cc_employee_id_list = [];
    }

    if (dialogType.value === 'EDIT' && currentRowData && currentRowData.create_at) {
      param.value.create_at = currentRowData.create_at;
    }

    let res = {
      status: false,
      payload: {
        message: 'Service Error, Please Contact Genius Team.'
      }
    };
    if (dialogType.value === 'ADD' || dialogType.value === 'COPY') {
      await addNotification(param.value)
        .then((response) => res = response.data)
          .catch((e) => {
            console.log(e);
          });
    } else {
      await editNotification(param.value)
        .then((response) => res = response.data)
          .catch((e) => {
            console.log(e);
          });
    }
    // 返回结果的处理
    if (!res.status) return publicWayStore().showElMessage(`${res.payload.message}`);
    emit('updateList');
    publicWayStore().showElMessage(res.payload.message, 'success');
    closeDialog(formRef);
  });
};
// 获取bu和site
const getSiteOrBuList = async () => {
  const { data: res } = await siteOrbuList();
  if (!res.status) return publicWayStore().showElMessage(res.message);
  siteList.value = res.site_list.filter((item) => {
    if (item) return true;
    if (!item) return false;
  });
  buList.value = res.bu_list.filter((item) => {
    if (item) return true;
    if (!item) return false;
  });
};
// 获取groupList
const getTableGroupList = async () => {
  const { data: res } = await getGroupList();
  if (!res.status) return publicWayStore().showElMessage(res.message);
  const filteredData = res.payload.data.filter((item) => !!item);
  
  groupList.value = filteredData;
  allGroupList = filteredData;
};
// 根据Site，Bu，Search值获取穿梭框的数据
const handleRecipients = async () => {
  const paramsObj = {};
  if (param.value.search) {
    paramsObj.search = param.value.search;
  } else {
    paramsObj.site = param.value.site;
    paramsObj.bu = param.value.bu;
  }
  const { data: res } = await userEmailList(paramsObj);
  if (!res.status) return publicWayStore().showElMessage(res.payload.message);
  recipients.value = res.payload.data;
};
const showTooltip = (recipientsLabel) => {
  const result = publicWayStore().isshowTooltip(recipientsLabel, 'nowrap');
  recipientsTooltip.value = result.divWidth > 333;
};

const handleCc = async () => {
  const paramsObj = {};
  if (param.value.searchCC) {
    paramsObj.search = param.value.searchCC;
  } else {
    paramsObj.site = param.value.site;
    paramsObj.bu = param.value.bu;
  }
  const { data: res } = await userEmailList(paramsObj);
  if (!res.status) return publicWayStore().showElMessage(res.payload.message);
  param.value.ccData = res.payload.data;
};

defineExpose({
  open
});
</script>

<style lang="scss" scoped>
::v-deep .search-form-item .el-form-item--large {
  margin-bottom: 0;
}
::v-deep .search-form-item .el-form-item {
  margin-bottom: 0;
}
// el-transfer的头部不显示
::v-deep .el-transfer-panel__header {
  display: none;
}
// el-transfer的宽度
::v-deep .el-transfer-panel {
  width: 387px;
}
::v-deep .el-checkbox {
  margin-right: 15px;
}
// el-transfer的按钮
::v-deep .el-transfer__buttons {
  width: 46px;
  padding: 0 10px;
}
::v-deep .el-button--large {
  --el-button-size: 20px;
  padding: 10px 5px;
}
::v-deep .el-button + .el-button {
  margin-left: 0;
}
::v-deep .recipient-form-item .el-form-item__error {
  left: 433px;
}
// el-transfer的头部自定义内容
.transfer-title {
  height: 40px;
  width: 387px;
  padding-left: 15px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  background-color: var(--theme-container-bg-color);
}
</style>
```
