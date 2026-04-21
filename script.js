const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');

// 设置 canvas 尺寸
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// 绘制心形
function drawHeartShape(centerX, centerY, size, scale = 1) {
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.scale(scale, scale);
    
    ctx.fillStyle = '#ff6b9d';
    ctx.beginPath();
    
    const x = 0;
    const y = 0;
    
    // 绘制���形
    ctx.moveTo(x, y + size * 0.35);
    
    // 左边的圆弧
    ctx.bezierCurveTo(
        x - size * 0.5, y - size * 0.2,
        x - size * 0.8, y - size * 0.5,
        x - size * 0.3, y - size * 0.7
    );
    
    ctx.bezierCurveTo(
        x - size * 0.1, y - size * 0.85,
        x + size * 0.1, y - size * 0.85,
        x + size * 0.3, y - size * 0.7
    );
    
    // 右边的圆弧
    ctx.bezierCurveTo(
        x + size * 0.8, y - size * 0.5,
        x + size * 0.5, y - size * 0.2,
        x, y + size * 0.35
    );
    
    ctx.fill();
    ctx.restore();
}

// 动画变量
let animationProgress = 0;
let direction = 1;

// 主动画循环
function animate() {
    // 清空 canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 更新动画进度
    animationProgress += direction * 0.05;
    
    if (animationProgress >= 1) {
        direction = -1;
    } else if (animationProgress <= 0) {
        direction = 1;
    }
    
    // 计算缩放比例（0.8 到 1.1 之间的脉动）
    const scale = 0.8 + animationProgress * 0.3;
    
    // 绘制心形
    drawHeartShape(canvas.width / 2, canvas.height / 2, 100, scale);
    
    // 继续动画循环
    requestAnimationFrame(animate);
}

// 处理窗口 resize
window.addEventListener('resize', resizeCanvas);

// 初始化
resizeCanvas();
animate();