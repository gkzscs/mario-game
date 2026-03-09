/**
 * 背包系统
 * 管理玩家收集的道具
 */

export class Inventory {
    constructor(maxSlots = 5) {
        this.maxSlots = maxSlots;
        this.items = [];
        this.selectedIndex = 0;
    }

    addItem(itemType) {
        if (this.items.length >= this.maxSlots) {
            // 背包已满，检查是否可以堆叠
            const existing = this.items.find(i => i.type === itemType);
            if (existing) {
                existing.count++;
                return true;
            }
            return false;
        }

        const existing = this.items.find(i => i.type === itemType);
        if (existing) {
            existing.count++;
        } else {
            this.items.push({ type: itemType, count: 1 });
        }
        return true;
    }

    useItem(player) {
        if (this.items.length === 0) return null;

        const item = this.items[this.selectedIndex];
        if (!item) return null;

        item.count--;
        if (item.count <= 0) {
            this.items.splice(this.selectedIndex, 1);
            if (this.selectedIndex >= this.items.length) {
                this.selectedIndex = Math.max(0, this.items.length - 1);
            }
        }

        // 应用道具效果
        this.applyEffect(item.type, player);
        return item.type;
    }

    applyEffect(type, player) {
        switch (type) {
            case 'speed':
                player.speedBoost = 5000; // 5秒速度提升
                player.speed = 8;
                break;
            case 'shield':
                player.shield = true;
                player.shieldTime = 10000; // 10秒护盾
                break;
            case 'doubleJump':
                player.canDoubleJump = true;
                player.doubleJumpTime = 15000; // 15秒双跳
                break;
            case 'extraLife':
                // 生命+1在外部处理
                break;
            case 'star':
                player.invincible = true;
                player.invincibleTime = 8000; // 8秒无敌
                break;
        }
    }

    selectNext() {
        if (this.items.length === 0) return;
        this.selectedIndex = (this.selectedIndex + 1) % this.items.length;
    }

    selectPrev() {
        if (this.items.length === 0) return;
        this.selectedIndex = (this.selectedIndex - 1 + this.items.length) % this.items.length;
    }

    getItems() {
        return this.items;
    }

    getSelectedItem() {
        return this.items[this.selectedIndex] || null;
    }
}