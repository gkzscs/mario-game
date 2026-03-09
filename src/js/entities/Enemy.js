/**
 * 敌人类
 * 简单的巡逻敌人
 */

export class Enemy {
    constructor(x, y, minX, maxX) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.minX = minX;
        this.maxX = maxX;
        this.speed = 1.5;
        this.direction = 1;
    }

    update() {
        this.x += this.speed * this.direction;

        // 巡逻范围
        if (this.x <= this.minX) {
            this.direction = 1;
        } else if (this.x + this.width >= this.maxX) {
            this.direction = -1;
        }
    }

    render(ctx) {
        ctx.save();

        // 身体
        ctx.fillStyle = '#8B0000';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // 眼睛
        ctx.fillStyle = '#FFF';
        ctx.fillRect(this.x + 5, this.y + 5, 8, 8);
        ctx.fillRect(this.x + 17, this.y + 5, 8, 8);

        // 瞳孔
        ctx.fillStyle = '#000';
        const pupilOffset = this.direction > 0 ? 3 : 0;
        ctx.fillRect(this.x + 7 + pupilOffset, this.y + 7, 4, 4);
        ctx.fillRect(this.x + 19 + pupilOffset, this.y + 7, 4, 4);

        // 脚
        ctx.fillStyle = '#8B0000';
        ctx.fillRect(this.x + 2, this.y + this.height, 8, 5);
        ctx.fillRect(this.x + this.width - 10, this.y + this.height, 8, 5);

        ctx.restore();
    }
}