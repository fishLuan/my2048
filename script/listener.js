// function Listener({move:moveFn,start:startFn}){
//     window.addEventListener('keyup',function(e){
//         switch(e.code){
//             case 'ArrowLeft':
//                 moveFn({row:0,column:-1});
//                 break;
//             case 'ArrowUp':
//                 moveFn({row:-1,column:0});
//                 break;
//             case 'ArrowDown':
//                 moveFn({row:1,column:0});
//                 break;
//             case 'ArrowRight':
//                 moveFn({row:0,column:1});
//                 break;
//         }
//     });
//     const buttons=document.querySelectorAll('button');
//     for(let i=0;i<buttons.length;i++){
//         buttons[i].addEventListener('click',function(){
//             startFn();
//         })
//     }
// }

function Listener({ move: moveFn, start: startFn }) {
  // 键盘事件（保留用于调试）
  window.addEventListener('keyup', function(e) {
    switch (e.code) {
      case 'ArrowUp':
        moveFn({ row: -1, column: 0 });
        break;
      case 'ArrowLeft':
        moveFn({ row: 0, column: -1 });
        break;
      case 'ArrowRight':
        moveFn({ row: 0, column: 1 });
        break;
      case 'ArrowDown':
        moveFn({ row: 1, column: 0 });
        break;
    }
  });

  // 添加触摸滑动支持
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  
  // 最小滑动距离（像素）
  const minDistance = 50;
  
  // 获取游戏容器（通常整个游戏区域）
  const gameContainer = document.querySelector('.container') || document.body;
  
  gameContainer.addEventListener('touchstart', function(e) {
    e.preventDefault();  // 防止页面滚动
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: false });
  
  gameContainer.addEventListener('touchend', function(e) {
    e.preventDefault();
    touchEndX = e.changedTouches[0].clientX;
    touchEndY = e.changedTouches[0].clientY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    // 判断滑动方向（取绝对值大的方向）
    if (Math.abs(deltaX) < minDistance && Math.abs(deltaY) < minDistance) {
      return;  // 滑动距离太小，忽略
    }
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // 水平滑动
      if (deltaX > 0) {
        moveFn({ row: 0, column: 1 });  // 向右
      } else {
        moveFn({ row: 0, column: -1 }); // 向左
      }
    } else {
      // 垂直滑动
      if (deltaY > 0) {
        moveFn({ row: 1, column: 0 });  // 向下
      } else {
        moveFn({ row: -1, column: 0 }); // 向上
      }
    }
  });
  
  // 按钮事件（重新开始）
  const buttons = document.querySelectorAll('button');
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function() {
      startFn();
    });
  }
}