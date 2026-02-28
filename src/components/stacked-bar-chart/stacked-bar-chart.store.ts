import { Subject } from 'rxjs';
import { Point } from '../../plot/util';

export class StackedBarChartStore {
    public readonly quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

    // Category 1: starts at 10,000, decreases to 6,000 by Q4
    public readonly category1Sales: Point[] = [
        { x: 1, y: 10000 },
        { x: 2, y: 9500 },
        { x: 3, y: 8000 },
        { x: 4, y: 6000 },
    ];

    // Category 2: remains between 3000 and 5000
    public readonly category2Sales: Point[] = [
        { x: 1, y: 4000 },
        { x: 2, y: 3500 },
        { x: 3, y: 4500 },
        { x: 4, y: 4200 },
    ];

    // Category 3: starts at 1000, increases to 6000 by Q4
    public readonly category3Sales: Point[] = [
        { x: 1, y: 1000 },
        { x: 2, y: 2500 },
        { x: 3, y: 4500 },
        { x: 4, y: 6000 },
    ];

    public readonly dataChanged = new Subject<void>();

    public quarterFromValue(value: number): string {
        const index = Math.round(value) - 1;
        return this.quarters[index] || '';
    }
}
