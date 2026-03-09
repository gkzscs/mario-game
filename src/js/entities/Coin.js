/**
 * 金币类
 */

export class Coin {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.collected = false;

        // 动画
        this.animFrame = 0;
        this.animTimer = 0;
    }

    update(timestamp) {
        // 简单的旋转动画
        this.animTimer += 16;
        if (this.animTimer > 100) {
            this.animFrame = (this.animFrame + 1) % 4;
            this.animTimer = 0;
        }
    }

    render(ctx) {
        if (this.collected) return;

        ctx.save();

        // 金币主体
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();

        // 根据动画帧改变宽度模拟旋转
        const widths = [20, 15, 5, 15];
        const currentWidth = widths[this.animFrame];

        ctx.ellipse(
            this.x + this.width / 2,
            this.y + this.height / 2,
            currentWidth / 2,
            this.height / 2,
            0, 0, Math.PI * 2
        );
        ctx.fill();

        // 高光
        if (currentWidth > 10) {
            ctx.fillStyle = '#FFF8DC';
            ctx.beginPath();
            ctx.ellipse(
                this.x + this.width / 2 - 3,
                this.y + this.height / 2 - 3,
                3,
                4,
                0, 0, Math.PI * 2
            );
            ctx.fill();
        }

        ctx.restore();
    }
}