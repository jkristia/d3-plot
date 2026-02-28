import * as d3 from 'd3';
import { IPlotArea } from '../plot.area';
import { ICursor } from '../plot.cross-cursor';
import { IPlotItem } from '../plot.interface';
import { ITooltip } from '../elements/tooltip';
import { Scale } from '../elements';
import { D3Selection, Point, Rect } from '../util';

export function createSvgRoot(): D3Selection {
    return d3.create('svg:svg');
}

export class MockPlotAreaOwner implements IPlotArea {
    public rootElm: D3Selection;
    public contentAreaElm: D3Selection;
    public tooltipLayerElm: D3Selection;
    public contentAreaRect: Rect;
    public scale: Scale;
    public hoverItem: IPlotItem | null = null;
    public clearHoverItemCalls = 0;

    public constructor(init?: {
        rootElm?: D3Selection;
        contentAreaRect?: Rect;
        scale?: Scale;
    }) {
        this.rootElm = init?.rootElm || createSvgRoot();
        this.contentAreaRect = init?.contentAreaRect || new Rect({ left: 0, top: 0, width: 200, height: 100 });
        this.scale = init?.scale || new Scale();
        this.scale.updateScales(this.contentAreaRect);

        this.contentAreaElm = this.rootElm.append('rect').classed('plot-content-area', true);
        this.tooltipLayerElm = this.rootElm.append('g').classed('tooltip-layer', true);
    }

    public setHoverItem(item: IPlotItem): void {
        this.hoverItem = item;
    }

    public clearHoverItem(_item: IPlotItem): void {
        this.hoverItem = null;
        this.clearHoverItemCalls++;
    }
}

export class MockCursor implements ICursor {
    public initialized = false;
    public updatedArgs: { scale: Scale; x: number; y: number; area: Rect }[] = [];

    public initialize(_rootElm: D3Selection): void {
        this.initialized = true;
    }

    public updatePosition(scale: Scale, xPos: number, yPos: number, area: Rect): void {
        this.updatedArgs.push({ scale, x: xPos, y: yPos, area });
    }
}

export class MockTooltip<TData = any> implements ITooltip<TData> {
    public initialized = false;
    public showCalls: Array<{ event: MouseEvent; data: TData; bounds: Rect }> = [];
    public hideCalls = 0;
    public destroyCalls = 0;

    public initialize(_rootElm: D3Selection): void {
        this.initialized = true;
    }
    public show(event: MouseEvent, data: TData, bounds: Rect): void {
        this.showCalls.push({ event, data, bounds });
    }
    public hide(): void {
        this.hideCalls++;
    }
    public destroy(): void {
        this.destroyCalls++;
    }
}

export function dispatchPointerEvent(target: Element, type: string, x: number, y: number, pointerId = 1): PointerEvent {
    const event = new PointerEvent(type, {
        bubbles: true,
        clientX: x,
        clientY: y,
        pointerId,
    });
    target.dispatchEvent(event);
    return event;
}

export function pointToClientEvent(type: string, p: Point): MouseEvent {
    return new MouseEvent(type, { bubbles: true, clientX: p.x, clientY: p.y });
}
