const Ball = {
    props: ['x', 'y'],
    template: '<div class="ball" :style="{ left: x + \'px\', top: y + \'px\' }"></div>'
};

const Paddle = {
    props: ['x'],
    template: '<div class="paddle" :style="{ left: x + \'px\' }"></div>'
};

const app = Vue.createApp({
    components: {
        Ball,
        Paddle
    },
    data() {
        return {
            ballX: 0,
            ballY: 0,
            paddleX: 0,
            x: 3,
            y: -3,
            leftPressed: false,
            rightPressed: false,
            score: 0,
            gameOver: false,
            gameStarted: false,
            startTime: 0,
            gameLoop: null,
            isDarkTheme: false,
            bricks: [],
            brickCount: 0,
            brickWidth: 75,
            brickHeight: 20,
            brickPadding: 10,
            brickOffsetTop: 30,
            brickOffsetLeft: 30,
            brickRowCount: 3,
            brickColumnCount: 5
        }
    },
    mounted() {
        this.initializeGame();
    },
    methods: {
        initializeGame() {
            window.addEventListener('keydown', this.keyDownHandler);
            window.addEventListener('keyup', this.keyUpHandler);
        },
        startGame() {
            this.score = 0;
            this.startTime = Date.now();
            this.gameOver = false;
            this.gameStarted = true;
            this.paddleX = (480 - 80) / 2; // Paddle starts in the middle
            this.ballX = (480 - 10) / 2; // Ball starts in the middle
            this.ballY = (320 - 10) / 2; // Ball starts in the middle
            this.initializeBricks();
            this.gameLoop = requestAnimationFrame(this.updateGame);
        },
        initializeBricks() {
            const brickContainer = document.getElementById("brick-container");
            brickContainer.innerHTML = "";
            this.bricks = [];
            this.brickCount = 0;
            for (let i = 0; i < this.brickRowCount; i++) {
                for (let j = 0; j < this.brickColumnCount; j++) {
                    const brick = document.createElement("div");
                    brick.className = "brick";
                    brick.style.left = j * (this.brickWidth + this.brickPadding) + this.brickOffsetLeft + "px";
                    brick.style.top = i * (this.brickHeight + this.brickPadding) + this.brickOffsetTop + "px";
                    brickContainer.appendChild(brick);
                    this.bricks.push(brick);
                    this.brickCount++;
                }
            }
        },
        updateGame() {
            if (!this.gameOver) {
                this.updateBallPosition();
                this.checkCollisions();
                this.updatePaddlePosition();
                this.gameLoop = requestAnimationFrame(this.updateGame);
            }
        },
        updateBallPosition() {
            this.ballX += this.x;
            this.ballY += this.y;
        },
        checkCollisions() {
            if (this.ballX < 0 || this.ballX + 10 > 480) {
                this.x = -this.x; // Reverse horizontal direction
            }
            if (this.ballY < 0) {
                this.y = -this.y; // Reverse vertical direction
            } else if (this.ballY + 10 > 320) {
                this.endGame(); // End game if ball falls below
            }
            if (this.ballY + 10 > 320 - 10 &&
                this.ballX + 10 > this.paddleX &&
                this.ballX < this.paddleX + 80) {
                this.y = -this.y; // Reverse vertical direction on paddle hit
                this.score += 10; // Increment score
            }
            this.checkBrickCollisions();
        },
        checkBrickCollisions() {
            for (let i = 0; i < this.bricks.length; i++) {
                const brick = this.bricks[i];
                if (brick.style.display !== "none" &&
                    this.ballY < parseInt(brick.style.top) + this.brickHeight &&
                    this.ballY + 10 > parseInt(brick.style.top) &&
                    this.ballX + 10 > parseInt(brick.style.left) &&
                    this.ballX < parseInt(brick.style.left) + this.brickWidth) {
                    this.y = -this.y;
                    brick.style.display = "none";
                    this.brickCount--;
                    this.score += 20; // Increment score by 20
                    if (this.brickCount === 0) {
                        this.endGame();
                    }
                }
            }
        },
        updatePaddlePosition() {
            if (this.leftPressed && this.paddleX > 0) {
                this.paddleX -= 5;
            } else if (this.rightPressed && this.paddleX + 80 < 480) {
                this.paddleX += 5;
            }
        },
        endGame() {
            this.gameOver = true;
            this.gameStarted = false;
            cancelAnimationFrame(this.gameLoop);
            alert("游戏结束，你的得分是：" + this.score);
        },
        resetGame() {
            this.startGame();
        },
        keyDownHandler(event) {
            if (event.key === "ArrowLeft") {
                this.leftPressed = true;
            } else if (event.key === "ArrowRight") {
                this.rightPressed = true;
            }
        },
        keyUpHandler(event) {
            if (event.key === "ArrowLeft") {
                this.leftPressed = false;
            } else if (event.key === "ArrowRight") {
                this.rightPressed = false;
            }
        },
        changeTheme(theme) {
            this.isDarkTheme = theme === "dark";
        }
    }
});

app.mount('#app');