import { Margin } from "../util";
import { Scale } from "./elements";
import { PlotItem } from "./plot.item";

export interface IPlotOptions {
    margin?: Margin;
    cssClass?: string;
    // use default setting for titleArea, if titleArea is defined, then that will be used
    title?: string; 
    titleArea?: {
        height: number;
        plots?: PlotItem[];
    }
    
    leftArea?: {
        width: number;
        plots?: PlotItem[];
    }
    rightArea?: {
        width: number;
        plots?: PlotItem[];
    }
    footerArea?: {
        height: number;
        plots?: PlotItem[];
    }
    plots?: PlotItem[];
    scales?: Scale[]; // scale will be updated before plots
}

export interface IPlotItemOptions {
    margin?: Margin;
    cssClasses?: string[];
}