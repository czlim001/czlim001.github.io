document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById("gameCanvas");
    const start2PlayerButton = document.getElementById("start2PlayerButton");
    const start4PlayerButton = document.getElementById("start4PlayerButton"); 
    const ctx = canvas.getContext("2d");

//Initialize player mode being used
    let playerMode = "2-player";

//Setting up the paddles for initial positions and the size of the bats
    const batHeight = 80;
    const batWidth = 10;
    let leftBatY = canvas.height/2 - batHeight/2;
    let rightBatY = canvas.height/2 - batHeight/2;
    let player1Y = canvas.height/2 - batHeight/2;
    let player2Y = canvas.height/2 - batHeight/2;
    let player3X = canvas.height/2 - batHeight/2;
    let player4X = canvas.height/2 - batHeight/2;

//To determine the speed of the bat
    const batSpeed = 15;
    const leftBatSpeed = 0;
    const rightBatSpeed = 0;
    const player1BatSpeed = 0;
    const player2BatSpeed = 0;
    const player3BatSpeed = 0;
    const player4BatSpeed = 0;
    

//Setting up the balls for initial positions and the size of the balls
    const ballSize = 10
    let BallX = canvas.width/2;
    let BallY = canvas.height/2;
    let ballSpeedX = 3;
    let ballSpeedY = 3;

//Setting up array for split balls
    const balls = [];
    let isBallSplit = false;
    let splitTimer;

//Setting up the scoreboard for the game
    let leftPlayerScore = 0;
    let rightPlayerScore = 0;
    let player1Score = 0;
    let player2Score = 0;
    let player3Score = 0;
    let player4Score = 0;

//Adding variables to track player inputs
    let leftBatUpPressed = false;
    let leftBatDownPressed = false;
    let rightBatUpPressed = false;
    let rightBatDownPressed = false;
    let player1UpPressed = false;
    let player1DownPressed = false;
    let player2UpPressed = false;
    let player2DownPressed = false;
    let player3LeftPressed = false;
    let player3RightPressed = false;
    let player4LeftPressed = false;
    let player4RightPressed = false;

//Setting up timer event for ball to split
    let timerActive = false;

// Variable to check if the game is running
    let isGameRunning = false;

//Setting a variable for game end
    let gameEnded = false;

//Creating the bats
    function drawBats() {
        ctx.fillStyle = "#ffff00";
        if (isGameRunning && playerMode === "2-player") {
            ctx.fillRect(0, leftBatY, batWidth, batHeight);
            ctx.fillRect(canvas.width - batWidth, rightBatY, batWidth, batHeight);
        }
        if (isGameRunning && playerMode === "4-player") {
            ctx.fillRect(10, player1Y, batWidth, batHeight);
            ctx.fillRect(canvas.width - 20, player2Y, batWidth, batHeight);
            ctx.fillRect(player3X, 10, batHeight, batWidth);
            ctx.fillRect(player4X, canvas.height - 20, batHeight, batWidth);
        }
        
    }

//Creating the ball
    function drawBall() {
        ctx.beginPath();
            ctx.arc(BallX, BallY, ballSize, 0, Math.PI*2);
        ctx.fillStyle = "#ffff00";
        ctx.fill();
        ctx.closePath();

//Creating the new balls
        for (let i = 0; i < balls.length; i++) {
            ctx.beginPath();
            ctx.arc(balls[i].x, balls[i].y, ballSize, 0, Math.PI * 2);
            ctx.fillStyle = "#ffff00";
            ctx.fill();
            ctx.closePath();
}
    }


//Creating the scoreboard
    function drawScore() {
        ctx.font = "40px Helvetica";
        ctx.fillStyle = "#ffff00";
        ctx.fillText(
            leftPlayerScore + " - " + rightPlayerScore + " | " + player1Score + " - " + player2Score + " | " + player3Score + " - " + player4Score, canvas.width / 2 - 40, 50);
    }

//Creating a win condition for the game
    function checkGameEnd() {
        if(leftPlayerScore >= 11 || rightPlayerScore >= 11 || player1Score >= 11 || player2Score >= 11 || player3Score >= 11 || player4Score >= 11 ) {
            isGameRunning = false;
            gameEnded = true;
        }
    }

//Function to calculate scoring when a player gets a point
    function scorePoint(player) {
        if (player === "left") {
            leftPlayerScore++;
        } else if (player === "right") {
            rightPlayerScore++;
        } else if (player === "player1") {
            player1Score++;
        } else if (player === "player2") {
            player2Score++;
        } else if (player === "player3") {
            player3Score++;
        } else if (player === "player4") {
            player4Score++;
        }
        resetBall();
    }

