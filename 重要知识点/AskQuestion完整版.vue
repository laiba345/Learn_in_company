# AskQuestion完整版.vue 
```
<template>
  <v-bottom-sheet v-model="openQuestion" :persistent="true" :hide-overlay="true" full-width color="rgb(33, 150, 243)"
    eager no-transition>
    <v-container grid-list-xl fluid pa-0>
      <v-layout row wrap>
        <v-flex lg12 xs12 sm12 md12>
          <v-list>
            <!-- question -->
            <!-- 修改后的结构 -->
            <div class="iconCounter">
              <div class="topLeft">
                <v-tooltip right>
                  <v-icon class="closeIcon" @click="closeQuestion" slot="activator" dark
                  >clear</v-icon>
                  <span>To Close Question</span>
                </v-tooltip>
                <time-counter :start="startCounter" :stop="!startCounter"></time-counter>
              </div>
              <span class="font-weight-regular red--text">
                {{ container }}
              </span>
            </div>
            <!-- image -->
            <v-flex lg12 xs12 sm12 md12 mt-0 pb-0 v-if="image">
              <div style="display: flex;">
                <img class="imgStyle" v-bind:src="image" v-bind:alt="'Could not display ' + image"
                 @click="showFullscreen = true" />
                <v-dialog v-model="showFullscreen" persistent content-class="fullscreen-dialog"
                  @keydown.esc="handleClose">
                  <div class="imgDialog" @click="handleClose">
                    <div style="position: relative" @wheel.prevent="handleWheel">
                      <img :style="{
                        transform: `scale(${zoomScale})`,
                        transition: 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                        maxWidth: '90vw',
                        maxHeight: '90vh',
                        objectFit: 'contain',
                      }" v-bind:src="image" v-bind:alt="'Could not display ' + image" />
                    </div>
                  </div>
                </v-dialog>
              </div>
            </v-flex>

            <!-- Single Question input of AskQuestion -->
            <v-flex lg12 xs12 sm12 md12 pt-0 pb-0 class="singleQuestionInput" v-if="type === 'text' && !Questions && attribute.length === 0" >
              <template>
                <div class="titleSearch">
                  <div >
                    <div v-if="typeof title == 'string'" class="titleStyleBase titleStyle">
                      <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                          <span v-bind="attrs" v-on="on">{{ container }}</span>
                        </template>
                        <span>{{ container }}</span>
                      </v-tooltip>
                    </div>
                    <div v-else style="margin-top: 30px;">
                      <div class="titleStyleBase titleStyleAnother" v-for="(item, index) in titleObj" :key="index">
                        <v-tooltip top v-if="item.istooltip">
                          <template v-slot:activator="{ on, attrs }">
                            <div class="tooltip-ellipsis" v-bind="attrs" v-on="on">{{ item.title }}</div>
                          </template>
                          <div>{{ item.title }}</div>
                        </v-tooltip>
                        <div v-else>{{ item.title }}</div>
                      </div>
                    </div>
                  </div>
                  <v-text-field ref="searchInput" class="singleInputStyle" style="font-size: 20px; margin: 6px 8px 0 8px;" 
                    autofocus outline clearable solo :type="textType" v-model="userInput"
                    label="Type Your Input Here" v-on:keyup.enter="onEnter">
                  </v-text-field>
                </div>
              </template>
              <v-btn slot="append-outer" class="submitButtonSingleQuestion" @click="submitUserInputSingleQuestion">
                Submit
              </v-btn>
            </v-flex>

            <!-- Multi Question input -->
            <div class="multiQuestion">
              <v-flex lg12 xs12 sm12 md12 pt-0 pb-0 v-if="type === 'text' && Questions && attribute.length > 0">
                <div :class="attribute.length > 4 ? 'scrollMultiQuestionMore' : 'scrollMultiQuestionInput'">
                  <v-layout row v-for="(item, index) in attribute" :key="index" style="margin-top: 1px">
                    <div class="multiQuestionName" :style="{ fontSize: '20px', margin: '3px 8px 0px 15px', width: `${maxQuestionWidth}px` }">
                      {{ item.question }}
                    </div>
                    <v-text-field :ref="`searchInput${index}`" :class="index === attribute.length - 1 ? 'inputStyle inputTopStyle' : 'inputStyle'" :type="textTypes[index]"
                      v-model="userInputs[index]" label="Type Your Input Here"
                      @keyup.enter="focusNext(`searchInput${index}`, index)" 
                      :rules="matchInputs[index]" @blur="setValidationRule(index)" @focus="clearValidationRule(index)"
                      :autofocus="index === 0" outline clearable solo>
                    </v-text-field>
                  </v-layout>
                </div>
                <!-- @change="handleSelectChange(index)" -->
                <div class="submitButtonMore">
                  <v-btn slot="append-outer" @click="submitUserInputMultiQuestion">
                    Submit
                  </v-btn>
                </div>
              </v-flex>
            </div>
            <!-- Single Question select -->
            <v-flex lg12 xs12 sm12 md12 pt-0 pb-0 v-if="type === 'select' && !Questions" style="margin-bottom: 34px">
              <v-layout row>
                <div class="titleSearch">
                <div>
                  <div v-if="typeof title == 'string'" class="titleStyleBase titleSelectStyle">
                    {{ container }}
                  </div>
                  <div v-else>
                    <div class="titleStyleBase titleSelectStyle titleSelectStyleAnother" v-for="(item, index) in titleObj" :key="index">
                      <v-tooltip top v-if="item.istooltip">
                        <template v-slot:activator="{ on, attrs }">
                          <div class="tooltip-ellipsis" v-bind="attrs" v-on="on">{{ item.title }}</div>
                        </template>
                        <div>{{ item.title }}</div>
                      </v-tooltip>
                      <div v-else>{{ item.title }}</div>
                    </div>
                  </div>
                </div>
                <v-select ref="singleSelect" class="singleSelectStyle" :items="options"
                  style="font-size: 20px; margin: 8px 20px 12px 20px" outline clearable solo :multiple="multiple"
                  v-model="userInput" label="Select Your Option Here" :error-messages="selectError"
                  :rules="matchSingleSelect" @blur="
                    matchSingleSelect = [(v) => validateMultiSelectInput(v)]
                    " @focus="handleSingleSelectRule">
                  <template v-slot:prepend-item v-if="multiple">
                    <v-list-tile ripple @click="toggleSelect">
                      <v-list-tile-action>
                        <v-icon :color="userInput.length > 0 ? 'indigo darken-4' : ''">{{ selectIcon }}</v-icon>
                      </v-list-tile-action>
                      <v-list-tile-content>
                        <v-list-tile-title>Select All</v-list-tile-title>
                      </v-list-tile-content>
                    </v-list-tile>
                    <v-divider class="mt-2"></v-divider>
                  </template>
                </v-select>
                </div>
                <v-btn slot="append-outer" class="submitButtonSingleQuestion" @click="submitUserInputSingleQuestion">
                  Submit
                </v-btn>
              </v-layout>
            </v-flex>
            <!-- Multi Question select -->
            <div class="multiQuestion">
              <v-flex lg12 xs12 sm12 md12 pt-0 pb-0 v-if="type === 'select' && Questions">
                <div ref="scrollContainer" :class="attribute.length > 4 ? 'scrollMultiQuestionMore' : 'scrollMultiQuestion'">
                  <v-layout row v-for="(item, index) in attribute" :key="index" style="margin-top: 1px" :ref="`itemRef${index}`">
                    <div class="multiQuestionName" :style="{ fontSize: '20px', margin: '3px 2px 0px 15px', width: `${maxQuestionWidth}px` }">
                      {{ item.question }}
                    </div>
                    <v-select :ref="`multiSelect${index}`" :class="index === attribute.length - 1 ? 'inputStyle inputTopStyle' : 'inputStyle'" v-bind:key="index"
                      :items="item.answers" style="font-size: 20px" outline clearable solo :autofocus="index === 0"
                      :error-messages="selectErrors[index]" :multiple="item.multiple"
                      v-model="userInputMultiSelect[index]" label="Select Your Option Here"
                      @blur="handleMultiSelect(index)" @focus="handleSelectRules(index)" @change="handleSelectChange(index, item.multiple)" @input="handleSelectInput(index, item.multiple)" >
                      <template v-slot:prepend-item v-if="item.multiple">
                        <v-list-tile ripple @click="toggleMultiSelect(index)">
                          <v-list-tile-action>
                            <v-icon :color="userInputMultiSelect[index] &&
                              userInputMultiSelect[index].length > 0
                              ? 'indigo darken-4'
                              : ''
                              ">{{ multiSelectIcon(index) }}</v-icon>
                          </v-list-tile-action>
                          <v-list-tile-content>
                            <v-list-tile-title>Select All</v-list-tile-title>
                          </v-list-tile-content>
                        </v-list-tile>
                        <v-divider class="mt-2"></v-divider>
                      </template>
                    </v-select>
                  </v-layout>
                </div>
                <div class="submitButtonMore">
                  <v-btn slot="append-outer" @click="submitUserInputMultiSelectQuestion">
                    Submit
                  </v-btn>
                </div>
              </v-flex>
            </div>
          </v-list>
        </v-flex>
      </v-layout>
    </v-container>
  </v-bottom-sheet>
</template>

<script>
import TimeCounter from '../components/TimeCounter';
import publicWays from '../../../store/publicWays';
import { debounce } from 'lodash'; 

export default {
  components: {
    TimeCounter,
  },
  props: {
    title: {
      type: [String, Array],
      default: [],
    },
    open: Boolean,
    type: String,
    options: Array,
    image: String,
    container: String,
    visible: String,
    multiple: Boolean,
    attribute: {
      type: Array,
      default: () => [],
    },
    Questions: Boolean,
  },
  data() {
    return {
      currentTime: null,
      showFullscreen: false,
      zoomScale: 1,
      minScale: 0.5,
      maxScale: 3,
      userInput: Object,
      userInputs: [],
      matchInputs: [],
      userInputMultiSelect: [],
      userInputMultify: [],
      userInputObject: [],
      maxQuestionWidth: 430,
      resizeObserver: null,
      startCounter: false,
      selectError: '',
      selectErrors: [],
      arrTitle: [],
      matchSingleSelect: [],
      scrollDistance: 0, 
      maxScrollDistance: 50, 
      titleObj: [{
        title: 'MAC',
        istooltip: false
      }], 
      debounceHandlers: {}, // 用于存储防抖函数
    };
  },
  computed: {
    openQuestion() {     
      return this.open;
    },
    textType() {
      if (this.visible === 'YES') {
        return 'text';
      }
      return 'password';
    },
    textTypes() {
      return this.attribute.map((item) => (item.visible ? 'text' : 'password'));
    },
    likesAllOptions() {
      return this.userInput.length === this.options.length;
    },
    likesSomeOptions() {
      return this.userInput.length > 0 && !this.likesAllOptions;
    },
    selectIcon() {
      if (this.likesAllOptions) return 'check_box';
      if (this.likesSomeOptions) return 'indeterminate_check_box';
      return 'check_box_outline_blank';
    },
  },
  watch: {
    title: {
      handler() {
        this.startCounter = !this.startCounter; 
        this.calculateForInput(); 
        this.calculateForSelect(); 
      },
      immediate: true,
      deep: true,
    },
    open(newVal) {
      if (newVal) {
        this.userInputs = new Array(this.attribute.length).fill('');
        this.matchInputs = new Array(this.attribute.length).fill([]);
        this.userInputMultiSelect = new Array(this.attribute.length).fill([]);
        // recalculate when the popup opens
        this.$nextTick(() => {
          this.calculateMaxWidth();
          // this.calculateIsShowToolTips();
          this.calculateForInput(); 
          this.calculateForSelect(); 
          this.setupResizeObserver();
          this.forceFocusFirstInput();
          if (this.$refs.searchInput) {
            this.$refs.searchInput.focus();
          }
        });
      } else {
        this.cleanupResizeObserver();
      }
    },
    attribute: {
      handler(newVal) {
        this.selectErrors = new Array(newVal.length).fill('');
        // 增加计算逻辑
        this.$nextTick(() => {
          this.calculateMaxWidth();
          this.setupResizeObserver(); 
        });
      },
      immediate: true,
      deep: true
    },
    userInputMultiSelect: {
      deep: true,
      handler(newVal) {
        this.$nextTick(() => {
          newVal.forEach((_, index) => {
            if (this.likesAllMultiOptions(index)) {
              this.closeSelectMenu(index);
            }
          });
        });
      }
    },
    userInput(newVal) {
      if (this.multiple && newVal.length === this.options.length) {
        this.closeSingleSelectMenu();
      }
    }
  },
  mounted() {
    if (this.type === 'text') {
      this.userInput = '';
    } else {
      this.userInput = [];
    }
    this.setupResizeObserver();
    window.addEventListener('resize', this.calculateForInput);
    window.addEventListener('resize', this.calculateForSelect); 
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.calculateForInput);
    window.removeEventListener('resize', this.calculateForSelect); 
  },
  methods: {
    handleWheel(e) {
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      this.zoomScale = Math.min(
        this.maxScale,
        Math.max(this.minScale, this.zoomScale * delta)
      );
    },
    handleClose() {
      this.showFullscreen = false;
      this.zoomScale = 1;
    },
    // calculate questionTitle MaxWidth
    calculateMaxWidth() {
      let width = [];
      this.attribute.forEach((data) => {
        width.push(
          publicWays.isshowTooltip(data.question, 'nowrap', '21px').divWidth
        );
      });
      if (width.length > 0) {
        const max = Math.max(...width);
        this.maxQuestionWidth = max > 1200 ? max - 42 : max > 1000 ? max - 26 : max > 800 ? max - 16 : max + 18;
      }
    },
    calculateIsShowToolTips(className) {
      if (this.title.length < 1) return;
      this.$nextTick(() => {
        let divWidth = parseFloat(getComputedStyle(document.querySelector(`.${className}`)).width);
        this.titleObj = [];
        this.title.forEach((data) => {
          this.titleObj.push(
            { title: data, istooltip: publicWays.isshowTooltip(data, 'nowrap', '20px').divWidth > divWidth }
          );
        });
      }); 
    },
    calculateForInput() {
      this.calculateIsShowToolTips('titleStyleAnother');
    },
    calculateForSelect() {
      this.calculateIsShowToolTips('titleSelectStyleAnother');
    },
    setupResizeObserver() {
      this.resizeObserver = new ResizeObserver(() => {
        this.calculateMaxWidth();
      });
    },
    cleanupResizeObserver() {
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
        this.resizeObserver = null;
      }
    },
    handleSingleSelectRule() {
      this.selectError = '';
      this.matchSingleSelect = [];
    },
    // Multi select focus
    handleSelectRules(index) {
      this.$set(this.selectErrors, index, '');
    },

    createDebounceHandler(index) {
      if (!this.debounceHandlers[index]) {
        this.debounceHandlers[index] = debounce(() => {
          this.$nextTick(() => {
            let nextIndex = index + 1;  
            const selectRef = this.$refs[`multiSelect${nextIndex}`];
            if (selectRef && selectRef[0]) {
              const input = selectRef[0].$el.querySelector('.v-select__slot input');
              if (input) {
                input.focus();
              }
              if (nextIndex === this.attribute.length - 1) {
                const vuetifySelect = selectRef[0];
                vuetifySelect.isFocused = true;
              }
              selectRef[0].$el.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            }
          });
        }, 100); // 300ms 防抖时间
      }
      return this.debounceHandlers[index];
    },

    // Multi select blur
    handleMultiSelect(index) {
      console.log('index1', index); 
      this.$set(this.selectErrors, index, '');
      const userInput = this.userInputMultiSelect[index];
      this.$nextTick(() => {
        // 验证必选：Must Select one at least !
        const isEmptyError = this.validateMultiSelectInput(userInput);
        if (typeof isEmptyError === 'string') {
          this.$set(this.selectErrors, index, isEmptyError);
          // return;
        }
        // 验证是否满足正则表达式：Wrong Format
        const regexError = this.validateInput(userInput, index);
        if (typeof regexError === 'string') {
          this.$set(this.selectErrors, index, regexError);
          // return;
        }
      });
      if (this.userInputMultiSelect[index] && index === 3 || index === 7) {
        console.log('index2', index); 
        this.createDebounceHandler(index)();
        return;
      }
    },

    handleSelectChange(index, isMultiple) {
      if (!isMultiple) {
        this.$nextTick(() => {
          this.closeSelectMenu(index);
        });
      }
    },

    handleSelectInput(index, isMultiple) {
      console.log('用户可以开始输入'); 
      // 判断是否为清除操作（值为空且不是多选）
      if (!isMultiple && this.userInputMultiSelect[index] === null) {
        // 清除时仅聚焦当前框，不触发下一个框的聚焦
        this.$nextTick(() => {
          const currentRef = this.$refs[`multiSelect${index}`];
          if (currentRef && currentRef[0]) {
            const input = currentRef[0].$el.querySelector('.v-select__slot input');
            if (input) {
              // 先失焦所有相关输入框
              this.blurAllSelects();
              // 只聚焦当前框
              input.focus();
            }
          }
        });
      }
    },

    blurAllSelects() {
      this.attribute.forEach((_, idx) => {
        const ref = this.$refs[`multiSelect${idx}`];
        if (ref && ref[0] && ref[0].blur) {
          ref[0].blur();
        }
      });
    },
  
    
    // Submit single input / single select
    submitUserInputSingleQuestion() {
      if (this.type === 'select' && this.userInput.length < 1) {
        this.selectError = 'Must Select one at least !';
        return false;
      }
      this.$emit('answerQuestion', this.userInput, this.container);
      this.$emit('updateAttribute', []);
      this.$emit('updateQuestions', false);
      this.$emit('updateImage', '');
      this.$emit('updateShowQA', false);
      this.selectError = '';
      this.userInput = '';
    },
    // Submit Multi select
    submitUserInputMultiSelectQuestion() {
      let hasError = false;
      let firstErrorIndex = -1; 
      this.selectErrors = new Array(this.attribute.length).fill('');
      this.attribute.forEach((item, index) => {
        const userInput = this.userInputMultiSelect[index];
        // 验证1：检查是否为空
        const isEmptyError = this.validateMultiSelectInput(userInput);
        if (typeof isEmptyError === 'string') {
          this.$set(this.selectErrors, index, isEmptyError);
          if (firstErrorIndex === -1) firstErrorIndex = index; // First Error
          hasError = true;
          return;
        }
        // 验证2：检查正则格式（仅当有输入时）
        const regexError = this.validateInput(userInput, index);
        if (typeof regexError === 'string') {
          this.$set(this.selectErrors, index, regexError);
          if (firstErrorIndex === -1) firstErrorIndex = index; // Second Error
          hasError = true;
        }
      });
      if (hasError && firstErrorIndex !== -1) {
        const selectRef = this.$refs[`multiSelect${firstErrorIndex}`];
        if (selectRef && selectRef[0]) {
          const input = selectRef[0].$el.querySelector('.v-select__slot input');
          if (input) {
            input.focus();
          }
          if (firstErrorIndex === this.attribute.length - 1) {
            const vuetifySelect = selectRef[0];
            vuetifySelect.isFocused = true;
          }
          selectRef[0].$el.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
        return;
      }
      // 提交逻辑...
      this.userInputObject = this.attribute.map((item, index) => ({
        question: item.question,
        answer: this.userInputMultiSelect[index],
      }));
      this.$emit('answerMultiQuestion', this.userInputObject, this.container);
      this.$emit('updateAttribute', []);
      this.$emit('updateQuestions', false);
      this.$emit('updateShowQA', false);
      this.userInputObject = [];
      this.userInputMultiSelect = [];
    },
    // Submit Multi input
    submitUserInputMultiQuestion() {
      this.matchInputs = this.attribute.map((_, i) => [
        (v) => this.validateInput(v, i),
      ]);
      this.$nextTick(() => {
        const refs = this.attribute.map(
          (_, i) => this.$refs[`searchInput${i}`][0]
        );
        const validations = refs.map((ref) => ref.validate());
        const allValid = validations.every((valid) => valid);
        if (allValid) {
          this.userInputMultify = this.attribute.map((item, index) => ({
            question: item.question,
            answer: this.userInputs[index],
          }));
          this.$emit(
            'answerMultiQuestion',
            this.userInputMultify,
            this.container
          );
          this.userInputMultify = [];
          this.$emit('updateAttribute', []);
          this.$emit('updateQuestions', false);
          this.$emit('updateShowQA', false);
          this.userInputs = [];
        } else {
          const firstInvalidIndex = validations.findIndex((valid) => !valid);
          if (firstInvalidIndex !== -1) {
            refs[firstInvalidIndex].focus();
          }
        }
      });
    },
    focusNext(refName, index) {
      const lastInputIndex = this.attribute.length - 1;
      if (index === lastInputIndex) {
        this.submitUserInputMultiQuestion();
      } else {
        const nextRef = `searchInput${index + 1}`;
        if (this.$refs[nextRef]) {
          this.$refs[nextRef][0].focus();
          if (index === 3 || index === 7) {
            this.$refs[nextRef][0].$el.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      }
    },
    onEnter() {
      this.submitUserInputSingleQuestion();
    },
    onEnterMultiQuestion() {
      this.submitUserInputMultiQuestion();
    },
    closeQuestion() {
      this.$emit('closeQuestion');
      this.userInput = '';
      this.userInputs = [];
    },
    toggleSelect() {
      this.$nextTick(() => {
        if (this.likesAllOptions) {
          this.userInput = [];
        } else {
          this.userInput = this.options.slice();
        }
        if (this.likesAllOptions) {
          this.closeSingleSelectMenu();
        }
      });
    },
    safeFocusNextSelect(currentIndex) {
      const nextIndex = currentIndex + 1;
      
      // 确保下一个选择框存在
      if (nextIndex < this.attribute.length) {
        setTimeout(() => {
          const selectRef = this.$refs[`multiSelect${nextIndex}`];
          
          if (selectRef && selectRef[0]) {
            // 使用Vuetify的focus方法
            selectRef[0].focus();
            
            // 滚动到可视区域
            selectRef[0].$el.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }, 150); // 增加延迟确保DOM更新完成
      }
    },
    toggleMultiSelect(index) {
      const item = this.attribute[index] || {};
      const options = item.answers || [];
      const isSelectingAll = !this.likesAllMultiOptions(index);
      if (this.likesAllMultiOptions(index)) {
        this.$set(this.userInputMultiSelect, index, []);
      } else {
        this.$set(this.userInputMultiSelect, index, [...options]);
      }
      this.$set(this.selectErrors, index, '');
      if (isSelectingAll) {
        this.$nextTick(() => {
          this.closeSelectMenu(index);
          
          // 如果是第4个或第8个选择框，延迟聚焦下一个
          if (index === 3 || index === 7) {
            setTimeout(() => {
              // this.focusNextSelect(index);
              this.safeFocusNextSelect(index);
            }, 100);
          }
        });
      }
    },
    // 关闭选择菜单 (Multi select)
    closeSelectMenu(index) {
      const selectRef = this.$refs[`multiSelect${index}`] && this.$refs[`multiSelect${index}`][0];
      if (selectRef && selectRef.blur) {
        selectRef.blur();
      }
    },
    // 关闭选择菜单(Single select)
    closeSingleSelectMenu() {
      const selectRef = this.$refs.singleSelect;
      if (selectRef && selectRef.blur) {
        selectRef.blur();
      }
    },
    // 新增 focusNextSelect 方法 
    focusNextSelect(currentIndex) {
      const nextIndex = currentIndex + 1;
      if (nextIndex < this.attribute.length) {
        const selectRef = this.$refs[`multiSelect${nextIndex}`];
        if (selectRef && selectRef[0]) {
          selectRef[0].focus();
          selectRef[0].$el.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    },
    likesAllMultiOptions(index) {
      const item = this.attribute[index] || {};
      const options = item.answers || [];
      const input = this.userInputMultiSelect[index] || [];
      return input.length === options.length;
    },
    likesSomeMultiOptions(index) {
      const input = this.userInputMultiSelect[index] || [];
      return input.length > 0 && !this.likesAllMultiOptions(index);
    },
    multiSelectIcon(index) {
      if (this.likesAllMultiOptions(index)) return 'check_box';
      if (this.likesSomeMultiOptions(index)) return 'indeterminate_check_box';
      return 'check_box_outline_blank';
    },
    // validate regex
    validateInput(v, index) {
      let regexPattern = this.attribute[index].regex;
      if (regexPattern) {
        regexPattern = regexPattern.replace(/^\/|\/$/g, '');
        regexPattern = '^' + regexPattern + '$';
      }
      const regex = new RegExp(regexPattern);
      if (Array.isArray(v)) {
        if (v.length === 0) return true;
        const allValid = v.every((item) => {
          const strItem = String(item).trim();
          return regex.test(strItem);
        });
        return allValid || 'Wrong Format';
      }
      const strValue = String(v).trim();
      return regex.test(strValue) || 'Wrong Format';
    },
    // validate must select one
    validateMultiSelectInput(v) {
      if (Array.isArray(v) && v.length === 0) {
        return 'Must Select one at least !';
      }
      return !!v || 'Must Select one at least !';
    },
    setValidationRule(index) {
      this.$set(this.matchInputs, index, [(v) => this.validateInput(v, index)]);
    },
    clearValidationRule(index) {
      this.$set(this.matchInputs, index, []);
    },
    forceFocusFirstInput() {
      if (this.type === 'text' && this.Questions) {
        const firstInputRef =
          this.$refs.searchInput0 && this.$refs.searchInput0[0];
        if (firstInputRef) {
          firstInputRef.focus();
        }
      } else if (this.type === 'select' && this.Questions) {
        const firstSelect = document.querySelector('.v-select__slot input');
        if (firstSelect) {
          firstSelect.focus();
        }
      } else if (this.$refs.searchInput) {
        this.$refs.searchInput.focus();
      }
    },

    // 在组件销毁时清理
    beforeDestroy() {
      Object.values(this.debounceHandlers).forEach(handler => handler.cancel());
    }
  },
};
</script>

<style lang='stylus' scoped>
// 整个背景色
.theme--light.v-list {
  background: rgb(31, 151, 244) !important;
  // border: 3px solid rgb(255, 193, 7);
  border: 3px solid white;
  border-radius: 10px;
  color: white !important;
}

.imgStyle {
  display: inline-block;
  margin:-6px auto 6px;
  max-width: 60vh;
  object-fit: cover;
  cursor: zoom-in;
}

.imgDialog {
  position: fixed;
  inset: 0;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: zoom-out;
}

.titleSearch {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.titleStyleBase {
  display: block !important; 
  flex-shrink: 0;   
  max-width: 100% !important; 
  font-size: 20px;
  word-wrap: break-word;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.titleStyle {
  margin: 30px 20px 0px 24px;
}

.titleStyleAnother {
  margin: 0px 20px 0px 8px;
}

.titleSelectStyle {
  margin: 8px 20px 0px 20px;
}

.titleStyleLess {
  display: flex;
  font-size: 22px;
  margin-top: 26px;
  margin-left: 6px;
  max-width: 50%;
  word-wrap: break-word;
  white-space: normal;
}

.closeIcon {
  margin-right: 10px;
  font-weight: 800 !important;
}

.iconCounter {
  position: relative;
  min-height: 32px;
}

.singleQuestionInput {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: -28px;
  margin-bottom: 36px;
}

.topLeft {
  display: flex;
  position: absolute;
  align-items: center;
  margin-left: 16px;
  margin-top: 4px;
}

.multiQuestion {
  margin-top: 12px;
}

.multiQuestionName {
  max-width: 66% !important;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// 输入框前方字体颜色调整
/deep/ .theme--light.v-list[data-v-06e16d70] {
  background: #1f97f4 !important;
}

/deep/ .theme--light.v-select .v-select__selections {
  color: rgba(0, 0, 0, 0.87);
  font-size: 18px !important;
  min-height: auto !important;
  height: 36px !important;
}

// Multi select
/deep/ .v-select__selection--comma {
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-inline-box;
  display: -ms-inline-flexbox;
  display: inline-flex;
  margin: 9px 4px 7px 0 !important;
  font-size: 18px;
}

// 上方标题字体
.red--text {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  color: white !important;
  font-size: 20px;
  caret-color: #f44336 !important;
}

// 提交按钮的布局(多问题)
.submitButtonMore {
  position: absolute !important;
  height: 36px !important;
  bottom: 8px !important;
  // margin-top: 36px;
  bottom: 16px !important;
  border-radius: 4px !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  font-size: 14px !important;
}

.submitButton {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative !important;
  height: 36px !important;
  bottom: 1px !important;
  border-radius: 4px !important;
  font-size: 14px !important;
}

.submitButtonInput {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative !important;
  height: 36px !important;
  bottom: -4px !important;
  border-radius: 4px !important;
  font-size: 14px !important;
}

// 提交按钮的布局（多问题）
.submitButtonSingleQuestion {
  position: absolute !important;
  height: 36px !important;
  bottom: 8px !important;
  // margin-top: 36px;
  bottom: 4px !important;
  border-radius: 4px !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  font-size: 14px !important;
}

// 单选
.submitButtonSingleSelect {
  width: 20px !important;
  height: 26px !important;
  bottom: -20px !important;
  border-radius: 4px !important;
  // right: 6px !important;
  font-size: 12px !important;
}

/deep/ .singleInputStyleAnother.v-text-field.v-text-field--solo > .v-input__control > .v-input__slot {
  background-color: #fff !important;
}

/deep/ .singleInputStyle.v-text-field.v-text-field--solo > .v-input__control > .v-input__slot {
  background-color: #fff !important;
  min-height: 36px !important;
  height: 36px !important;
  max-height: 36px !important;
  margin-right: 12px !important;
  border-radius: 7px;
}

/deep/ .singleSelectStyle.v-text-field.v-text-field--solo > .v-input__control > .v-input__slot {
  background-color: #fff !important;
  min-height: 36px !important;
  height: 36px !important;
  max-height: 36px !important;
  margin-right: 12px !important;
  border-radius: 7px;
}

/deep/ .singleInputStyle.v-text-field--outline.v-text-field--single-line input {
  margin-top: 0px;
}

/deep/ .v-text-field input {
  -webkit-box-flex: 1;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  line-height: 20px;
  padding: 8px 0 8px;
  max-width: 100%;
  min-width: 0px;
  width: 100%;
  font-size: 18px;
}

// 多问题滚动条
.scrollMultiQuestion {
  margin: 2px 8px 42px 6px;
  margin-bottom: 52px !important;
}

// 多问题滚动条
.scrollMultiQuestionMore {
  max-height: 191px !important;
  margin: 2px 8px 40px 6px;
  padding-right: 6px;
  overflow-x: hidden;
  overflow-y: auto !important;
}

// 设置滚动条整体样式 
/deep/ .scrollMultiQuestionMore::-webkit-scrollbar {
  margin-left: 3px;
  width: 10px;
}

// 设置滚动条滑块(thumb)样式
/deep/ .scrollMultiQuestionMore::-webkit-scrollbar-thumb {
  background-color: rgb(255, 255, 255); 
  border-radius: 5px;
}

// 设置滚动条轨道样式
/deep/ .scrollMultiQuestionMore::-webkit-scrollbar-track {
  background-color: rgb(31, 151, 244);
}

.scrollMultiQuestionInput {
  margin: 2px 8px 42px 6px;
  margin-bottom: 52px !important;
}

/deep/ .inputTopStyle.v-text-field.v-text-field--solo .v-input__control {
  min-height: 42px !important;
  max-height: 42px !important;
  padding: 0;
}

/deep/ .inputTopStyle.v-select .v-input__control {
  min-height: 36px !important;
  max-height: 36px !important;
}

/deep/ .inputTopStyle.v-text-field.v-text-field--solo.v-input--is-focused > .v-input__control > .v-input__slot {
  background-color: yellow !important;
}

/deep/ [data-v-06e16d70] .inputTopStyle.v-select .v-select__selections input {
  display: none !important;
}

// 单问题输入框鼠标聚焦位置
/deep/ .singleInputStyleAnother.v-text-field--outline.v-text-field--single-line input {
  margin-top: -1px;
}

// 多问题输入框的布局（调整最小高度）
/deep/ .inputStyle.v-text-field.v-text-field--solo > .v-input__control > .v-input__slot {
  min-height: 36px !important;
  height: 36px !important;
  max-height: 36px !important;
  background-color: #fff !important;
  border-radius: 7px;
}

/deep/ .inputStyle.v-text-field--outline.v-text-field--single-line input {
  margin-top: 1px;
}

// 一系列边框设置
/deep/ .inputStyle.v-text-field--outline.v-input--is-focused > .v-input__control > .v-input__slot, .v-text-field--outline.v-input--has-state > .v-input__control > .v-input__slot {
  border: 3px solid yellow !important;
  -webkit-transition: border 0.3scubic -bezier(0.25, 0.8, 0.5, 1) !important;
  transition: border 0.3scubic -bezier(0.25, 0.8, 0.5, 1) !important;
}

/deep/ .theme--light.v-text-field--outline > .v-input__control > .v-input__slot {
  border: 3px solid white !important;
}

/deep/ .v-text-field--outline.v-input--is-focused > .v-input__control > .v-input__slot, /deep/ .v-text-field--outline.v-input--has-state > .v-input__control > .v-input__slot {
  border: 3px solid currentColor !important;
  transition: border 0.3s cubic-bezier(0.25, 0.8, 0.5, 1) !important;
}

// single Selct border
/deep/ .singleSelectStyle.v-text-field--outline.v-input--is-focused > .v-input__control > .v-input__slot, /deep/ .singleSelectStyle.v-text-field--outline.v-input--has-state > .v-input__control > .v-input__slot {
  border: 3px solid white !important;
  transition: border 0.3s cubic-bezier(0.25, 0.8, 0.5, 1) !important;
}

// single input border
/deep/ .singleInputStyle.v-text-field--outline.v-input--is-focused > .v-input__control > .v-input__slot, /deep/ .singleInputStyle.v-text-field--outline.v-input--has-state > .v-input__control > .v-input__slot {
  border: 3px solid white !important;
  transition: border 0.3s cubic-bezier(0.25, 0.8, 0.5, 1) !important;
}

// single input border
/deep/ .singleInputStyleAnother.v-text-field--outline.v-input--is-focused > .v-input__control > .v-input__slot, /deep/ .singleInputStyleAnother.v-text-field--outline.v-input--has-state > .v-input__control > .v-input__slot {
  border: 3px solid white !important;
  transition: border 0.3s cubic-bezier(0.25, 0.8, 0.5, 1) !important;
}

// 多问题输入框之间以及输入框与前面字体间样式调整
.inputStyle {
  font-size: 20px;
  margin: 0 19px 0px 2px !important;
}

// 用户聚焦于多输入框时，调整背景色
/deep/ .inputStyle.v-text-field.v-text-field--solo.v-input--is-focused > .v-input__control > .v-input__slot {
  background-color: yellow !important;
}

/deep/ .inputTopStyle.v-text-field.v-text-field--solo.v-input--is-focused > .v-input__control > .v-input__slot {
  background-color: yellow !important;
}

/deep/ .inputStyle.v-text-field.v-text-field--solo:hover > .v-input__control > .v-input__slot {
  border: 3px solid white;
  transition: border 0.3s ease !important;
}

/deep/ .singleInputStyle.v-text-field.v-text-field--solo:hover > .v-input__control > .v-input__slot {
  border: 3px solid white !important;
  transition: border 0.3s ease !important;
}

/deep/ .singleInputStyleAnother.v-text-field.v-text-field--solo:hover > .v-input__control > .v-input__slot {
  border: 3px solid white !important;
  transition: border 0.3s ease !important;
}

/deep/ .singleSelectStyle.v-text-field.v-text-field--solo:hover > .v-input__control > .v-input__slot {
  border: 3px solid white !important;
  transition: border 0.3s ease !important;
}

// Multi Question focused
/deep/ [data-v-06e16d70] .inputStyle.v-text-field--outline.v-input--is-focused > .v-input__control > .v-input__slot, .v-text-field--outline.v-input--has-state > .v-input__control > .v-input__slot {
  border: 3px solid yellow !important;
  -webkit-transition: border 0.3scubic -bezier(0.25, 0.8, 0.5, 1) !important;
  transition: border 0.3scubic -bezier(0.25, 0.8, 0.5, 1) !important;
}

/deep/ .v-text-field.v-text-field--solo:not(.v-text-field--solo-flat) > .v-input__control > .v-input__slot {
  box-shadow: none !important;
  -webkit-box-shadow: none !important;
}

// 错误提示语
/deep/ .v-messages {
  // display: none !important;
  visibility: hidden !important;
  font-size: 14px;
  color: yellow !important;
  caret-color: #ff5252 !important;
  min-height: 0;
  line-height: 14px;
  transition: none !important;
  transform: translateZ(0);
  backface-visibility: hidden;
}

/deep/ [data-v-06e16d70] .inputTopStyle.v-select .v-select__selections input {
  display: none !important;
}

/deep/ .v-text-field.v-text-field--enclosed .v-text-field__details {
  display: none !important;
}
.tooltip-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  display: inline-block;
}
</style>
```
