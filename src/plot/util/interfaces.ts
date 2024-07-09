import * as d3 from 'd3';
import { Rect } from './rect';

export type D3Selection<T = any> = d3.Selection<any, T, null, undefined>;

export type ValueFunc<T> = () => T;
export type ValueOrFunc = number | ValueFunc<number>;

export type AreaFunc = (area: Rect) => Rect;
export type DomainFunc = (area: Rect) => { min: number, max: number };

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
