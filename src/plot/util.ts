
export interface Size {
    width: number;
    height: number;
}
export interface Point {
    x: number;
    y: number;
}

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
        }
    }
    constructor(r?: {
        left: number,
        top: number,
        width: number,
        height: number,
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
        })
    }
    public offset(amount: number = 0.5): Rect {
        return new Rect({
            left: this.left + amount,
            top: this.top - amount,
            width: this.width,
            height: this.height,
        })
    }
}

export class Util {
    static isFunction(f: any): boolean {
        return typeof f === 'function';
    }
    static *range(a: number, b?: number, step?: number) {
        let start = a;
        let end = b!;
        step = step || 1;
        if (b === undefined) {
            start = 0;
            end = a;
        }
        while (start < end) {
            yield start;
            start += step;
        }
    }
}

