# CSS的书写顺序要求
在 CSS 里，虽然没有严格的强制性顺序要求，但遵循一定的顺序来书写样式代码，能增强代码的可读性与可维护性。一般来说，推荐按照以下顺序来书写样式规则：

1. **显示属性**：像 `display`、`visibility`、`opacity` 这类控制元素显示方式的属性，建议放在前面。因为它们会影响元素的基本布局与呈现方式。
2. **盒模型属性**：`width`、`height`、`margin`、`padding`、`border` 等属性，它们决定了元素在页面中的尺寸与间距。
3. **定位属性**：`position`、`top`、`right`、`bottom`、`left`、`z-index` 等属性，用于控制元素的定位方式。
4. **背景与颜色属性**：`background-color`、`background-image`、`color` 这类属性，能为元素设置背景和文本颜色。
5. **文本属性**：`font-size`、`font-family`、`text-align` 等属性，用来控制文本的外观和排版。
6. **其他属性**：`overflow`、`cursor` 等其他属性。

按照这个顺序，你提供的代码可以调整为：

```css
.HDDStorage {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 24vh;
  overflow: hidden;
  background-color: rgba(7, 106, 235, 0.1);
}
```
