import { Rect } from "../../util";
import { LinearScale, Scale } from "./scale"

test('default scale', () => {
	// default scale is a linear scale with no margin
	const s = new Scale();
	s.updateScales(new Rect({ left: 0, top: 0, width: 200, height: 100 }));
	expect(s.xScale.range()).toEqual([0, 200]);
	expect(s.xScale.domain()).toEqual([0, 200]);
	expect(s.yScale.range()).toEqual([100, 0]); // notice range is inversed
	expect(s.yScale.domain()).toEqual([0, 100]);
	expect(s.xScale(10)).toBe(10);
	expect(s.yScale(11)).toBe(89); // inverted, max - value
})
test('margin', () => {
	// default scale is a linear scale with no margin
	const s = new Scale();
	s.margin = { top: 5, left: 5, right: 5, bottom: 5 };
	s.updateScales(new Rect({ left: 0, top: 0, width: 200, height: 100 }));
	expect(s.xScale.range()).toEqual([5, 195]); // adjust for margin
	expect(s.xScale.domain()).toEqual([0, 200]); // domain is full area
	expect(s.yScale.range()).toEqual([90, 5]); // notice range is inversed
	expect(s.yScale.domain()).toEqual([5, 90]);
	expect(s.xScale(10)).toBe(14.5); // pos is not 1:1 when margin is set
	expect(s.yScale(10)).toBe(85); // inverted, max - value
	// expect(s.xScale(10)).toBe(10); 
	// expect(s.yScale(10)).toBe(85); // inverted, max - value

	s.margin = { top: 0, left: 0, right: 0, bottom: 0 };
	s.updateScales(new Rect({ left: 0, top: 0, width: 200, height: 100 }));
	expect(s.xScale.range()).toEqual([0, 200]); // no margin
	expect(s.xScale.domain()).toEqual([0, 200]); // domain is full area
	expect(s.yScale.range()).toEqual([100, 0]); // notice range is inversed
	expect(s.yScale.domain()).toEqual([0, 100]);
	expect(s.xScale(10)).toBe(10); // pos is not 1:1 when margin is set
	expect(s.yScale(10)).toBe(90); // inverted, max - value
})
test('domain callback', () => {
	const s = new LinearScale()
		.xDomain(r => { return { min: 0, max: 400 } })
		.yDomain(r => { return { min: 0, max: 200 } })
		;
	s.updateScales(new Rect({ left: 0, top: 0, width: 200, height: 100 }));
	expect(s.xScale.range()).toEqual([0, 200]);
	expect(s.xScale.domain()).toEqual([0, 400]);
	expect(s.yScale.range()).toEqual([100, 0]); // notice range is inversed
	expect(s.yScale.domain()).toEqual([0, 200]);
	expect(s.xScale(10)).toBe(5);
	expect(s.yScale(11)).toBe(94.5); // inverted, max - value
})