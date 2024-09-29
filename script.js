const cardContainer = document.getElementById("card-container");

const theme1 = [
  { front: "images/vegetablefront.png", back: "images/vegetable1.png" },
  { front: "images/vegetablefront.png", back: "images/vegetable2.png" },
  { front: "images/vegetablefront.png", back: "images/vegetable3.png" },
  { front: "images/vegetablefront.png", back: "images/vegetable4.png" },
  { front: "images/vegetablefront.png", back: "images/vegetable5.png" },
  { front: "images/vegetablefront.png", back: "images/vegetable6.png" },
  { front: "images/vegetablefront.png", back: "images/vegetable7.png" },
  { front: "images/vegetablefront.png", back: "images/vegetable8.png" },
];

const theme2 = [
  { front: "images/halloweenfront.png", back: "images/halloween1.png" },
  { front: "images/halloweenfront.png", back: "images/halloween2.png" },
  { front: "images/halloweenfront.png", back: "images/halloween3.png" },
  { front: "images/halloweenfront.png", back: "images/halloween4.png" },
  { front: "images/halloweenfront.png", back: "images/halloween5.png" },
  { front: "images/halloweenfront.png", back: "images/halloween6.png" },
  { front: "images/halloweenfront.png", back: "images/halloween7.png" },
  { front: "images/halloweenfront.png", back: "images/halloween8.png" },
];

let currentTheme = [];
let flippedCards = [];
let canFlip = false; // 控制是否可以翻转
let countdownInterval; // 倒计时定时器

// 更新选中按钮的函数
function updateSelectedButton(selectedId) {
  document.querySelectorAll(".button-container button").forEach((button) => {
    button.classList.remove("selected");
  });
  document.getElementById(selectedId).classList.add("selected");
}

document.getElementById("theme-8").onclick = () => {
  currentTheme = [...theme1, ...theme1]; // 选择8张的主题
  updateSelectedButton("theme-8"); // 更新选中状态
};

document.getElementById("theme-16").onclick = () => {
  currentTheme = [...theme2, ...theme2]; // 选择16张的主题
  updateSelectedButton("theme-16"); // 更新选中状态
};

document.getElementById("start-game").onclick = () => {
  if (countdownInterval) {
    clearInterval(countdownInterval); // 停止旧的倒计时
    document.getElementById("countdown").style.visibility = "hidden"; // 隐藏倒计时
  }

  if (currentTheme.length === 0) {
    alert("请先选择一个主题！");
    return;
  }

  cardContainer.innerHTML = ""; // 清空之前的卡片
  shuffle(currentTheme); // 随机排列卡片

  currentTheme.forEach((data) => {
    const card = document.createElement("div");
    card.className = "card flipped"; // 先显示背面

    card.innerHTML = `
            <div class="face front">
                <img src="${data.front}" alt="正面圖片">
            </div>
            <div class="face back">
                <img src="${data.back}" alt="背面圖片">
            </div>
        `;

    // 添加点击事件
    card.addEventListener("click", () => {
      if (!canFlip || card.classList.contains("flipped")) return; // 如果不能翻转或已翻转则返回

      card.classList.add("flipped"); // 立即翻转当前卡片
      flippedCards.push(card); // 存储已翻转的卡片

      // 如果翻转的卡片数量达到两张
      if (flippedCards.length === 2) {
        canFlip = false; // 禁止再翻转
        setTimeout(() => {
          const [card1, card2] = flippedCards;
          const isMatch =
            card1.querySelector(".back img").src ===
            card2.querySelector(".back img").src;

          if (isMatch) {
            // 匹配时，添加背面淡出效果
            card1.querySelector('.back').classList.add("fade-out");
            card2.querySelector('.back').classList.add("fade-out");

            // 在动画结束后隐藏卡片
            setTimeout(() => {
              card1.style.visibility = "hidden";
              card2.style.visibility = "hidden";

              // 检查是否所有卡片都已隐藏
              const allCardsHidden =
                document.querySelectorAll(
                  '.card:not([style*="visibility: hidden"])'
                ).length === 0;

                if (allCardsHidden) {
                    setTimeout(() => {
                      // 使用 SweetAlert2 显示弹窗
                      Swal.fire({
                        title: '遊戲結束',
                        text: '所有卡片已匹配完成！',
                        icon: 'success',
                        confirmButtonText: '重新開始'
                      }).then(() => {
                        // 可以在这里重置游戏或执行其他操作
                        location.reload(); // 刷新页面以重新开始游戏
                      });
                    }, 500); // 延迟弹窗，以免被翻转动画干扰
                  }
            }, 1000); // 1秒后卡片淡出并隐藏
          } else {
            card1.classList.remove("flipped"); // 翻回正面
            card2.classList.remove("flipped");
          }
          flippedCards = []; // 清空已翻转的卡片
          canFlip = true; // 允许翻转
        }, 500); // 1秒后进行匹配检查
      }
    });

    cardContainer.appendChild(card);
  });

  let countdownTime = 10; // 倒计时的初始值
  const countdownElement = document.getElementById("countdown");
  countdownElement.textContent = countdownTime; // 显示初始时间
  countdownElement.style.visibility = "visible"; // 显示倒计时

  countdownInterval = setInterval(() => {
    countdownTime--; // 每秒减少1
    countdownElement.textContent = countdownTime; // 更新倒计时显示

    if (countdownTime <= 0) {
      clearInterval(countdownInterval); // 停止倒计时
      countdownElement.style.visibility = "hidden"; // 倒计时结束隐藏
      document
        .querySelectorAll(".card")
        .forEach((card) => card.classList.remove("flipped")); // 翻回正面
      canFlip = true; // 倒计时结束后允许翻转
    }
  }, 1000); // 每秒更新
};

document.getElementById("show-front").onclick = () => {
  clearInterval(countdownInterval); // 停止倒计时
  document
    .querySelectorAll(".card")
    .forEach((card) => card.classList.remove("flipped"));
  document.getElementById("countdown").style.visibility = "hidden"; // 隐藏倒计时
};

document.getElementById("show-back").onclick = () => {
  clearInterval(countdownInterval); // 停止倒计时
  document
    .querySelectorAll(".card")
    .forEach((card) => card.classList.add("flipped"));
  document.getElementById("countdown").style.visibility = "hidden"; // 隐藏倒计时
};

// 随机排列数组的函数
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
