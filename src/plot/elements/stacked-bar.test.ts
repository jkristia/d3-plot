import { describe, expect, it, jest } from '@jest/globals';

jest.mock('../elements', () => {
    const scale = jest.requireActual<typeof import('../elements/scale')>('../elements/scale');
    return { Scale: scale.Scale };
});

import { Subject } from 'rxjs';
import { StackedBarPlotItem } from './stacked-bar';
import { Rect } from '../util';
import { Scale } from './scale';
import { MockPlotAreaOwner, MockTooltip, pointToClientEvent } from '../test/mocks';

describe('StackedBarPlotItem', () => {
    it('renders stacked bar segments with css class and geometry', () => {
        const owner = new MockPlotAreaOwner();
        const scale = new Scale();
        scale.updateScales(new Rect({ left: 0, top: 0, width: 100, height: 100 }));
        const item = new StackedBarPlotItem({
            categories: [
                { label: 'Cat A', cssClass: 'category-a', points: [{ x: 1, y: 10 }] },
                { label: 'Cat B', cssClass: 'category-b', points: [{ x: 1, y: 20 }] },
                { label: 'Cat C', points: [{ x: 1, y: 15 }] },
            ],
        });
        item.setOwner(owner);
        item.setScale(scale);
        item.initializeLayout();
        item.updateLayout(new Rect({ left: 0, top: 0, width: 100, height: 100 }));

        const segments = item.plotElement!.selectAll('.stacked-bar-segment').nodes() as SVGRectElement[];
        expect(segments.length).toBe(3);
        expect(segments[0].getAttribute('class')).toContain('category-a');
        expect(segments[1].getAttribute('class')).toContain('category-b');
        expect(Number(segments[0].getAttribute('width'))).toBeGreaterThan(0);
        expect(Number(segments[0].getAttribute('height'))).toBeGreaterThan(0);
    });

    it('stacks segments vertically at same x position', () => {
        const owner = new MockPlotAreaOwner();
        const scale = new Scale();
        scale.updateScales(new Rect({ left: 0, top: 0, width: 100, height: 100 }));
        const item = new StackedBarPlotItem({
            categories: [
                { label: 'Cat A', points: [{ x: 1, y: 10 }] },
                { label: 'Cat B', points: [{ x: 1, y: 20 }] },
            ],
        });
        item.setOwner(owner);
        item.setScale(scale);
        item.initializeLayout();
        item.updateLayout(new Rect({ left: 0, top: 0, width: 100, height: 100 }));

        const segments = item.plotElement!.selectAll('.stacked-bar-segment').nodes() as SVGRectElement[];
        expect(segments.length).toBe(2);

        // Both segments should have the same x position
        const x0 = Number(segments[0].getAttribute('x'));
        const x1 = Number(segments[1].getAttribute('x'));
        expect(x0).toBe(x1);

        // Y positions should be different (stacked)
        const y0 = Number(segments[0].getAttribute('y'));
        const y1 = Number(segments[1].getAttribute('y'));
        expect(y0).not.toBe(y1);
    });

    it('shows and hides tooltip during segment hover interactions', () => {
        const owner = new MockPlotAreaOwner();
        const scale = new Scale();
        scale.updateScales(new Rect({ left: 0, top: 0, width: 100, height: 100 }));
        const tooltip = new MockTooltip();
        const item = new StackedBarPlotItem(
            { categories: [{ label: 'Cat A', points: [{ x: 1, y: 10 }] }] },
            { tooltip, xTooltipFormatter: (x: number) => `Q${x}` }
        );
        item.setOwner(owner);
        item.setScale(scale);
        item.initializeLayout();
        item.updateLayout(new Rect({ left: 0, top: 0, width: 100, height: 100 }));

        const segment = item.plotElement!.select('.stacked-bar-segment').node() as SVGRectElement;
        segment.dispatchEvent(pointToClientEvent('mouseenter', { x: 10, y: 10 }));
        expect(tooltip.showCalls.length).toBe(1);
        expect(tooltip.showCalls[0].data.category).toBe('Cat A');
        segment.dispatchEvent(pointToClientEvent('mouseleave', { x: 10, y: 10 }));
        expect(tooltip.hideCalls).toBe(1);
    });

    it('adds hovered class on mouseenter and removes on mouseleave', () => {
        const owner = new MockPlotAreaOwner();
        const scale = new Scale();
        scale.updateScales(new Rect({ left: 0, top: 0, width: 100, height: 100 }));
        const item = new StackedBarPlotItem({
            categories: [
                { label: 'Cat A', points: [{ x: 1, y: 10 }] },
            ],
        });
        item.setOwner(owner);
        item.setScale(scale);
        item.initializeLayout();
        item.updateLayout(new Rect({ left: 0, top: 0, width: 100, height: 100 }));

        const segment = item.plotElement!.select('.stacked-bar-segment').node() as SVGRectElement;
        expect(segment.classList.contains('hovered')).toBe(false);

        segment.dispatchEvent(pointToClientEvent('mouseenter', { x: 10, y: 10 }));
        expect(segment.classList.contains('hovered')).toBe(true);

        segment.dispatchEvent(pointToClientEvent('mouseleave', { x: 10, y: 10 }));
        expect(segment.classList.contains('hovered')).toBe(false);
    });

    it('responds to global and category-level dataChanged and unsubscribes on destroy', () => {
        const changed = new Subject<void>();
        const categoryChanged = new Subject<void>();
        const owner = new MockPlotAreaOwner();
        const scale = new Scale();
        scale.updateScales(new Rect({ left: 0, top: 0, width: 100, height: 100 }));
        const item = new StackedBarPlotItem({
            dataChanged: changed,
            categories: [{ points: [{ x: 1, y: 10 }], dataChanged: categoryChanged }],
        });
        item.setOwner(owner);
        item.setScale(scale);
        item.initializeLayout();
        item.updateLayout(new Rect({ left: 0, top: 0, width: 100, height: 100 }));
        const spy = jest.spyOn(item, 'updateLayout');

        changed.next();
        categoryChanged.next();
        expect(spy.mock.calls.length).toBeGreaterThanOrEqual(2);

        item.destroy();
        const after = spy.mock.calls.length;
        changed.next();
        categoryChanged.next();
        expect(spy.mock.calls.length).toBe(after);
    });

    it('handles multiple bars at different x positions', () => {
        const owner = new MockPlotAreaOwner();
        const scale = new Scale();
        scale.updateScales(new Rect({ left: 0, top: 0, width: 100, height: 100 }));
        const item = new StackedBarPlotItem({
            categories: [
                { label: 'Cat A', points: [{ x: 1, y: 10 }, { x: 2, y: 15 }] },
                { label: 'Cat B', points: [{ x: 1, y: 20 }, { x: 2, y: 25 }] },
            ],
        });
        item.setOwner(owner);
        item.setScale(scale);
        item.initializeLayout();
        item.updateLayout(new Rect({ left: 0, top: 0, width: 100, height: 100 }));

        const segments = item.plotElement!.selectAll('.stacked-bar-segment').nodes() as SVGRectElement[];
        expect(segments.length).toBe(4); // 2 categories × 2 x positions
    });

    it('applies CSS class from options', () => {
        const owner = new MockPlotAreaOwner();
        const scale = new Scale();
        scale.updateScales(new Rect({ left: 0, top: 0, width: 100, height: 100 }));
        const item = new StackedBarPlotItem(
            { categories: [{ points: [{ x: 1, y: 10 }] }] },
            { cssClasses: ['custom-stacked-bar'] }
        );
        item.setOwner(owner);
        item.setScale(scale);
        item.initializeLayout();
        item.updateLayout(new Rect({ left: 0, top: 0, width: 100, height: 100 }));

        expect(item.plotElement?.attr('class')).toContain('custom-stacked-bar');
    });

    it('applies correct category index CSS classes to prevent color offset', () => {
        // This test catches the bug where category colors were offset due to incorrect CSS class mappings
        const owner = new MockPlotAreaOwner();
        const scale = new Scale();
        scale.updateScales(new Rect({ left: 0, top: 0, width: 100, height: 100 }));
        const item = new StackedBarPlotItem({
            categories: [
                { label: 'Category 1', points: [{ x: 1, y: 10000 }] },  // index 0 -> should have category-0 class
                { label: 'Category 2', points: [{ x: 1, y: 4000 }] },   // index 1 -> should have category-1 class
                { label: 'Category 3', points: [{ x: 1, y: 1000 }] },   // index 2 -> should have category-2 class
            ],
        });
        item.setOwner(owner);
        item.setScale(scale);
        item.initializeLayout();
        item.updateLayout(new Rect({ left: 0, top: 0, width: 100, height: 100 }));

        const segments = item.plotElement!.selectAll('.stacked-bar-segment').nodes() as SVGRectElement[];
        expect(segments.length).toBe(3);

        // Verify each segment has the correct index-based CSS class
        for (let i = 0; i < segments.length; i++) {
            const classList = segments[i].getAttribute('class') || '';
            expect(classList).toContain(`category-${i}`);
            expect(classList).toContain('stacked-bar-segment');
        }

        // Specifically verify the color mapping:
        // category-0 (index 0) = Category 1 = blue
        // category-1 (index 1) = Category 2 = green
        // category-2 (index 2) = Category 3 = orange
        expect(segments[0].getAttribute('class')).toContain('category-0');
        expect(segments[1].getAttribute('class')).toContain('category-1');
        expect(segments[2].getAttribute('class')).toContain('category-2');
    });
});

