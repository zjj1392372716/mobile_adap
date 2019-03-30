/**
 * [ 移动端适配方案 ]
 * @params designWidth  设计稿的实际宽度值，需要根据实际设置
 * @params maxWidth     该高度是最大兼容宽度，如我们设为750，就表示当视窗大于750的时候，会限制放大，比如我们想只兼容到ipad，由于ipad视窗宽度为768，那么我们就可以设置该值为768
 * 拿iphone6作为实验机： 像素宽度为 750像素  css宽度为375px  最终设置html：font-size：50px;  1rem = 50px;  375px  = 7.5rem
 * 如果设计稿是750像素宽的，由于dpr = 2，所以逻辑像素宽度只有 375 ，那么设计图上的 100px 代表 1rem;
 */
;
(function(designWidth, maxWidth) {
  var doc = document,
    win = window,
    docEl = doc.documentElement, // html节点
    remStyle = document.createElement("style"),
    tid;

  // 计算 rem 比例
  function refreshRem() {
    // getBoundingClientRect 获取某个元素相对于视窗的位置集合
    var width = docEl.getBoundingClientRect().width; // 获取整个文档元素的宽度，iphone6 是 375
    maxWidth = maxWidth || 540;
    width > maxWidth && (width = maxWidth); // 如果整个视窗的宽度大于 设计稿的最大宽度，那么就设置宽度为设计稿的最大宽度，
    var rem = ( width / designWidth ) * 100; // 不同的手机，width不一样，计算 width / designWidth 为不同的比例，比如 iphone6 下 rem = 50px iphone5 下 rem = 42.66666666666667px;
    // 利用该效果来实现屏幕小就缩小，屏幕变大就适当的放大
    remStyle.innerHTML = 'html{font-size:' + rem + 'px;}';
  }

  // 将 style 标签引入
  if (docEl.firstElementChild) {
    docEl.firstElementChild.appendChild(remStyle); // 头部head中插入
  } else {
    var wrap = doc.createElement("div");
    wrap.appendChild(remStyle);
    doc.write(wrap.innerHTML);
    wrap = null;
  }
  // 要等 wiewport 设置好后才能执行 refreshRem，不然 refreshRem 会执行2次；
  refreshRem();

  // 手机屏幕尺寸变化
  win.addEventListener("resize", function() {
    clearTimeout(tid); //防止执行两次
    tid = setTimeout(refreshRem, 300);
  }, false);

  // 页面返回自动刷新
  win.addEventListener("pageshow", function(e) {
    if (e.persisted) { // 浏览器后退的时候重新计算
      clearTimeout(tid);
      tid = setTimeout(refreshRem, 300);
    }
  }, false);

  // 文档全部资源加载完成
  // 为body设置默认字体大小为16ox
  if (doc.readyState === "complete") {
    doc.body.style.fontSize = "16px";
  } else {
    doc.addEventListener("DOMContentLoaded", function(e) {
      doc.body.style.fontSize = "16px";
    }, false);
  }
})(750, 768);
