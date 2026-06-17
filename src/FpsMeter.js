// A tiny dev FPS readout. Ticked once per rendered frame from the game loop, so it
// reflects the ACTUAL game framerate (not just the browser's refresh). Appended to
// the page body (outside the 3x-scaled game container) so the text stays legible.
// Toggle visibility with the ` (backtick) key.
export class FpsMeter {
  constructor() {
    this.frames = 0;
    this.lastSample = performance.now();
    this.worst = Infinity; // lowest fps seen this run, to catch dips
  }

  init() {
    this.element = document.createElement("div");
    this.element.classList.add("FpsMeter");
    this.element.textContent = "-- fps";
    document.body.appendChild(this.element);
  }

  // Call once per rendered frame.
  tick() {
    this.frames += 1;
    const now = performance.now();
    const elapsed = now - this.lastSample;
    if (elapsed >= 500) {
      const fps = Math.round((this.frames * 1000) / elapsed);
      this.worst = Math.min(this.worst, fps);
      this.element.textContent = `${fps} fps (low ${this.worst === Infinity ? "--" : this.worst})`;
      this.frames = 0;
      this.lastSample = now;
    }
  }

  toggle() {
    this.element.classList.toggle("FpsMeter--hidden");
  }
}
