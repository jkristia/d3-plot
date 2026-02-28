import { describe, expect, it, jest } from '@jest/globals';

jest.mock('../elements', () => {
    const scale = jest.requireActual<typeof import('../elements/scale')>('../elements/scale');
    return { Scale: scale.Scale };
});

import { RightYAxis } from './y-axis-right';
import { Scale } from './scale';
import { Rect } from '../util';

describe('RightYAxis', () => {
    it('renders right-side axis with configured domain and format', () => {
        const item = new RightYAxis({
            domain: { min: 0, max: 100 },
            ticks: 4,
            tickValues: [0, 50, 100],
            tickFormat: (v: number) => `${v}%`,
        });
        const scale = new Scale();
        scale.updateScales(new Rect({ left: 0, top: 0, width: 200, height: 100 }));
        item.setScale(scale);
        item.initializeLayout();
        item.updateLayout(new Rect({ left: 10, top: 5, width: 180, height: 90 }));

        const axis = item.plotElement!.select('.y-axis-right');
        expect(axis.node()).not.toBeNull();
        expect(axis.attr('transform')).toContain('translate(');
        const labels = axis.selectAll('.tick text').nodes().map((n: any) => n.textContent);
        expect(labels).toContain('0%');
        expect(labels).toContain('50%');
        expect(labels).toContain('100%');
    });
});