//Adding functions for game elements
    function update() {
        if (!gameEnded) {

//Determining relative bat position
            if (leftBatUpPressed && leftBatY > 0) {
                leftBatY -= batSpeed
            }
            if (leftBatDownPressed && batHeight + leftBatY < canvas.height) {
                leftBatY += batSpeed;
            }
            if (rightBatUpPressed && rightBatY > 0) {
                rightBatY -= batSpeed
            }
            if (rightBatDownPressed && batHeight + rightBatY < canvas.height) {
                rightBatY += batSpeed;
            }
            if (player1UpPressed && player1Y > 0) {
                player1Y -= batSpeed
            }
            if (player1DownPressed && batHeight + player1Y < canvas.height) {
                player1Y += batSpeed;
            }
            if (player2UpPressed && player2Y > 0) {
                player2Y -= batSpeed;
            }
            if (player2DownPressed && batHeight + player2Y < canvas.height) {
                player2Y += batSpeed;
            }
            
            if (player3LeftPressed) {
                player3X -= batSpeed;
            }
            if (player3RightPressed) {
                player3X += batSpeed;
            }
            if (player4LeftPressed) {
                player4X -= batSpeed;
            }
            if (player4RightPressed) {
                player4X += batSpeed;
            }

// To ensure that the bat is within the canvas
            if (leftBatY < 0) {
                leftBatY = 0;
            } else if (leftBatY + batHeight > canvas.height) {
                leftBatY = canvas.height - batHeight;
            }
            if (rightBatY < 0) {
                rightBatY = 0;
            } else if (rightBatY + batHeight > canvas.height) {
                rightBatY = canvas.height - batHeight;
            }
            if (player1Y < 0) {
                player1Y = 0;
            } else if (player1Y + batHeight > canvas.height) {
                player1Y = canvas.height - batHeight;
            }
            if (player2Y < 0) {
                player2Y = 0;
            } else if (player2Y + batHeight > canvas.height) {
                player2Y = canvas.height - batHeight;
            }
            if (player3X < 0) {
                player3X = 0;
            }
             else if (player3X + batWidth > canvas.width) {
                player3X = canvas.width - batWidth;
            }
            if (player4X < 0) {
                player4X = 0;
            }
            else if (player4X + batWidth > canvas.width) {
                player4X = canvas.width - batWidth;
            }


//Determining relative ball position
            BallX += ballSpeedX;
            BallY += ballSpeedY;

//Updating split balls' positions
            for (let i = 0; i < balls.length; i++) {
                balls[i].x += balls[i].speedX;
                balls[i].y += balls[i].speedY;
            }


//When ball comes into contact with the walls
            if (BallY - ballSize < 0 || BallY + ballSize > canvas.height) {
                ballSpeedY = -ballSpeedY;
            }

            if (BallX - ballSize < 0) {
                if (playerMode === "2-player") {
                    rightPlayerScore++;
                } else {
                    player2Score++;
                }
                resetBall();
                startTimer();
            } else if (BallX + ballSize > canvas.width) {
                if (playerMode === "2-player") {
                    leftPlayerScore++;
                } else {
                    player1Score++;
                }
                resetBall();
                startTimer();
            }

            if (playerMode === "4-player") {
                if (BallY - ballSize < 0) {
                    player3Score++;
                    resetBall();
                }
                else if (BallY + ballSize > canvas.height) {
                    player4Score++;
                    resetBall();
                    startTimer();
                }
                if (BallX - ballSize < 0) {
                    player2Score++;
                    resetBall();
                    startTimer();
                }
                else if (BallX + ballSize > canvas.width) {
                    player1Score++;
                    resetBall();
                    startTimer();
                } else {
                    if (BallY - ballSize < 0 || BallY + ballSize > canvas.height) {
                        ballSpeedY = -ballSpeedY;
                    }               
                    if (BallX - ballSize < 0) {
                        player2Score++;
                        resetBall();
                        startTimer();
                    }
                    else if (BallX + ballSize > canvas.width) {
                        player1Score++;
                        resetBall();
                        startTimer();
                    }
                }
            }
// When ball comes into contact with the bat
            if (
                (BallX - ballSize < batWidth && BallY > leftBatY && BallY < leftBatY + batHeight) || 
                (BallX + ballSize > canvas.width - batWidth && BallY > rightBatY && BallY < rightBatY + batHeight)||
                (BallX - ballSize < batWidth && BallY > player1Y && BallY < player1Y + batHeight) ||
                (BallX + ballSize > canvas.width - batWidth && BallY > player2Y && BallY < player2Y + batHeight) ||
                (BallX - ballSize < player3X + batWidth && BallX + ballSize > player3X && BallY - ballSize < 10 + batHeight && BallY + ballSize > 10) ||
                (BallX - ballSize < player4X + batWidth && BallX + ballSize > player4X && BallY - ballSize < canvas.height - 20 + batHeight && BallY + ballSize > canvas.height - 20)
                ) {
                ballSpeedX = -ballSpeedX;
                ballSpeedY = -ballSpeedY
                const angle = (Math.random() - 0.5) * Math.PI / 2;
                ballSpeedY = Math.sign(ballSpeedY) * Math.sin(angle) * Math.abs(ballSpeedX);
            }
           

// When ball is out of bounds(player scores and gains a point)
            if (BallX - ballSize < 0) { 
                rightPlayerScore++;
                resetBall();
            } else if (BallX + ballSize > canvas.width) {
                leftPlayerScore++;
                resetBall();
            }

            checkGameEnd();
            if(gameEnded) {
                leftPlayerScore = 0;
                rightPlayerScore = 0;
                player1Score = 0;
                player2Score = 0;
                player3Score = 0;
                player4Score = 0;
                gameEnded = false;
            }
        }
    }
 //Initializing the ball back to the original position
    function resetBall() {
        BallX = canvas.width / 2;
        BallY = canvas.height / 2;
        ballSpeedX = Math.random() > 0.5 ? 3 : -3;
        ballSpeedY = Math.random() > 0.5 ? 3 : -3;
        isBallSplit = false;
        startTimer();
    }

