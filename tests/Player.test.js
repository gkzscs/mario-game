/**
 * 玩家类测试
 */

import { Player } from '../src/js/entities/Player.js';

describe('Player', () => {
    let player;
    let mockPlatforms;

    beforeEach(() => {
        player = new Player(100, 400);
        mockPlatforms = [
            { x: 0, y: 550, width: 800, height: 50 }
        ];
    });

    test('应该正确初始化玩家', () => {
        expect(player.x).toBe(100);
        expect(player.y).toBe(400);
        expect(player.width).toBe(32);
        expect(player.height).toBe(40);
    });

    test('玩家应该能向右移动', () => {
        const input = { left: false, right: true, up: false, jump: false };
        player.onGround = true;
        player.update(input, 0.5, 800, 600, mockPlatforms);

        expect(player.vx).toBeGreaterThan(0);
    });

    test('玩家应该能向左移动', () => {
        const input = { left: true, right: false, up: false, jump: false };
        player.onGround = true;
        player.update(input, 0.5, 800, 600, mockPlatforms);

        expect(player.vx).toBeLessThan(0);
    });

    test('玩家在地面时应该能跳跃', () => {
        const input = { left: false, right: false, up: true, jump: true };
        player.onGround = true;
        player.update(input, 0.5, 800, 600, mockPlatforms);

        expect(player.vy).toBe(player.jumpForce);
    });

    test('玩家不在地面时不能跳跃', () => {
        const input = { left: false, right: false, up: true, jump: true };
        player.onGround = false;
        const initialVy = player.vy;
        player.update(input, 0.5, 800, 600, mockPlatforms);

        // 不应该触发跳跃（vy应该受重力影响，而不是跳跃力）
        expect(player.vy).not.toBe(player.jumpForce);
    });
});