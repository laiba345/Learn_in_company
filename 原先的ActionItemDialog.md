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
