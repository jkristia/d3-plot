import { PlotTypeBase } from './plot-types/plottype';
import { Margin, Rect, ValueOrFunc } from '../util';


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

export interface AreasV1 {
    topHeight?: ValueOrFunc;
    leftWidth?: ValueOrFunc;
    rightWidth?: ValueOrFunc;
    bottomHeight?: ValueOrFunc;
}
