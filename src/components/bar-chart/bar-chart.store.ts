import { Point } from '../../plot/util';

export class BarChartStore {
	public readonly months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];
	public readonly monthlySales25: Point[] = [
		{ x: 1, y: 65 },
		{ x: 2, y: 60 },
		{ x: 3, y: 80 },
		{ x: 4, y: 81 },
		{ x: 5, y: 56 },
		{ x: 6, y: 55 },
		{ x: 7, y: 72 },
		{ x: 8, y: 89 },
		{ x: 9, y: 86 },
		{ x: 10, y: 78 },
		{ x: 11, y: 83 },
		{ x: 12, y: 79 },
	];
	public readonly monthlySales26: Point[] = [
		{ x: 1, y: 68 },
		{ x: 2, y: 64 },
		{ x: 3, y: 76 },
		{ x: 4, y: 85 },
		{ x: 5, y: 61 },
		{ x: 6, y: 53 },
		{ x: 7, y: 70 },
		{ x: 8, y: 92 },
		{ x: 9, y: 82 },
		{ x: 10, y: 82 },
		{ x: 11, y: 88 },
		{ x: 12, y: 74 },
	];

	public monthFromValue(value: number): string {
		const index = Math.round(value) - 1;
		return this.months[index] || '';
	}
}