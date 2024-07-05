import { Plot } from "./plot"

describe('plot areas', () => {
	let plot: Plot;
	beforeEach(() => {
		plot = new Plot(null, {
			areas: {
				topHeight: 15,
				leftWidth: 25,
				rightWidth: 35,
				bottomHeight: 45,
			}
		})
	})
	it('areas', () => {
		plot.size({ width: 300, height: 200 });
		expect(plot.fullArea.rect).toEqual({ top: 0, left: 0, right: 300, bottom: 200 });
		expect(plot.topArea.rect).toEqual({ top: 0, left: 0, right: 300, bottom: 15 });
		expect(plot.leftArea.rect).toEqual({ top: 15, left: 0, right: 25, bottom: 155 });
		expect(plot.rightArea.rect).toEqual({ top: 15, left: 265, right: 300, bottom: 155 });
		expect(plot.bottomArea.rect).toEqual({ top: 155, left: 0, right: 300, bottom: 200 });
		expect(plot.plotArea.rect).toEqual({ top: 15, left: 25, right: 265, bottom: 155 });
	})
})