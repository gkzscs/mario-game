/**
 * 游戏主入口文件
 * 初始化游戏引擎并启动游戏循环
 */

import { Game } from './systems/Game.js';
import { InputHandler } from './systems/InputHandler.js';
import { LevelManager } from './systems/LevelManager.js';

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // 初始化游戏系统
    const game = new Game(canvas, ctx);
    const inputHandler = new InputHandler();
    const levelManager = new LevelManager();

    // UI元素
    const startScreen = document.getElementById('start-screen');
    const gameOverScreen = document.getElementById('game-over-screen');
    const startBtn = document.getElementById('start-btn');
    const restartBtn = document.getElementById('restart-btn');
    const scoreValue = document.getElementById('score-value');
    const livesValue = document.getElementById('lives-value');
    const coinsValue = document.getElementById('coins-value');
    const finalScore = document.getElementById('final-score');

    // 开始游戏
    function startGame() {
        startScreen.classList.add('hidden');
        gameOverScreen.classList.add('hidden');
        game.reset();
        game.start();
    }

    // 游戏结束
    function onGameOver() {
        gameOverScreen.classList.remove('hidden');
        finalScore.textContent = game.score;
    }

    // 更新UI
    function updateUI() {
        scoreValue.textContent = game.score;
        livesValue.textContent = game.lives;
        coinsValue.textContent = game.coins;
    }

    // 绑定事件
    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);

    game.setOnGameOver(onGameOver);
    game.setOnUIUpdate(updateUI);

    // 游戏循环
    function gameLoop(timestamp) {
        const input = inputHandler.getInput();

        if (game.isRunning) {
            game.update(input, timestamp);
            game.render();
            updateUI();
        }

        requestAnimationFrame(gameLoop);
    }

    requestAnimationFrame(gameLoop);

    console.log('🎮 像素冒险家已加载完成！');
});