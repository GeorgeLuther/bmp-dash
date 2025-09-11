// Shared geometry helpers (single source of numbers)
export const baseGeom = (G: number) => {
  const w = 6.5 * G, h = 4 * G, r = G / 12;
  return { w, h, r };
};

export const actionGeom = (G: number) => {
  const { w, h, r } = baseGeom(G);
  const notch = 1 * G;
  return { w, h, r, notch };
};

export const termGeom = (G: number) => {
  const { w, h } = baseGeom(G);
  const rx = Math.min(h / 2, w / 2);
  return { w, h, rx };
};

export const docGeom = (G: number) => {
  const { w, h, r } = baseGeom(G);
  const wave = h * 0.20;
  return { w, h, r, wave };
};

export const ioGeom = (G: number) => {
  const { w, h } = baseGeom(G);
  const slant = w * 0.12;
  return { w, h, slant };
};

export const dbGeom = (G: number) => {
  const { w, h } = baseGeom(G);
  const rx = w * 0.25;
  const ry = Math.min(h * 0.2, rx);
  return { w, h, rx, ry };
};
