import * as d3 from 'd3';

export type D3Selection<T = any> = d3.Selection<any, T, null, undefined>;

export type ValueFunc<T> = () => T;
export type ValueOrFunc = number | ValueFunc<number>;

export interface Point {
    x: number;
    y: number;
}
export interface Size {
    width: number;
    height: number;
}
export interface Margin {
    left: number;
    top: number;
    right: number;
    bottom: number;
}
