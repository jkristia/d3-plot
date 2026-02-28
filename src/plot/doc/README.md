# Plot Component

A convenience wrapper on top of [D3.js](https://d3js.org/) that provides structure while maintaining full D3 flexibility.

## What is it?

- Structured layout system for building D3 charts
- Direct D3 access for custom rendering logic
- Composable plot items that work together
- Built-in lifecycle management (initialize, update, destroy)

## Architecture

### Areas

The plot is divided into 5 areas:

- **top** - Title, header elements
- **left** - Y-axis, left labels
- **center** - Main plot content (lines, bars, etc.)
- **right** - Secondary Y-axis, right labels
- **bottom** - X-axis, footer elements

Each area:
- Takes a list of `PlotItem` instances
- Renders items in the order they're added
- Has its own coordinate system and scale
- Can be sized independently (width/height)

### Plot Items

A `PlotItem` is a D3 entry point where you write rendering logic:

- `initializeLayout()` - Create D3 elements once
- `updateLayout(area)` - Update positions/data on resize or data change
- `destroy()` - Clean up when removed

Items have access to:
- `this._rootElm` - D3 selection for your SVG group
- `this.scale` - Scale with `xScale`/`yScale` for coordinate mapping
- `this._area` - Bounding rectangle for layout
- `this._owner` - Parent area (for tooltip layer, etc.)

## Quick Example

```typescript
// 1. Create a custom plot item
class MyLinePlot extends PlotItem {
    public override initializeLayout(): void {
        super.initializeLayout();
        this._rootElm?.append('path')
            .classed('my-line', true)
            .attr('fill', 'none')
            .attr('stroke', 'blue');
    }

    public override updateLayout(area: Rect): void {
        super.updateLayout(area);
        const data = [{ x: 0, y: 0 }, { x: 10, y: 20 }, { x: 20, y: 15 }];
        
        const line = d3.line()
            .x(d => this.scale.xScale(d.x))
            .y(d => this.scale.yScale(d.y));
        
        this._rootElm?.select('.my-line')
            .attr('d', line(data));
    }
}

// 2. Configure the plot
const scale = new Scale()
    .xDomain(() => ({ min: 0, max: 20 }))
    .yDomain(() => ({ min: 0, max: 25 }))
    .setMargin({ left: 50, top: 10, right: 10, bottom: 40 });

const plot = new Plot({
    title: 'My Chart',
    leftArea: { 
        width: 60, 
        plots: [new AxisLabelItem('Y Axis', -90)] 
    },
    plots: [
        new AxisAndGrid(),
        new MyLinePlot()
    ],
    scales: [scale]
});

// 3. Use in Angular component
// Component:
export class MyChartComponent {
    public plot = signal(plot);
}

// Template:
<div class="container">
    <plot-base [plot]="plot()"></plot-base>
</div>
```

## Common Plot Items

Pre-built items in `src/plot/elements/`:

- **AxisAndGrid** - X/Y axes with grid lines
- **LineSeries** - Line chart with optional point markers
- **BarPlotItem** - Grouped bar charts
- **StackedBarPlotItem** - Stacked bar charts with category layers
- **TitleItem** - Centered or aligned text
- **AxisLabelItem** - Rotatable axis labels
- **RightYAxis** - Secondary Y-axis
- **BarLegendItem** - Legend markers

## Scales

Scales map data values to pixel coordinates:

```typescript
const scale = new Scale()
    .xDomain(area => ({ min: 0, max: 100 }))  // Data range
    .yDomain(area => ({ min: 0, max: 50 }))
    .setMargin({ left: 5, top: 5, right: 5, bottom: 5 });

// Use in items:
const xPixel = this.scale.xScale(dataX);
const yPixel = this.scale.yScale(dataY);
```

## Tooltips

Plot items can use tooltips via the owner's tooltip layer:

```typescript
const tooltip = new LineTooltip();
tooltip.initialize(this._owner?.tooltipLayerElm);
tooltip.show(event, { point, seriesLabel }, bounds);
```

## Full D3 Power

Any D3 operation works inside `PlotItem`:

- Selections, joins, transitions
- Custom scales, axes, shapes
- Event handlers, drag behaviors
- Force simulations, geographic projections
- Full SVG/DOM manipulation

The wrapper just provides structure—D3 does the rendering.
