import { Point } from '../../plot/util';
import { hist_data } from '../../../age_data_bins';

export class HistogramChartStore {
    public readonly ageData: Point[];
    public readonly ageLabels: string[];

    public constructor() {
        // Convert age bin data to plottable points
        this.ageData = hist_data.map((item, index) => ({
            x: index + 1, // 1-based index for positioning
            y: item.count,
        }));

        this.ageLabels = hist_data.map((item) => item.age_bin);
    }

    public ageLabelFromValue(value: number): string {
        const index = Math.round(value) - 1;
        return this.ageLabels[index] || '';
    }
}
