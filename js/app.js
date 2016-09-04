// use strict mode to converting mistake into errors
// further info
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode

"use strict";
var score_updated;

// Actor class
// mentor suggest to split function (sides) in enemy and player classes for more modular and DRY
// but i think, it different behaviour i guess, and it just make more complex when it injected into collide function.
// then i didn't split it.

// Enemies our player must avoid
var Enemy = function(x, y, speed, sprite) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = sprite;
    this.x = x;
    this.y = y;
    this.speed = speed;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;
    this.reset();
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Reset enemy location
Enemy.prototype.reset = function() {
    if (this.x >= 500) {
        this.x = -101;
        this.speed = Math.floor(Math.random() * (450 - 250 + 1)) + 250;
    }
};

// The following prototype function store enemy dimensions
Enemy.prototype.sides = function(side) {
    if (side === 'leftSide') {
        return this.x;
    }
    if (side === 'rightSide') {
        return this.x + 101;
    }
    if (side === 'topSide') {
        return this.y + 77;
    }
    if (side === 'bottomSide') {
        return this.y + 144;
    }
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
// you can change player preference by changing asset.
// dont forget to load the resource in egine.js
var Player = function(x, y) {
    this.sprite = 'images/char-cat-girl.png';
    this.x = x;
    this.y = y;
    this.score = 0;
};

// collision player position is reset, score decreased by 1
Player.prototype.update = function() {
    if (this.collide()) {
        this.reset();
        if (this.score >= 1) {
            this.score = this.score - 1;
            console.log("nyan-girl hit the bug, score decreased " + this.score);
        }
    }
};

// Renders player, adds player score to top right corner of canvas\
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    if (score_updated === true) {
        ctx.clearRect(382, 0, 100, 50);
        ctx.font = "Bold 24px Arial";
        ctx.fillText("Score: " + this.score, 382, 35);
    } else {
        ctx.font = "Bold 24px Arial";
        ctx.fillText("Score: " + this.score, 382, 35);
    }
};


// prevents player out of map
Player.prototype.handleInput = function(direction) {
    if (direction === 'left' && this.x !== borders.leftWall) {
        this.x -= 101;
    }
    if (direction === 'right' && this.x !== borders.rightWall) {
        this.x += 101;
    }
    if (direction === 'up' && this.y !== borders.topWall) {
        this.y -= 85;
        // increase score when hit water
    } else if (direction === 'up' && this.y === 50) {
        this.reset();
        this.score++;
        score_updated = true;
        console.log("score increased " + this.score);
    }
    if (direction === 'down' && this.y !== borders.bottomWall) {
        this.y += 85;
    }
};

// Canvas border coordinate
var borders = {
    leftWall: 0,
    rightWall: 404,
    bottomWall: 390,
    topWall: 50
};

// player dimension to detect collision
Player.prototype.sides = function(side) {
    if (side === 'leftSide') {
        return this.x + 31;
    }
    if (side === 'rightSide') {
        return this.x + 84;
    }
    if (side === 'topSide') {
        return this.y + 80;
    }
    if (side === 'bottomSide') {
        return this.y + 140;
    }
};

// Detects collision, returns boolean value
Player.prototype.collide = function() {
    for (var i = 0, len = allEnemies.length; i < len; i++) { 
        if (this.sides('leftSide') < allEnemies[i].sides('rightSide') &&
            this.sides('rightSide') > allEnemies[i].sides('leftSide') &&
            this.sides('topSide') < allEnemies[i].sides('bottomSide') &&
            this.sides('bottomSide') > allEnemies[i].sides('topSide')) {
            return true;
        }
    }
};

// Reset player to start points
Player.prototype.reset = function() {
    this.x = 202;
    this.y = 390;
};

// Insitantiate player object
var enemy1 = new Enemy(-101, 55, randomInt(250, 450), 'images/enemy-bug.png');
var enemy2 = new Enemy(-101, 140, randomInt(250, 450), 'images/rotten-enemy-bug.png');
var enemy3 = new Enemy(-101, 225, randomInt(250, 450), 'images/enemy-bug.png');

// push all enemies to array
var allEnemies = [];
allEnemies.push(enemy1);
allEnemies.push(enemy2);
allEnemies.push(enemy3);

// Place the player object in a variable called player
var player = new Player(202, 390);

// random int function
// to make enemy appear randomly
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// This listens for key presses and sends the keys to your
// player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});