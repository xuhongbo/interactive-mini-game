// 游戏数据
const symbols = ['🍎', '🍊', '🍋', '🍉', '🍇', '🍓', '🍒', '🥝'];
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let timer = 0;
let gameStarted = false;
let timerInterval;

// DOM元素
const gameBoard = document.querySelector('.game-board');
const movesElement = document.querySelector('.moves');
const timerElement = document.querySelector('.timer');
const restartButton = document.querySelector('.restart');

// 初始化游戏
function initGame() {
    // 清除旧状态
    gameBoard.innerHTML = '';
    cards = [];
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    timer = 0;
    gameStarted = false;
    clearInterval(timerInterval);
    
    // 更新显示
    movesElement.textContent = '0 步';
    timerElement.textContent = '时间: 0秒';
    
    // 准备卡牌数据 (8对，总共16张)
    const cardSymbols = [...symbols, ...symbols];
    // 洗牌算法
    for (let i = cardSymbols.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cardSymbols[i], cardSymbols[j]] = [cardSymbols[j], cardSymbols[i]];
    }
    
    // 创建卡牌元素
    cardSymbols.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.index = index;
        card.dataset.symbol = symbol;
        
        // 卡片正面 (背面朝上)
        const cardFront = document.createElement('div');
        cardFront.classList.add('card-face', 'card-front');
        cardFront.textContent = '?';
        
        // 卡片背面 (符号面)
        const cardBack = document.createElement('div');
        cardBack.classList.add('card-face', 'card-back');
        cardBack.textContent = symbol;
        
        // 将正面和背面添加到卡片
        card.appendChild(cardFront);
        card.appendChild(cardBack);
        
        // 添加点击事件
        card.addEventListener('click', () => flipCard(card));
        
        // 将卡片添加到游戏板和数组
        gameBoard.appendChild(card);
        cards.push(card);
    });
}

// 翻转卡片
function flipCard(card) {
    // 如果已经匹配或者正在翻转中，则忽略点击
    if (card.classList.contains('matched') || flippedCards.length >= 2 || flippedCards.includes(card)) {
        return;
    }
    
    // 开始游戏计时
    if (!gameStarted) {
        startTimer();
        gameStarted = true;
    }
    
    // 翻转卡片
    card.classList.add('flipped');
    flippedCards.push(card);
    
    // 检查是否翻转了两张牌
    if (flippedCards.length === 2) {
        moves++;
        movesElement.textContent = `${moves} 步`;
        checkMatch();
    }
}

// 检查是否匹配
function checkMatch() {
    const [card1, card2] = flippedCards;
    
    if (card1.dataset.symbol === card2.dataset.symbol) {
        // 匹配成功
        card1.classList.add('matched');
        card2.classList.add('matched');
        flippedCards = [];
        matchedPairs++;
        
        // 检查游戏是否结束
        if (matchedPairs === symbols.length) {
            setTimeout(() => {
                endGame();
            }, 500);
        }
    } else {
        // 不匹配，翻回
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

// 开始计时器
function startTimer() {
    timerInterval = setInterval(() => {
        timer++;
        timerElement.textContent = `时间: ${timer}秒`;
    }, 1000);
}

// 结束游戏
function endGame() {
    clearInterval(timerInterval);
    
    // 创建模态框元素
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.style.display = 'flex';
    
    // 模态框内容
    modal.innerHTML = `
        <div class="modal-content">
            <h2>恭喜你赢了！</h2>
            <p>你用了 ${moves} 步</p>
            <p>耗时 ${timer} 秒</p>
            <button class="play-again">再玩一次</button>
        </div>
    `;
    
    // 添加到页面
    document.body.appendChild(modal);
    
    // 再玩一次按钮事件
    const playAgainButton = modal.querySelector('.play-again');
    playAgainButton.addEventListener('click', () => {
        document.body.removeChild(modal);
        initGame();
    });
}

// 重新开始按钮事件
restartButton.addEventListener('click', initGame);

// 游戏初始化
initGame();
