import { PlotV1 } from "./plotv1"

describe('plot areas', () => {
	it('areas', () => {
		const plot = new PlotV1(null, {
			areas: { topHeight: 15, leftWidth: 25, rightWidth: 35, bottomHeight: 45, }
		})

		plot.size({ width: 300, height: 200 });
		expect(plot.fullArea.rect).toEqual({ top: 0, left: 0, right: 300, bottom: 200 });
		expect(plot.topArea.rect).toEqual({ top: 0, left: 0, right: 300, bottom: 15 });
		expect(plot.leftArea.rect).toEqual({ top: 15, left: 0, right: 25, bottom: 155 });
		expect(plot.rightArea.rect).toEqual({ top: 15, left: 265, right: 300, bottom: 155 });
		expect(plot.bottomArea.rect).toEqual({ top: 155, left: 0, right: 300, bottom: 200 });
		expect(plot.plotArea.rect).toEqual({ top: 15, left: 25, right: 265, bottom: 155 });
	})

	it('margin', () => {
		const plot = new PlotV1(null, {
			margin: { top: 5, left: 6, right: 7, bottom: 8}
		})
		plot.size({ width: 300, height: 200 });
		expect(plot.fullArea.rect).toEqual({ top: 5, left: 6, right: 293, bottom: 192 });
		expect(plot.plotArea.rect).toEqual({ top: 5, left: 6, right: 293, bottom: 192 });
	})
	it('margin & area', () => {
		const plot = new PlotV1(null, {
			margin: { top: 5, left: 5, right: 5, bottom: 5},
			areas: { topHeight: 10, leftWidth: 20, rightWidth: 30, bottomHeight: 40, }
		})
		plot.size({ width: 300, height: 200 });
		expect(plot.fullArea.rect).toEqual({ top: 5, left: 5, right: 295, bottom: 195 });
		expect(plot.topArea.rect).toEqual({ top: 5, left: 5, right: 295, bottom: 15 });
		expect(plot.leftArea.rect).toEqual({ top: 15, left: 5, right: 25, bottom: 155 });
		expect(plot.rightArea.rect).toEqual({ top: 15, left: 265, right: 295, bottom: 155 });
		expect(plot.bottomArea.rect).toEqual({ top: 155, left: 5, right: 295, bottom: 195 });
	})

})