import * as d3 from 'd3';
import { PlotTypeBase } from './plottype';

export type D3Selection<T = any> = d3.Selection<any, T, null, undefined>;

export interface Size {
    width: number;
    height: number;
}
export class Rect {
    left: number;
    top: number;
    width: number;
    height: number;
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
        this.left -= amount;
        this.top -= amount;
        this.width += amount * 2;
        this.height += amount * 2;
        return this;
    }
}

export interface IPlotOptions {
    width?: number;
    height?: number;
    plots?: PlotTypeBase[]
}

export interface IPlot {
    readonly plotArea: Rect;
}

export interface IPlotTypeOptions {
    cssClasses?: string[]
}

export class Util {
    static isFunction(f: any): boolean {
        return typeof f === 'function';
    }
    static *range(a: number, b?: number) {
        let start = a;
        let end = b!;
        if (b === undefined) {
            start = 0; 
            end = a;
        }
        while (start < end) {
            yield start;
            start++;
        }
    }
}