//Setting a function to start the timer
function startTimer() {
    clearInterval(splitTimer);
    splitTimer = setInterval(function () {
        console.log('Timer triggered');
        splitBall();
    }, 5000);
}

//Setting a function to split the ball
    function splitBall() {
        if (!isBallSplit) {
// Create two new balls with their positions and speeds
                const splitSpeed = 2;
                const angle = Math.PI / 4;
                const newBall1 = {
                    x: BallX,
                    y: BallY,
                    speedX: -ballSpeedX,
                    speedY: splitSpeed * Math.sin(angle),
                };

                const newBall2 = {
                    x: BallX,
                    y: BallY,
                    speedX: ballSpeedX,
                    speedY: splitSpeed * Math.sin(angle),
                };

                balls.push(newBall1);
                balls.push(newBall2)

                isBallSplit = true;
                
            }
        }

//To update and change the player scores after either player scores a point
function gameLoop() {
    if (isGameRunning) {
        update();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBats();
        drawBall();
        drawScore();
        if (isGameRunning) {
            requestAnimationFrame(gameLoop);
        } else {
            ctx.font = "50px Helvetica";
            ctx.fillStyle = "#ffff00";
            if (playerMode === "2-player") {
                if (leftPlayerScore >= 11) {
                    ctx.fillText("Left Player Wins!", canvas.width / 2 - 200, canvas.height / 3);
                } else {
                    ctx.fillText("Right Player Wins!", canvas.width / 2 - 200, canvas.height / 3);
                }
            } else if (playerMode === "4-player") { // Corrected the "else" to "else if"
                if (player1Score >= 11) {
                    ctx.fillText("Player 1 Wins!", canvas.width / 2 - 200, canvas.height / 3);
                } else if (player2Score >= 11) {
                    ctx.fillText("Player 2 Wins!", canvas.width / 2 - 200, canvas.height / 3);
                } else if (player3Score >= 11) {
                    ctx.fillText("Player 3 Wins!", canvas.width / 2 - 200, canvas.height / 3);
                } else {
                    ctx.fillText("Player 4 Wins!", canvas.width / 2 - 200, canvas.height / 3);
                }
            }
        }
    }
}

    function start2PlayerGame() {
        if (!isGameRunning) {
            playerMode = "2-player";
            leftPlayerScore = 0;
            rightPlayerScore = 0;
            resetBall();
            isGameRunning = true;
            requestAnimationFrame(gameLoop);
        }
    }

    function start4PlayerGame() {
        if (!isGameRunning) {
            playerMode = "4-player";
            player1Score = 0;
            player2Score = 0;
            player3Score = 0;
            player4Score = 0;
            resetBall();
            isGameRunning = true;
            requestAnimationFrame(gameLoop);
        }
    }

    function stopGame() {
        isGameRunning = false;
    }

//To add event listeners to record user input
    start2PlayerButton.addEventListener("click", function() {
        start2PlayerGame();
    });

    start4PlayerButton.addEventListener("click", function() {
        start4PlayerGame();
    });
    
    window.addEventListener("keydown", function (e) {
        switch (e.key) {
            case "r":
                leftBatUpPressed = true;
                break;
            case "f":
                leftBatDownPressed = true;
                break;
            case "0":
                rightBatUpPressed = true;
                break;
            case "p":
                rightBatDownPressed = true;
                break;
            case "w":
                player1UpPressed = true;
                break;
            case "s":
                player1DownPressed = true;
                break;
            case "ArrowUp":
                player2UpPressed = true;
                break;
            case "ArrowDown":
                player2DownPressed = true;
                break;
            case "7":
                player3LeftPressed = true;
                break;
            case "9":
                player3RightPressed = true;
                break;
            case "b":
                player4LeftPressed = true;
                break;
            case "m":
                player4RightPressed = true;
                break;
        }
    });

    window.addEventListener("keyup", function (e) {
        switch (e.key) {
            case "r":
                leftBatUpPressed = false;
                break;
            case "f":
                leftBatDownPressed = false;
                break;
            case "0":
                rightBatUpPressed = false;
                break;
            case "p":
                rightBatDownPressed = false;
                break;
            case "w":
                player1UpPressed = false;
                break;
            case "s":
                player1DownPressed = false;
                break;
            case "ArrowUp":
                player2UpPressed = false;
                break;
            case "ArrowDown":
                player2DownPressed = false;
                break;
            case "7":
                player3LeftPressed = false;
                break;
            case "9":
                player3RightPressed = false;
                break;
            case "b":
                player4LeftPressed = false;
                break;
            case "m":
                player4RightPressed = false;
                break;
        }
    });
});