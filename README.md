# d3-plot

An Angular playground for building reusable D3 chart primitives and interactive plot demos.

This workspace contains two generations of a custom plotting API:

- **Plot V1**: early, chainable D3 plot objects and demo components.
- **Plot V2**: a cleaner, area-based architecture with dedicated plot elements (axis/grid, line series, title, selection, cursor).

## V1 vs V2 (summary)

### Plot V1

- Single plot container with computed label/plot rectangles (`topArea`, `leftArea`, `plotArea`, etc).
- Plot elements are `PlotTypeBase` descendants and commonly rely on callback-based area selection.
- More implicit wiring between components and plot areas (flexible, but easier to couple tightly to component state).
- Useful for early experiments and legacy demos.

### Plot V2

- Explicit area model (`PlotArea`): top, left, right, bottom, center each own rect, scale, and child items.
- Composition is item-based (`PlotItem`) with clearer ownership and lifecycle (`initializeLayout` / `updateLayout`).
- Better separation of concerns: scales, mouse handlers, hover state, and chart items are modular.
- Cleaner extension path for interactive features (cross cursor, area selection, per-area plots, custom items).

### Decision going forward

- **New chart development should use V2 only.**
- V1 remains in the repo for reference and existing demos, but is considered legacy.
- If a chart currently exists in V1 and needs active enhancement, prefer migrating it to V2 instead of adding new V1 features.

## Tech stack

- Angular 20 (standalone components)
- TypeScript
- D3 v7
- Jest (unit tests for plot utilities and plot behavior)

## Project layout

- `src/components/v1/*`: Angular demo components for the V1 plot API.
- `src/components/v2/demo-1/*`: Angular demo using the V2 plot API.
- `src/plot/v1/*`: V1 plotting engine, plot types, and V1 base component.
- `src/plot/v2/*`: V2 plotting engine, areas, elements, scaling, mouse handling, and V2 base component.
- `src/plot/util/*`: shared geometry/util helpers and tests.
- `src/app/*`: application shell that hosts demos.

## Getting started

Install dependencies:

```bash
npm install
```

Run the app locally:

```bash
npm start
```

Then open `http://localhost:4200`.

## Testing

Run unit tests:

```bash
npm test
```

## Notes

- D3 rendering is encapsulated in plot base components that attach SVG output to a container and react to window resize.
- Demo components now use Angular signals for plot bindings passed into base components.