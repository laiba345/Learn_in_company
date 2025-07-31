# UserView.vue
```
<template>
  <div class="container">
    <!-- 头部 -->
    <div class="header">
      <div class="header-left">
        <el-select class="header-select" v-model="param.site" clearable placeholder="Select Site">
          <el-option
            v-for="item in siteList"
            :key="item+'A'"
            :label="item"
            :value="item"
          />
        </el-select>
        <el-select class="header-select" v-model="param.bu" clearable placeholder="Select BU">
          <el-option
            v-for="item in buList"
            :key="item+'A'"
            :label="item"
            :value="item"
          />
        </el-select>
        <el-select class="header-select" v-model="param.account_type" clearable placeholder="Select Role">
          <el-option
            v-for="item in ['Operator','Engineer']"
            :key="item+'A'"
            :label="item"
            :value="item"
          />
        </el-select>
        <el-input
          v-model="param.name"
          style="width: 150px; margin-right: 16px"
          placeholder="Input ID or Name"
          @keyup.enter="userListInformation"
        >
          <template #suffix>
            <el-icon style="cursor: pointer;" @click="userListInformation">
              <Search />
            </el-icon>
          </template>
        </el-input>
        <el-button @click="reset">Reset</el-button>
      </div>
      <div class="header-right">
        <el-button color="#5454ff" style="margin-right: 16px;" @click="add">Add</el-button>
        <el-button-group>
          <el-button plain color="#5454ff" @click="importFile">Import</el-button>
          <el-button plain color="#5454ff" @click="download" :loading="btnloading"><i class="iconfont icon-icondownload"></i></el-button>
        </el-button-group>
      </div>
    </div>
    <!-- 表格 -->
    <el-table max-height="700" :data="tableData" border style="width: 100%;margin-top: 30px;" :header-cell-style="{ background:'#f2f2f2',color:'#4e4949' }">
      <el-table-column prop="rowNum" label="ID" width="60"/>
      <el-table-column label="Display Name(EmployeeID)" min-width="120">
      <template #default="scope">
        <span>{{ `${scope.row.english_name}（${scope.row.employee_id}）` }}</span>
      </template>  
      </el-table-column>
      <el-table-column prop="fullname" label="Name" />
      <el-table-column prop="email" label="Email" min-width="140">
        <template #default="scope">
          <div
            class="property-cell row center"
            @mouseenter="checkOverflow(scope.row.email, $event)"
            @mouseleave="currentOverflow.value = false"
          >
            <el-tooltip v-if="currentOverflow" :content="scope.row.email" placement="top" class="custom-tooltip">
              <div style="white-space: nowrap; text-overflow: ellipsis; overflow: hidden;" >{{ scope.row.email }}</div>
            </el-tooltip>
            <div style="white-space: nowrap; text-overflow: ellipsis; overflow: hidden;" v-else>{{ scope.row.email }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="site" label="Site" width="120"/>
      <el-table-column prop="bu" label="BU">
        <template #default="scope">
          <div
            class="property-cell row center"
            @mouseenter="checkBuOverflow(scope.row.bu, $event)"
            @mouseleave="currentBuOverflow.value = false"
          >
            <el-tooltip v-if="currentBuOverflow" :content="scope.row.bu" placement="top" class="custom-tooltip">
              <div style="white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">{{ scope.row.bu }}</div>
            </el-tooltip>
            <div v-else style="white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">{{ scope.row.bu }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="account_type" label="Role">
        <template #default="scope">
          <span>{{ scope.row.admin === 0 ? `${scope.row.account_type}`:`${scope.row.account_type} , Admin` }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Operation" width="210">
      <template #default="scope">
        <el-button text style="border:1px solid #0000ff;color:#0000ff;" size="small" @click="handleEdit(scope.row)">Edit</el-button>
        <el-button text style="border:1px solid #0000ff;color:#0000ff;" size="small" @click="handleReset(scope.row)">Reset</el-button>
        <el-button text style="border:1px solid #dd1e36;color:#dd1e36;" size="small" @click="handleDelete(scope.row)">Delete</el-button>
      </template>
    </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      style="margin-top: 20px;display: flex;justify-content: flex-end;"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[15, 50, 100, 200, 500, 1000]"
      layout="slot, total, prev, pager, next, jumper"
      :total="pageTotal"
      @current-change="handleCurrentChange"
      :hide-on-single-page="pageTotal > 15 ? false : true"
    >
      <template #default>
        <el-select v-model="pageSize" @change="handleSizeChange">
          <el-option v-for="size in [15, 50, 100, 200, 500, 1000]" :key="size" :label="size + ' / page'" :value="size"></el-option>
          <!-- <el-option :label="'ALL'" :value="pageTotal"></el-option> -->
        </el-select>
      </template>
    </el-pagination>
    <!-- add/edit Dialog -->
    <add-or-edit-dialog ref="addoreditDialog" :site-list="siteList" :bu-list="buList" @update-list="updateList"></add-or-edit-dialog>
    <delete-dialog ref="deleteDialog" @update-list="delGetUserList"></delete-dialog>
    <reset-dialog ref="resetDialog"></reset-dialog>
    <import-drawer ref="importdrawer" :site-list="siteList" :bu-list="buList" @update-list="userListInformation"></import-drawer>
  </div>
</template>

<script setup>
import { userList, siteOrbuList } from '@/api/user/user';
import { serverAddr } from '@/api/config';
import AddOrEditDialog from '@/components/user/AddOrEditDialog.vue';
import DeleteDialog from '@/components/user/DeleteDialog.vue';
import ResetDialog from '@/components/user/ResetDialog.vue';
import ImportDrawer from '@/components/user/ImportDrawer.vue';
import { publicWayStore } from '@/stores/publicWay';

// 数据定义
let tableData = ref([]);
let siteList = ref([]);
let buList = ref([]);
const addoreditDialog = ref(null);
const deleteDialog = ref(null);
const resetDialog = ref(null); 
const importdrawer = ref(null);
const param = ref({
  site: '',
  bu: '',
  account_type: '',
  name: ''
});
const currentPage = ref(1);
const pageSize = ref(15);
let btnloading = ref(false);
let pageTotal = ref(0);
let action = ref(null);
let currentOverflow = ref(false); 
let currentBuOverflow = ref(false);

// 挂载调用
onMounted (() => {
    setTimeout(() => {
      getUserList(param);      
    }, 500);
    getSiteOrBuList();
  }
);
// 监听
watch([() => param.value.site,() => param.value.bu,() => param.value.account_type], () => {
  param.value.page_index = 1;
  currentPage.value = 1;
  getUserList(param);
});
// 事件
const reset = () => {
  param.value.site = '';
  param.value.bu = '';
  param.value.account_type = ''; 
  param.value.name = '';
  param.value.page_index = 1;
  currentPage.value = 1;
  getUserList(param);
};
const updateList = () => {
  if (action.value === 'add') {
    param.value.page_index = 1;
    currentPage.value = 1;
  }
  getUserList(param);
  getSiteOrBuList();
};
// add
const add = () => {
  action.value = 'add';
  addoreditDialog.value.open('add');
};
// import
const importFile = () => {
  importdrawer.value.open();
};
// edit
const handleEdit = (row) => {
  action.value = 'edit';
  addoreditDialog.value.open('edit',JSON.parse(JSON.stringify(row, null, 2)));
};
// reset 
const handleReset = (row) => {
  resetDialog.value.open(row.employee_id);
}; 
// delete
const handleDelete = (row) => {
  deleteDialog.value.open(row.employee_id);
};
// 分页页码大小
const handleSizeChange = (val) => {
  param.value.page_size = val;
  getUserList(param);
};
// 分页当前页
const handleCurrentChange = (val) => {
  param.value.page_index = val;
  getUserList(param);
};
// 获取列表数据
const getUserList = async (paramobj) => {
  const { data: res } = await userList(paramobj.value);
  if (!res.status) {
    return ElMessage({
      type: 'error',
      message: `${res.message}`,
      showClose: true,
      duration: 5000
    });
  }
  tableData.value = res.data;
  pageTotal.value = res.data_sum;
};
// 获取bu和site
const getSiteOrBuList = async () => {
  const { data: res } = await siteOrbuList();
  if (!res.status) {
    return ElMessage({
      type: 'error',
      message: `${res.message}`,
      showClose: true,
      duration: 5000
    });
  }
  siteList.value = res.site_list.filter((item) => {
    if (item) return true;
    if (!item) return false;
  });
  buList.value = res.bu_list.filter((item) => {
    if (item) return true;
    if (!item) return false;
  });
};
// 下载文件模版
const download = async () => {
  btnloading.value = true;
  const action = `${serverAddr}/user_management/download_sample/`;
  window.open(action, '_self'); // _self参数设置是为了不跳转到新界面上
  btnloading.value = false;
};
// 查询用户数据
const userListInformation = () => {
  param.value.page_index = 1;
  currentPage.value = 1;
  getUserList(param);
};
const delGetUserList = () => {
  if ((pageTotal.value - 1) % pageSize.value === 0) {
    param.value.page_index = Math.max(currentPage.value - 1, 1);
    currentPage.value = Math.max(currentPage.value - 1, 1);
  }
  getUserList(param);
};
// Email列是否溢出
const checkOverflow = (email, event) => {
  if (!email || email.trim() === '') return currentOverflow.value = false;
  const cell = event.currentTarget;
  const result = publicWayStore().isshowTooltip(email, 'nowrap');
  currentOverflow.value = result.divWidth > cell.offsetWidth;
}; 

// BU列是否溢出
const checkBuOverflow = (bu, event) => {
  if (!bu || bu.trim() === '') return currentBuOverflow.value = false;
  const cell = event.currentTarget;
  const result = publicWayStore().isshowTooltip(bu, 'nowrap');
  currentBuOverflow.value = result.divWidth > cell.offsetWidth;
};
// const resetOverflow = () => {
//   currentOverflow.value = false;
// };

// const resetBuOverflow = () => {
//   currentBuOverflow.value = false;
// };
</script>

<style lang="scss" scoped>
.header{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
  .header-right{
    margin-left: 10px;
  }
}

.header-select {
  width: 140px;
  margin-right: 16px
}

// .email-cell {
//   display: inline-block;
//   overflow: hidden;
//   text-overflow: ellipsis;
//   white-space: nowrap;
//   width: 100%;
// }

// .bu-cell {
//   display: inline-block;
//   overflow: hidden;
//   text-overflow: ellipsis;
//   white-space: nowrap;
//   width: 100%;
// }

.property-cell {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

.demo-pagination-block + .demo-pagination-block {
  margin-top: 10px;
}
.demo-pagination-block .demonstration {
  margin-bottom: 16px;
}
</style>
```
