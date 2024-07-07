import { Rect } from "./rect";

test('rect boundary', () => {
	const r = new Rect({ top: 6, left: 5, width: 100, height: 200 });
	expect(r.left).toBe(5);
	expect(r.width).toBe(100);
	expect(r.right).toBe(105);
	expect(r.top).toBe(6);
	expect(r.height).toBe(200);
	expect(r.bottom).toBe(206);
	expect(r.center).toEqual({ x: 55, y: 106 })
})
test('rect inflate', () => {
	let original = new Rect({ top: 6, left: 5, width: 100, height: 200 });
	let r = original.inflate(4);
	expect(original.left).toBe(5);

	expect(r.left).toBe(1);
	expect(r.width).toBe(108);
	expect(r.right).toBe(109);
	expect(r.top).toBe(2);
	expect(r.height).toBe(208);
	expect(r.bottom).toBe(210);
	expect(r.center).toEqual({ x: 55, y: 106 })

	original = new Rect({ top: 6, left: 5, width: 100, height: 200 });
	r = original.inflate(-4);
	expect(original.left).toBe(5);

	expect(r.left).toBe(9);
	expect(r.width).toBe(92);
	expect(r.right).toBe(101);
	expect(r.top).toBe(10);
	expect(r.height).toBe(192);
	expect(r.bottom).toBe(202);
	expect(r.center).toEqual({ x: 55, y: 106 })
	expect(r.rect).toEqual({
		left: 9,
		top: 10,
		right: 101,
		bottom: 202
	})
})
test('rect offset', () => {
	let original = new Rect({ top: 6, left: 5, width: 100, height: 200 });
	let r = original.offset()
	expect(original.left).toBe(5);
	expect(r.left).toBe(5.5);
	expect(r.width).toBe(100);
	expect(r.right).toBe(105.5);
	expect(r.top).toBe(5.5);
	expect(r.height).toBe(200);
	expect(r.bottom).toBe(205.5);
	expect(r.center).toEqual({ x: 55.5, y: 105.5 })
})
test('rect set-right', () => {
	let r = new Rect({ top: 6, left: 5, width: 100, height: 200 });
	expect(r.rect).toEqual({ left: 5, top: 6, right: 105, bottom: 206 })
	expect(r.width).toBe(100)
	r.right = 90
	expect(r.rect).toEqual({ left: 5, top: 6, right: 90, bottom: 206 })
	expect(r.width).toBe(85)
})
test('isempty', () => {
	let r = new Rect()
	expect(r.isEmpty).toBe(true);
	r.width = 1;
	r.height = 0;
	expect(r.isEmpty).toBe(false);
	r.width = 0;
	r.height = 1;
	expect(r.isEmpty).toBe(false);
})