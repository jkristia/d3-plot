import * as d3 from 'd3';
import { D3Selection, Point, Rect } from '../util';

/**
 * Base tooltip interface for plot elements
 */
export interface ITooltip<TData = any> {
    /**
     * Initialize the tooltip DOM elements
     */
    initialize(rootElm: D3Selection): void;

    /**
     * Show the tooltip at the specified position with data
     */
    show(event: MouseEvent, data: TData, bounds: Rect): void;

    /**
     * Hide the tooltip
     */
    hide(): void;

    /**
     * Clean up and remove tooltip elements
     */
    destroy(): void;
}

/**
 * Base tooltip implementation with common functionality
 */
export abstract class TooltipBase<TData = any> implements ITooltip<TData> {
    protected tooltipElm?: D3Selection;
    protected tooltipRect?: D3Selection;
    protected tooltipText?: D3Selection;
    protected containerElm?: D3Selection;

    public initialize(rootElm: D3Selection): void {
        this.containerElm = rootElm;
        this.tooltipElm = rootElm.append('g')
            .classed('plot-tooltip hidden', true)
            .style('pointer-events', 'none');
        this.tooltipRect = this.tooltipElm.append('rect');
        this.tooltipText = this.tooltipElm
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle');
    }

    public show(event: MouseEvent, data: TData, bounds: Rect): void {
        if (!this.tooltipElm || !this.tooltipRect || !this.tooltipText) {
            console.log('Tooltip not initialized');
            return;
        }

        this.tooltipElm.raise();
        const lines = this.formatData(data);

        this.tooltipText
            .selectAll('tspan')
            .data(lines)
            .join('tspan')
            .attr('x', 0)
            .attr('dy', (_d, i) => (i === 0 ? '0.9em' : '1.2em'))
            .text((d) => d);

        this.tooltipText.attr('x', 0).attr('y', 0);
        const bbox = this.tooltipText.node()?.getBBox();
        const width = Math.round((bbox?.width || 0) + 14);
        const height = Math.round((bbox?.height || 0) + 12);

        this.tooltipText
            .attr('x', Math.round(width / 2))
            .attr('y', 3);
        this.tooltipText
            .selectAll('tspan')
            .attr('x', Math.round(width / 2));

        this.tooltipRect
            .attr('width', width)
            .attr('height', height)
            .attr('rx', 4)
            .attr('ry', 4);

        const position = this.calculatePosition(event, width, height, bounds);
        const x = Math.round(position.x);
        const y = Math.round(position.y);
        this.tooltipElm
            .classed('hidden', false)
            .attr('transform', `translate(${x}, ${y})`);
    }

    public hide(): void {
        this.tooltipElm?.classed('hidden', true);
    }

    public destroy(): void {
        this.tooltipElm?.remove();
        this.tooltipRect?.remove();
        this.tooltipText?.remove();
        this.tooltipElm = undefined;
        this.tooltipRect = undefined;
        this.tooltipText = undefined;
        this.containerElm = undefined;
    }

    /**
     * Format data into tooltip lines - implemented by derived classes
     */
    protected abstract formatData(data: TData): string[];

    /**
     * Calculate tooltip position with boundary checking
     */
    protected calculatePosition(
        event: MouseEvent,
        width: number,
        height: number,
        bounds: Rect
    ): Point {
        // Default implementation - can be overridden
        const gap = 10;
        const mousePos = this.getMousePosition(event);
        let x = mousePos.x - width / 2;
        let y = mousePos.y - height - gap;

        x = Math.max(bounds.left + 2, Math.min(x, bounds.right - width - 2));
        if (y < bounds.top + 2) {
            y = mousePos.y + gap;
        }

        return { x, y };
    }

    /**
     * Get mouse position from event - can be overridden to use custom coordinate system
     */
    protected getMousePosition(event: MouseEvent): Point {
        // Default implementation - returns event coordinates
        // This should be overridden by implementations that need SVG coordinates
        return { x: event.clientX, y: event.clientY };
    }
}
