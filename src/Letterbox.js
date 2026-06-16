// Cinematic black bars (top + bottom) for cutscenes. Toggled via the
// "letterbox" cutscene event: { type: "letterbox", on: true|false }.
// One instance lives on the Overworld and persists across maps, so you can
// turn it on in one map's cutscene and off in another (or after a changeMap).
export class Letterbox {
  init(container) {
    this.element = document.createElement("div");
    this.element.classList.add("Letterbox");
    this.element.innerHTML = (`
      <div class="Letterbox_bar Letterbox_bar--top"></div>
      <div class="Letterbox_bar Letterbox_bar--bottom"></div>
    `);
    container.appendChild(this.element);
  }

  show(onComplete) {
    this.element.classList.add("Letterbox--on");
    this.afterTransition(onComplete);
  }

  hide(onComplete) {
    this.element.classList.remove("Letterbox--on");
    this.afterTransition(onComplete);
  }

  // Resolve once the bars finish sliding (matches the CSS transition duration).
  afterTransition(onComplete) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(onComplete, 420);
  }
}
