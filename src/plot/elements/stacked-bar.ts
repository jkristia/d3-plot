import { Subject, Subscription } from 'rxjs';
import { Point, Rect } from '../util';
import { PlotItem } from '../plot.item';
import { IPlotItemOptions } from '../plot.interface';
import { ITooltip } from './tooltip';

/**
 * Stacked bar tooltip data interface.
 */
export interface StackedBarTooltipData {
    point: Point;
    category: string;
    categoryIndex: number;
    xTooltipFormatter?: (x: number) => string;
    xTickFormatter?: (x: number) => string;
    yTooltipFormatter?: (y: number) => string;
    yTickFormatter?: (y: number) => string;
}

/**
 * Input payload for a stacked bar chart.
 * Each category represents a layer in the stack.
 */
export interface IStackedBarChartData {
    categories: IStackedBarCategory[];
    dataChanged?: Subject<void>;
}

/**
 * One category layer in the stacked bar chart (e.g. "Category 1", "Category 2").
 */
export interface IStackedBarCategory {
    id?: string;
    label?: string;
    cssClass?: string;
    points: Point[];
    dataChanged?: Subject<void>;
}

/**
 * Visual/behavior options for stacked bar rendering.
 */
export interface IStackedBarOptions extends IPlotItemOptions {
    barWidthRatio?: number;
    minBarWidth?: number;
    maxBarWidth?: number;
    xTooltipFormatter?: (x: number) => string;
    xTickFormatter?: (x: number) => string;
    yTooltipFormatter?: (y: number) => string;
    yTickFormatter?: (y: number) => string;
    tooltip?: ITooltip<StackedBarTooltipData>;
}

/**
 * Internal per-segment data container used during layout and hover handling.
 */
interface StackedBarSegment {
    point: Point;
    categoryIndex: number;
    categoryLabel: string;
    categoryCssClass?: string;
    y0: number; // bottom of this segment
    y1: number; // top of this segment
}

export class StackedBarPlotItem extends PlotItem {
    private tooltip?: ITooltip<StackedBarTooltipData>;
    private subscriptions: Subscription[] = [];

    private get options(): IStackedBarOptions | undefined {
        return this._options as IStackedBarOptions;
    }

    public constructor(private _data: IStackedBarChartData, options?: IStackedBarOptions) {
        super(options);
        this.tooltip = options?.tooltip;
        if (_data.dataChanged) {
            this.subscriptions.push(
                _data.dataChanged.subscribe(() => this.updateLayout(this._area))
            );
        }
        (_data.categories || []).forEach((category) => {
            if (category.dataChanged) {
                this.subscriptions.push(
                    category.dataChanged.subscribe(() => this.updateLayout(this._area))
                );
            }
        });
    }

    protected override onDestroy(): void {
        // Unsubscribe from all data change subscriptions to prevent memory leaks
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.subscriptions = [];
        // Remove event listeners from bar elements
        this._rootElm?.selectAll('.stacked-bar-segment')
            .on('mouseenter', null)
            .on('mousemove', null)
            .on('mouseleave', null);
        // Clean up tooltip
        this.tooltip?.destroy();
    }

    public override initializeLayout(): void {
        super.initializeLayout();
        this._rootElm?.classed('stacked-bar-plot-elm', true);
        const tooltipRoot = this._owner?.tooltipLayerElm || this._rootElm;
        if (this.tooltip && tooltipRoot) {
            this.tooltip.initialize(tooltipRoot);
        }
    }

