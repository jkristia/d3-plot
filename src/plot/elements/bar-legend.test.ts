import { describe, expect, it, jest } from '@jest/globals';

jest.mock('../elements', () => {
    const scale = jest.requireActual<typeof import('../elements/scale')>('../elements/scale');
    return { Scale: scale.Scale };
});

import { BarLegendItem } from './bar-legend';
import { Rect } from '../util';

describe('BarLegendItem', () => {
    it('positions marker and label based on slot and total', () => {
        const item = new BarLegendItem('Revenue', 'series-a', 1, 3);
        item.initializeLayout();
        item.updateLayout(new Rect({ left: 0, top: 0, width: 420, height: 60 }));

        const root = item.plotElement!.node() as SVGGElement;
        const marker = root.querySelector('rect')!;
        const label = root.querySelector('text')!;

        expect(marker.getAttribute('x')).toBe('140');
        expect(marker.getAttribute('y')).toBe('40');
        expect(marker.getAttribute('width')).toBe('34');
        expect(label.getAttribute('x')).toBe('180');
        expect(label.textContent).toBe('Revenue');
        expect(root.classList.contains('series-a')).toBe(true);
    });
});
