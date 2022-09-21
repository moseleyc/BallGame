const gameCanvas = new fabric.Canvas("gameCanvas");
const newGameBtn = $(".gameButtons .newGameBtn");
const stopGameBtn = $(".gameButtons .stopGameBtn");
const gameScoreDiv = $(".gameControls .gameScore");
const gameDifficultyDiv = $(".gameControls .gameDifficulty");

// Default Values
const bubbleRadius = 2 * Math.PI;
const bubbleSize = 10;
const bubbleStartAngle = 0;
const bubblesCreatedInArray = 1;
const bubblesMax = 20
const bubblesMaxDirection = 1;

const defaultGameScore = 0;
const defaultGameDifficultyLevel = 1;

let gameBubbleArray = [];
let gameScore = 0;
let gameDifficultyLevel = 1;
let interval;

let theOptions

// Makes the speed of the balls increase faster
let gameDifficultyMultiplier = 1;

fabric.Object.prototype.selectable = false;

newGameBtn.on("click", function () {
    clearInterval(interval);
    startGame();
})

stopGameBtn.on("click", function () {
    clearGame();
    clearInterval(interval);
})

gameCanvas.on("mouse:down", function (options) {
    if (options.target != null) {
        gameCanvas.remove(options.target);

        gameScore += gameDifficultyLevel;

        gameScoreDiv.children("p").text(`Score: ${gameScore}`);

        if (gameCanvas.getObjects().length === 0) {
            gameDifficultyLevel++;
            gameDifficultyDiv.children("p").text(`Difficulty: ${gameDifficultyLevel}`);
            populateBubbles();
        }
    }
})

function startGame() {
    clearGame();
    gameScore = defaultGameScore;
    gameDifficultyLevel = defaultGameDifficultyLevel;
    gameScoreDiv.children("p").text(`Score: ${gameScore}`);
    gameDifficultyDiv.children("p").text(`Difficulty: ${gameDifficultyLevel}`);
    populateBubbles();
    theOptions = gameCanvas.getObjects()
    interval = setInterval(animate, 20);
    //fabric.util.requestAnimFrame(animate);
    //gameCanvas.renderAll();
}

function populateBubbles() {
    // Draw array bubbles
    gameBubbleArray = newBubblesArray();
    gameBubbleArray.forEach(function (bubble) {
        let circle = new fabric.Circle({ radius: bubbleRadius, fill: bubble.colour, left: bubble.x, top: bubble.y });
        //circle.animate('left', (bubble.x < 0 || bubble.x > gameCanvas.width) ? bubble.xDirection * -1 : bubble.xDirection, {
        //    onChange: gameCanvas.renderAll.bind(gameCanvas),
        //    onComplete: function () {
        //        circle.animate('left', (bubble.x < 0 || bubble.x > gameCanvas.width) ? bubble.xDirection * -1 : bubble.xDirection)
        //    }
        //});
        gameCanvas.add(circle)
    })
}

function clearGame() {
    gameCanvas.getObjects().forEach(function (item) {
        gameCanvas.remove(item);
    })    
}

function animate() {
    gameCanvas.getObjects().forEach(function (circle) {
        console.log(`BEFORE: ${circle.left} : ${circle.top}`);
        theBubble.newPosition();
        console.log(`AFTER: ${circle.left} : ${circle.top}`);
    });
    gameCanvas.renderAll();
}

function newBubblesArray() {
    const bubbleArray = [];

    for (let i = 0; i < bubblesCreatedInArray && i <= bubblesMax; i++) {
        xCoord = Math.random() * gameCanvas.width;
        yCoord = Math.random() * gameCanvas.height;
        xDir = (Math.random() * 2) - bubblesMaxDirection;
        yDir = (Math.random() * 2) - bubblesMaxDirection;
        spd = Math.random() * gameDifficultyLevel * gameDifficultyMultiplier;
        if (spd === 0) {
            spd = 1;
        }
        bubbleArray.push(new Bubble(xCoord, yCoord, "red", xDir, yDir, spd))
    }

    return bubbleArray;
}

// @Acknowledgement to supernova
// https://stackoverflow.com/questions/12625766/javascript-canvas-detect-click-on-shape
class Bubble {
    constructor(x, y, colour, xDirection, yDirection, speed) {
        this.x = x;
        this.y = y;
        this.colour = colour;
        this.xDirection = xDirection;
        this.yDirection = yDirection;
        this.speed = speed;
    }

    increaseSpeed(speedMultiplier) {
        this.speed = speedMultiplier;
    }

    newPosition() {
        this.x += this.xDirection * this.speed;
        this.y += this.yDirection * this.speed;

        if (this.x > gameCanvas.width || this.x < 0) {
            this.xDirection *= -1;
        }

        if (this.y > gameCanvas.height || this.y < 0) {
            this.yDirection *= -1;
        }
    }
}