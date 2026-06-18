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
      // The character you currently steer in the overworld (a characterId, not a
      // party-slot key). Starts as Brett. Changed via the pause menu's "Play as"
      // options; the Overworld listens for ActiveCharacterChanged to reskin the hero.
      this.activeCharacterId = "s001";
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

    // Choose which party member you steer in the overworld. Emits an event the
    // Overworld listens for to swap the hero's sprite immediately.
    setActiveCharacter(characterId) {
      if (this.activeCharacterId === characterId) { return; }
      this.activeCharacterId = characterId;
      utils.emitEvent("ActiveCharacterChanged", { characterId });
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