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
//   // 键盘事件
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

//   // 触摸滑动
//   let touchStartX = 0, touchStartY = 0;
//   let touchStartTime = 0;
//   const minDistance = 15;
//   const maxTime = 300;
  
//   const gameGrid = document.querySelector('.game-grid');
  
//   if (gameGrid) {
//     gameGrid.addEventListener('touchstart', function(e) {
//       e.preventDefault();
//       touchStartX = e.touches[0].clientX;
//       touchStartY = e.touches[0].clientY;
//       touchStartTime = Date.now();
//     }, { passive: false });
    
//     gameGrid.addEventListener('touchmove', function(e) {
//       e.preventDefault();
//     }, { passive: false });
    
//     gameGrid.addEventListener('touchend', function(e) {
//       e.preventDefault();
//       const deltaX = e.changedTouches[0].clientX - touchStartX;
//       const deltaY = e.changedTouches[0].clientY - touchStartY;
//       const deltaTime = Date.now() - touchStartTime;
      
//       if (Math.abs(deltaX) < minDistance && Math.abs(deltaY) < minDistance) return;
//       if (deltaTime > maxTime) return;
      
//       if (Math.abs(deltaX) > Math.abs(deltaY)) {
//         if (deltaX > 0) {
//           moveFn({ row: 0, column: 1 });
//         } else {
//           moveFn({ row: 0, column: -1 });
//         }
//       } else {
//         if (deltaY > 0) {
//           moveFn({ row: 1, column: 0 });
//         } else {
//           moveFn({ row: -1, column: 0 });
//         }
//       }
//     });
//   }

//   // 按钮事件
//   const buttons = document.querySelectorAll('button');
//   const handleClick = function() {
//     startFn();
//   };
  
//   for (let i = 0; i < buttons.length; i++) {
//     buttons[i].addEventListener('click', handleClick);
//   }
// }







function Listener({ move: moveFn, start: startFn }) {
  // 键盘事件
  window.addEventListener('keyup', function(e) {
    switch (e.code) {
      case 'ArrowUp': moveFn({ row: -1, column: 0 }); break;
      case 'ArrowLeft': moveFn({ row: 0, column: -1 }); break;
      case 'ArrowRight': moveFn({ row: 0, column: 1 }); break;
      case 'ArrowDown': moveFn({ row: 1, column: 0 }); break;
    }
  });

  // 触摸滑动 - 覆盖整个 .container，但排除按钮
  let touchStartX = 0, touchStartY = 0;
  let touchStartTime = 0;
  const minDistance = 15;
  const maxTime = 300;
  
  // 绑定到整个容器
  const container = document.querySelector('.container');
  
  if (container) {
    container.addEventListener('touchstart', function(e) {
      // 检查触摸的目标是否是按钮
      let target = e.target;
      let isButton = false;
      
      // 向上查找是否点击了按钮或遮罩内容
      while (target && target !== container) {
        if (target.tagName === 'BUTTON' || 
            target.closest?.('button') ||
            target.classList?.contains('status') ||
            target.classList?.contains('content')) {
          isButton = true;
          break;
        }
        target = target.parentElement;
      }
      
      // 只有点按钮时，不阻止默认行为，让 click 正常触发
      if (!isButton) {
        e.preventDefault();
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
      }
    }, { passive: false });
    
    container.addEventListener('touchmove', function(e) {
      // 只有非按钮区域才阻止滚动
      let target = e.target;
      let isButton = false;
      while (target && target !== container) {
        if (target.tagName === 'BUTTON' || target.closest?.('button')) {
          isButton = true;
          break;
        }
        target = target.parentElement;
      }
      if (!isButton) {
        e.preventDefault();
      }
    }, { passive: false });
    
    container.addEventListener('touchend', function(e) {
      // 重置标记
      setTimeout(() => {
        touchStartX = 0;
        touchStartY = 0;
      }, 50);
      
      // 如果触摸的是按钮，不处理滑动
      let target = e.target;
      let isButton = false;
      while (target && target !== container) {
        if (target.tagName === 'BUTTON' || 
            target.closest?.('button') ||
            target.classList?.contains('status') ||
            target.classList?.contains('content')) {
          isButton = true;
          break;
        }
        target = target.parentElement;
      }
      
      if (isButton) return;
      if (touchStartX === 0 && touchStartY === 0) return;
      
      e.preventDefault();
      const deltaX = e.changedTouches[0].clientX - touchStartX;
      const deltaY = e.changedTouches[0].clientY - touchStartY;
      const deltaTime = Date.now() - touchStartTime;
      
      if (Math.abs(deltaX) < minDistance && Math.abs(deltaY) < minDistance) return;
      if (deltaTime > maxTime) return;
      
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
          moveFn({ row: 0, column: 1 });
        } else {
          moveFn({ row: 0, column: -1 });
        }
      } else {
        if (deltaY > 0) {
          moveFn({ row: 1, column: 0 });
        } else {
          moveFn({ row: -1, column: 0 });
        }
      }
    });
  }

  // 按钮事件
  const buttons = document.querySelectorAll('button');
  const handleClick = function() {
    startFn();
  };
  
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', handleClick);
  }
}