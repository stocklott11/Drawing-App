import { Brush } from './brush.js';
import { CanvasHandler } from './canvasHandler.js';

function ready(fn: () => void) {
  if (document.readyState !== 'loading') fn();
  else document.addEventListener('DOMContentLoaded', fn);
}

ready(() => {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const colorInput = document.getElementById('color') as HTMLInputElement;
  const sizeInput = document.getElementById('size') as HTMLInputElement;
  const sizeValue = document.getElementById('sizeValue') as HTMLSpanElement;
  const clearBtn = document.getElementById('clearBtn') as HTMLButtonElement;
  const saveBtn = document.getElementById('saveBtn') as HTMLButtonElement;

  const brush = new Brush(colorInput.value, Number(sizeInput.value));
  const handler = new CanvasHandler(canvas, brush);

  colorInput.addEventListener('input', () => brush.setColor(colorInput.value));
  sizeInput.addEventListener('input', () => {
    brush.setSize(Number(sizeInput.value));
    sizeValue.textContent = sizeInput.value;
  });

  clearBtn.addEventListener('click', () => handler.clear());
  saveBtn.addEventListener('click', () => handler.savePNG());
});