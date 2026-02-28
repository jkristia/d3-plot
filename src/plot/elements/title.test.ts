import { describe, expect, it, jest } from '@jest/globals';

jest.mock('../elements', () => {
    const scale = jest.requireActual<typeof import('../elements/scale')>('../elements/scale');
    return { Scale: scale.Scale };
});

import { TitleItem } from './title';
import { Rect } from '../util';

describe('TitleItem', () => {
    it('renders title and positions left by default', () => {
        const item = new TitleItem('Hello');
        item.initializeLayout();
        item.updateLayout(new Rect({ left: 0, top: 0, width: 100, height: 20 }));
        const root = item.plotElement!.node() as SVGGElement;
        expect(root.querySelector('text')?.textContent).toBe('Hello');
        expect(root.querySelector('text')?.getAttribute('text-anchor')).toBe('start');
        expect(root.getAttribute('transform')).toBe('translate(0, 10)');
    });

    it('supports middle and right alignments with offsets', () => {
        const middle = new TitleItem('M', { align: 'middle', offset: { x: 2, y: 1 } });
        middle.initializeLayout();
        middle.updateLayout(new Rect({ left: 0, top: 0, width: 100, height: 20 }));
        expect(middle.plotElement!.select('text').attr('text-anchor')).toBe('middle');
        expect(middle.plotElement!.attr('transform')).toBe('translate(52, 9)');

        const right = new TitleItem('R', { align: 'right' });
        right.initializeLayout();
        right.updateLayout(new Rect({ left: 0, top: 0, width: 100, height: 20 }));
        expect(right.plotElement!.select('text').attr('text-anchor')).toBe('end');
        expect(right.plotElement!.attr('transform')).toBe('translate(100, 10)');
    });
});
