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
let gameStartTime; // 记录游戏开始时间
let gameDuration; // 记录游戏持续时间

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
    clearInterval(countdownInterval);
    document.getElementById("countdown").style.visibility = "hidden";
  }

  if (currentTheme.length === 0) {
    alert("请先选择一个主题！");
    return;
  }

  // 禁用主题选择按钮
  document.getElementById("theme-8").disabled = true;
  document.getElementById("theme-16").disabled = true;

  cardContainer.innerHTML = ""; // 清空卡片容器
  shuffle(currentTheme); // 随机打乱卡片顺序

  currentTheme.forEach((data) => {
    const card = document.createElement("div");
    card.className = "card"; // 初始状态不添加flipped类，表示背面朝上

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
      if (!canFlip || card.classList.contains("flipped")) return;

      card.classList.add("flipped");
      flippedCards.push(card);

      if (flippedCards.length === 2) {
        canFlip = false;
        setTimeout(() => {
          const [card1, card2] = flippedCards;
          const isMatch =
            card1.querySelector(".back img").src ===
            card2.querySelector(".back img").src;

          if (isMatch) {
            card1.querySelector('.back').classList.add("fade-out");
            card2.querySelector('.back').classList.add("fade-out");

            setTimeout(() => {
              card1.style.visibility = "hidden";
              card2.style.visibility = "hidden";

              const allCardsHidden =
                document.querySelectorAll('.card:not([style*="visibility: hidden"])').length === 0;

              if (allCardsHidden) {
                const gameEndTime = Date.now(); // 记录游戏结束时间
                gameDuration = (gameEndTime - gameStartTime) / 1000; // 计算游戏持续时间（秒）

                setTimeout(() => {
                  Swal.fire({
                    title: '遊戲結束',
                    text: `所有卡片已匹配完成！\n您遊玩了 ${gameDuration.toFixed(2)} 秒!`,
                    icon: 'success',
                    confirmButtonText: '重新開始'
                  }).then(() => {
                    location.reload();
                  });
                }, 500);
              }
            }, 1000);
          } else {
            card1.classList.remove("flipped");
            card2.classList.remove("flipped");
          }
          flippedCards = [];
          canFlip = true;
        }, 500);
      }
    });

    cardContainer.appendChild(card);
  });

  let countdownTime = 10; // 设置倒计时
  const countdownElement = document.getElementById("countdown");
  countdownElement.textContent = countdownTime;
  countdownElement.style.visibility = "visible";

// 记录游戏开始时间和持续时间
let gameStartTime;
let gameDuration;

  countdownInterval = setInterval(() => {
    countdownTime--;
    countdownElement.textContent = countdownTime;

    if (countdownTime <= 0) {
      clearInterval(countdownInterval);
      countdownElement.style.visibility = "hidden";

      // 倒计时结束后翻回所有卡片
      document.querySelectorAll(".card").forEach((card) => {
        card.classList.remove("flipped"); // 确保所有卡片在倒计时结束时显示背面
      });

      canFlip = true; // 倒计时结束后允许翻转
      gameStartTime = Date.now(); // 记录游戏开始时间
      countdownElement.textContent = "遊玩時間: 0.00 秒"; // 初始显示为游戏时间

      // 开始计时更新
      const gameTimerInterval = setInterval(() => {
        gameDuration = Math.floor((Date.now() - gameStartTime) / 1000); // 计算已过时间
        countdownElement.textContent = `遊玩時間: ${gameDuration.toFixed(2)} 秒`;
      }, 100); // 每100毫秒更新一次显示
    }
  }, 1000);

  // 初始状态下先展示正面
  document.querySelectorAll(".card").forEach((card) => {
    card.classList.add("flipped"); // 在游戏开始时先展示卡片的正面
  });

  canFlip = false; // 禁用翻转，直到倒计时结束
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
