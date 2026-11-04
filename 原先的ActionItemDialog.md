# 原先的ActionItemDialog.vue代码 
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
                <label class="dialog-field-label">
                  Owner <span class="required-mark">*</span>
                </label>
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

          <!-- Attachments -->
          <div class="attachments-section">
            <div class="attachments-toolbar">
              <div class="attachments-heading">
                Attachments
                <span class="attachments-count">
                  ({{ attachmentList.length }})
                </span>
              </div>

              <input
                ref="attachmentInput"
                type="file"
                multiple
                class="attachment-file-input"
                @change="handleAttachmentSelect"
              />

              <button
                type="button"
                class="attachment-upload-area"
                @click="openAttachmentPicker"
                @dragover.prevent
                @drop.prevent="handleAttachmentDrop"
              >
                <span class="upload-icon">
                  <v-icon color="white" small>mdi-cloud-upload</v-icon>
                </span>
                <span class="upload-link">Upload Files</span>
                <span class="upload-hint">or drag and drop here</span>
              </button>

              <span class="attachment-limit">
                (Up to 10 files, 100 MB each)
              </span>
            </div>

            <div
              v-if="attachmentList.length"
              class="attachment-table-wrap"
            >
              <table class="attachment-table">
                <thead>
                  <tr>
                    <th>File Name</th>
                    <th>Uploaded By</th>
                    <th class="attachment-actions-heading">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    v-for="item in attachmentList"
                    :key="item._key"
                  >
                    <td>
                      <div class="attachment-file-name">
                        <v-icon
                          class="attachment-file-icon"
                          :color="getFileIconColor(item.name)"
                          small
                        >
                          {{ getFileIcon(item.name) }}
                        </v-icon>
                        <span>{{ item.name }}</span>
                      </div>
                    </td>

                    <td>
                      <div class="attachment-uploader">
                        <span>{{ item.uploadedBy || '—' }}</span>
                        <span
                          v-if="item.uploadedAt"
                          class="attachment-upload-time"
                        >
                          {{ formatAttachmentDate(item.uploadedAt) }}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div class="attachment-actions">
                        <v-btn
                          icon
                          small
                          title="View"
                          @click="viewAttachment(item)"
                        >
                          <v-icon small>mdi-eye</v-icon>
                        </v-btn>

                        <v-btn
                          icon
                          small
                          title="Download"
                          @click="downloadAttachment(item)"
                        >
                          <v-icon small>mdi-download</v-icon>
                        </v-btn>

                        <v-btn
                          v-if="canDeleteAttachments"
                          icon
                          small
                          title="Delete"
                          @click="deleteAttachment(item)"
                        >
                          <v-icon small>mdi-delete</v-icon>
                        </v-btn>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-else class="attachment-empty">
              No attachments
            </div>
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
    attachments: {
      type: Array,
      default: () => [],
    },
    currentUser: {
      type: String,
      default: 'Current User',
    },
    canDeleteAttachments: {
      type: Boolean,
      default: true,
    },
  },

  data () {
    return {
      actionFormValid: false,
      requiredRules: [
        value => !!value || 'This field is required',
      ],
      form: this.createEmptyForm(),
      attachmentList: [],
    };
  },

  watch: {
    visible (val) {
      if (val) {
        this.resetForm();
        this.resetAttachments();
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

    resetAttachments () {
      this.attachmentList = (this.attachments || []).map((item, index) => {
        const name = item.name || item.fileName || 'Unnamed file';

        return {
          ...item,
          name,
          uploadedBy: item.uploadedBy || item.uploader || '',
          uploadedAt: item.uploadedAt || item.createdAt || '',
          url: item.url || item.downloadUrl || '',
          isLocal: false,
          _key: item.id || `existing-${index}-${name}`,
        };
      });
    },

    openAttachmentPicker () {
      if (this.$refs.attachmentInput) {
        this.$refs.attachmentInput.click();
      }
    },

    handleAttachmentSelect (event) {
      const files = Array.from(event.target.files || []);

      this.addAttachments(files);

      // 清空 input，保证再次选择同一个文件也会触发 change
      event.target.value = '';
    },

    handleAttachmentDrop (event) {
      const files = Array.from(
        (event.dataTransfer && event.dataTransfer.files) || [],
      );

      this.addAttachments(files);
    },

    addAttachments (files) {
      if (!files.length) return;

      const maxFiles = 10;
      const maxFileSize = 100 * 1024 * 1024;
      const acceptedFiles = [];
      const rejectedFiles = [];

      files.forEach(file => {
        const currentCount = this.attachmentList.length + acceptedFiles.length;

        if (currentCount >= maxFiles) {
          rejectedFiles.push(`${file.name}（最多上传 10 个文件）`);
          return;
        }

        if (file.size > maxFileSize) {
          rejectedFiles.push(`${file.name}（超过 100 MB）`);
          return;
        }

        acceptedFiles.push(file);
      });

      acceptedFiles.forEach(file => {
        this.attachmentList.push({
          _key: `local-${Date.now()}-${Math.random()}`,
          name: file.name,
          file,
          url: URL.createObjectURL(file),
          uploadedBy: this.currentUser,
          uploadedAt: new Date().toISOString(),
          isLocal: true,
        });
      });

      // 将文件交给父组件，由父组件调用后端上传接口
      if (acceptedFiles.length) {
        this.$emit('upload-files', acceptedFiles);
      }

      if (rejectedFiles.length) {
        this.$emit('upload-error', rejectedFiles);
      }
    },

    viewAttachment (item) {
      const url = item.url || (item.file ? URL.createObjectURL(item.file) : '');

      if (!url) {
        this.$emit('view-attachment', item);
        return;
      }

      window.open(url, '_blank');
    },

    downloadAttachment (item) {
      const url = item.url || (item.file ? URL.createObjectURL(item.file) : '');

      if (!url) {
        this.$emit('download-attachment', item);
        return;
      }

      const link = document.createElement('a');
      link.href = url;
      link.download = item.name || 'attachment';
      link.target = '_blank';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    deleteAttachment (item) {
      if (!item.isLocal) {
        // 已上传附件由父组件调用后端接口删除
        this.$emit('delete-attachment', item);
      }

      if (item.isLocal && item.url) {
        URL.revokeObjectURL(item.url);
      }

      this.attachmentList = this.attachmentList.filter(
        attachment => attachment._key !== item._key,
      );
    },

    getFileIcon (fileName) {
      const extension = (fileName || '').split('.').pop().toLowerCase();

      if (extension === 'pdf') {
        return 'mdi-file-pdf-box';
      }

      if (['xls', 'xlsx', 'csv'].includes(extension)) {
        return 'mdi-file-excel-box';
      }

      if (['doc', 'docx'].includes(extension)) {
        return 'mdi-file-word-box';
      }

      return 'mdi-file-document-outline';
    },

    getFileIconColor (fileName) {
      const extension = (fileName || '').split('.').pop().toLowerCase();

      if (extension === 'pdf') {
        return '#e53935';
      }

      if (['xls', 'xlsx', 'csv'].includes(extension)) {
        return '#16864a';
      }

      return '#64748b';
    },

    formatAttachmentDate (value) {
      const date = new Date(value);

      if (Number.isNaN(date.getTime())) {
        return value;
      }

      return date.toLocaleString();
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
        attachments: this.attachmentList,
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

.attachments-section
  margin-top 22px

.attachments-toolbar
  display flex
  align-items center
  flex-wrap wrap
  gap 12px
  margin-bottom 12px

.attachments-heading
  min-width 170px
  color #17202a
  font-size 16px
  font-weight 700

.attachments-count
  font-weight 400

.attachment-file-input
  display none

.attachment-upload-area
  display flex
  align-items center
  gap 10px
  min-height 46px
  padding 5px 12px
  border 1px solid #cbd5e1
  border-radius 8px
  background #fff
  cursor pointer

.attachment-upload-area:hover
  border-color #1976d2
  background #f8fbff

.upload-icon
  display flex
  align-items center
  justify-content center
  width 32px
  height 32px
  border-radius 50%
  background #1684e8

.upload-link
  color #1976d2
  font-size 15px
  font-weight 700
  white-space nowrap

.upload-hint
  color #64748b
  font-size 14px
  white-space nowrap

.attachment-limit
  color #64748b
  font-size 13px

.attachment-table-wrap
  overflow-x auto
  border 1px solid #d8dee8
  border-radius 6px
  background #fff

.attachment-table
  width 100%
  border-collapse collapse
  color #17202a
  font-size 14px

.attachment-table thead
  background #e8edf5

.attachment-table th
  height 40px
  padding 8px 14px
  text-align left
  font-size 14px
  font-weight 700
  white-space nowrap

.attachment-table td
  height 46px
  padding 7px 14px
  border-top 1px solid #e2e8f0

.attachment-actions-heading
  width 180px
  text-align center !important

.attachment-file-name
  display flex
  align-items center
  gap 8px
  min-width 200px

.attachment-file-icon
  flex-shrink 0

.attachment-uploader
  display flex
  align-items center
  gap 12px
  white-space nowrap

.attachment-upload-time
  color #64748b
  font-size 12px

.attachment-actions
  display flex
  align-items center
  justify-content center
  gap 12px

.attachment-actions .v-icon
  color #64748b

.attachment-actions .v-btn:hover .v-icon
  color #1976d2

.attachment-empty
  padding 18px
  border 1px solid #d8dee8
  border-radius 6px
  color #64748b
  background #fff
  text-align center

@media (max-width: 600px)
  .attachments-heading
    width 100%

  .attachment-limit
    width 100%

  .attachment-table th,
  .attachment-table td
    padding 7px 9px

  .attachment-actions
    gap 2px
</style>
```
