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
            jump: false,
            useItem: false,
            nextItem: false,
            prevItem: false
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
            case 'KeyF':
                if (isPressed) this.keys.useItem = true;
                break;
            case 'KeyE':
                if (isPressed) this.keys.nextItem = true;
                break;
            case 'KeyQ':
                if (isPressed) this.keys.prevItem = true;
                break;
        }
    }

    getInput() {
        const input = { ...this.keys };
        // 重置单次触发的按键
        this.keys.jump = false;
        this.keys.useItem = false;
        this.keys.nextItem = false;
        this.keys.prevItem = false;
        return input;
    }
}