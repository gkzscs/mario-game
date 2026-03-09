/**
 * 相机类
 * 实现场景跟随玩家移动
 */

export class Camera {
    constructor(canvasWidth, canvasHeight, levelWidth) {
        this.x = 0;
        this.y = 0;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.levelWidth = levelWidth;
        this.levelHeight = canvasHeight;

        // 平滑跟随
        this.smoothFactor = 0.1;
        this.targetX = 0;
    }

    follow(player) {
        // 计算目标位置（玩家居中）
        this.targetX = player.x - this.canvasWidth / 2 + player.width / 2;

        // 平滑插值
        this.x += (this.targetX - this.x) * this.smoothFactor;

        // 边界限制
        if (this.x < 0) this.x = 0;
        if (this.x > this.levelWidth - this.canvasWidth) {
            this.x = this.levelWidth - this.canvasWidth;
        }
    }

    applyTransform(ctx) {
        ctx.save();
        ctx.translate(-this.x, -this.y);
    }

    resetTransform(ctx) {
        ctx.restore();
    }

    isVisible(obj) {
        return obj.x + obj.width > this.x &&
               obj.x < this.x + this.canvasWidth;
    }
}