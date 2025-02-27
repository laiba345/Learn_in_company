# element-plus中聚焦或者失焦将规则隐藏（一般是失焦以后再进行匹配操作）
```
 <el-input
  v-model="form.confirmPassword"
  autocomplete="off"
  :type="isConfirmPasswordVisible ? 'text' : 'password'"
  @focus="handleConfirmFocus" 
  @blur="handleConfirmBlur"
>

// confirmPassword focus
const handleConfirmFocus = () => {
  passwordFormRef.value.clearValidate('confirmPassword'); 
};

// confirmPassword blur
const handleConfirmBlur = () => {
  passwordFormRef.value.validateField('confirmPassword'); // 触发验证
};
```
- 注意：clearValidate是element UI/Plus 表单组件提供的一个方法，作用：清除指定表单项的验证状态（**包括错误提示和视觉样式**）
# 在功能要求颇多的时候，除了可以用聚焦@focus以外还可以使用@blur来操作；
```
<el-input
  v-model="form.newPassword"
  autocomplete="off"
  :type="isNewPasswordVisible ? 'text' : 'password'"
  @focus="handleFocus"
  @blur="handleBlur('newPassword')"
  @input="handlePasswordInput('newPassword')"
>

// 输入校验
const handlePasswordInput = (field) => {
  const password = form.value[field].trim();
  if(allRulesValid.value) {
    showPasswordRules.value = false; 
    // rules.newPassword[0].trigger = 'input'; 
    // console.log('hello', rules.newPassword[0].trigger); 
  }else {
    showPasswordRules.value = !!password; 
  }; 
  // console.log('showPasswordRules.value', showPasswordRules.value);
  if (field === 'newPassword' && showPasswordRules.value) {
    passwordFormRef.value.clearValidate('newPassword'); 
  }
  form.value[field] = form.value[field]
    .replace(/\s+/g, '') 
    .replace(/[^\x20-\x7E]/g, ''); 
};

// newPassword focus
const handleFocus = () => {
  const isValid = allRulesValid.value;
  showPasswordRules.value = !isValid;
  passwordFormRef.value.clearValidate('newPassword'); 
};

// newPassword blur
const handleBlur = (field) => {
  if (field === 'newPassword') {
    showPasswordRules.value = false; 
    const isValid = Object.values(passwordValidation.value).every(Boolean);
    passwordFormRef.value.validateField('newPassword'); 
  }
};

```

