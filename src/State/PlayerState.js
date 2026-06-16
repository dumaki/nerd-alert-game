import { utils } from "../utils.js";

class PlayerState {
    constructor() {
      // The player's roster. Starts as just Brett; others join via addToParty
      // (e.g. Kenny at the end of the elevator scene).
      this.party = {
        "p1": {
          characterId: "s001",
          hp: 50,
          maxHp: 50,
          xp: 90,
          maxXp: 100,
          level: 1,
          status: null,
        },
      }
      this.lineup = ["p1"];
      this.items = [
        { actionId: "item_recoverHp", instanceId: "item1" },
        { actionId: "item_recoverHp", instanceId: "item2" },
        { actionId: "item_recoverHp", instanceId: "item3" },
      ]
      this.storyFlags = {
        // "TALKED_TO_ERIO": true,
      };
    }
  
    swapLineup(oldId, incomingId) {
      const oldIndex = this.lineup.indexOf(oldId);
      this.lineup[oldIndex] = incomingId;
      utils.emitEvent("LineupChanged");
    }

    // Recruit a character into the party (not the active lineup — swap them in
    // via the pause menu). Keyed by characterId, so recruiting twice is a no-op.
    addToParty(characterId) {
      if (this.party[characterId]) { return; }
      this.party[characterId] = {
        characterId,
        hp: 50,
        maxHp: 50,
        xp: 0,
        maxXp: 100,
        level: 1,
        status: null,
      };
    }

  }
  export const playerState = new PlayerState();