const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const WIDTH = 400, HEIGHT = 600;
let plane = { x: WIDTH/2-20, y: HEIGHT-60, w: 40, h: 40 };
let bullets = [];
let enemies = [];
let score = 0;
let gameOver = false;

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') plane.x -= 20;
  if (e.key === 'ArrowRight') plane.x += 20;
  if (e.key === ' ' || e.key === 'Spacebar') bullets.push({ x: plane.x+plane.w/2-3, y: plane.y, w: 6, h: 15 });
  if (gameOver && e.key === 'r') restart();
});

function restart() {
  plane.x = WIDTH/2-20;
  bullets = [];
  enemies = [];
  score = 0;
  gameOver = false;
}

function drawPlane() {
  ctx.fillStyle = '#4fc3f7';
  ctx.fillRect(plane.x, plane.y, plane.w, plane.h);
  ctx.fillStyle = '#fff';
  ctx.fillRect(plane.x+plane.w/2-5, plane.y+10, 10, 20);
}

function drawBullets() {
  ctx.fillStyle = '#ffeb3b';
  bullets.forEach(b => ctx.fillRect(b.x, b.y, b.w, b.h));
}

function drawEnemies() {
  ctx.fillStyle = '#e57373';
  enemies.forEach(e => ctx.fillRect(e.x, e.y, e.w, e.h));
}

function draw() {
  ctx.clearRect(0,0,WIDTH,HEIGHT);
  drawPlane();
  drawBullets();
  drawEnemies();
  ctx.fillStyle = '#fff';
  ctx.font = '20px Arial';
  ctx.fillText('Score: ' + score, 10, 30);
  if (gameOver) {
    ctx.fillStyle = '#f44336';
    ctx.font = '36px Arial';
    ctx.fillText('Game Over', 100, 300);
    ctx.font = '20px Arial';
    ctx.fillText('Press R to Restart', 110, 340);
  }
}

function update() {
  if (gameOver) return;
  // 총알 이동
  bullets.forEach(b => b.y -= 10);
  // 적 이동
  enemies.forEach(e => e.y += 3);
  // 총알-적 충돌
  for (let i = enemies.length-1; i >= 0; i--) {
    for (let j = bullets.length-1; j >= 0; j--) {
      let e = enemies[i], b = bullets[j];
      if (b.x < e.x+e.w && b.x+b.w > e.x && b.y < e.y+e.h && b.y+b.h > e.y) {
        enemies.splice(i,1);
        bullets.splice(j,1);
        score += 10;
        break;
      }
    }
  }
  // 적-비행기 충돌
  for (let e of enemies) {
    if (plane.x < e.x+e.w && plane.x+plane.w > e.x && plane.y < e.y+e.h && plane.y+plane.h > e.y) {
      gameOver = true;
    }
  }
  // 화면 밖 제거
  bullets = bullets.filter(b => b.y + b.h > 0);
  enemies = enemies.filter(e => e.y < HEIGHT);
  // 적 생성
  if (Math.random() < 0.03) {
    let ex = Math.random() * (WIDTH-40);
    enemies.push({ x: ex, y: -40, w: 40, h: 40 });
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}
loop();
