import { Margin, Point } from "./interfaces";

export class Rect {
    private _width: number = 0;
    private _height: number = 0;
    left: number;
    top: number;
    public get width(): number {
        return Math.max(0, this._width);
    }
    public set width(value: number) {
        this._width = value;
    }
    public get height(): number {
        return Math.max(0, this._height);
    }
    public set height(value: number) {
        this._height = value;
    }
    public get right(): number {
        return this.left + this.width;
    }
    public set right(rightValue: number) {
        this.width = Math.max(0, rightValue - this.left);
    }
    public get bottom(): number {
        return this.top + this.height;
    }
    public set bottom(bottomValue: number) {
        this.height = Math.max(0, bottomValue - this.top);
    }
    public get center(): Point {
        return {
            x: this.left + ((this.right - this.left) / 2),
            y: this.top + ((this.bottom - this.top) / 2),
        };
    }
    public get rect(): { left: number, top: number, right: number, bottom: number} {
        return {
            left: this.left,
            top: this.top,
            right: this.right,
            bottom: this.bottom
        }
    }
    public get isEmpty(): boolean {
        return (this.width === 0 && this.height === 0);
    }
    constructor(r?: {
        left: number;
        top: number;
        width: number;
        height: number;
    }) {
        this.left = r?.left || 0;
        this.top = r?.top || 0;
        this.width = r?.width || 0;
        this.height = r?.height || 0;
    }
    public inRect(x: number, y: number): boolean {
        return x >= this.left && 
                x <= this.right &&
                y >= this.top &&
                y <= this.bottom
                ;

    }
    public inflate(amount: number): Rect {
        return new Rect({
            left: this.left - amount,
            top: this.top - amount,
            width: this.width + amount * 2,
            height: this.height + amount * 2,
        });
    }
    public offset(amount: number = 0): Rect {
        return new Rect({
            left: this.left + amount,
            top: this.top - amount,
            width: this.width,
            height: this.height,
        });
    }
    public adjustMargin(margin: Margin): Rect {
        return new Rect({
            left: this.left + margin.left,
            top: this.top + margin.top,
            width: this.width - (margin.left + margin.right),
            height: this.height - (margin.top + margin.bottom),
        });

    }
    public clamp(left: number, top: number, right: number, bottom: number): Rect {
        const r = new Rect();
        r.left = Math.max(this.left, left);
        r.top = Math.max(this.top, top);
        r.right = Math.min(this.right, right);
        r.bottom = Math.min(this.bottom, bottom);
        return r;
    }
    public toString(): string {
        if (this.isEmpty) {
            return '[empty]'
        }
        return `[top: ${this.top}, left: ${this.left}, width: ${this.width}, height: ${this.height}]`;
    }
}
