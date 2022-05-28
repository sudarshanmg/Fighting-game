function rectangularCollision({ rect1, rect2 }) {
    return (
      rect1.attackBox.position.x + rect1.attackBox.width >= rect2.position.x &&
      rect1.attackBox.position.x <= rect2.position.x + rect2.width &&
      rect1.attackBox.position.y + rect1.attackBox.height >= rect2.position.y &&
      rect1.attackBox.position.y <= rect2.position.y + rect2.height
    );
  }
  
  function determineWinner({ player, enemy, timerId }) {
    clearTimeout(timerId);
    document.getElementById("result").style.display = "flex";
    
    if (player.health === enemy.health) {
      // console.log('There is a tie!');
      document.querySelector("#result h1").textContent = "Tie!";
    } else if (player.health > enemy.health) {
      // console.log('There is a tie!');
      document.querySelector("#result h1").textContent = "Player Wins!";
    } else {
      document.querySelector("#result h1").textContent = "Enemy Wins!";
    }
  }
  
  let timer = 60;
  let timerId;
  function decreaseTimer() {
    if (timer > 0) {
      timerId = setTimeout(decreaseTimer, 1000);
      timer--;
      document.querySelector("#timer h1").textContent = timer;
    }
    if (timer === 0) {
      determineWinner({ player, enemy, timerId });
    }
  }