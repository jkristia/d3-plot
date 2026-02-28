import { describe, expect, it, jest } from '@jest/globals';

jest.mock('../elements', () => {
    const scale = jest.requireActual<typeof import('../elements/scale')>('../elements/scale');
    return { Scale: scale.Scale };
});

import { AxisLabelItem } from './axis-label';
import { Rect } from '../util';

describe('AxisLabelItem', () => {
    it('centers text and applies rotation when configured', () => {
        const item = new AxisLabelItem('Y Axis', -90);
        item.initializeLayout();
        item.updateLayout(new Rect({ left: 10, top: 10, width: 100, height: 40 }));

        const text = item.plotElement!.select('text');
        expect(text.text()).toBe('Y Axis');
        expect(text.attr('x')).toBe('60');
        expect(text.attr('y')).toBe('30');
        expect(text.attr('transform')).toBe('rotate(-90, 60, 30)');
    });

    it('omits transform when rotation is zero', () => {
        const item = new AxisLabelItem('X Axis', 0);
        item.initializeLayout();
        item.updateLayout(new Rect({ left: 0, top: 0, width: 80, height: 20 }));
        expect(item.plotElement!.select('text').attr('transform')).toBeNull();
    });
});
