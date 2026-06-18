import { RevealingText } from "./RevealingText.js";
import { KeyPressListener } from "./KeyPressListener.js";
import { Characters } from "./Content/characters.js";

export class TextMessage {
  constructor({
    text,
    speaker,
    onComplete
  }) {
    this.text = text;
    this.speaker = speaker; // optional characterId; otherwise sniffed from a "NAME:" prefix
    this.onComplete = onComplete;
    this.element = null;
  }

  // Decide whose portrait (if any) to show and what text to display. An explicit
  // `speaker` characterId wins; otherwise we sniff a leading "NAME:" prefix and
  // match it to a character, stripping the prefix so the face replaces the name
  // tag. Speakers we don't have a portrait for keep their plain text label.
  resolveSpeaker() {
    if (this.speaker && Characters[this.speaker]) {
      return { portraitSrc: Characters[this.speaker].src, text: this.text };
    }
    const match = this.text.match(/^([^:]{1,20}):\s*(.+)$/);
    if (match) {
      const name = match[1].trim().toUpperCase();
      const entry = Object.values(Characters).find(c => c.name.toUpperCase() === name);
      if (entry) {
        return { portraitSrc: entry.src, text: match[2] };
      }
    }
    return { portraitSrc: null, text: this.text };
  }

  createElement() {
    //Create the element
    this.element = document.createElement("div");
    this.element.classList.add("TextMessage");

    const { portraitSrc, text } = this.resolveSpeaker();

    this.element.innerHTML = (`
      ${portraitSrc ? `<img class="TextMessage_portrait" src="${portraitSrc}" alt="" />` : ""}
      <p class="TextMessage_p ${portraitSrc ? "TextMessage_p--withPortrait" : ""}"></p>
      <button class="TextMessage_button">Next</button>
    `)

    //Init the typewriter effect (on the speaker-stripped text)
    this.revealingText = new RevealingText({
      element: this.element.querySelector(".TextMessage_p"),
      text: text
    })

    this.element.querySelector("button").addEventListener("click", () => {
      //Close the text message
      this.done();
    });

    this.actionListener = new KeyPressListener("Enter", () => {
      this.done();
    })

  }

  done() {

    if (this.revealingText.isDone) {
    this.element.remove();
    this.actionListener.unbind();
    this.onComplete();
  } else {
    this.revealingText.warpToDone();
  }
}

  init(container) {
    this.createElement();
    container.appendChild(this.element)
    this.revealingText.init();
  }

}
