import { Margin } from "../util";
import { PlotItem } from "./plot.item";

export interface IPlotOptions {
    margin?: Margin;
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
}