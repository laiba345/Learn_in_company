## svg文件的使用
- 将svg文件下载下来，存入到assets文件夹下；
- svg文件中width和height属性可以直接设置大小；
- 在vue模板中，直接通过img标签来调用svg文件，最简单的使用方式；
```
<img src="@/assets/img/user.svg" alt="">
```

## svg文件本身填充fill属性，在vue中使用css处理，没有作用
- 在SVG文件中使用 fill="var(--svg-fill-color)"：
- 然后在Vue中就可以使用css属性来进行问题处理，比如对应不同操作情况下来显示svg图标的颜色填充
```
.icon-hover-container .svg-icon {
  --svg-fill-color: #949494;
}

::v-deep .icon-hover-container:hover .svg-icon {
  --svg-fill-color: rgb(70, 57, 239);
}
```