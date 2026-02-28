import { describe, expect, it, jest } from '@jest/globals';

jest.mock('./elements', () => {
    const scale = jest.requireActual<typeof import('./elements/scale')>('./elements/scale');
    return { Scale: scale.Scale };
});

import { PlotAreaSelection } from './plot.area-selection';
import { Rect } from './util';
import { MockPlotAreaOwner } from './test/mocks';

describe('PlotAreaSelection', () => {
    it('creates, updates and clears selection range on pointer lifecycle', () => {
        const owner = new MockPlotAreaOwner({
            contentAreaRect: new Rect({ left: 10, top: 10, width: 50, height: 30 }),
        });
        const item = new PlotAreaSelection();
        item.setOwner(owner);
        item.initializeLayout();

        const contentNode = owner.contentAreaElm.node() as SVGElement;
        (contentNode as any).setPointerCapture = jest.fn();
        (contentNode as any).releasePointerCapture = jest.fn();

        const currentMousePosition = jest.spyOn(item, 'currentMousePosition');
        currentMousePosition
            .mockReturnValueOnce({ x: 0, y: 0 })
            .mockReturnValueOnce({ x: 0, y: 0 })
            .mockReturnValueOnce({ x: 100, y: 100 });

        (item as any).onPointerDown({ pointerId: 1 });
        let selection = (owner.rootElm.node() as SVGElement).querySelector('.range-selection') as SVGRectElement;
        expect(selection).not.toBeNull();
        expect(selection.getAttribute('x')).toBe('10');
        expect(selection.getAttribute('y')).toBe('10');
        expect(selection.getAttribute('width')).toBe('0');
        expect(selection.getAttribute('height')).toBe('0');

        (item as any).onPointerMove({ pointerId: 1 });
        selection = (owner.rootElm.node() as SVGElement).querySelector('.range-selection') as SVGRectElement;
        expect(selection.getAttribute('width')).toBe('50');
        expect(selection.getAttribute('height')).toBe('30');

        (item as any).onPointerUp({ pointerId: 1 });
        expect((owner.rootElm.node() as SVGElement).querySelector('.range-selection')).toBeNull();
        expect((contentNode as any).setPointerCapture).toHaveBeenCalledWith(1);
        expect((contentNode as any).releasePointerCapture).toHaveBeenCalledWith(1);
    });
});
