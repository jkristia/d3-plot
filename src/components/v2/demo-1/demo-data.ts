
// https://js.devexpress.com/Angular/Demos/WidgetsGallery/Demo/Charts/Spline/MaterialPurpleDark/

import { LineSeries, PlotItem } from "../../../plot";
import { Point } from "../../../plot/util";

export interface ArchitectureInfo {
    year: number;
    smp: number;
    mmp: number;
    cnstl: number;
    cluster: number;
}

export const architecturesInfo: ArchitectureInfo[] = [{
    year: 1997,
    smp: 263,
    // smp: 300,
    mmp: 208,
    cnstl: 9,
    cluster: 1,
}, {
    year: 1999,
    smp: 169,
    // smp: 0,
    mmp: 270,
    cnstl: 61,
    cluster: 7,
}, {
    year: 2001,
    smp: 57,
    mmp: 261,
    cnstl: 157,
    cluster: 45,
}, {
    year: 2003,
    smp: 0,
    mmp: 154,
    cnstl: 121,
    cluster: 211,
}, {
    year: 2005,
    smp: 0,
    mmp: 97,
    cnstl: 39,
    cluster: 382,
}, {
    year: 2007,
    smp: 0,
    mmp: 83,
    cnstl: 3,
    cluster: 437,
}];

export function dataSmp(): Point[] {
    return architecturesInfo.map(d => { return { x: d.year, y: d.smp } })
}
export function dataMmp(): Point[] {
    return architecturesInfo.map(d => { return { x: d.year, y: d.mmp } })
}
export function dataCluster(): Point[] {
    return architecturesInfo.map(d => { return { x: d.year, y: d.cluster } })
}
export function dataCnstl(): Point[] {
    return architecturesInfo.map(d => { return { x: d.year, y: d.cnstl } })
}

export class DataSeries extends LineSeries {
}