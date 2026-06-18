import { playerState } from "./State/PlayerState.js";
import { Characters } from "./Content/characters.js";
import { KeyboardMenu } from "./KeyboardMenu.js";
import { KeyPressListener } from "./KeyPressListener.js";
import { utils } from "./utils.js";
import { hasSave } from "./State/SaveSystem.js";

export class PauseMenu {
    constructor({onComplete}) {
      this.onComplete = onComplete;
    }
  
    getOptions() {
      // One "Play as" entry per party member who has an overworld sprite, so the
      // player can pick which of Brett / Kenny / Toshi they steer. The active one
      // is marked and selecting it just closes the menu.
      const playAsOptions = Object.values(playerState.party)
        .map(member => member.characterId)
        .filter(characterId => Characters[characterId]?.overworldSrc)
        .map(characterId => {
          const base = Characters[characterId];
          const isActive = playerState.activeCharacterId === characterId;
          return {
            label: base.name,
            description: isActive
              ? `Already playing as ${base.name}.`
              : `Play as ${base.name}.`,
            right: () => isActive ? "★" : "",
            handler: () => {
              playerState.setActiveCharacter(characterId);
              this.close();
            }
          };
        });

      return [
        ...playAsOptions,
        {
          label: "Load",
          disabled: !hasSave(),
          description: hasSave()
            ? "Reload your last save."
            : "No save yet — sign in with the guard to save.",
          handler: () => {
            this.close();
            utils.emitEvent("LoadGameRequested");
          }
        },
        {
          label: "Close",
          description: "Close the pause menu",
          handler: () => {
            this.close();
          }
        }
      ];
    }
  
    createElement() {
      this.element = document.createElement("div");
      this.element.classList.add("PauseMenu")
      this.element.innerHTML = (`
        <h2>Pause Menu</h2>
      `)
    }
  
    close() {
      this.esc?.unbind();
      this.keyboardMenu.end();
      this.element.remove();
      this.onComplete();
    }
  
    async init(container) {
      this.createElement();
      this.keyboardMenu = new KeyboardMenu({
        descriptionContainer: container
      })
      this.keyboardMenu.init(this.element);
      this.keyboardMenu.setOptions(this.getOptions());
  
      container.appendChild(this.element);
  
      utils.wait(200);
      this.esc = new KeyPressListener("Escape", () => {
        this.close();
      })
    }
  
  }