```
<template>
  <v-dialog
    :value="visible"
    max-width="760"
    persistent
    @input="onDialogInput"
  >
    <v-card color="#f8fafc">
      <v-card-title class="action-dialog-title d-flex align-center">
        <span>Add Action Item</span>
        <v-spacer />
        <v-btn icon class="action-dialog-close" @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-form ref="actionForm" v-model="actionFormValid">
        <v-card-text class="action-dialog-content">
          <div class="action-form-field">
            <label class="dialog-field-label">
              Action Item <span class="required-mark">*</span>
            </label>
            <v-text-field
              v-model="form.task_title"
              :rules="requiredRules"
              outlined
              dense
              hide-details="auto"
              background-color="white"
              placeholder="Enter action item..."
            />
          </div>

          <v-row dense>
            <v-col cols="12" sm="6">
              <div class="action-form-field">
                <label class="dialog-field-label">Owner <span class="required-mark">*</span></label>
                <v-select
                  v-model="form.ownerInfo"
                  :rules="requiredRules"
                  :items="owners"
                  item-text="label"
                  item-value="value"
                  :menu-props="{ offsetY: true }"
                  outlined
                  dense
                  hide-details="auto"
                  background-color="white"
                  placeholder="Select an owner..."
                />
              </div>
            </v-col>
            <v-col cols="12" sm="6">
              <div class="action-form-field">
                <label class="dialog-field-label">Due Date</label>
                <el-date-picker
                  v-model="form.due_date"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="Select a date..."
                  class="action-due-date-picker"
                />
              </div>
            </v-col>
          </v-row>

          <div class="action-form-field mb-0">
            <label class="dialog-field-label">Description</label>
            <v-textarea
              v-model="form.task_content"
              outlined
              rows="4"
              no-resize
              hide-details
              background-color="white"
              placeholder="Enter description..."
            />
          </div>
        </v-card-text>
      </v-form>

      <v-divider />

      <v-card-actions class="action-dialog-actions">
        <v-spacer />
        <v-btn outlined class="standard-action-button" @click="close">
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          depressed
          class="standard-action-button ml-4"
          @click="handleSave"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { DatePicker } from 'element-ui';

const EMPTY_FORM = Object.freeze({
  task_title: null,
  task_content: null,
  ownerInfo: null,
  due_date: null,
  status: 'Open',
});

export default {
  name: 'ActionItemDialog',

  components: {
    elDatePicker: DatePicker,
  },

  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    owners: {
      type: Array,
      default: () => [],
    },
    projectId: {
      type: [String, Number],
      default: null,
    },
  },

  data () {
    return {
      actionFormValid: false,
      requiredRules: [
        value => !!value || 'This field is required',
      ],
      form: this.createEmptyForm(),
    };
  },

  watch: {
    visible (val) {
      if (val) {
        this.resetForm();
      }
    },
  },

  methods: {
    createEmptyForm () {
      return { ...EMPTY_FORM };
    },

    resetForm () {
      this.form = this.createEmptyForm();
      this.$nextTick(() => {
        if (this.$refs.actionForm) {
          this.$refs.actionForm.resetValidation();
        }
      });
    },

    onDialogInput (val) {
      if (!val) {
        this.close();
      }
    },

    close () {
      this.$emit('update:visible', false);
    },

    buildSavePayload () {
      const { ownerInfo, ...rest } = this.form;

      return {
        ...(ownerInfo || {}),
        ...rest,
        status: this.form.status || 'Open',
        project_id: this.projectId,
      };
    },

    handleSave () {
      if (!this.$refs.actionForm || !this.$refs.actionForm.validate()) {
        return;
      }

      this.$emit('save', this.buildSavePayload());
      this.close();
    },
  },
};
</script>

<style lang="stylus" scoped>
.required-mark
  color #f44336

.standard-action-button
  min-width 100px !important
  font-weight 600
  letter-spacing 0
  text-transform none

.action-dialog-title
  padding 20px 24px 12px
  color #17202a
  font-size 25px
  font-weight 700

.action-dialog-close
  background #edf0f4

.action-form-field
  margin-bottom 6px

.dialog-field-label
  display block
  margin-bottom 7px
  color #17202a
  font-size 15px
  font-weight 700

.action-dialog-actions
  padding 18px 24px

.action-due-date-picker
  width 100% !important

::v-deep .action-due-date-picker .el-input__inner
  height 40px
  background #fff
  color #17202a
  line-height 40px
  border-color rgba(0, 0, 0, 0.42)
  border-radius 4px

::v-deep .action-due-date-picker .el-input__icon
  line-height 40px
</style>

```
# 原先的会议代码
```
<!--
功能说明:
1. 页面高度: 使用 PageFitLayout 按视口计算一屏高度，溢出内容在布局内部滚动。
2. 会议列表: 使用 v-list-item-group 渲染并切换会议；当前 mockMeetings 仅用于布局效果，后续由接口数据替换。
3. 会议详情: 点击历史会议时以纯文本展示名称、时间、地点和项目创建人，历史会议不可编辑。
4. 新建会议: 点击 New Meeting 后显示名称、时间、地点和 Host；Meeting Name 独占一行，Date、Location、Host 在下一行分三列展示，各字段 Label 与输入框同行且统一右对齐；Host 使用项目创建人的 Mock 数据并保持只读。
5. 待办事项: 当前列表最多显示三行并在区域内滚动，底部新增和 More History 操作栏固定；点击待办行打开独立详情弹窗，可修改完成状态、截止日期和描述，历史模式禁止直接勾选并隐藏新增按钮。
6. 新增待办: 新建会议模式点击加号打开表单，仅 Action Item 必填；Owner 未选择时显示为 --，保存后仅追加到本地 Mock 列表。
7. 待办历史: 点击 More History 打开只读表格，支持搜索、固定表头和分页；Open 显示红色，Closed 显示绿色。
8. 会议纪要: 新建模式提供议程与会议记录输入及保存操作；历史模式仅允许查看。
9. 右侧内容区: 新建与历史共用同一份 meetingForm，通过 pageMode 控制编辑（create）或只读（view）。

更新记录:
创建人: Ceci Fang
创建时间: 2026-09-15
最后更新人: Ceci Fang
最后更新时间: 2026-09-18
-->
<template>
  <v-container fluid class="meeting-page pa-0">
    <page-fit-layout :offset="145">
      <v-row no-gutters class="meeting-layout page-fit-scroll flex-nowrap">
        <!-- 左侧会议列表：抽成子组件，数据由父组件传入 -->
        <meeting-sidebar
          v-model="selectedMeetingIndex"
          :meetings="projectMeetings"
          :hasProjectMember="hasProjectMember"
          @new-meeting="openNewMeeting"
          @select-meeting="openHistoryMeeting"
        />

        <!-- 右侧内容区：create / view 共用同一份 meetingForm -->
        <v-col class="meeting-content">
          <v-container fluid class="content-container d-flex flex-column pa-0">
            <!-- 会议基础信息 -->
            <section class="content-section meeting-info-section">
              <!-- 新建会议：可编辑表单 -->
              <template v-if="isCreateMode">
                <v-form ref="meetingForm">
                  <v-row dense>
                    <v-col cols="12" class="meeting-form-field meeting-name-field">
                      <div class="meeting-form-label text-subtitle-2 font-weight-bold">
                        Meeting Name <span class="required-mark">*</span>
                      </div>
                      <v-text-field
                        v-model="meetingForm.subject"
                        :rules="requiredRules"
                        outlined
                        dense
                        hide-details="auto"
                        background-color="white"
                        placeholder="Enter meeting subject"
                        class="meeting-form-control"
                      />
                    </v-col>
                  </v-row>
                  <v-row dense class="mt-1">
                    <v-col cols="12" md="4" class="meeting-form-field">
                      <div class="meeting-form-label text-subtitle-2 font-weight-bold">
                        Date <span class="required-mark">*</span>
                      </div>
                      <div class="meeting-form-control-wrap">
                        <el-date-picker
                          v-model="meetingForm.meeting_time"
                          type="datetime"
                          format="yyyy-MM-dd HH:mm:ss"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="Select meeting time"
                          :clearable="false"
                          class="meeting-time-picker"
                          :class="{ 'is-error': !!formErrors.meeting_time }"
                          @change="handleMeetingTimeChange"
                          @blur="handleMeetingTimeBlur"
                        />
                        <div
                          v-if="formErrors.meeting_time"
                          class="error-text mt-1"
                        >
                          {{ formErrors.meeting_time }}
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="4" class="meeting-form-field">
                      <div class="meeting-form-label text-subtitle-2 font-weight-bold">
                        Location <span class="required-mark">*</span>
                      </div>
                      <v-text-field
                        v-model="meetingForm.location"
                        :rules="requiredRules"
                        outlined
                        dense
                        hide-details="auto"
                        background-color="white"
                        placeholder="Enter meeting location"
                        class="meeting-form-control"
                      />
                    </v-col>
                    <v-col cols="12" md="4" class="meeting-form-field">
                      <div class="meeting-form-label text-subtitle-2 font-weight-bold">Host</div>
                      <v-text-field
                        v-model="meetingForm.host_chinese_name"
                        outlined
                        dense
                        hide-details
                        background-color="white"
                        readonly
                        class="meeting-form-control"
                      />
                    </v-col>
                  </v-row>
                </v-form>
              </template>

              <!-- 查看会议：只读文本 -->
              <template v-else>
                <h1 class="history-meeting-name">{{ meetingForm.subject || '--' }}</h1>
                <div class="history-meeting-meta d-flex align-center">
                  <div class="history-meta-item">
                    <strong>Date：</strong>
                    <span>{{ meetingForm.meeting_time || '--' }}</span>
                  </div>
                  <div class="history-meta-item">
                    <strong>Location：</strong>
                    <span>{{ meetingForm.location || '--' }}</span>
                  </div>
                  <div class="history-meta-item">
                    <strong>Host：</strong>
                    <span>{{ meetingForm.host_chinese_name || '--' }}</span>
                  </div>
                </div>
              </template>
            </section>

            <!-- 参会人 -->
            <section class="content-section attendees-section">
              <div class="attendees-header d-flex align-center justify-space-between">
                <h2 class="section-title">
                  Attendees <span>(Attendance Check)</span>
                </h2>
              </div>
              <v-row class="attendees-list">
                <v-col
                  v-for="attendee in meetingForm.attendees"
                  :key="attendee.id || attendee.user_id"
                  cols="12"
                  sm="6"
                  md="3"
                  class="attendee-item d-flex flex-column"
                >
                  <div class="attendee-line d-flex align-center">
                    <span class="attendee-label">Name：</span>
                    <strong>
                      {{ attendee.user_chinese_name || attendee.user_name || '--' }}
                    </strong>
                    <v-checkbox
                      v-model="attendee.attendance_status"
                      :disabled="isViewMode"
                      :true-value="'1'"
                      :false-value="'0'"
                      dense
                      hide-details
                      class="attendee-checkbox"
                    />
                  </div>

                  <div class="attendee-line attendee-email d-flex align-center">
                    <span class="attendee-label">Email：</span>
                    <span :title="attendee.user_email">
                      {{ attendee.user_email || '--' }}
                    </span>
                  </div>
                </v-col>
              </v-row>
            </section>

            <!-- 待办事项 -->
            <section class="content-section action-section">
              <h2 class="section-title">Action Items <span>(To-Do Items)</span></h2>
              <v-sheet outlined rounded color="white" class="action-panel">
                <div class="action-list">
                  <!-- 本地新增的待办（未入库，随会议一起提交） -->
                  <action-item-row
                    v-for="(item, index) in localActionItems"
                    :key="`local-new-${index}`"
                    :item="item"
                    @click="openEditLocalActionDialog(item)"
                    @close-request="handleCloseRequest(item, 'local')"
                  />
                  <!-- 历史 / 接口返回的待办 -->
                  <action-item-row
                    v-for="item in meetingForm.action_items"
                    :key="item.id"
                    :item="item"
                    @click="openEditActionDialog(item)"
                    @close-request="handleCloseRequest(item, 'remote')"
                  />
                </div>
                <div class="action-footer d-flex align-center">
                  <v-btn
                    v-if="isCreateMode"
                    icon
                    color="primary"
                    class="add-action-button"
                    @click="openActionDialog"
                  >
                    <v-icon large>mdi-plus</v-icon>
                  </v-btn>
                  <v-spacer />
                  <v-btn text color="primary" class="history-button" v-if="isNewMeeting"  @click="openHistoryDialog">
                    More History
                  </v-btn>
                </div>
              </v-sheet>
            </section>

            <!-- 议程 & 会议纪要 -->
            <section class="content-section minutes-section d-flex flex-column">
              <h2 class="section-title">Agenda &amp; Meeting Minutes</h2>
              <v-textarea
                outlined
                hide-details
                no-resize
                background-color="white"
                v-model="meetingForm.meeting_content"
                :readonly="!hasProjectMember"
                class="minutes-input"
              />
              <v-row v-if="isCreateMode || (hasProjectMember && meetingForm.host_chinese_name)" no-gutters align="center" class="meeting-actions">
                <v-spacer />
                <v-btn depressed color="grey" dark class="standard-action-button" :loading="minutesLoading" @click="getLastMinutesData">Load Latest minutes</v-btn>
                <v-btn
                  depressed
                  color="primary"
                  class="standard-action-button ml-4"
                  @click="saveMeeting"
                  :loading="saveMeetingLoading"
                >Save</v-btn>
              </v-row>
            </section>
          </v-container>
        </v-col>
      </v-row>
    </page-fit-layout>

    <!-- 新增 Action Item 弹窗 -->
    <action-item-dialog
      :visible.sync="actionDialogVisible"
      :owners="actionOwners"
      :project-id="requestParams.project_id"
      @save="handleActionItemSaved"
    />

    <!-- Action Item 详情弹窗 -->
    <action-detail-dialog
      :visible.sync="actionDetailDialogVisible"
      :item="actionDetailForm"
      :loading="saveActionLoading"
      :hasProjectMember="hasProjectMember"
      @save="handleActionDetailSaved"
    />

    <!-- Action Item 历史弹窗 -->
    <action-history-dialog
      :visible.sync="historyDialogVisible"
      :items="actionItemsHistory.actions"
      :loading="actionItemsHistory.loading"
    />

    <!-- Action Items(To-Do Items) 单选框点击后弹框 -->
    <v-dialog
      v-model="closeActionConfirmVisible"
      max-width="520"
      persistent
    >
      <v-card>
        <v-card-text class="pa-6" style="font-size: 18px;">
          Confirm to close this action Item? You will no longer be able to edit it after closing!
        </v-card-text>
        <v-card-actions class="px-6 pb-4">
          <v-spacer />
          <v-btn outlined class="standard-action-button" :disabled="closeActionLoading" @click="cancelCloseAction">Cancel</v-btn>
          <v-btn depressed color="primary" class="standard-action-button ml-4" :loading="closeActionLoading" @click="confirmCloseAction">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { siteBuMixin } from '@/utils/mixins';
import { meetingMinutes, scheduler } from '@project_sensing/api/workspace';
import PageFitLayout from '@project_sensing/components/common/PageFitLayout.vue';
import ActionItemRow from '@project_sensing/components/workspace/meeting/ActionItemRow.vue';
import ActionDetailDialog from '@project_sensing/components/workspace/meeting/dialogs/ActionDetailDialog.vue';
import ActionHistoryDialog from '@project_sensing/components/workspace/meeting/dialogs/ActionHistoryDialog.vue';
import ActionItemDialog from '@project_sensing/components/workspace/meeting/dialogs/ActionItemDialog.vue';
import MeetingSidebar from '@project_sensing/components/workspace/meeting/MeetingSidebar.vue';
import { DatePicker } from 'element-ui';
import locale from 'element-ui/lib/locale';
import lang from 'element-ui/lib/locale/lang/en';
import moment from 'moment-timezone';

locale.use(lang);

export default {
  name: 'MeetingMinutes',
  mixins: [siteBuMixin],
  components: {
    elDatePicker: DatePicker,
    PageFitLayout,
    MeetingSidebar,
    ActionItemRow,
    ActionItemDialog,
    ActionDetailDialog,
    ActionHistoryDialog,
  },
  props: {
    currentUser: {
      type: Object,
      default: () => ({}),
    },
    members: {
      type: Array,
      default: () => [],
    },
  },
  data () {
    return {
      // 页面模式：'create' 可编辑（新建），'view' 只读（历史会议 / 默认）
      pageMode: 'view',
      // 空表单模板：新建 / 重置时基于此返回副本
      emptyMeetingForm: {
        subject: null,
        meeting_time: null,
        location: null,
        host_english_name: null,
        host_chinese_name: null,
        host_id: null,
        attendees: [],
        action_items: [],
        meeting_content: null,
        project_id: null,
      },

      // 弹窗显隐
      actionDialogVisible: false,
      actionDetailDialogVisible: false,
      historyDialogVisible: false,

      // 当前选中的会议 / 待办
      selectedActionId: null,
      selectedMeetingIndex: null,
      selectedMeetingId: null,
      isNewMeeting: false,
      // 右侧内容区唯一数据源，create / view 共用
      meetingForm: {
        subject: null,
        meeting_time: null,
        location: null,
        host_english_name: null,
        host_chinese_name: null,
        host_id: null,
        attendees: [],
        action_items: [],
        meeting_content: null,
        project_id: null,
      },

      // 本地新增的待办（未入库），保存会议时随会议一起提交
      localActionItems: [],
      // 当前正在编辑的本地新增待办索引，-1 表示不是本地新增
      editingLocalIndex: -1,

      // 详情弹窗数据源（由列表行传入）
      actionDetailForm: {},

      // 加载状态
      saveMeetingLoading: false,
      saveActionLoading: false,
      minutesLoading: false,

      // 待办 Owner 可选项
      actionOwners: [],

      // 待办历史
      actionItemsHistory: {
        actions: [],
        loading: false,
      },

      // 会议列表
      projectMeetings: [],
      // 表单的必填规则，绑定在 Meeting Name 和 Location上
      requiredRules: [
        value => !!value || 'This field is required',
      ],
      // 控制日期选择器必填提示
      formErrors: {
        meeting_time: '',
      },
      // 控制ActionItemRow.vue 组件点击v-checkbox弹窗是否弹开
      closeActionConfirmVisible: false,
      closeActionLoading: false,
      // 当前要处理哪一条数据
      pendingCloseAction: null,
    };
  },
  computed: {
    // 是否新建（可编辑）模式
    isCreateMode () {
      return this.pageMode === 'create';
    },
    // 是否只读（历史 / 默认）模式
    isViewMode () {
      return this.pageMode === 'view';
    },
    requestParams () {
      return {
        site: this.siteBuObj.site,
        customer: this.siteBuObj.customer,
        project_id: this.$route.query.projectId,
      };
    },
    // 看看是不是项目组成员，是项目组成员可以创建会议
    hasProjectMember() {
      return this.hasPermission(this.currentUser, this.members);
    },
  },
  watch: {
    requestParams: {
      immediate: true,
      deep: true,
      handler (params) {
        if (Object.values(params).every(Boolean)) {
          this.getMeetingList();
          // this.getMembers();
        }
      },
    },
  },
  created() {},
  methods: {
    // 日期选择器变化时，更新错误提示
    handleMeetingTimeChange(value) {
      if (value) this.formErrors.meeting_time = '';
    },
    // 日期选择器失去焦点时，更新错误提示
    handleMeetingTimeBlur() {
      this.formErrors.meeting_time = this.meetingForm.meeting_time ? '' : 'This field is required';
    },
    // === 工具方法：基于 data 里的模板返回一份全新的空表单 ===
    getEmptyMeetingForm (projectId) {
      const template = this.emptyMeetingForm;
      return {
        subject: template.subject,
        meeting_time: template.meeting_time,
        location: template.location,
        host_english_name: template.host_english_name,
        host_chinese_name: template.host_chinese_name,
        host_id: template.host_id,
        attendees: [],
        action_items: [],
        meeting_content: template.meeting_content,
        project_id: projectId || null,
      };
    },

    // === 获取项目所有会议 ===
    getMeetingList () {
      meetingMinutes.getMeetings(this.requestParams).then(({ data: res }) => {
        const { status, data, message } = res;
        if (!status) {
          throw new Error(message);
        }
        console.log(data, '==> get meetings');
        this.projectMeetings = data || [];
      }).catch(err => {
        console.error(err.message);
      });
    },

    // === 新建会议：切到 create 模式，重置表单并填充 PM / 参会人 ===
    openNewMeeting () {
      this.pageMode = 'create';
      this.selectedMeetingId = null;
      this.selectedMeetingIndex = null;

      // 重置日期校验状态
      this.formErrors.meeting_time = '';
      // 清空本地新增待办，避免上一次的残留
      this.localActionItems = [];
      // 先重置一份干净表单，避免残留上一次的数据
      this.meetingForm = this.getEmptyMeetingForm(this.requestParams.project_id);
      scheduler.projectInfor(this.requestParams).then(({ data: res }) => {
        const { status, data, message } = res;
        if (!status) {
          throw new Error(message);
        }

        const allMembers = [...(data.Members || []), ...(data.keyMembers || [])];
        const pmInfor = allMembers.find(u => u.project_role === 'PM') || {};

        this.meetingForm = {
          ...this.meetingForm,
          host_english_name: null,
          host_chinese_name: pmInfor.user_name || '',
          host_id: pmInfor.user_id || null,
          attendees: allMembers.map((item, i) => ({
            project_id: this.requestParams.project_id,
            user_id: item.user_id,
            user_english_name: item.user_name,
            user_chinese_name: item.user_name,
            user_email: item.user_email,
            sort_order: i + 1,
            attendance_status: '0',
          })),
        };
        // 更新TO DO List的action
        this.getOpenActions();
        console.log(data, this.meetingForm, '==> get project information');
      }).catch(err => {
        console.error(err.message);
      });
    },

    // === 打开历史会议：切到 view 模式，把数据灌入共用的 meetingForm ===
    openHistoryMeeting (meeting, index) {
      if (!meeting) return;
      // 切到历史会议时清空本地新增待办
      this.localActionItems = [];
      this.pageMode = 'view';
      this.isNewMeeting = index < 1; // 小于 1 表示是最新的会议，这个时候要显示全部历史action item
      this.selectedMeetingId = meeting.id;
      this.getHistoryMeetingAction({
        ...this.requestParams,
        meeting_id: meeting.id,
      });
    },
    // 参数：customer,site,project_id,meeting_id,status
    // 历史会议只显示和它对应的action item么，只有最新的会议才显示所有open状态的item
    getHistoryMeetingAction (actionParams) {
      meetingMinutes.getMeetings(actionParams).then(({ data: res }) => {
        const { status, data } = res;
        if (status) {
          // eslint-disable-next-line camelcase
          const { action_items, ...rest } = data;
          this.meetingForm = {
            ...rest,
            action_items,
          };
        }
      }).catch(err => {
        console.error(err.message);
      });
    },
    // === 新增 Action Item ===
    openActionDialog () {
      this.actionOwners = this.meetingForm.attendees.map(item => ({
        label: item.user_chinese_name || item.user_name,
        value: {
          owner_id: item.user_id,
          owner_chinese_name: item.user_chinese_name || item.user_name,
          owner_english_name: item.user_english_name || item.user_name,
        },
      }));
      this.actionDialogVisible = true;
      console.log('新增Action');
    },

    // 子组件 ActionItemDialog 保存后回传（新增待办只落到本地数组，不调接口）
    handleActionItemSaved (item) {
      this.localActionItems.push(item);
    },

    // === Action Item 详情（历史 / 接口数据）===
    openEditActionDialog(item) {
      console.log(item, '看看有没有ID');
      this.selectedActionId = item.id;
      // 打开历史详情时清掉本地索引标记
      this.editingLocalIndex = -1;
      this.actionDetailForm = { ...item };
      this.actionDetailDialogVisible = true;
    },

    // === Action Item 详情（本地新增）===
    openEditLocalActionDialog(item) {
      this.editingLocalIndex = this.localActionItems.indexOf(item);
      this.actionDetailForm = { ...item };
      this.actionDetailDialogVisible = true;
    },

    // 子组件 ActionDetailDialog 保存后回传
    handleActionDetailSaved(detailForm) {
      // 本地新增的待办：只更新本地列表，不走接口
      if (this.editingLocalIndex !== -1) {
        this.localActionItems.splice(this.editingLocalIndex, 1, {
          ...this.localActionItems[this.editingLocalIndex],
          ...detailForm,
        });
        this.actionDetailDialogVisible = false;
        return;
      }

      // 以下为历史 / 接口数据的原有逻辑，保持不动
      console.log(detailForm, '看看看看看看看你看着=》》》》》》');
      const actionItem = this.meetingForm.action_items.find(item => item.id === this.selectedActionId);
      console.log(actionItem, '||==》', detailForm);
      this.saveActionLoading = true;
      const params = {
        ...this.requestParams,
        meeting_id: actionItem.meeting_id,
      };
      const payload = [{
        ...this.getChangedFields(actionItem, detailForm),
        id: detailForm.id,
      }];
      meetingMinutes.updateActionItem(payload, params).then(({ data: res }) => {
        const { status } = res;
        if (status) {
          // 更新TO DO List的action
          // this.getOpenActions();
          if (this.selectedMeetingId) {
            this.getHistoryMeetingAction({ ...this.requestParams, meeting_id: this.selectedMeetingId });
          } else {
            this.getOpenActions();
          }
          this.showMessage('success', 'Save action item successfully');
          this.actionDetailDialogVisible = false;
        }
      }).catch(err => {
        console.error(err.message);
        this.showMessage('error', 'Save action item failed');
      }).finally(() => {
        this.saveActionLoading = false;
      });
    },
    // 获取当前所有Open的Meeting Actions
    getOpenActions() {
      meetingMinutes.getActionItems(this.requestParams).then(({ data: res }) => {
        const { status, data } = res;
        if (status) {
          this.meetingForm.action_items = data.filter(item => item.status === 'Open');
        }
      }).catch(err => {
        console.error(err.message);
      }).finally(() => {
      });
    },
    // 编辑Action Item 只需要提交有变化的
    getChangedFields (oldData, newData) {
      const fields = [
        'task_title',
        'task_content',
        'owner_id',
        'owner_chinese_name',
        'owner_english_name',
        'due_date',
        'status',
      ];
      const result = {};
      fields.forEach(field => {
        if (oldData[field] !== newData[field]) {
          result[field] = newData[field];
        }
      });
      return result;
    },
    // === Action Item 历史 ===
    openHistoryDialog () {
      this.historyDialogVisible = true;
      this.actionItemsHistory.loading = true;

      meetingMinutes.getActionItems(this.requestParams).then(({ data: res }) => {
        const { status, data } = res;
        if (status) {
          this.actionItemsHistory.actions = data.map((item, i) => {
            item.no = i + 1;
            item.created_at = moment(item.created_at).format('YYYY-MM-DD');
            return item;
          });
        }
      }).catch(err => {
        console.error(err.message);
      }).finally(() => {
        this.actionItemsHistory.loading = false;
      });
    },

    // === 保存会议 ===
    saveMeeting () {
      if (this.isCreateMode) {
        // 1. 校验 Date
        this.formErrors.meeting_time = this.meetingForm.meeting_time ? '' : 'This field is required';
        // 2. 校验Meeting Name、Location
        const isFormValid = this.$refs.meetingForm && this.$refs.meetingForm.validate();
        // 任意必填项校验失败，都阻止保存
        if (!isFormValid || !this.meetingForm.meeting_time) return;
        // 3. 校验全部通过
        this.saveMeetingLoading = true;
        const payload = {
          ...this.meetingForm,
          action_items: this.localActionItems,
          project_id: this.requestParams.project_id,
        };
        meetingMinutes.createMeeting(payload, this.requestParams).then(({ data: res }) => {
          const { status, message } = res;
          if (!status) {
            throw new Error(message);
          }
          console.log('==> create meeting ==>');
          this.showMessage('success', 'Save meeting successfully');
          // 保存成功后回到只读模式并刷新列表
          this.pageMode = 'view';
          // 保存成功后清空本地新增待办
          this.localActionItems = [];
          this.getMeetingList();
          // 更新TO DO List的action
          this.getOpenActions();
        }).catch(err => {
          console.error(err.message);
        }).finally(() => {
          this.saveMeetingLoading = false;
        });
      } else {
        // 历史模式：仅更新会议纪要
        this.saveMeetingLoading = true;
        const payload = {
          id: this.selectedMeetingId,
          meeting_content: this.meetingForm.meeting_content,
        };
        meetingMinutes.updateMeeting(payload, this.requestParams).then(({ data: res }) => {
          const { status, message } = res;
          if (!status) throw new Error(message);
          this.showMessage('success', 'Update meeting successfully');
          this.getMeetingList();
        }).catch(err => {
          this.showMessage('error', err.message || 'Update meeting failed');
        }).finally(() => {
          this.saveMeetingLoading = false;
        });
      }
    },
    getLastMinutesData() {
      // 已有内容时先确认，避免覆盖用户已填写的纪要
      if (this.meetingForm.meeting_content && this.meetingForm.meeting_content.trim()) {
        this.$Modal.confirm({
          title: 'Overwrite Existing Minutes?',
          content: 'Meeting minutes already have content. Continuing will overwrite the existing content. Are you sure you want to continue?',
          okText: 'Continue',
          cancelText: 'Cancel',
          onOk: () => {
            this.loadLastMinutes();
          },
          onCancel: () => {
            // 用户取消，什么都不做
          },
        });
        return;
      }
      this.loadLastMinutes();
    },
    // 实际请求逻辑
    loadLastMinutes() {
      this.minutesLoading = true;
      meetingMinutes.getLastMinutes(this.requestParams).then(({ data: res }) => {
        const { status, message, data } = res;
        if (status) {
          this.meetingForm.meeting_content = data;
        } else {
          this.$Message.error(message);
          throw new Error(message);
        }
      }).catch(err => {
        this.$Message.error(err);
        console.error(err);
      }).finally(() => {
        this.minutesLoading = false;
      });
    },
    // 统一调用页面消息组件，组件不存在时不执行提示。
    showMessage (type, message) {
      if (this.$Message) {
        this.$Message[type](message);
      }
    },
    // 判断当前用户有没有操作权限，必须要属于这个项目的成员，编辑 Action Item 也是
    hasPermission(user, data) {
      return data.some(item => item.user_id === user.id);
    },
    handleCloseRequest(item, source) {
      this.$set(item, 'isPendingClose', true);
      this.pendingCloseAction = {
        item,
        source,
      };
      this.closeActionConfirmVisible = true;
    },
    cancelCloseAction() {
      if (this.closeActionLoading) return;
      if (this.pendingCloseAction && this.pendingCloseAction.item) {
        this.$set(this.pendingCloseAction.item, 'isPendingClose', false);
      }
      this.closeActionConfirmVisible = false;
      this.pendingCloseAction = null;
    },

    async confirmCloseAction() {
      if (!this.pendingCloseAction || this.closeActionLoading) return;
      const { item, source } = this.pendingCloseAction;
      // 已经关闭的待办不重复处理
      if (item.status === 'Closed') {
        this.closeActionConfirmVisible = false;
        this.pendingCloseAction = null;
        return;
      }
      // 尚未保存到后端的本地待办，只更新本地状态
      if (source === 'local') {
        const index = this.localActionItems.indexOf(item);
        if (index !== -1) {
          this.$set(this.localActionItems, index, {
            ...item,
            status: 'Closed',
            isPendingClose: false,
          });
        }
        this.closeActionConfirmVisible = false;
        this.pendingCloseAction = null;
        return;
      }
      // 已存在于后端的待办，复用原有更新接口
      this.closeActionLoading = true;
      try {
        const params = {
          ...this.requestParams,
          meeting_id: item.meeting_id,
        };
        const payload = [{ id: item.id, status: 'Closed' }];
        const res = await meetingMinutes.updateActionItem(payload, params);
        const { status } = res;
        if (status) {
          // 沿用原有的列表刷新逻辑
          if (this.selectedMeetingId) {
            await this.getHistoryMeetingAction({
              ...this.requestParams,
              meeting_id: this.selectedMeetingId,
            });
          } else {
            await this.getOpenActions();
          }
          this.$Message.success('Action item closed successfully');
          this.closeActionConfirmVisible = false;
          this.pendingCloseAction = null;
        }
      } catch (error) {
        this.$Message.error('Failed to close action item');
      } finally {
        if (this.pendingCloseAction && this.pendingCloseAction.item) {
          this.$set(this.pendingCloseAction.item, 'isPendingClose', false);
        }
        this.closeActionLoading = false;
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.meeting-page
  color #17202a
  background #f3f3f3

  .meeting-layout
    height 100%
    padding 12px 10px 24px 22px
    box-sizing border-box

  // 注意：.meeting-sidebar / .meeting-list 等左侧列表样式已迁移到 MeetingSidebar.vue

  .meeting-content
    flex 1 1 auto
    min-width 0
    min-height 0
    padding-left 29px

    .content-container
      height 100%

    .content-section
      padding 10px 18px

    .meeting-info-section
      padding-top 3px
    .history-meeting-name
      margin 0 0 12px
      font-size 26px
      line-height 34px

    .history-meta-item
      min-width 0
      padding 0 52px
      border-right 1px solid #bdc5d1
      font-size 15px

      &:first-child
        padding-left 0

      &:last-child
        border-right 0

      strong
        margin-right 8px

    .required-mark
      color #f44336

    .meeting-form-field
      display flex
      align-items flex-start
      min-width 0

      .meeting-form-label
        flex 0 0 130px
        padding-right 12px
        text-align right
        white-space nowrap
        height 40px
        line-height 40px

      .meeting-form-control-wrap
        flex 1 1 auto
        min-width 0

      .meeting-form-control,
      .meeting-time-picker
        flex 1 1 auto
        min-width 0

    .attendees-list
      margin-top 10px
      align-items stretch

      .attendee-item
        min-width 0
        min-height 60px
        padding 2px 12px

      .attendee-line
        display flex
        align-items center
        min-width 0
        min-height 28px
        font-size 14px

      .attendee-label
        flex 0 0 auto
        margin-right 6px

      .attendee-line strong
        flex 1 1 auto
        min-width 0
        overflow-wrap anywhere

      .attendee-checkbox
        flex 0 0 auto
        margin 0 0 0 8px
        padding 0

      .attendee-email > span:last-child
        flex 1 1 auto
        min-width 0
        overflow hidden
        text-overflow ellipsis
        white-space nowrap

    .section-title
      margin-bottom 4px
      font-size 17px
      line-height 22px

      span
        font-weight 400

    .action-panel
      overflow hidden

      .action-list
        max-height 174px
        overflow-y auto
        padding 0 16px

      .action-footer
        min-height 54px
        padding 4px 16px

    .minutes-section
      flex 1 1 auto
      min-height 220px
      padding-bottom 0

      .minutes-input
        flex 1 1 auto
        min-height 160px

      .meeting-actions
        flex 0 0 auto
        padding-top 16px

.standard-action-button
  min-width 100px !important
  font-weight 600
  letter-spacing 0
  text-transform none

::v-deep .attendee-checkbox .v-input--selection-controls__input
  margin-right 0

.meeting-time-picker,
.action-due-date-picker,
.action-detail-date-picker
  width 100% !important

::v-deep .meeting-time-picker .el-input__inner,
::v-deep .action-due-date-picker .el-input__inner,
::v-deep .action-detail-date-picker .el-input__inner
  height 40px
  background #fff
  color #17202a
  line-height 40px

::v-deep .meeting-time-picker .el-input__icon,
::v-deep .action-due-date-picker .el-input__icon,
::v-deep .action-detail-date-picker .el-input__icon  line-height 40px

::v-deep .meeting-time-picker .el-input__inner,
::v-deep .action-due-date-picker .el-input__inner
  border-color rgba(0, 0, 0, 0.42)
  border-radius 4px

.history-button
  font-weight 700
  letter-spacing 0
  text-transform none

::v-deep .minutes-input .v-input__control,
::v-deep .minutes-input .v-input__slot
  height 100%
  min-height 160px

::v-deep .meeting-time-picker.is-error .el-input__inner,
::v-deep .meeting-time-picker.is-error .el-input__inner:hover,
::v-deep .meeting-time-picker.is-error .el-input__inner:focus,
::v-deep .meeting-time-picker.is-error .el-input.is-active .el-input__inner
  border-color #f44336 !important

.error-text
  color #f44336
  font-size 12px
  margin-left 12px
</style>
```
# 原先的ActionDetailDialog.vue代码
```
<template>
  <v-dialog
    :value="visible"
    max-width="1040"
    persistent
    @input="onDialogInput"
  >
    <v-card color="#f8fafc">
      <v-card-title class="action-dialog-title d-flex align-center">
        <span class="action-dialog-name">{{ form.task_title }}</span>
        <v-checkbox
          v-model="form.status"
          true-value="Closed"
          false-value="Open"
          dense
          hide-details
          class="action-dialog-checkbox"
        />
        <v-spacer />
        <v-btn icon class="action-dialog-close" @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="action-dialog-content action-detail-dialog-content">
        <v-row no-gutters class="action-detail-meta">
          <v-col cols="12" md="4" class="action-detail-meta-item">
            <span>Owner:</span>
            <strong>{{ form.owner_chinese_name || item.owner_english_name || '--' }}</strong>
          </v-col>
          <v-col cols="12" md="4" class="action-detail-meta-item action-detail-due-date">
            <span>Due Date:</span>
            <el-date-picker
              v-model="form.due_date"
              type="date"
              format="yyyy.MM.dd"
              value-format="yyyy-MM-dd"
              placeholder="Select a date..."
              :clearable="false"
              class="action-detail-date-picker"
            />
          </v-col>
        </v-row>

        <div class="action-form-field action-detail-description mb-0">
          <label class="dialog-field-label">Description:</label>
          <v-textarea
            v-model="form.task_content"
            outlined
            rows="5"
            no-resize
            hide-details
            background-color="white"
            placeholder="Enter description..."
          />
        </div>
      </v-card-text>

      <v-divider />

      <v-card-actions class="action-dialog-actions">
        <v-spacer />
        <v-btn outlined class="standard-action-button" @click="close">
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          depressed
          class="standard-action-button ml-4"
          :loading="loading"
          :hasProjectMember="!hasProjectMember"
          @click="handleSave"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { DatePicker } from 'element-ui';

const EMPTY_FORM = Object.freeze({
  task_title: null,
  task_content: null,
  owner_id: null,
  owner_chinese_name: null,
  owner_english_name: null,
  due_date: null,
  status: 'Open',
});

export default {
  name: 'ActionDetailDialog',

  components: {
    elDatePicker: DatePicker,
  },

  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      default: () => ({}),
    },
    loading: {
      type: Boolean,
      default: false,
    },
    hasProjectMember: {
      type: Boolean,
      default: true,
    },
  },

  data () {
    return {
      form: this.createEmptyForm(),
    };
  },

  watch: {
    visible(val) {
      if (val) {
        this.form = this.createFormFromItem(this.item);
      } else {
        this.form = this.createEmptyForm();
      }
    },
    form: {
      handler (newVal, oldVal) {
        console.log('form changed:', newVal, 'old==>', oldVal);
      },
      deep: true,
    },
  },

  methods: {
    createEmptyForm () {
      return { ...EMPTY_FORM };
    },

    createFormFromItem (item = {}) {
      return {
        ...this.createEmptyForm(),
        ...item,
      };
    },

    onDialogInput (val) {
      if (!val) {
        this.close();
      }
    },

    close () {
      this.$emit('update:visible', false);
    },

    handleSave () {
      this.$emit('save', { ...this.form });
    },
  },
};
</script>

<style lang="stylus" scoped>
.standard-action-button
  min-width 100px !important
  font-weight 600
  letter-spacing 0
  text-transform none

.action-dialog-title
  padding 20px 24px 12px
  color #17202a
  font-size 25px
  font-weight 700

.action-dialog-name
  overflow hidden
  text-overflow ellipsis
  white-space nowrap

.action-dialog-checkbox
  flex 0 0 auto
  margin 0 0 0 20px
  padding 0

.action-dialog-close
  background #edf0f4

.action-detail-meta-item
  display flex
  align-items center
  color #17202a
  font-size 16px

  &:first-child
    padding-left 0

  span
    flex 0 0 auto
    margin-right 18px
    color #657087

  strong
    font-weight 500

.action-detail-due-date
  padding-right 0

::v-deep .action-detail-date-picker .el-input__inner
  height 40px
  background #fff
  color #17202a
  line-height 40px
  border 1px solid #c8d1df
  border-radius 6px
  font-size 16px
  font-weight 500

::v-deep .action-detail-date-picker .el-input__icon
  line-height 40px

.action-detail-description .dialog-field-label
  color #657087
  font-weight 400

::v-deep .action-detail-description textarea
  color #17202a
  font-size 16px
  line-height 1.6

.action-form-field
  margin-bottom 6px

.dialog-field-label
  display block
  margin-bottom 7px
  color #17202a
  font-size 15px
  font-weight 700

.action-dialog-actions
  padding 18px 24px

.action-detail-date-picker
  width 100% !important
</style>
```
