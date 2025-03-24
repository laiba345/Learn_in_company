# el-row
```
<el-row :gutter="40" justify="space-between" class="top-row">
  <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
    <GaugeChart name="Fusion 1a" />
  </el-col>
  <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
    <GaugeChart name="DC 1a" />
  </el-col>
  <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
    <GaugeChart name="Log 1a" />
  </el-col>
</el-row>
```
## 解释
1. :gutter="40" 表示每列之间的左右总间隔为40px，实际每个列的两侧会各分配20px（左右20px，总间隔为40px）

# 样式的相关分析
```
.position-wrapper {
  position: relative;   /* 启用相对定位 */
  left: 70%;            /* 向右偏移父容器宽度的70% */
  transform: translateX(-50%); /* 向左回退自身宽度的50%，实现中心对齐 */
  width: 155%;          /* 扩大容器宽度，抵消偏移后的空白 */
}
```
## 解释
- 下层的两个仪表盘会向右偏移，与上层三个仪表盘形成错落布局； 
