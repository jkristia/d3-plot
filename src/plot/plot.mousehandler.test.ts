import { describe, expect, it } from '@jest/globals';
import { PlotMouseHandler } from './plot.mousehandler';
import { Rect } from './util';
import { MockCursor, MockPlotAreaOwner, pointToClientEvent } from './test/mocks';

describe('PlotMouseHandler', () => {
    it('initializes cursor container and forwards pointermove updates', () => {
        const owner = new MockPlotAreaOwner({
            contentAreaRect: new Rect({ left: 10, top: 10, width: 50, height: 20 }),
        });
        const cursor = new MockCursor();
        const handler = new PlotMouseHandler().setCursor(cursor);
        handler.initializeLayout(owner);

        const root = owner.rootElm.node() as SVGElement;
        root.dispatchEvent(pointToClientEvent('pointermove', { x: 20, y: 15 }));
        expect(cursor.initialized).toBe(true);
        expect(cursor.updatedArgs.length).toBe(1);
        expect(cursor.updatedArgs[0].x).toBe(20);
        expect(cursor.updatedArgs[0].y).toBe(15);
    });

    it('toggles hidden class when pointer leaves visible content area', () => {
        const owner = new MockPlotAreaOwner({
            contentAreaRect: new Rect({ left: 10, top: 10, width: 50, height: 20 }),
        });
        const handler = new PlotMouseHandler();
        handler.initializeLayout(owner);

        const root = owner.rootElm.node() as SVGElement;
        root.dispatchEvent(pointToClientEvent('pointerleave', { x: 5, y: 5 }));
        const container = root.querySelector('.cursor')!;
        expect(container.classList.contains('hidden')).toBe(true);

        root.dispatchEvent(pointToClientEvent('pointerleave', { x: 20, y: 20 }));
        expect(container.classList.contains('hidden')).toBe(false);
    });

    it('destroy removes handlers and container', () => {
        const owner = new MockPlotAreaOwner();
        const cursor = new MockCursor();
        const handler = new PlotMouseHandler().setCursor(cursor);
        handler.initializeLayout(owner);
        const root = owner.rootElm.node() as SVGElement;
        handler.destroy();
        expect(root.querySelector('.cursor')).toBeNull();
        root.dispatchEvent(pointToClientEvent('pointermove', { x: 20, y: 20 }));
        expect(cursor.updatedArgs.length).toBe(0);
    });
});
