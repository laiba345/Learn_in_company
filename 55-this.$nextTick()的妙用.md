```
handleMultiSelect(index) {
  this.$set(this.selectErrors, index, '');
  const userInput = this.userInputMultiSelect[index];
  this.$nextTick(() => {
    // 验证必选：Must Select one at least !
    const isEmptyError = this.validateMultiSelectInput(userInput);
    if (typeof isEmptyError === 'string') {
      this.$set(this.selectErrors, index, isEmptyError);
      return;
    }
    // 验证是否满足正则表达式：Wrong Format
    const regexError = this.validateInput(userInput, index);
    if (typeof regexError === 'string') {
      this.$set(this.selectErrors, index, regexError);
      return;
    }
  });
},
```
# this.$nextTick()的妙用
- 作用：将回调延迟到下一次DOM更新循环之后执行（）
- 因为Vue的DOM更新是异步的，当我们修改数据的时候，比如 this.$set(this.selectErrors, index, '')，
  - Vue不会立即更新DOM，而是将更新放入一个队列中，在下一个"tick"（下一次事件循环时）批量执行
  - 这意味着如果你在修改数据以后立即尝试读取DOM或依赖DOM的状态，可能会得到旧的值；

# 验证逻辑需要最新的DOM状态
- 在handleMultiSelect 方法中，首先清除了错误信息 (this.$set(this.selectErrors, index, ''))，然后进行验证。如果不使用 $nextTick，
- **验证可能会在 DOM 更新之前执行，**
  - 错误信息可能没有及时清除
  - **验证时可能读取到旧的DOM状态或表单状态
  - 可能导致验证结果与预期不符
# 表单验证的特殊性
- Vuetify 的表单验证（如 v-select）也有自己的更新周期（有自己的更新周期）。$nextTick 确保你的验证逻辑在 Vuetify 完成其内部状态更新后执行，这样：

# 去掉$nextTick可能会出错
- 验证时 userInputMultiSelect[index] 可能还未完全更新
- Vuetify 内部验证状态可能还未同步
