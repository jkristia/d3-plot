import { Plot } from "./plot"

describe('plot areas', () => {
	let plot: Plot;
	beforeEach(() => {
		plot = new Plot(null, {
			areas: {
				topHeight: 10,
				leftWidth: 20,
				rightWidth: 30,
				bottomHeight: 40,
			}
		})
	})
	it('test', () => {
		expect(true).toBe(true)
	})
})