/**
 * 玩家类
 * 处理玩家的移动、跳跃和碰撞
 */

import { Inventory } from './systems/Inventory.js';

export class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 40;
        this.vx = 0;
        this.vy = 0;

        // 移动参数
        this.baseSpeed = 5;
        this.speed = this.baseSpeed;
        this.jumpForce = -12;
        this.friction = 0.8;

        // 状态
        this.onGround = false;
        this.facingRight = true;

        // 道具效果
        this.speedBoost = 0;
        this.shield = false;
        this.shieldTime = 0;
        this.canDoubleJump = false;
        this.doubleJumpTime = 0;
        this.hasDoubleJumped = false;
        this.invincible = false;
        this.invincibleTime = 0;

        // 背包
        this.inventory = new Inventory(5);
    }

    update(input, gravity, levelWidth, levelHeight, platforms, deltaTime = 16) {
        // 更新道具效果时间
        this.updateEffects(deltaTime);

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
        if (input.jump) {
            if (this.onGround) {
                this.vy = this.jumpForce;
                this.onGround = false;
                this.hasDoubleJumped = false;
            } else if (this.canDoubleJump && !this.hasDoubleJumped) {
                // 双跳
                this.vy = this.jumpForce * 0.85;
                this.hasDoubleJumped = true;
            }
        }

        // 应用重力
        this.vy += gravity;

        // 限制下落速度
        if (this.vy > 15) this.vy = 15;

        // 更新位置
        this.x += this.vx;
        this.y += this.vy;

        // 边界检测
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > levelWidth) this.x = levelWidth - this.width;

        // 平台碰撞检测
        this.onGround = false;
        platforms.forEach(platform => {
            if (this.checkPlatformCollision(platform)) {
                // 从上方落下
                if (this.vy > 0 && this.y + this.height - this.vy <= platform.y + 5) {
                    this.y = platform.y - this.height;
                    this.vy = 0;
                    this.onGround = true;
                    this.hasDoubleJumped = false;
                }
            }
        });

        // 处理道具使用
        if (input.useItem) {
            const used = this.inventory.useItem(this);
            if (used === 'extraLife') {
                // 额外生命特殊处理
                return 'extraLife';
            }
        }

        // 背包选择
        if (input.nextItem) {
            this.inventory.selectNext();
        }
        if (input.prevItem) {
            this.inventory.selectPrev();
        }

        return null;
    }

    updateEffects(deltaTime) {
        // 速度提升
        if (this.speedBoost > 0) {
            this.speedBoost -= deltaTime;
            if (this.speedBoost <= 0) {
                this.speed = this.baseSpeed;
                this.speedBoost = 0;
            }
        }

        // 护盾
        if (this.shieldTime > 0) {
            this.shieldTime -= deltaTime;
            if (this.shieldTime <= 0) {
                this.shield = false;
                this.shieldTime = 0;
            }
        }

        // 双跳
        if (this.doubleJumpTime > 0) {
            this.doubleJumpTime -= deltaTime;
            if (this.doubleJumpTime <= 0) {
                this.canDoubleJump = false;
                this.doubleJumpTime = 0;
            }
        }

        // 无敌
        if (this.invincibleTime > 0) {
            this.invincibleTime -= deltaTime;
            if (this.invincibleTime <= 0) {
                this.invincible = false;
                this.invincibleTime = 0;
            }
        }
    }

    checkPlatformCollision(platform) {
        return this.x < platform.x + platform.width &&
               this.x + this.width > platform.x &&
               this.y < platform.y + platform.height &&
               this.y + this.height > platform.y;
    }

    collectItem(itemType) {
        return this.inventory.addItem(itemType);
    }

    render(ctx) {
        ctx.save();

        // 翻转绘制方向
        if (!this.facingRight) {
            ctx.translate(this.x + this.width, this.y);
            ctx.scale(-1, 1);
            ctx.translate(-this.x, -this.y);
        }

        // 无敌闪烁效果
        if (this.invincible && Math.floor(Date.now() / 100) % 2 === 0) {
            ctx.globalAlpha = 0.5;
        }

        // 护盾光环
        if (this.shield) {
            ctx.strokeStyle = 'rgba(65, 105, 225, 0.6)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, 28, 0, Math.PI * 2);
            ctx.stroke();
        }

        // 速度特效
        if (this.speedBoost > 0) {
            ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
            for (let i = 1; i <= 3; i++) {
                ctx.fillRect(this.x - i * 8, this.y + 5, 6, this.height - 10);
            }
        }

        // 身体
        ctx.fillStyle = this.invincible ? '#FFD700' : '#FF6B6B';
        ctx.fillRect(this.x, this.y + 10, this.width, this.height - 10);

        // 头部
        ctx.fillStyle = '#FFE66D';
        ctx.fillRect(this.x + 4, this.y, this.width - 8, 15);

        // 眼睛
        ctx.fillStyle = '#000';
        ctx.fillRect(this.x + 18, this.y + 5, 5, 5);

        // 帽子
        ctx.fillStyle = this.invincible ? '#FFD700' : '#FF4757';
        ctx.fillRect(this.x + 2, this.y - 5, this.width - 4, 8);

        // 双跳指示
        if (this.canDoubleJump) {
            ctx.fillStyle = '#32CD32';
            ctx.fillRect(this.x + 12, this.y + this.height + 2, 8, 4);
        }

        ctx.restore();
    }
}