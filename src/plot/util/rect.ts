import { Point } from "./interfaces";

export class Rect {
    left: number;
    top: number;
    width: number;
    height: number;
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
    public inflate(amount: number): Rect {
        return new Rect({
            left: this.left - amount,
            top: this.top - amount,
            width: this.width + amount * 2,
            height: this.height + amount * 2,
        });
    }
    public offset(amount: number = 0.5): Rect {
        return new Rect({
            left: this.left + amount,
            top: this.top - amount,
            width: this.width,
            height: this.height,
        });
    }
    public toString(): string {
        if (this.width === 0 && this.height === 0) {
            return '[empty]'
        }
        return `[top: ${this.top}, left: ${this.left}, width: ${this.width}, height: ${this.height}]`;
    }
}
