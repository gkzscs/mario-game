/**
 * 游戏主类
 * 管理游戏状态、渲染和更新逻辑
 */

import { Player } from '../entities/Player.js';
import { Platform } from '../entities/Platform.js';
import { Enemy } from '../entities/Enemy.js';
import { Coin } from '../entities/Coin.js';
import { Item } from '../entities/Item.js';
import { Camera } from './Camera.js';

export class Game {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.width = canvas.width;
        this.height = canvas.height;

        // 关卡尺寸（扩展关卡）
        this.levelWidth = 3200;
        this.levelHeight = this.height;

        // 游戏状态
        this.isRunning = false;
        this.score = 0;
        this.lives = 3;
        this.coins = 0;
        this.currentLevel = 1;
        this.maxLevel = 3;

        // 游戏对象
        this.player = null;
        this.platforms = [];
        this.enemies = [];
        this.coinsList = [];
        this.items = [];
        this.camera = null;

        // 重力
        this.gravity = 0.5;

        // 回调
        this.onGameOver = null;
        this.onUIUpdate = null;
        this.onLevelComplete = null;

        // 时间
        this.lastTime = 0;
        this.deltaTime = 16;

        // 背景云朵
        this.clouds = [];

        // 初始化关卡
        this.initLevel();
    }

    initLevel() {
        // 创建玩家
        this.player = new Player(100, 400);

        // 创建相机
        this.camera = new Camera(this.width, this.height, this.levelWidth);

        // 根据关卡创建不同内容
        this.createLevelContent();

        // 创建背景云朵
        this.createClouds();
    }

    createLevelContent() {
        this.platforms = [];
        this.enemies = [];
        this.coinsList = [];
        this.items = [];

        // ============ 第一区域 (0-800) ============
        // 起始地面
        this.platforms.push(new Platform(0, 550, 400, 50));

        // 第一个跳跃平台
        this.platforms.push(new Platform(450, 480, 100, 20));
        this.platforms.push(new Platform(600, 400, 150, 20));

        // 金币
        this.coinsList.push(new Coin(480, 450));
        this.coinsList.push(new Coin(520, 450));
        this.coinsList.push(new Coin(650, 370));
        this.coinsList.push(new Coin(700, 370));

        // 第一个道具 - 速度提升
        this.items.push(new Item(700, 350, 'speed'));

        // ============ 第二区域 (800-1600) ============
        // 断崖和跳跃区域
        this.platforms.push(new Platform(800, 550, 200, 50));
        this.platforms.push(new Platform(1050, 480, 80, 20));
        this.platforms.push(new Platform(1180, 400, 80, 20));
        this.platforms.push(new Platform(1050, 320, 100, 20));
        this.platforms.push(new Platform(1200, 550, 300, 50));

        // 敌人
        this.enemies.push(new Enemy(850, 520, 800, 950));
        this.enemies.push(new Enemy(1250, 520, 1200, 1450));

        // 金币群
        for (let i = 0; i < 5; i++) {
            this.coinsList.push(new Coin(1080 + i * 25, 290));
        }

        // 护盾道具
        this.items.push(new Item(1100, 280, 'shield'));

        // ============ 第三区域 (1600-2400) ============
        // 高空跳跃区域
        this.platforms.push(new Platform(1550, 550, 150, 50));
        this.platforms.push(new Platform(1750, 480, 100, 20));
        this.platforms.push(new Platform(1900, 400, 80, 20));
        this.platforms.push(new Platform(1800, 320, 100, 20));
        this.platforms.push(new Platform(1950, 250, 120, 20));
        this.platforms.push(new Platform(1750, 180, 80, 20));
        this.platforms.push(new Platform(2100, 550, 200, 50));

        // 敌人
        this.enemies.push(new Enemy(1600, 520, 1550, 1680));
        this.enemies.push(new Enemy(2150, 520, 2100, 2280));

        // 金币
        for (let i = 0; i < 3; i++) {
            this.coinsList.push(new Coin(1780 + i * 25, 290));
        }
        this.coinsList.push(new Coin(1980, 220));
        this.coinsList.push(new Coin(1780, 150));

        // 双跳道具
        this.items.push(new Item(1800, 150, 'doubleJump'));

        // ============ 第四区域 (2400-3200) ============
        // 最终挑战区域
        this.platforms.push(new Platform(2350, 550, 150, 50));
        this.platforms.push(new Platform(2550, 480, 100, 20));
        this.platforms.push(new Platform(2700, 400, 80, 20));
        this.platforms.push(new Platform(2550, 320, 120, 20));
        this.platforms.push(new Platform(2750, 250, 100, 20));
        this.platforms.push(new Platform(2600, 180, 80, 20));
        this.platforms.push(new Platform(2850, 550, 350, 50));

        // 更多敌人
        this.enemies.push(new Enemy(2400, 520, 2350, 2480));
        this.enemies.push(new Enemy(2900, 520, 2850, 3100));

        // 金币群
        for (let i = 0; i < 8; i++) {
            this.coinsList.push(new Coin(2580 + i * 25, 290));
        }

        // 额外生命
        this.items.push(new Item(2650, 150, 'extraLife'));

        // 无敌星星（终点附近）
        this.items.push(new Item(3050, 350, 'star'));

        // 终点金币群
        for (let i = 0; i < 10; i++) {
            this.coinsList.push(new Coin(2950 + i * 25, 520));
        }

        // 终点标志区域的平台
        this.platforms.push(new Platform(3000, 400, 150, 20));
    }

    createClouds() {
        this.clouds = [];
        for (let i = 0; i < 15; i++) {
            this.clouds.push({
                x: Math.random() * this.levelWidth,
                y: Math.random() * 300 + 50,
                width: Math.random() * 80 + 60,
                speed: Math.random() * 0.3 + 0.1
            });
        }
    }

    reset() {
        this.score = 0;
        this.lives = 3;
        this.coins = 0;
        this.currentLevel = 1;
        this.isRunning = false;
        this.initLevel();
    }

    start() {
        this.isRunning = true;
        this.lastTime = performance.now();
    }

    update(input, timestamp) {
        if (!this.isRunning) return;

        // 计算时间差
        this.deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        // 更新玩家
        const result = this.player.update(
            input,
            this.gravity,
            this.levelWidth,
            this.levelHeight,
            this.platforms,
            this.deltaTime
        );

        // 处理额外生命道具使用
        if (result === 'extraLife') {
            this.lives++;
        }

        // 更新相机
        this.camera.follow(this.player);

        // 更新敌人
        this.enemies.forEach(enemy => enemy.update());

        // 更新道具动画
        this.items.forEach(item => item.update(timestamp));

        // 更新金币动画
        this.coinsList.forEach(coin => coin.update(timestamp));

        // 更新云朵
        this.clouds.forEach(cloud => {
            cloud.x += cloud.speed;
            if (cloud.x > this.levelWidth + cloud.width) {
                cloud.x = -cloud.width;
            }
        });

        // 检测碰撞
        this.checkCollisions();

        // 检查游戏结束条件
        if (this.player.y > this.height) {
            this.loseLife();
        }

        // 检查关卡完成
        if (this.player.x > this.levelWidth - 100) {
            this.levelComplete();
        }
    }

    checkCollisions() {
        // 玩家与敌人碰撞
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            if (this.isColliding(this.player, enemy)) {
                // 无敌状态直接消灭敌人
                if (this.player.invincible) {
                    this.enemies.splice(i, 1);
                    this.score += 100;
                    continue;
                }

                // 从上方踩敌人
                if (this.player.vy > 0 && this.player.y + this.player.height - 10 < enemy.y) {
                    this.enemies.splice(i, 1);
                    this.player.vy = -10; // 弹跳
                    this.score += 100;
                } else if (!this.player.shield) {
                    // 有护盾不会受伤
                    this.loseLife();
                    break;
                } else {
                    // 护盾抵挡
                    this.player.shield = false;
                    this.player.shieldTime = 0;
                }
            }
        }

        // 玩家与金币碰撞
        for (let i = this.coinsList.length - 1; i >= 0; i--) {
            const coin = this.coinsList[i];
            if (this.isColliding(this.player, coin)) {
                this.coinsList.splice(i, 1);
                this.coins++;
                this.score += 50;

                // 每100金币加一条命
                if (this.coins % 100 === 0) {
                    this.lives++;
                }
            }
        }

        // 玩家与道具碰撞
        for (let i = this.items.length - 1; i >= 0; i--) {
            const item = this.items[i];
            if (!item.collected && this.isColliding(this.player, item)) {
                if (this.player.collectItem(item.type)) {
                    item.collected = true;
                    this.items.splice(i, 1);
                    this.score += 200;
                }
            }
        }
    }

    isColliding(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    loseLife() {
        if (this.player.invincible) return;

        this.lives--;
        if (this.lives <= 0) {
            this.gameOver();
        } else {
            // 重置玩家位置到最近的安全点
            const safeX = Math.max(100, Math.floor(this.player.x / 800) * 800 + 100);
            this.player.x = safeX;
            this.player.y = 400;
            this.player.vx = 0;
            this.player.vy = 0;

            // 给短暂无敌
            this.player.invincible = true;
            this.player.invincibleTime = 2000;
        }
    }

    levelComplete() {
        if (this.currentLevel < this.maxLevel) {
            this.currentLevel++;
            this.levelWidth += 800;
            this.player.x = 100;
            this.player.y = 400;
            this.camera = new Camera(this.width, this.height, this.levelWidth);
            this.createLevelContent();

            if (this.onLevelComplete) {
                this.onLevelComplete(this.currentLevel);
            }
        } else {
            // 游戏通关
            this.isRunning = false;
            if (this.onGameOver) {
                this.onGameOver(true); // 传递胜利标志
            }
        }
    }

    gameOver() {
        this.isRunning = false;
        if (this.onGameOver) {
            this.onGameOver(false);
        }
    }

    setOnGameOver(callback) {
        this.onGameOver = callback;
    }

    setOnUIUpdate(callback) {
        this.onUIUpdate = callback;
    }

    setOnLevelComplete(callback) {
        this.onLevelComplete = callback;
    }

    render() {
        // 清空画布
        this.ctx.clearRect(0, 0, this.width, this.height);

        // 绘制背景渐变
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(0.5, '#98D8E8');
        gradient.addColorStop(1, '#70C5CE');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // 绘制云朵（视差效果）
        this.renderClouds();

        // 应用相机变换
        this.camera.applyTransform(this.ctx);

        // 绘制平台
        this.platforms.forEach(platform => {
            if (this.camera.isVisible(platform)) {
                platform.render(this.ctx);
            }
        });

        // 绘制金币
        this.coinsList.forEach(coin => {
            if (this.camera.isVisible(coin)) {
                coin.render(this.ctx);
            }
        });

        // 绘制道具
        this.items.forEach(item => {
            if (this.camera.isVisible(item)) {
                item.render(this.ctx);
            }
        });

        // 绘制敌人
        this.enemies.forEach(enemy => {
            if (this.camera.isVisible(enemy)) {
                enemy.render(this.ctx);
            }
        });

        // 绘制玩家
        this.player.render(this.ctx);

        // 绘制终点旗帜
        this.renderFlag();

        // 重置相机变换
        this.camera.resetTransform(this.ctx);

        // 绘制背包UI
        this.renderInventoryUI();

        // 绘制关卡进度
        this.renderLevelProgress();
    }

    renderClouds() {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.clouds.forEach(cloud => {
            const screenX = cloud.x - this.camera.x * 0.3; // 视差效果
            this.ctx.beginPath();
            this.ctx.arc(screenX, cloud.y, cloud.width / 3, 0, Math.PI * 2);
            this.ctx.arc(screenX + cloud.width / 3, cloud.y - 10, cloud.width / 3, 0, Math.PI * 2);
            this.ctx.arc(screenX + cloud.width / 2, cloud.y, cloud.width / 3, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    renderFlag() {
        const flagX = this.levelWidth - 80;

        // 旗杆
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(flagX, 300, 8, 250);

        // 旗帜
        this.ctx.fillStyle = '#FF4500';
        this.ctx.beginPath();
        this.ctx.moveTo(flagX + 8, 300);
        this.ctx.lineTo(flagX + 70, 340);
        this.ctx.lineTo(flagX + 8, 380);
        this.ctx.closePath();
        this.ctx.fill();

        // 星星装饰
        this.ctx.fillStyle = '#FFD700';
        this.ctx.beginPath();
        this.ctx.arc(flagX + 35, 340, 12, 0, Math.PI * 2);
        this.ctx.fill();
    }

    renderInventoryUI() {
        const inventory = this.player.inventory;
        const items = inventory.getItems();
        const selectedIndex = inventory.selectedIndex;

        // 背包背景
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        this.ctx.fillRect(10, this.height - 60, 270, 50);

        // 绘制槽位
        for (let i = 0; i < inventory.maxSlots; i++) {
            const x = 20 + i * 50;
            const y = this.height - 55;

            // 槽位背景
            this.ctx.fillStyle = i === selectedIndex ? 'rgba(255, 215, 0, 0.5)' : 'rgba(100, 100, 100, 0.5)';
            this.ctx.fillRect(x, y, 40, 40);

            // 槽位边框
            this.ctx.strokeStyle = i === selectedIndex ? '#FFD700' : '#666';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(x, y, 40, 40);

            // 道具图标
            if (items[i]) {
                this.renderItemIcon(this.ctx, x + 8, y + 8, items[i].type);

                // 数量
                if (items[i].count > 1) {
                    this.ctx.fillStyle = '#FFF';
                    this.ctx.font = 'bold 12px Arial';
                    this.ctx.fillText('x' + items[i].count, x + 22, y + 35);
                }
            }
        }

        // 操作提示
        this.ctx.fillStyle = '#AAA';
        this.ctx.font = '10px Arial';
        this.ctx.fillText('Q/E:选择  F:使用', 15, this.height - 8);
    }

    renderItemIcon(ctx, x, y, type) {
        ctx.save();
        switch (type) {
            case 'speed':
                ctx.fillStyle = '#FFD700';
                ctx.beginPath();
                ctx.moveTo(x + 8, y);
                ctx.lineTo(x + 2, y + 8);
                ctx.lineTo(x + 6, y + 8);
                ctx.lineTo(x + 4, y + 16);
                ctx.lineTo(x + 14, y + 6);
                ctx.lineTo(x + 10, y + 6);
                ctx.lineTo(x + 12, y);
                ctx.closePath();
                ctx.fill();
                break;
            case 'shield':
                ctx.fillStyle = '#4169E1';
                ctx.beginPath();
                ctx.moveTo(x + 8, y);
                ctx.lineTo(x + 16, y + 4);
                ctx.lineTo(x + 16, y + 10);
                ctx.quadraticCurveTo(x + 8, y + 16, x, y + 10);
                ctx.lineTo(x, y + 4);
                ctx.closePath();
                ctx.fill();
                break;
            case 'doubleJump':
                ctx.fillStyle = '#32CD32';
                // 上箭头
                ctx.beginPath();
                ctx.moveTo(x + 8, y);
                ctx.lineTo(x + 14, y + 6);
                ctx.lineTo(x + 2, y + 6);
                ctx.closePath();
                ctx.fill();
                // 下箭头
                ctx.beginPath();
                ctx.moveTo(x + 8, y + 8);
                ctx.lineTo(x + 14, y + 14);
                ctx.lineTo(x + 2, y + 14);
                ctx.closePath();
                ctx.fill();
                break;
            case 'extraLife':
                ctx.fillStyle = '#FF69B4';
                ctx.beginPath();
                ctx.moveTo(x + 8, y + 4);
                ctx.bezierCurveTo(x + 8, y + 2, x + 6, y, x + 3, y + 2);
                ctx.bezierCurveTo(x, y + 4, x + 2, y + 8, x + 8, y + 14);
                ctx.bezierCurveTo(x + 14, y + 8, x + 16, y + 4, x + 13, y + 2);
                ctx.bezierCurveTo(x + 10, y, x + 8, y + 2, x + 8, y + 4);
                ctx.fill();
                break;
            case 'star':
                ctx.fillStyle = '#FFD700';
                const cx = x + 8;
                const cy = y + 8;
                ctx.beginPath();
                for (let i = 0; i < 5; i++) {
                    const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
                    const px = cx + Math.cos(angle) * 8;
                    const py = cy + Math.sin(angle) * 8;
                    if (i === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                ctx.closePath();
                ctx.fill();
                break;
        }
        ctx.restore();
    }

    renderLevelProgress() {
        // 进度条背景
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        this.ctx.fillRect(this.width - 160, 10, 150, 20);

        // 进度条
        const progress = this.player.x / this.levelWidth;
        this.ctx.fillStyle = '#4CAF50';
        this.ctx.fillRect(this.width - 158, 12, 146 * progress, 16);

        // 进度文字
        this.ctx.fillStyle = '#FFF';
        this.ctx.font = '12px Arial';
        this.ctx.fillText(`关卡 ${this.currentLevel}/${this.maxLevel}`, this.width - 155, 24);
    }
}