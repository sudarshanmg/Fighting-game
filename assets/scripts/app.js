const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const backGround = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./assets/images/background.png",
});

const shop = new Sprite({
  position: {
    x: 620,
    y: 128,
  },
  imageSrc: "./assets/images/shop.png",
  scale: 2.75,
  framesMax: 6,
});

const player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: "./assets/samuraiMack/Idle.png",
  scale: 2.5,
  framesMax: 8,
  offset: {
    x: 215,
    y: 156,
  },
  sprites: {
    idle: {
      imageSrc: "./assets/samuraiMack/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "./assets/samuraiMack/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./assets/samuraiMack/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./assets/samuraiMack/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./assets/samuraiMack/Attack1.png",
      framesMax: 6,
    },
    takeHit: {
      imageSrc: "./assets/samuraiMack/Take Hit - white silhouette.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "./assets/samuraiMack/Death.png",
      framesMax: 6,
    },
  },
  attackBox: {
    offet: {
      x: 100,
      y: 50,
    },
    width: 150,
    height: 25,
  },
});

const enemy = new Fighter({
  position: {
    x: 900,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "red",
  offset: {
    x: -50,
    y: 0,
  },
  imageSrc: "./assets/kenji/Idle.png",
  scale: 2.5,
  framesMax: 4,
  offset: {
    x: 215,
    y: 168,
  },
  sprites: {
    idle: {
      imageSrc: "./assets/kenji/Idle.png",
      framesMax: 4,
    },
    run: {
      imageSrc: "./assets/kenji/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./assets/kenji/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./assets/kenji/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./assets/kenji/Attack1.png",
      framesMax: 4,
    },
    takeHit: {
      imageSrc: "./assets/kenji/Take Hit.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "./assets/kenji/Death.png",
      framesMax: 7,
    },
  },
  attackBox: {
    offet: {
      x: -170,
      y: 50,
    },
    width: 150,
    height: 25,
  },
});

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowUp: {
    pressed: false,
  },
};

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  backGround.update();
  shop.update();
  // c.fillStyle = 'rgba(255, 255, 255, 0.15)';
  // c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  // Player movement
  if (keys.a.pressed && !keys.d.pressed) {
    player.switchSprite("run");
    player.velocity.x = -5;
  } else if (keys.d.pressed && !keys.a.pressed) {
    player.switchSprite("run");
    player.velocity.x = 5;
  } else if (keys.a.pressed && keys.d.pressed) {
    player.velocity.x = 0;
    player.switchSprite("idle");
  } else if (!keys.a.pressed && !keys.d.pressed) {
    player.switchSprite("idle");
  }

  // player jumping
  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  // Enemy movement
  if (keys.ArrowLeft.pressed) {
    enemy.velocity.x = -5;
    enemy.switchSprite("run");
  } else if (keys.ArrowRight.pressed) {
    enemy.velocity.x = 5;
    enemy.switchSprite("run");
  } else if (keys.ArrowLeft.pressed && keys.ArrowRight.pressed) {
    enemy.velocity.x = 0;
    enemy.switchSprite("idle");
  } else if (!keys.ArrowLeft.pressed && !keys.ArrowRight.pressed) {
    enemy.switchSprite("idle");
  }

  // enemy jumping
  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }

  // collision detector & enemy gets hit
  if (
    rectangularCollision({ rect1: player, rect2: enemy }) &&
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    player.isAttacking = false;
    // console.log('Player attacked!');
    enemy.health -= 25;
    enemy.takeHit();
    // document.getElementById("enemy-health").style.width = enemy.health + "%";
    gsap.to('#enemy-health', {
      width: enemy.health + '%'
    });
  }

  // if player misses
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false;
  }

  // collision detector & player gets hit
  if (
    rectangularCollision({ rect1: enemy, rect2: player }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2
  ) {
    enemy.isAttacking = false;
    // console.log('Enemy attacked!');
    player.health -= 20;
    player.takeHit();
    // document.getElementById("player-health").style.width = player.health + "%";
    gsap.to('#player-health', {
      width: player.health + '%'
    });
  }

  // if enemy misses
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false;
  }

  // check health if time runs out
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}

animate();

let enemyAttackPressed = false;
let enemyJumpPressed = false;
let playerAttackPressed = false;
let playerJumpPressed = false;
window.addEventListener("keydown", (event) => {
  if (!player.dead) {
    switch (event.key) {
      // Player
      case "d":
        keys.d.pressed = true;
        // player.switchSprite('run');

        break;
      case "a":
        keys.a.pressed = true;
        // player.switchSprite('run');
        break;
      case "w":
        if (!playerJumpPressed) {
          playerJumpPressed = true;
          player.velocity.y = -20;
        }
        break;
      case " ":
        if (!playerAttackPressed) {
          playerAttackPressed = true;
          player.attack();
        }

        break;
    }
  }

  if (!enemy.dead) {
    switch (event.key) {
      // Enemy
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        break;
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        break;
      case "ArrowUp":
        if (!enemyJumpPressed) {
          enemyJumpPressed = true;
          enemy.velocity.y = -20;
        }
        break;
      case "ArrowDown":
        if (!enemyAttackPressed) {
          enemyAttackPressed = true;
          enemy.attack();
        }
    }
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    // Player
    case "d":
      keys.d.pressed = false;

      break;
    case "a":
      keys.a.pressed = false;

      break;
    case " ":
      playerAttackPressed = false;
      break;
    case "w":
      playerJumpPressed = false;
      break;

    // Enemy
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
    case "ArrowDown":
      enemyAttackPressed = false;
      break;
    case "ArrowUp":
      enemyJumpPressed = false;
      break;
  }
});
