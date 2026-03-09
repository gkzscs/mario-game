/**
 * 玩家类
 * 处理玩家的移动、跳跃和碰撞
 */

export class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 40;
        this.vx = 0;
        this.vy = 0;

        // 移动参数
        this.speed = 5;
        this.jumpForce = -12;
        this.friction = 0.8;

        // 状态
        this.onGround = false;
        this.facingRight = true;
    }

    update(input, gravity, canvasWidth, canvasHeight, platforms) {
        // 水平移动
        if (input.left) {
            this.vx = -this.speed;
            this.facingRight = false;
        } else if (input.right) {
            this.vx = this.speed;
            this.facingRight = true;
        } else {
            this.vx *= this.friction;
        }

        // 跳跃
        if (input.jump && this.onGround) {
            this.vy = this.jumpForce;
            this.onGround = false;
        }

        // 应用重力
        this.vy += gravity;

        // 更新位置
        this.x += this.vx;
        this.y += this.vy;

        // 边界检测
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > canvasWidth) this.x = canvasWidth - this.width;

        // 平台碰撞检测
        this.onGround = false;
        platforms.forEach(platform => {
            if (this.checkPlatformCollision(platform)) {
                // 从上方落下
                if (this.vy > 0 && this.y + this.height - this.vy <= platform.y) {
                    this.y = platform.y - this.height;
                    this.vy = 0;
                    this.onGround = true;
                }
            }
        });
    }

    checkPlatformCollision(platform) {
        return this.x < platform.x + platform.width &&
               this.x + this.width > platform.x &&
               this.y < platform.y + platform.height &&
               this.y + this.height > platform.y;
    }

    render(ctx) {
        ctx.save();

        // 翻转绘制方向
        if (!this.facingRight) {
            ctx.translate(this.x + this.width, this.y);
            ctx.scale(-1, 1);
            ctx.translate(-this.x, -this.y);
        }

        // 身体
        ctx.fillStyle = '#FF6B6B';
        ctx.fillRect(this.x, this.y + 10, this.width, this.height - 10);

        // 头部
        ctx.fillStyle = '#FFE66D';
        ctx.fillRect(this.x + 4, this.y, this.width - 8, 15);

        // 眼睛
        ctx.fillStyle = '#000';
        ctx.fillRect(this.x + 18, this.y + 5, 5, 5);

        // 帽子
        ctx.fillStyle = '#FF4757';
        ctx.fillRect(this.x + 2, this.y - 5, this.width - 4, 8);

        ctx.restore();
    }
}