    public override updateLayout(area: Rect): void {
        super.updateLayout(area);
        const plotArea = this.getPlotArea();
        const categories = this.getCategories();
        if (!this._rootElm || categories.length === 0) {
            return;
        }

        const xValues = new Set<number>();
        categories.forEach(cat => cat.points.forEach(p => xValues.add(p.x)));
        const sortedXValues = Array.from(xValues).sort((a, b) => a - b);

        if (sortedXValues.length === 0) {
            return;
        }

        // Calculate bar width
        let minDelta = Number.POSITIVE_INFINITY;
        for (let i = 1; i < sortedXValues.length; i++) {
            const delta = sortedXValues[i] - sortedXValues[i - 1];
            if (delta > 0) {
                minDelta = Math.min(minDelta, delta);
            }
        }

        const ratio = this.options?.barWidthRatio ?? 0.6;
        const minBarWidth = this.options?.minBarWidth ?? 6;
        const maxBarWidth = this.options?.maxBarWidth ?? 120;
        const fallbackWidth = plotArea.width / Math.max(sortedXValues.length * 1.8, 1);
        const computedWidth = Number.isFinite(minDelta)
            ? Math.abs(this.scale.xScale(minDelta) - this.scale.xScale(0)) * ratio
            : fallbackWidth;
        const barWidth = Math.max(minBarWidth, Math.min(maxBarWidth, computedWidth));

        // Build stacked segments data
        const segments: StackedBarSegment[] = [];

        sortedXValues.forEach(xValue => {
            let cumulativeY = 0;
            categories.forEach((category, categoryIndex) => {
                const point = category.points.find(p => p.x === xValue);
                if (point && typeof point.y === 'number') {
                    const y0 = cumulativeY;
                    const y1 = cumulativeY + point.y;
                    segments.push({
                        point: { x: xValue, y: point.y },
                        categoryIndex,
                        categoryLabel: category.label,
                        categoryCssClass: category.cssClass,
                        y0,
                        y1,
                    });
                    cumulativeY = y1;
                }
            });
        });

        const y0Scale = this.scale.yScale(0);
        this._rootElm
            .selectAll('.stacked-bar-segment')
            .data(segments, (d: any) => `${d.categoryIndex}-${d.point.x}`)
            .join('rect')
            .attr('class', (d) => {
                const classes = ['stacked-bar-segment', `category-${d.categoryIndex}`];
                if (d.categoryCssClass) {
                    classes.push(d.categoryCssClass);
                }
                return classes.join(' ');
            })
            .attr('x', (d) => {
                const xCenter = this.scale.xScale(d.point.x);
                return xCenter - barWidth / 2;
            })
            .attr('y', (d) => this.scale.yScale(d.y1))
            .attr('width', barWidth)
            .attr('height', (d) => Math.abs(this.scale.yScale(d.y0) - this.scale.yScale(d.y1)))
            .on('mouseenter', (event: MouseEvent, d: StackedBarSegment) => {
                // Highlight the hovered segment
                this._rootElm?.selectAll('.stacked-bar-segment').classed('hovered', false);
                (event.target as Element).classList.add('hovered');
                this.showTooltip(event, d);
            })
            .on('mousemove', (event: MouseEvent, d: StackedBarSegment) => this.showTooltip(event, d))
            .on('mouseleave', (event: MouseEvent) => {
                (event.target as Element).classList.remove('hovered');
                this.hideTooltip();
            });
    }

    private getCategories(): Array<{ points: Point[]; label: string; cssClass?: string }> {
        return this._data.categories.map((c, i) => ({
            points: c.points,
            label: c.label || c.id || `Category ${i + 1}`,
            cssClass: c.cssClass,
        }));
    }

    private showTooltip(event: MouseEvent, datum: StackedBarSegment) {
        if (!this.tooltip) {
            return;
        }
        const tooltipData: StackedBarTooltipData = {
            point: datum.point,
            category: datum.categoryLabel,
            categoryIndex: datum.categoryIndex,
            xTooltipFormatter: this.options?.xTooltipFormatter,
            xTickFormatter: this.options?.xTickFormatter,
            yTooltipFormatter: this.options?.yTooltipFormatter,
            yTickFormatter: this.options?.yTickFormatter,
        };
        this.tooltip.show(event, tooltipData, this._area);
    }

    private hideTooltip() {
        this.tooltip?.hide();
    }
}
