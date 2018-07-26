// Game Setup
var game = new Phaser.Game(640, 480, Phaser.AUTO, 'stage', {
    preload: preload,
    create: create,
    update: update
});

// Global Variables
var cursors;
var player_speed = 600;
var hscore=0;
var coin;
var coin_padding = 60;
var score = 0;
var score_text;
var gameOverText;
var enemySpeed=400;
var hscoreText="";
var newRecord=false;
var r;
var resetText;

//Global functions

var randomCoinPosition = function(){
  let posX = Math.round(Math.random()*(game.width-(2*coin_padding+1)+coin_padding));
  let posY = Math.round(Math.random()* (game.height-(2*coin_padding+1)+coin_padding));
  coin.position = new Phaser.Point(posX,posY);
}

function checkHScore(){
  if (score>hscore){
    newRecord = true;
    hscore = score;
    hscoreText.text = "High Score: " + hscore;
    localStorage.setItem('hscore', hscore);
  }else{
    newRecord = false;
  }
}

function reset(){
  score = 0;
  score_text.text = 'Score:'+ score;
  gameOverText.text="";
  resetText.text = "";
  player.reset(128,128);
  randomCoinPosition();
}


// var Collect = function(){
//   randomCoinPoisition();
// }

// Loads assets before starting the game
function preload() {

    game.load.crossOrigin = 'anonymous'; // For loading external assets
    // Load player image
    game.load.image('player','https://heyitsguy.github.io/Coin-Collector-Game/Images/Mariopix.png');

    game.load.image('coin', 'https://upload.wikimedia.org/wikipedia/commons/4/46/Bitcoin.svg');
    game.load.image('enemy', 'https://heyitsguy.github.io/Coin-Collector-Game/Images/Wario.png');

}

// Creates game objects before starting the game
function create() {
   game.physics.startSystem(Phaser.Physics.Arcade); // Starts the physics system

    cursors = game.input.keyboard.createCursorKeys(); // Adds keyboard input

    game.stage.backgroundColor = "#72d899";

    // Add Player
    player = game.add.sprite(128, 128, 'player'); // Add player sprite at x, y position
    player.scale.setTo(0.5, 0.5); //scale the image
    game.physics.enable(player, Phaser.Physics.ARCADE); // Enable player physics
    player.body.collideWorldBounds = true; // Keep player inside the screen

    enemy = game.add.sprite(360,400,'enemy');
    enemy.scale.setTo(0.5,0.5);
    game.physics.enable(enemy, Phaser.Physics.ARACDE);

    gameOverText = game.add.text(0,0,"",{
      fill:'white',
      font:'50pt Arial',
      boundsAlignH: 'center',
      boundsAlignV: 'middle'
    });

    gameOverText.setTextBounds(0,0,640,480);

    if(localStorage.getItem('hscore')){
      hscore = localStorage.getItem('hscore');
    }

    r=game.input.keyboard.addKey(Phaser.Keyboard.R);

    resetText = game.add.text(0,0,"",{
      fill: 'white',
      boundsAlignH:'center',
      boundsAlignV: 'bottom'
    });
    resetText.setTextBounds(0,0,640,480);

    hscoreText= game.add.text(440,15, "High Score: " + hscore, {
      fill: 'white'
    });
    // Add Key
    coin = game.add.sprite(200, 200, 'coin'); // Add key sprite at x, y position
    coin.scale.setTo(0.4, 0.4); //scale the image
    game.physics.enable(coin, Phaser.Physics.ARCADE); // Enable key physics
    coin.body.immovable = true; // Keep key from moving
    // Picks a random location on the stage for the coin to appear.
    randomCoinPosition();
    score_text = game.add.text(15,15,"Score:" + score,{
      fill:"white"
    });
}

// Runs every frame
function update() {
  if (r.downDuration(1)) {
  reset();
  }
    var speed_x = 0; // Current x speed
    var speed_y = 0; // Current y speed

    // X Movement
    if (cursors.left.isDown) { // Left
        speed_x = speed_x - player_speed;
    } else if (cursors.right.isDown) { // Right
        speed_x = speed_x + player_speed;
    }

    // Y Movement
    if (cursors.up.isDown) { // Up
        speed_y = -player_speed;
    } else if (cursors.down.isDown) { // Down
        speed_y = player_speed;
    }

    var speed_dir = new Phaser.Point(speed_x, speed_y); // make speed vector
    player.body.velocity = speed_dir; // Set player velocity

    var enemyDir = new Phaser.Point(enemySpeed,(speed_y * .5));
    if(enemy.world.x > 640){
      enemy.position = new Phaser.Point(0,player.world.y)
    }
    enemy.body.velocity = enemyDir;

    game.physics.arcade.collide(player, coin, function(){
      randomCoinPosition();
      score++;
      score_text.text = "Score: " +score;
      document.getElementById("score").innerHTML = score;
      checkHScore();
    }); // Player-key collision
    game.physics.arcade.collide(player, enemy, function(){
      player.kill();
      gameOverText.text = "GAME OVER";
      resetText.text = "Hit the R key to Restart!";
      if(newRecord === true){
        gameOverText.text += "\n New Record!";
      }
    });


}
