
export interface Size {
    width: number;
    height: number;
}

export class Rect {
    readonly left: number;
    readonly top: number;
    readonly width: number;
    readonly height: number;
    public get right(): number {
        return this.left + this.width;
    }
    public get bottom(): number {
        return this.top + this.height;
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
        return this;
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

