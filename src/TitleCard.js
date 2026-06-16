import { KeyPressListener } from "./KeyPressListener.js";

// A TV-episode-style title card. Use it as a cutscene event:
//   { type: "titleCard", title: "NERD ALERT", subtitle: "Episode 1: New Guy" }
// Optional: duration (ms the card holds before auto-dismissing, default 2800).
// The player can also skip it with Enter. It resolves when fully gone, so it
// sequences cleanly inside startCutscene([...]) for intros and act breaks.
export class TitleCard {
  constructor({ title, subtitle, duration = 2800, onComplete }) {
    this.title = title;
    this.subtitle = subtitle;
    this.duration = duration;
    this.onComplete = onComplete;
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("TitleCard");
    this.element.innerHTML = (`
      <div class="TitleCard_inner">
        <h1 class="TitleCard_title">${this.title ?? ""}</h1>
        ${this.subtitle ? `<p class="TitleCard_subtitle">${this.subtitle}</p>` : ""}
      </div>
    `);
  }

  done() {
    if (this.isDone) { return; }
    this.isDone = true;
    clearTimeout(this.timeout);
    this.actionListener?.unbind();

    // Play the exit animation, then clean up and resolve.
    this.element.classList.add("TitleCard--exit");
    this.element.addEventListener("animationend", () => {
      this.element.remove();
      this.onComplete();
    }, { once: true });
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);

    this.timeout = setTimeout(() => this.done(), this.duration);
    this.actionListener = new KeyPressListener("Enter", () => this.done());
  }
}
