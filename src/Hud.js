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
  
      playerState.lineup.forEach(key => {
        const character = playerState.party[key];
        const scoreboard = new Combatant({
          id: key,
          ...Characters[character.characterId],
          ...character,
        }, null)
        scoreboard.createElement();
        this.scoreboards.push(scoreboard);
        this.element.appendChild(scoreboard.hudElement);
      })
      this.update();
    }
  
    init(container) {
      this.createElement();
      container.appendChild(this.element);
  
      document.addEventListener("PlayerStateUpdated", () => {
        this.update();
      })
  
      document.addEventListener("LineupChanged", () => {
        this.createElement();
        container.appendChild(this.element);
      })
  
    }
  
  
  
  }