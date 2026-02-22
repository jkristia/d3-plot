
export class Util {
    public static isFunction(f: any): boolean {
        return typeof f === 'function';
    }
    public static *range(a: number, b?: number, step?: number) {
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

