// this util functions generates an svg path from a list of points
export function generatePath(points: number[][]) {
  const path = points.map(([x, y]) => `${x},${y}`).join(' L');
  return `M${path} Z`;
}

export const shapeColors: Record<
  'process' | 'in-out' | 'start-end' | 'decision' | 'action' | 'document' | 'data',
  string
> = {
  process:   '#9dc7f7ff', // blue
  'in-out':  '#00a2aeff', // teal
  'start-end': '#cececeff', // neutral
  decision:  '#fd9947ff', // orange
  action:    '#ffd071ff', // yellow
  document:  '#7ad9e6ff', // turquoise
  data:      '#af5bc9ff', // plumb
};

export function getDefaultColor(type: string): string {
  return (shapeColors as Record<string, string>)[type] ?? '#6b7280'; // gray fallback
}