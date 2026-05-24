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

// function Listener({ move: moveFn, start: startFn }) {
//   // 键盘事件（保留用于调试）
//   window.addEventListener('keyup', function(e) {
//     switch (e.code) {
//       case 'ArrowUp':
//         moveFn({ row: -1, column: 0 });
//         break;
//       case 'ArrowLeft':
//         moveFn({ row: 0, column: -1 });
//         break;
//       case 'ArrowRight':
//         moveFn({ row: 0, column: 1 });
//         break;
//       case 'ArrowDown':
//         moveFn({ row: 1, column: 0 });
//         break;
//     }
//   });

//   // 添加触摸滑动支持
//   let touchStartX = 0;
//   let touchStartY = 0;
//   let touchEndX = 0;
//   let touchEndY = 0;
  
//   // 最小滑动距离（像素）
//   const minDistance = 50;
  
//   // 获取游戏容器（通常整个游戏区域）
//   const gameContainer = document.querySelector('.container') || document.body;
  
//   gameContainer.addEventListener('touchstart', function(e) {
//     e.preventDefault();  // 防止页面滚动
//     touchStartX = e.touches[0].clientX;
//     touchStartY = e.touches[0].clientY;
//   }, { passive: false });
  
//   gameContainer.addEventListener('touchend', function(e) {
//     e.preventDefault();
//     touchEndX = e.changedTouches[0].clientX;
//     touchEndY = e.changedTouches[0].clientY;
    
//     const deltaX = touchEndX - touchStartX;
//     const deltaY = touchEndY - touchStartY;
    
//     // 判断滑动方向（取绝对值大的方向）
//     if (Math.abs(deltaX) < minDistance && Math.abs(deltaY) < minDistance) {
//       return;  // 滑动距离太小，忽略
//     }
    
//     if (Math.abs(deltaX) > Math.abs(deltaY)) {
//       // 水平滑动
//       if (deltaX > 0) {
//         moveFn({ row: 0, column: 1 });  // 向右
//       } else {
//         moveFn({ row: 0, column: -1 }); // 向左
//       }
//     } else {
//       // 垂直滑动
//       if (deltaY > 0) {
//         moveFn({ row: 1, column: 0 });  // 向下
//       } else {
//         moveFn({ row: -1, column: 0 }); // 向上
//       }
//     }
//   });
  
//   // 按钮事件（重新开始）
//   const buttons = document.querySelectorAll('button');
//   for (let i = 0; i < buttons.length; i++) {
//     buttons[i].addEventListener('click', function() {
//       startFn();
//     });
//   }
// }

// function Listener({ move: moveFn, start: startFn }) {
//   // 键盘事件（保持不变）
//   window.addEventListener('keyup', function(e) {
//     switch (e.code) {
//       case 'ArrowUp': moveFn({ row: -1, column: 0 }); break;
//       case 'ArrowLeft': moveFn({ row: 0, column: -1 }); break;
//       case 'ArrowRight': moveFn({ row: 0, column: 1 }); break;
//       case 'ArrowDown': moveFn({ row: 1, column: 0 }); break;
//     }
//   });

//   // 触摸滑动 - 只绑定到游戏区域
//   let touchStartX = 0, touchStartY = 0;
//   const minDistance = 15;
//   const gameGrid = document.querySelector('.game-grid');
  
//   if (gameGrid) {
//     gameGrid.addEventListener('touchstart', function(e) {
//       e.preventDefault();
//       touchStartX = e.touches[0].clientX;
//       touchStartY = e.touches[0].clientY;
//     }, { passive: false });
    
//     gameGrid.addEventListener('touchend', function(e) {
//       e.preventDefault();
//       const deltaX = e.changedTouches[0].clientX - touchStartX;
//       const deltaY = e.changedTouches[0].clientY - touchStartY;
      
//       if (Math.abs(deltaX) < minDistance && Math.abs(deltaY) < minDistance) return;
      
//       if (Math.abs(deltaX) > Math.abs(deltaY)) {
//         if (deltaX > 0) moveFn({ row: 0, column: 1 });
//         else moveFn({ row: 0, column: -1 });
//       } else {
//         if (deltaY > 0) moveFn({ row: 1, column: 0 });
//         else moveFn({ row: -1, column: 0 });
//       }
//     });
//   }

//   // 按钮事件 - 不阻止默认行为
//   const buttons = document.querySelectorAll('button');
//   for (let i = 0; i < buttons.length; i++) {
//     buttons[i].addEventListener('click', function() {
//       startFn();
//     });
//   }
// }

function Listener({ move: moveFn, start: startFn }) {
  // 键盘事件（保持不变）
  
  let touchStartX = 0, touchStartY = 0;
  let touchStartTime = 0;
  let isTouchingButton = false;
  const minDistance = 15;
  const maxTime = 300;
  
  const container = document.querySelector('.container');
  
  if (container) {
    container.addEventListener('touchstart', function(e) {
      let target = e.target;
      isTouchingButton = false;
      
      while (target && target !== container) {
        if (target.tagName === 'BUTTON' || 
            target.closest('button') ||
            target.classList?.contains('status') ||
            target.classList?.contains('content')) {
          isTouchingButton = true;
          break;
        }
        target = target.parentElement;
      }
      
      if (!isTouchingButton) {
        e.preventDefault();
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
        // 删除这行
        // container.style.transition = 'transform 0.05s ease-out';
      }
    }, { passive: false });
    
    container.addEventListener('touchmove', function(e) {
      if (!isTouchingButton) {
        e.preventDefault();
        //  删除整个 touchmove 中的视觉反馈
      }
    }, { passive: false });
    
    container.addEventListener('touchend', function(e) {
      if (!isTouchingButton) {
        e.preventDefault();
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const touchEndTime = Date.now();
        
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        const deltaTime = touchEndTime - touchStartTime;
        
        // 删除这行
        // container.style.transform = '';
        
        if (Math.abs(deltaX) < minDistance && Math.abs(deltaY) < minDistance) return;
        if (deltaTime > maxTime) return;
        
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          if (deltaX > 0) moveFn({ row: 0, column: 1 });
          else moveFn({ row: 0, column: -1 });
        } else {
          if (deltaY > 0) moveFn({ row: 1, column: 0 });
          else moveFn({ row: -1, column: 0 });
        }
      }
      isTouchingButton = false;
    });
  }

  // 按钮事件（保持不变）
  const buttons = document.querySelectorAll('button');
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].removeEventListener('click', handleButtonClick);
    buttons[i].addEventListener('click', handleButtonClick);
    
    buttons[i].addEventListener('touchstart', function(e) {
      this.style.transform = 'scale(0.95)';
    }, { passive: true });
    
    buttons[i].addEventListener('touchend', function(e) {
      this.style.transform = '';
    });
    
    buttons[i].addEventListener('touchcancel', function(e) {
      this.style.transform = '';
    });
  }
  
  function handleButtonClick(e) {
    startFn();
  }
}