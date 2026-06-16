import { utils } from "../utils.js";
import { playerState } from "../State/PlayerState.js";
import { Characters } from "../Content/characters.js";
import { Combatant } from "./Combatant.js";
import { Team } from "./Team.js";
import { TurnCycle } from "./TurnCycle.js";
import { BattleEvent } from "./BattleEvent.js";

export class Battle {
  constructor({ enemy, onComplete }) {

    this.enemy = enemy;
    this.onComplete = onComplete;

    // Combatants are added dynamically below from the player's party and the enemy's.
    this.combatants = {}

    this.activeCombatants = {
      player: null, //"player1",
      enemy: null, //"enemy1",
    }

    //Dynamically add the Player team
    playerState.lineup.forEach(id => {
      this.addCombatant(id, "player", playerState.party[id])
    });
    //Now the enemy team
    Object.keys(this.enemy.party).forEach(key => {
      this.addCombatant("e_"+key, "enemy", this.enemy.party[key])
    })


    //Start empty
    this.items = []

    //Add in player items
    playerState.items.forEach(item => {
      this.items.push({
        ...item,
        team: "player"
      })
    })

    this.usedInstanceIds = {};

  }

  addCombatant(id, team, config) {
      this.combatants[id] = new Combatant({
        ...Characters[config.characterId],
        ...config,
        team,
        isPlayerControlled: team === "player"
      }, this)

      //Populate first active character
      this.activeCombatants[team] = this.activeCombatants[team] || id
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("Battle");
    this.element.innerHTML = (`
    <div class="Battle_hero">
      <img src="${'images/characters/people/brett.png'}" alt="Brett" />
    </div>
    <div class="Battle_enemy">
      <img src=${this.enemy.src} alt=${this.enemy.name} />
    </div>
    `)
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);

    this.playerTeam = new Team("player", "Hero");
    this.enemyTeam = new Team("enemy", "Bully");

    Object.keys(this.combatants).forEach(key => {
      let combatant = this.combatants[key];
      combatant.id = key;
      combatant.init(this.element)
      
      //Add to correct team
      if (combatant.team === "player") {
        this.playerTeam.combatants.push(combatant);
      } else if (combatant.team === "enemy") {
        this.enemyTeam.combatants.push(combatant);
      }
    })

    this.playerTeam.init(this.element);
    this.enemyTeam.init(this.element);

    this.turnCycle = new TurnCycle({
      battle: this,
      onNewEvent: event => {
        return new Promise(resolve => {
          const battleEvent = new BattleEvent(event, this)
          battleEvent.init(resolve);
        })
      },
      onWinner: winner => {

        if (winner === "player") {
          Object.keys(playerState.party).forEach(id => {
            const playerStateCharacter = playerState.party[id];
            const combatant = this.combatants[id];
            if (combatant) {
              playerStateCharacter.hp = combatant.hp;
              playerStateCharacter.xp = combatant.xp;
              playerStateCharacter.maxXp = combatant.maxXp;
              playerStateCharacter.level = combatant.level;
            }
          })

          //Get rid of player used items
          playerState.items = playerState.items.filter(item => {
            return !this.usedInstanceIds[item.instanceId]
          })

          //Send signal to update
          utils.emitEvent("PlayerStateUpdated");
        }

        this.element.remove();
        this.onComplete();
      }
    })
    this.turnCycle.init();


  }

}