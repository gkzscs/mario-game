/**
 * 游戏主类
 * 管理游戏状态、渲染和更新逻辑
 */

import { Player } from '../entities/Player.js';
import { Platform } from '../entities/Platform.js';
import { Enemy } from '../entities/Enemy.js';
import { Coin } from '../entities/Coin.js';

export class Game {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.width = canvas.width;
        this.height = canvas.height;

        // 游戏状态
        this.isRunning = false;
        this.score = 0;
        this.lives = 3;
        this.coins = 0;

        // 游戏对象
        this.player = null;
        this.platforms = [];
        this.enemies = [];
        this.coinsList = [];

        // 重力
        this.gravity = 0.5;

        // 回调
        this.onGameOver = null;
        this.onUIUpdate = null;

        // 相机偏移
        this.cameraX = 0;

        // 初始化关卡
        this.initLevel();
    }

    initLevel() {
        // 创建玩家
        this.player = new Player(100, 400);

        // 创建平台
        this.platforms = [
            // 地面
            new Platform(0, 550, 800, 50),
            // 平台
            new Platform(200, 450, 150, 20),
            new Platform(400, 380, 150, 20),
            new Platform(100, 300, 100, 20),
            new Platform(500, 280, 120, 20),
            new Platform(300, 200, 100, 20),
            new Platform(600, 150, 150, 20),
        ];

        // 创建敌人
        this.enemies = [
            new Enemy(350, 520, 300, 450),
            new Enemy(550, 520, 500, 700),
        ];

        // 创建金币
        this.coinsList = [
            new Coin(250, 420),
            new Coin(300, 420),
            new Coin(450, 350),
            new Coin(130, 270),
            new Coin(550, 250),
            new Coin(350, 170),
            new Coin(650, 120),
        ];
    }

    reset() {
        this.score = 0;
        this.lives = 3;
        this.coins = 0;
        this.cameraX = 0;
        this.isRunning = false;
        this.initLevel();
    }

    start() {
        this.isRunning = true;
    }

    update(input, timestamp) {
        if (!this.isRunning) return;

        // 更新玩家
        this.player.update(input, this.gravity, this.width, this.height, this.platforms);

        // 更新敌人
        this.enemies.forEach(enemy => enemy.update());

        // 检测碰撞
        this.checkCollisions();

        // 检查游戏结束条件
        if (this.player.y > this.height) {
            this.loseLife();
        }
    }

    checkCollisions() {
        // 玩家与敌人碰撞
        this.enemies.forEach((enemy, index) => {
            if (this.isColliding(this.player, enemy)) {
                // 从上方踩敌人
                if (this.player.vy > 0 && this.player.y + this.player.height - 10 < enemy.y) {
                    this.enemies.splice(index, 1);
                    this.player.vy = -10; // 弹跳
                    this.score += 100;
                } else {
                    this.loseLife();
                }
            }
        });

        // 玩家与金币碰撞
        this.coinsList.forEach((coin, index) => {
            if (this.isColliding(this.player, coin)) {
                this.coinsList.splice(index, 1);
                this.coins++;
                this.score += 50;
            }
        });
    }

    isColliding(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    loseLife() {
        this.lives--;
        if (this.lives <= 0) {
            this.gameOver();
        } else {
            // 重置玩家位置
            this.player.x = 100;
            this.player.y = 400;
            this.player.vx = 0;
            this.player.vy = 0;
        }
    }

    gameOver() {
        this.isRunning = false;
        if (this.onGameOver) {
            this.onGameOver();
        }
    }

    setOnGameOver(callback) {
        this.onGameOver = callback;
    }

    setOnUIUpdate(callback) {
        this.onUIUpdate = callback;
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

        // 绘制平台
        this.platforms.forEach(platform => platform.render(this.ctx));

        // 绘制金币
        this.coinsList.forEach(coin => coin.render(this.ctx));

        // 绘制敌人
        this.enemies.forEach(enemy => enemy.render(this.ctx));

        // 绘制玩家
        this.player.render(this.ctx);
    }
}