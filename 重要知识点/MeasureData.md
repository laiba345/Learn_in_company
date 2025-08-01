# MeasureDataTable.vue (其中 MeasureData.vue 和 MeasurmentDataTable.vue都是新加的）
```
<template>
  <div>
    <v-layout row wrap>   
      <v-flex xl12 sm12 md12 pa-0>
        <v-data-table
          :headers="headers"
          :pagination.sync="pagination"
          :items="templateObj.data"
          :rows-per-page-items="[15, 50, 100, 200, 500, 1000]"
          class="elevation-1 BlockOffsetTable"
          item-key="id"
          :hide-actions="hidePage"
        >
          <!-- 表单内容 -->
          <template v-slot:items="props">
            <tr>
              <td class="name-width" @mouseenter="showTooltip(props.item.name, 'name-width', 'nameTooltip', 'nameWidth')" @mouseleave="nameTooltip = false">
                <v-tooltip v-if="nameTooltip" bottom :max-width="nameWidth">
                  <template v-slot:activator="{ on }">
                    <div v-on="on" class="tooltip-ellipsis">{{ props.item.name }}</div>
                  </template>
                  <div style="word-break: break-all">{{ props.item.name }}</div>
                </v-tooltip>
                <div v-else class="tooltip-ellipsis">{{ props.item.name }}</div>
              </td>
              <td class="desc-width" @mouseenter="showTooltip(props.item.description, 'desc-width', 'descTooltip', 'descWidth')" @mouseleave="descTooltip = false">
                <v-tooltip v-if="descTooltip" bottom :max-width="descWidth">
                  <template v-slot:activator="{ on }">
                    <div v-on="on" class="tooltip-ellipsis">{{ props.item.description }}</div>
                  </template>
                  <div style="word-break: break-all">{{ props.item.description }}</div>
                </v-tooltip>
                <div v-else class="tooltip-ellipsis">{{ props.item.description }}</div>
              </td>
              <td>
                <div class="ServerIpAddress">
                  <span @click="showAttributesList(props.item.template_id)">{{ props.item.attr_count }}</span>
                </div>
              </td>
              <td>{{ props.item.able === 1 ? 'Enabled' : 'Disabled' }}</td>
              <td>{{ props.item.update_at }}</td>
            </tr>
          </template>
          <template slot="actions-append">
            <div style="display: flex; align-items: center;">
              <span class="mx-4">{{ templateObj.start_index }}-{{ templateObj.end_index }} of {{ templateObj.data_sum }}</span>
              <v-pagination v-model="pageIndex" :length="pages" :total-visible="5"></v-pagination>
              <span class="mx-1">Go to</span>
              <v-select v-model="pageIndex" outline dense class="SelectBlockOffset" :items="pagesCount" style="width:80px;margin-right:10px;" :menu-props="{ bottom: true, offsetY: true }"></v-select>
            </div>
          </template>
        </v-data-table>
        <json-to-excel :jsonData="templateObj.data" excelName="Template"></json-to-excel>
        <!-- <attributes-table-dialog ref="attributesTableDialog" :attributesList="attributesList"></attributes-table-dialog> -->
      </v-flex>            
    </v-layout>
  </div>
</template>

<script>
import JsonToExcel from '../JsonToExcel.vue';
// import AttributesTableDialog from './AttributesTableDialog.vue';
// import Attrib
import publicWays from '../../../../store/publicWays';

export default {
  components: {
    JsonToExcel,
    // AttributesTableDialog
  },
  props: ['templateObj', 'attributesList'],
  data () {
    return {
      nameTooltip: false,
      nameWidth: 400,
      descTooltip: false,
      descWidth: 400,
      pagination: {
        rowsPerPage: 15,
      },
      hidePage: false,
      pageIndex: 1,
      headers: [
        {
          text: 'Record Time',
          value: 'record_time',
          sortable: false,
        },
        {
          text: 'Serial Number',
          value: 'serial_number',
          sortable: false,
        },
        {
          text: 'UUT Type',
          value: 'uut_type',
          sortable: false,
        },
        {
          text: 'Test Item',
          value: 'test_item',
          sortable: false,
        },
        {
          text: 'Status',
          value: 'status',
          sortable: false,
        },
        {
          text: 'Measures',
          value: 'measures',
          sortable: false,
        },
        {
          text: 'Limit Def',
          value: 'limit_def',
          sortable: false,
        },
        {
          text: 'Machine',
          value: 'machine',
          sortable: false,
        },
        {
          text: 'Area',
          value: 'area',
          sortable: false,
        },
        {
          text: 'Container',
          value: 'container',
          sortable: false,
        },
      ],
    };
  },
  computed: {
    pages () {
      if (this.pagination.rowsPerPage == null || this.pagination.totalItems == null) return 0;
      return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage);
    },
    pagesCount() {
      if (this.pagination.rowsPerPage == null || this.pagination.totalItems == null) return [];
      return Array.from({ length: Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage) }, (_, index) => index + 1);
    },
  },
  watch: {
    // 监听template数据，更新表格数据总条数并判断是否展示分页
    templateObj: {
      handler(val) {
        this.pagination.totalItems = val.data_sum;
        // eslint-disable-next-line no-unused-expressions
        this.hidePage = val.data_sum > 15 ? false : true;
      },
      immediate: true,
      deep: true,
    },
    // “分页器划分大小”发生变化，重新请求数据
    'pagination.rowsPerPage': {
      handler(newval, oldval) {
        if (newval !== oldval) {
          this.pageIndex = 1;
          this.$emit('getTemplateQuery', { page: this.pageIndex, page_size: newval }); 
        } 
      },
      immediate: true,
      deep: true,
    },
    // “分页器页码”发生变化，重新请求数据
    pageIndex: {
      handler(newval, oldval) {
        if (newval !== oldval) {
          this.$emit('getTemplateQuery', { page: newval, page_size: this.pagination.rowsPerPage });
        }
      },
    },
    // 监听attributesList长度，判断是否有数据，有数据则打开弹窗展示数据；否则报错
    attributesList: {
      handler(val) {
        if (val.length > 0 && this.$refs.attributesTableDialog) this.$refs.attributesTableDialog.showDialog();
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    // 发送id给父组件，根据id进行查询attributes数据
    showAttributesList(id) {
      this.$emit('getSNAttributes', { template_id: id });
    },
    // 如果单元格一行显示不完整，则出现tooltip
    showTooltip(content, tdClass, tooltip, tooltipWidth) {
      const maxWidth = parseFloat(getComputedStyle(document.querySelector(`.${tdClass}`)).width) - 48;
      const result = publicWays.isshowTooltip(content, 'nowrap');
      this[tooltipWidth] = maxWidth;
      this[tooltip] = result.divWidth > maxWidth;
    }
  }
};
</script>

<style lang='stylus' scoped>
/deep/ table.v-table thead tr {
  background: #F8E8FF !important;
}
/deep/ button.v-btn.v-btn--flat.v-btn--icon.theme--light {
  display: none !important;
}
/deep/ .v-datatable__actions__range-controls {
  display: none;
}
.ServerIpAddress {
  color: #9d4edc;
}
.ServerIpAddress :hover {
  color: #165DFF;
  text-decoration: none;
  cursor: pointer;
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
