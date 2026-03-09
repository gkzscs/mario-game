/**
 * 关卡管理器
 * 管理游戏关卡
 */

export class LevelManager {
    constructor() {
        this.currentLevel = 0;
        this.levels = this.createLevels();
    }

    createLevels() {
        return [
            {
                name: '第一关 - 草原',
                platforms: [
                    { x: 0, y: 550, width: 800, height: 50 },
                    { x: 200, y: 450, width: 150, height: 20 },
                    { x: 400, y: 380, width: 150, height: 20 },
                ],
                enemies: [
                    { x: 350, y: 520, minX: 300, maxX: 450 }
                ],
                coins: [
                    { x: 250, y: 420 },
                    { x: 450, y: 350 }
                ]
            },
            // 可以添加更多关卡
        ];
    }

    getCurrentLevel() {
        return this.levels[this.currentLevel];
    }

    nextLevel() {
        if (this.currentLevel < this.levels.length - 1) {
            this.currentLevel++;
            return true;
        }
        return false;
    }

    reset() {
        this.currentLevel = 0;
    }
}