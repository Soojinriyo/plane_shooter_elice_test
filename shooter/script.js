const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const WIDTH = 400, HEIGHT = 600;
let plane = { x: WIDTH/2-20, y: HEIGHT-60, w: 40, h: 40 };
let bullets = [];
let enemies = [];
let score = 0;
let gameOver = false;
let bombs = 3;
let energy = 1;
let energyMode = false;
let energyTimer = 0;

function fireBullets() {
  if (energyMode) {
    // 3방향 총알
    bullets.push({ x: plane.x+plane.w/2-3, y: plane.y, w: 6, h: 15, dx: 0 });
    bullets.push({ x: plane.x+plane.w/2-3, y: plane.y, w: 6, h: 15, dx: -3 });
    bullets.push({ x: plane.x+plane.w/2-3, y: plane.y, w: 6, h: 15, dx: 3 });
  } else {
    bullets.push({ x: plane.x+plane.w/2-3, y: plane.y, w: 6, h: 15, dx: 0 });
  }
}

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') plane.x = Math.max(0, plane.x - 20);
  if (e.key === 'ArrowRight') plane.x = Math.min(WIDTH - plane.w, plane.x + 20);
  if (e.key === ' ' || e.key === 'Spacebar') fireBullets();
  if (e.key === 'b' || e.key === 'B') {
    if (bombs > 0 && !gameOver) {
      bombs--;
      // 폭탄 효과: 모든 적 제거
      enemies = [];
      // 폭발 이펙트 화면 전체에
      bombEffectTimer = 20;
    }
  }
  if ((e.key === 'e' || e.key === 'E') && energy > 0 && !energyMode && !gameOver) {
    energy--;
    energyMode = true;
    energyTimer = 300; // 약 5초 (60fps 기준)
  }
  if (gameOver && e.key === 'r') restart();
});

let bombEffectTimer = 0;

function restart() {
  plane.x = WIDTH/2-20;
  bullets = [];
  enemies = [];
  score = 0;
  gameOver = false;
  bombs = 3;
  energy = 1;
  energyMode = false;
  energyTimer = 0;
}

function drawPlane() {
  // 본체
  ctx.save();
  ctx.translate(plane.x + plane.w/2, plane.y + plane.h/2);
  ctx.beginPath();
  ctx.moveTo(0, -plane.h/2);
  ctx.lineTo(-plane.w/2, plane.h/2);
  ctx.lineTo(plane.w/2, plane.h/2);
  ctx.closePath();
  ctx.fillStyle = energyMode ? '#ffd600' : '#4fc3f7';
  ctx.shadowColor = energyMode ? '#ffd600' : '#2196f3';
  ctx.shadowBlur = 10;
  ctx.fill();
  ctx.restore();
  // 조종석
  ctx.save();
  ctx.translate(plane.x + plane.w/2, plane.y + plane.h/6);
  ctx.beginPath();
  ctx.arc(0, 0, 7, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.shadowBlur = 0;
  ctx.fill();
  ctx.restore();
}

function drawBullets() {
  ctx.fillStyle = '#ffeb3b';
  bullets.forEach(b => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(b.x + b.w/2, b.y, 4, 0, Math.PI * 2);
    ctx.shadowColor = '#fffde7';
    ctx.shadowBlur = 6;
    ctx.fill();
    ctx.restore();
  });
}

function drawEnemies() {
  enemies.forEach(e => {
    ctx.save();
    ctx.translate(e.x + e.w/2, e.y + e.h/2);
    ctx.beginPath();
    ctx.arc(0, 0, e.w/2, 0, Math.PI * 2);
    ctx.fillStyle = '#e57373';
    ctx.shadowColor = '#ff1744';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.restore();
  });
}

function drawBackground() {
  let grad = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  grad.addColorStop(0, '#232b60');
  grad.addColorStop(1, '#6dd5ed');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
}

function drawDirectionArrows() {
  // 좌우 방향 표시
  ctx.save();
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = '#fff';
  // 왼쪽
  ctx.beginPath();
  ctx.moveTo(30, HEIGHT-50);
  ctx.lineTo(10, HEIGHT-40);
  ctx.lineTo(30, HEIGHT-30);
  ctx.closePath();
  ctx.fill();
  // 오른쪽
  ctx.beginPath();
  ctx.moveTo(WIDTH-30, HEIGHT-50);
  ctx.lineTo(WIDTH-10, HEIGHT-40);
  ctx.lineTo(WIDTH-30, HEIGHT-30);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawStatusBar() {
  ctx.save();
  ctx.font = 'bold 18px Arial';
  ctx.fillStyle = '#fff';
  ctx.shadowColor = '#000';
  ctx.shadowBlur = 2;
  ctx.fillText('Score: ' + score, 12, 34);
  ctx.fillText('Bombs: ' + bombs, 140, 34);
  ctx.fillText('Energy: ' + energy, 260, 34);
  if (energyMode) {
    ctx.fillStyle = '#ffd600';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('ENERGY MODE!', 320-120, 60);
  }
  ctx.restore();
}

function drawBombEffect() {
  if (bombEffectTimer > 0) {
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#fffbe7';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.globalAlpha = 1;
    ctx.restore();
  }
}

function draw() {
  drawBackground();
  drawPlane();
  drawBullets();
  drawEnemies();
  drawDirectionArrows();
  drawStatusBar();
  drawBombEffect();
  if (gameOver) {
    ctx.save();
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = '#232b60';
    ctx.fillRect(40, 220, 320, 120);
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#f44336';
    ctx.font = 'bold 40px Arial';
    ctx.shadowColor = '#fff';
    ctx.shadowBlur = 5;
    ctx.fillText('Game Over', 90, 270);
    ctx.font = '20px Arial';
    ctx.fillStyle = '#fff';
    ctx.shadowBlur = 0;
    ctx.fillText('Press R to Restart', 110, 310);
    ctx.restore();
  }
}

function update() {
  if (gameOver) return;
  // 총알 이동
  bullets.forEach(b => {
    b.y -= 10;
    if (b.dx) b.x += b.dx;
  });
  // 에너지 모드 타이머
  if (energyMode) {
    energyTimer--;
    if (energyTimer <= 0) energyMode = false;
  }
  // 폭탄 이펙트 타이머
  if (bombEffectTimer > 0) bombEffectTimer--;
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
  bullets = bullets.filter(b => b.y + b.h > 0 && b.x > -10 && b.x < WIDTH+10);
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
