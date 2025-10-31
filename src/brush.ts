export class Brush {
    constructor(public color: string, public size: number) {}
  
    setColor(color: string) { this.color = color; }
    setSize(size: number) { this.size = size; }
  }