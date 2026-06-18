import { KeyboardMenu } from "./KeyboardMenu.js";
import { loadSave } from "./State/SaveSystem.js";

const EPISODES = [
  "Episode 1: New Guy",
  "Episode 2: ???",
  "Episode 3: ???",
  "Episode 4: ???",
  "Episode 5: ???",
];

export class TitleScreen {
  // onStart(episodeNumber) boots the game at that episode.
  constructor({ onStart }) {
    this.onStart = onStart;
  }

  getPages() {
    const save = loadSave();
    const hasSave = !!save;
    const episodesUnlocked = (save && save.episodesUnlocked) || 1;

    return {
      root: [
        {
          label: "Start",
          description: "Begin Episode 1 from the start.",
          handler: () => this.startEpisode(1),
        },
        {
          label: "Continue",
          disabled: !hasSave, // enabled once a save exists
          description: hasSave ? "Resume your saved game." : "No save yet.",
          handler: () => this.startEpisode(episodesUnlocked, save),
        },
        {
          label: "Episodes",
          description: "Jump to an unlocked episode.",
          handler: () => this.keyboardMenu.setOptions(this.getPages().episodes),
        },
        {
          label: "Settings",
          disabled: true, // nothing to configure yet
          description: "Coming soon.",
          handler: () => {},
        },
        {
          label: "Quit",
          description: "Leave the game.",
          handler: () => this.quit(),
        },
      ],
      episodes: [
        ...EPISODES.map((title, i) => {
          const ep = i + 1;
          const unlocked = ep <= episodesUnlocked;
          return {
            label: title,
            disabled: !unlocked,
            description: unlocked ? "Play this episode." : "Finish the previous episode to unlock.",
            handler: () => this.startEpisode(ep),
          };
        }),
        {
          label: "Back",
          description: "Return to the menu.",
          handler: () => this.keyboardMenu.setOptions(this.getPages().root),
        },
      ],
    };
  }

  startEpisode(ep, save) {
    // Only Episode 1 has content for now; Start and Episodes -> Ep 1 both begin it.
    // When `save` is passed (the Continue option), the game restores from it.
    this.close();
    this.onStart(ep, save);
  }

  quit() {
    this.close();
    // A browser page can't stop the dev server, and window.close() only works for
    // tabs opened by script. So show a sign-off and try to close as a courtesy.
    const bye = document.createElement("div");
    bye.classList.add("TitleScreen");
    bye.innerHTML = (`<h1 class="TitleScreen_byeline">Thanks for playing!</h1>`);
    this.container.appendChild(bye);
    window.close();
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("TitleScreen");
    this.element.innerHTML = (`
      <h1 class="TitleScreen_title">Nerd Alert!</h1>
    `);
  }

  close() {
    this.keyboardMenu?.end();
    this.element.remove();
  }

  init(container) {
    this.container = container;
    this.createElement();
    container.appendChild(this.element);

    this.keyboardMenu = new KeyboardMenu();
    this.keyboardMenu.init(this.element);
    this.keyboardMenu.setOptions(this.getPages().root);
  }
}
