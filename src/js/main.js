/**
 * 游戏主入口文件
 * 初始化游戏引擎并启动游戏循环
 */

import { Game } from './systems/Game.js';
import { InputHandler } from './systems/InputHandler.js';

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // 初始化游戏系统
    const game = new Game(canvas, ctx);
    const inputHandler = new InputHandler();

    // UI元素
    const startScreen = document.getElementById('start-screen');
    const gameOverScreen = document.getElementById('game-over-screen');
    const victoryScreen = document.getElementById('victory-screen');
    const levelCompleteScreen = document.getElementById('level-complete-screen');
    const startBtn = document.getElementById('start-btn');
    const restartBtn = document.getElementById('restart-btn');
    const restartBtnVictory = document.getElementById('restart-btn-victory');
    const continueBtn = document.getElementById('continue-btn');
    const scoreValue = document.getElementById('score-value');
    const livesValue = document.getElementById('lives-value');
    const coinsValue = document.getElementById('coins-value');
    const levelValue = document.getElementById('level-value');
    const finalScore = document.getElementById('final-score');
    const victoryScore = document.getElementById('victory-score');
    const nextLevelNum = document.getElementById('next-level-num');

    // 开始游戏
    function startGame() {
        startScreen.classList.add('hidden');
        gameOverScreen.classList.add('hidden');
        victoryScreen.classList.add('hidden');
        levelCompleteScreen.classList.add('hidden');
        game.reset();
        game.start();
    }

    // 游戏结束
    function onGameOver(isVictory) {
        if (isVictory) {
            victoryScreen.classList.remove('hidden');
            victoryScore.textContent = game.score;
        } else {
            gameOverScreen.classList.remove('hidden');
            finalScore.textContent = game.score;
        }
    }

    // 关卡完成
    function onLevelComplete(level) {
        levelCompleteScreen.classList.remove('hidden');
        nextLevelNum.textContent = level;
    }

    // 继续下一关
    function continueNextLevel() {
        levelCompleteScreen.classList.add('hidden');
        game.isRunning = true;
    }

    // 更新UI
    function updateUI() {
        scoreValue.textContent = game.score;
        livesValue.textContent = game.lives;
        coinsValue.textContent = game.coins;
        levelValue.textContent = game.currentLevel;
    }

    // 绑定事件
    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);
    restartBtnVictory.addEventListener('click', startGame);
    continueBtn.addEventListener('click', continueNextLevel);

    game.setOnGameOver(onGameOver);
    game.setOnUIUpdate(updateUI);
    game.setOnLevelComplete(onLevelComplete);

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
    console.log('操作说明:');
    console.log('  ← → 或 A D: 移动');
    console.log('  ↑ 或 W 或 空格: 跳跃');
    console.log('  Q/E: 选择背包道具');
    console.log('  F: 使用道具');
});