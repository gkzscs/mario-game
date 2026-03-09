/**
 * 输入处理器
 * 处理键盘输入
 */

export class InputHandler {
    constructor() {
        this.keys = {
            left: false,
            right: false,
            up: false,
            jump: false
        };

        this.bindEvents();
    }

    bindEvents() {
        document.addEventListener('keydown', (e) => {
            this.handleKey(e.code, true);
        });

        document.addEventListener('keyup', (e) => {
            this.handleKey(e.code, false);
        });
    }

    handleKey(code, isPressed) {
        switch (code) {
            case 'ArrowLeft':
            case 'KeyA':
                this.keys.left = isPressed;
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.keys.right = isPressed;
                break;
            case 'ArrowUp':
            case 'KeyW':
            case 'Space':
                this.keys.up = isPressed;
                if (isPressed) this.keys.jump = true;
                break;
        }
    }

    getInput() {
        const input = { ...this.keys };
        // 重置跳跃键（只触发一次）
        this.keys.jump = false;
        return input;
    }
}