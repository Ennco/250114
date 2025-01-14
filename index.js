//图片容器
var feedsContainer = document.querySelector(".feeds-container");
var itemWidth = 220;
var infoHeight = 32;

let data;
// const xhr = new XMLHttpRequest();
// xhr.onreadystatechange = function () {
//   console.log(xhr.readyState);
//   if (xhr.readyState === 4) {
//     data = JSON.parse(xhr.responseText).subjects;
//     main();
//   }
// };
// xhr.open(
//   "GET",
//   "https://movie.douban.com/j/search_subjects?type=movie&tag=%E7%83%AD%E9%97%A8&page_limit=50&page_start=0"
// );
// xhr.send(null);

// fetch(
//   "https://movie.douban.com/j/search_subjects?type=movie&tag=%E7%83%AD%E9%97%A8&page_limit=50&page_start=0"
// )
//   .then((resp) => {
//     return resp.json();
//   })
//   .then((resp) => {
//     data = resp.subjects;
//     main();
//   });

async function getList() {
  const resp = await fetch(
    "https://movie.douban.com/j/search_subjects?type=movie&tag=%E7%83%AD%E9%97%A8&page_limit=50&page_start=0"
  );
  const body = await resp.json();
  return body;
}
getList().then((resp) => {
  data = resp.subjects;
  main();
});
function createItem() {
  for (var i = 0; i < data.length; i++) {
    var feedItem = document.createElement("div");
    feedItem.className = "feeds-item";
    var img = document.createElement("img");
    img.src = `${data[i].cover}`;
    img.style.width = itemWidth + "px";
    var feedsItemInfo = document.createElement("div");
    feedsItemInfo.className = "feeds-item-info";
    feedsItemInfo.innerText = data[i].title;
    feedItem.appendChild(img);
    feedItem.appendChild(feedsItemInfo);
    feedsContainer.appendChild(feedItem);
    (function (i) {
      feedItem.onclick = function () {
        location.href = data[i].url;
      };
    })(i);

    img.onload = setPosition;
    img.onerror = setPosition;
  }
}
// 计算元素列数
function cal() {
  // 视口宽度
  var viewWidth = document.documentElement.clientWidth;
  //图片间距
  var gap = 20;
  // 列数
  var columns = Math.floor((viewWidth - 20) / (itemWidth + 20)) || 1;
  // 容器宽度
  var feedsContainerWidth = columns * itemWidth + (columns + 1) * gap;
  feedsContainer.style.width = feedsContainerWidth + "px";
  return {
    viewWidth,
    feedsContainerWidth,
    gap,
    columns,
  };
}
//设置位置
function setPosition() {
  var itemInfo = cal();
  var arr = new Array(itemInfo.columns);
  arr.fill(0);
  for (var i = 0; i < feedsContainer.children.length; i++) {
    var item = feedsContainer.children[i].querySelector("img");
    // 插入列下标
    var minIndex = arr.indexOf(getMin(arr));
    var minTop = arr[minIndex];
    var left = minIndex * itemWidth + (minIndex + 1) * itemInfo.gap;
    if (i < itemInfo.columns) {
      arr[minIndex] = minTop + item.height + itemInfo.gap;
      item.parentElement.style.transform = `translate(${left}px,${minTop}px)`;
    } else {
      arr[minIndex] = minTop + item.height + infoHeight + itemInfo.gap;
      item.parentElement.style.transform = `translate(${left}px,${
        minTop + infoHeight
      }px)`;
    }
  }
  var maxTop = getMax(arr);
  feedsContainer.style.height = maxTop + infoHeight + "px";
}
function getMin(arr) {
  return Math.min(...arr);
}
function getMax(arr) {
  return Math.max(...arr);
}
//防抖
function debounce(fn, duration) {
  var timerId;
  return function (e) {
    clearTimeout(timerId);
    var curThis = this;
    var args = Array.prototype.slice.call(arguments);
    timerId = setTimeout(function () {
      fn.apply(curThis, args);
    }, duration);
  };
}
// 程序主函数
function main() {
  createItem();
  window.addEventListener("resize", debounce(setPosition, 200));
}
