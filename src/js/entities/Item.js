/**
 * 道具基类
 */

export class Item {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.width = 24;
        this.height = 24;
        this.type = type;
        this.collected = false;

        // 浮动动画
        this.baseY = y;
        this.floatOffset = 0;
        this.floatSpeed = 0.05;
        this.floatRange = 5;
    }

    update(timestamp) {
        this.floatOffset = Math.sin(timestamp * this.floatSpeed) * this.floatRange;
        this.y = this.baseY + this.floatOffset;
    }

    render(ctx) {
        if (this.collected) return;

        ctx.save();

        switch (this.type) {
            case 'speed':
                this.renderSpeedBoost(ctx);
                break;
            case 'shield':
                this.renderShield(ctx);
                break;
            case 'doubleJump':
                this.renderDoubleJump(ctx);
                break;
            case 'extraLife':
                this.renderExtraLife(ctx);
                break;
            case 'star':
                this.renderStar(ctx);
                break;
        }

        ctx.restore();
    }

    renderSpeedBoost(ctx) {
        // 速度提升道具 - 闪电形状
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.moveTo(this.x + 12, this.y);
        ctx.lineTo(this.x + 4, this.y + 10);
        ctx.lineTo(this.x + 10, this.y + 10);
        ctx.lineTo(this.x + 8, this.y + 24);
        ctx.lineTo(this.x + 18, this.y + 10);
        ctx.lineTo(this.x + 12, this.y + 10);
        ctx.closePath();
        ctx.fill();

        // 发光效果
        ctx.strokeStyle = '#FFF';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    renderShield(ctx) {
        // 护盾道具 - 盾牌形状
        ctx.fillStyle = '#4169E1';
        ctx.beginPath();
        ctx.moveTo(this.x + 12, this.y);
        ctx.lineTo(this.x + 22, this.y + 6);
        ctx.lineTo(this.x + 22, this.y + 14);
        ctx.quadraticCurveTo(this.x + 12, this.y + 24, this.x + 2, this.y + 14);
        ctx.lineTo(this.x + 2, this.y + 6);
        ctx.closePath();
        ctx.fill();

        // 高光
        ctx.fillStyle = '#87CEEB';
        ctx.beginPath();
        ctx.moveTo(this.x + 12, this.y + 3);
        ctx.lineTo(this.x + 18, this.y + 7);
        ctx.lineTo(this.x + 12, this.y + 11);
        ctx.closePath();
        ctx.fill();
    }

    renderDoubleJump(ctx) {
        // 双跳道具 - 双箭头
        ctx.fillStyle = '#32CD32';

        // 上箭头
        ctx.beginPath();
        ctx.moveTo(this.x + 12, this.y);
        ctx.lineTo(this.x + 20, this.y + 8);
        ctx.lineTo(this.x + 4, this.y + 8);
        ctx.closePath();
        ctx.fill();

        // 下箭头
        ctx.beginPath();
        ctx.moveTo(this.x + 12, this.y + 10);
        ctx.lineTo(this.x + 20, this.y + 18);
        ctx.lineTo(this.x + 4, this.y + 18);
        ctx.closePath();
        ctx.fill();
    }

    renderExtraLife(ctx) {
        // 额外生命 - 爱心形状
        ctx.fillStyle = '#FF69B4';

        ctx.beginPath();
        ctx.moveTo(this.x + 12, this.y + 6);
        ctx.bezierCurveTo(this.x + 12, this.y + 4, this.x + 8, this.y, this.x + 4, this.y + 4);
        ctx.bezierCurveTo(this.x, this.y + 8, this.x + 4, this.y + 14, this.x + 12, this.y + 22);
        ctx.bezierCurveTo(this.x + 20, this.y + 14, this.x + 24, this.y + 8, this.x + 20, this.y + 4);
        ctx.bezierCurveTo(this.x + 16, this.y, this.x + 12, this.y + 4, this.x + 12, this.y + 6);
        ctx.fill();
    }

    renderStar(ctx) {
        // 无敌星星 - 旋转星星
        ctx.fillStyle = '#FFD700';

        const cx = this.x + 12;
        const cy = this.y + 12;
        const spikes = 5;
        const outerRadius = 12;
        const innerRadius = 5;

        ctx.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (i * Math.PI) / spikes - Math.PI / 2;
            const x = cx + Math.cos(angle) * radius;
            const y = cy + Math.sin(angle) * radius;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();

        // 眼睛
        ctx.fillStyle = '#000';
        ctx.fillRect(cx - 4, cy - 2, 3, 3);
        ctx.fillRect(cx + 2, cy - 2, 3, 3);
    }
}