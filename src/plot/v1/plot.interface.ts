import * as d3 from 'd3';
import { PlotTypeBase } from './plot-types/plottype';
import { Margin, Rect } from '../util';

export type D3Selection<T = any> = d3.Selection<any, T, null, undefined>;

export interface IPlotOptionsV1 {
    width?: number;
    height?: number;
    margin?: Margin;
    areas?: AreasV1;
    plots?: PlotTypeBase[]
}

export interface IPlotV1 {
    readonly fullArea: Rect;
    readonly topArea: Rect;
    readonly bottomArea: Rect;
    readonly leftArea: Rect;
    readonly rightArea: Rect;
    readonly plotArea: Rect;
}

export interface IPlotTypeOptionsV1 {
    cssClasses?: string[];
    showPoint?: boolean;
}

export type ValueFunc<T> = () => T;
export type ValueOrFunc = number | ValueFunc<number>;

export interface AreasV1 {
    topHeight?: ValueOrFunc;
    leftWidth?: ValueOrFunc;
    rightWidth?: ValueOrFunc;
    bottomHeight?: ValueOrFunc;
}
