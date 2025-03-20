# 监视属性watch的全新用法(关键） 
```
watch: {
  // 表明了要监视的对象
  'container.status': {
    handler(newStatus) {
      if (['idle', 'fail'].includes(newStatus)) {
        console.log('状态改变了', this.container.status); 
        this.$emit('statusChange', newStatus);
      }
    },
    deep: true,
    immediate: true
  }
},

// 通过一系列的监视操作来实行计划；
// 比如：根据'container.status'的值来进行一系列的监视操作
watch: {
  'container.status'(newStatus) {
    if (newStatus === 'idle' || newStatus === 'fail') {
      this.showQA = false;
    }
  }
}
监视操作是实时的
```
