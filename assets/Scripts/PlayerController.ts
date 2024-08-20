import { _decorator, Animation, Component, EventMouse, EventTouch, Input, input, Vec3 } from 'cc';

const { ccclass, property } = _decorator;
export const BLOCK_SIZE = 40;

@ccclass('PlayerController')
export class PlayerController extends Component {
    @property(Animation)
    BodyAnim: Animation = null;

    @property({ type: Node })
    public leftTouch: Node | null = null;

    @property({ type: Node })
    public rightTouch: Node | null = null;

    // @property({ type: Node })
    // public canvas: Node | null = null;

    private _startJump: boolean = false;
    private _jumpStep: number = 0;
    private _jumpTime: number = 0.1;
    private _curJumpTime: number = 0;
    private _curJumpSpeed: number = 0;
    private _curPos: Vec3 = new Vec3();
    private _deltaPos: Vec3 = new Vec3(0, 0, 0);
    private _targetPos: Vec3 = new Vec3();
    private _curMoveIndex: number = 0;

    start() {
        // console.clear();
        // console.log("start");
        // input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
    }

    update(deltaTime: number) {
        if (!this._startJump) {
            return;
        }

        this._curJumpTime += deltaTime;
        if (this._curJumpTime > this._jumpTime) {
            this.node.setPosition(this._targetPos);
            this._startJump = false;
            this.onOnceJumpEnd();
        } else {
            this.node.getPosition(this._curPos);
            this._deltaPos.x = this._curJumpSpeed * deltaTime;
            Vec3.add(this._curPos, this._curPos, this._deltaPos);
            this.node.setPosition(this._curPos);
        }
    }

    onMouseUp(event: EventMouse) {
        if (event.getButton() === EventMouse.BUTTON_LEFT) {
            this.jumpByStep(1);
        } else if (event.getButton() === EventMouse.BUTTON_RIGHT) {
            this.jumpByStep(2);
        }
    }

    jumpByStep(step: number) {
        if (this._startJump) {
            return;
        }

        const clipName = step == 1 ? 'oneStep' : 'twoStep';
        const state = this.BodyAnim.getState(clipName);
        this._jumpTime = state.duration;

        this._startJump = true;
        this._jumpStep = step;
        this._curJumpTime = 0;
        this._curJumpSpeed = this._jumpStep * BLOCK_SIZE / this._jumpTime;
        this.node.getPosition(this._curPos);
        Vec3.add(this._targetPos, this._curPos, new Vec3(this._jumpStep * BLOCK_SIZE, 0, 0));

        if (this.BodyAnim) {
            if (step === 1) {
                this.BodyAnim.play('oneStep');
            } else if (step === 2) {
                this.BodyAnim.play('twoStep');
            }
        }

        this._curMoveIndex += step;
    }

    onOnceJumpEnd() {
        this.node.emit('JumpEnd', this._curMoveIndex);
    }

    // jumpByStep(step: number) {

    //     if (this._startJump) {
    //         return;
    //     }

    //     this._startJump = true;
    //     const clipName = step == 1 ? 'oneStep' : 'twoStep';
    //     const state = this.BodyAnim.getState(clipName);
    //     this._jumpTime = state.duration;

    //     this._jumpStep = step;

    //     this._curJumpTime = 0;
    //     this._curJumpSpeed = this._jumpStep * BLOCK_SIZE / this._jumpTime;
    //     this.node.getPosition(this._curPos);
    //     Vec3.add(this._targetPos, this._curPos, new Vec3(this._jumpStep * BLOCK_SIZE, 0, 0));

    //     if (this.BodyAnim) {
    //         if (step === 1) {
    //             this.BodyAnim.play('oneStep');
    //         } else if (step === 2) {
    //             this.BodyAnim.play('twoStep');
    //         }
    //     }
    // }


    reset() {
        this._curMoveIndex = 0;
        this.node.getPosition(this._curPos);
        this._targetPos.set(0, 0, 0);
    }

    setInputActive(active: boolean) {
        if (active) {
            input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        } else {
            input.off(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        }
    }

    // setInputActive(active: boolean) {
    //     if (active) {
    //         //for pc
    //         input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
    //         //for mobile
    //         this.leftTouch.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
    //         this.rightTouch.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
    //     } else { 
    //         //for pc
    //         input.off(Input.EventType.MOUSE_UP, this.onMouseUp, this);
    //         //for mobile
    //         this.leftTouch.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
    //         this.rightTouch.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
    //     }
    // }

    onTouchStart(event: EventTouch) {
        const target = event.target as Node;
        if (target?.nodeName == 'LeftTouch') {
            this.jumpByStep(1);
        } else {
            this.jumpByStep(2);
        }
    }

}
