/**
 * 敌人类测试
 */

import { Enemy } from '../src/js/entities/Enemy.js';

describe('Enemy', () => {
    let enemy;

    beforeEach(() => {
        enemy = new Enemy(350, 520, 300, 450);
    });

    test('应该正确初始化敌人', () => {
        expect(enemy.x).toBe(350);
        expect(enemy.y).toBe(520);
        expect(enemy.width).toBe(30);
        expect(enemy.height).toBe(30);
    });

    test('敌人应该在巡逻范围内移动', () => {
        const initialX = enemy.x;
        enemy.update();

        expect(enemy.x).not.toBe(initialX);
    });

    test('敌人到达边界时应该改变方向', () => {
        enemy.x = 295;
        enemy.direction = -1;
        enemy.update();

        expect(enemy.direction).toBe(1);
    });

    test('敌人应该在最小边界改变方向', () => {
        enemy.x = 425;
        enemy.direction = 1;
        enemy.update();

        expect(enemy.direction).toBe(-1);
    });
});