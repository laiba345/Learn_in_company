# vue文件中样式穿透问题
- 在Vue中使用scoped样式时，样式是针对该组件的局部生效的，
- 在代码中使用了/deep/或::v-deep选择器，这样子**会穿透Vue的scoped样式隔离**，使得样式能影响到子组件或者其他组件的DOM元素，
- 原因
  - /deep/ 或 ::v-deep 是 Vue 提供的穿透选择器，它会忽略 scoped 的限制，作用于整个应用的 DOM。如果你在 scoped 样式中使用了 /deep/，它会将样式应用于全局范围。
