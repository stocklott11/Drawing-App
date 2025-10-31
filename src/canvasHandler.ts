import { Brush } from './brush.js';

type Point = { x: number; y: number; };

export class CanvasHandler {
  private ctx: CanvasRenderingContext2D;
  private isDrawing = false;
  private last: Point | null = null;
  private devicePixelRatio = Math.max(1, window.devicePixelRatio || 1);

  constructor(private canvas: HTMLCanvasElement, private brush: Brush) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('2D context unavailable');
    this.ctx = ctx;
    this.setupHiDPI();
    this.attachEvents();
    this.clear();
  }

  private setupHiDPI() {
    const { width, height } = this.canvas;
    const ratio = this.devicePixelRatio;
    this.canvas.width = width * ratio;
    this.canvas.height = height * ratio;
    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';
    this.ctx.scale(ratio, ratio);
  }

  clear() {
    const cssW = parseInt(this.canvas.style.width || String(this.canvas.width), 10) || this.canvas.width / this.devicePixelRatio;
    const cssH = parseInt(this.canvas.style.height || String(this.canvas.height), 10) || this.canvas.height / this.devicePixelRatio;
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, cssW, cssH);
  }

  async savePNG(filename = 'drawing.png') {
    const blob: Blob = await new Promise((resolve) => {
      this.canvas.toBlob((b) => resolve(b as Blob), 'image/png');
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  private attachEvents() {
    const toPoint = (e: MouseEvent | TouchEvent): Point => {
      const rect = this.canvas.getBoundingClientRect();
      const client = (e as TouchEvent).touches?.[0] ?? (e as MouseEvent);
      return { x: client.clientX - rect.left, y: client.clientY - rect.top };
    };

    const start = (e: MouseEvent | TouchEvent) => {
      this.isDrawing = true;
      this.last = toPoint(e);
    };

    const move = (e: MouseEvent | TouchEvent) => {
      if (!this.isDrawing) return;
      const curr = toPoint(e);
      this.stroke(this.last!, curr);
      this.last = curr;
    };

    const end = () => { this.isDrawing = false; this.last = null; };

    this.canvas.addEventListener('mousedown', start);
    this.canvas.addEventListener('mousemove', move);
    window.addEventListener('mouseup', end);

    this.canvas.addEventListener('touchstart', (e) => { e.preventDefault(); start(e); }, { passive: false });
    this.canvas.addEventListener('touchmove', (e) => { e.preventDefault(); move(e); }, { passive: false });
    window.addEventListener('touchend', end);

    window.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 'c') this.clear();
      if (e.key.toLowerCase() === 's') this.savePNG();
    });
  }

  private stroke(a: Point, b: Point) {
    const ctx = this.ctx;
    ctx.strokeStyle = this.brush.color;
    ctx.lineWidth = this.brush.size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }
}