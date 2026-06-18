import { playerState } from "./State/PlayerState.js";
import { Characters } from "./Content/characters.js";
import { Combatant } from "./Battle/Combatant.js";

export class Hud {
    constructor() {
      this.scoreboards = [];
    }
  
    update() {
      this.scoreboards.forEach(s => {
        s.update(playerState.party[s.id])
      })
    }
  
    createElement() {
  
      if (this.element) {
        this.element.remove();
        this.scoreboards = [];
      }
  
      this.element = document.createElement("div");
      this.element.classList.add("Hud");

      // Show the character you're currently steering in the overworld (the active
      // one), so the portrait/name/bars track who you swapped to in the pause menu.
      const activeKey = Object.keys(playerState.party).find(
        key => playerState.party[key].characterId === playerState.activeCharacterId
      ) || playerState.lineup[0];

      const character = playerState.party[activeKey];
      const scoreboard = new Combatant({
        id: activeKey,
        ...Characters[character.characterId],
        ...character,
      }, null)
      scoreboard.createElement();
      this.scoreboards.push(scoreboard);
      this.element.appendChild(scoreboard.hudElement);

      this.update();
    }

    init(container) {
      this.container = container;
      this.createElement();
      container.appendChild(this.element);

      document.addEventListener("PlayerStateUpdated", () => {
        this.update();
      })

      document.addEventListener("LineupChanged", () => {
        this.createElement();
        container.appendChild(this.element);
      })

      // Rebuild when the player swaps which character they're playing as.
      document.addEventListener("ActiveCharacterChanged", () => {
        this.createElement();
        container.appendChild(this.element);
      })

    }
  
  
  
  }