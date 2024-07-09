import * as d3 from 'd3';
import { Rect, D3Selection } from '../util';
import { PlotItem } from './plot.item';

export class PlotArea {
    public root?: D3Selection;
    public background: D3Selection;
    public rect: Rect = new Rect();
    public plots: PlotItem[] = [];
    // allow initialize even if rect is empty, this is for the center / main plot area
    public forceInitialize = false;
    constructor(root?: D3Selection) {
        this.root = root;
        this.background = d3.create('svg:rect')
        if (root) {
            root.append(() => this.background.node())
                .classed('plot-background', true)
        }
    }
    public applyRect(): D3Selection {
        this.root!
            .attr('x', this.rect.left)
            .attr('y', this.rect.top)
            .attr('width', this.rect.width)
            .attr('height', this.rect.height)

        this.background
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', this.rect.width)
            .attr('height', this.rect.height)

        return this.root!;
    }
    public initializeLayout() {
        if (this.forceInitialize === false && this.rect.isEmpty) {
            return;
        }
        this.plots.forEach(p => {
            p.initializeLayout()
            if (p.plotElement) {
                this.root?.append(() => p.plotElement!.node())
            }
        });
    }
    public updateLayout() {
        if (this.rect.isEmpty) {
            return;
        }
        // area passed to plot is the area of canvas, meaning sarts at (0,0)
        const r = new Rect({ left: 0, top: 0, width: this.rect.width, height: this.rect.height });
        (this.plots || []).forEach(p => {
            p.updateLayout(r)
        });
    }
}
