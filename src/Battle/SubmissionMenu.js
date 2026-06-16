import { Actions } from "../Content/actions.js";
import { KeyboardMenu } from "../KeyboardMenu.js";

// v1 menu: just the player's IT moves (no items / swap). Each option submits the
// move id; the ticket logic in ticketBattle.js decides the outcome.
export class SubmissionMenu {
  constructor({ caster, enemy, onComplete }) {
    this.caster = caster;
    this.enemy = enemy;
    this.onComplete = onComplete;
  }

  getPages() {
    return {
      root: this.caster.actions.map(id => {
        const action = Actions[id];
        return {
          label: action.name,
          description: action.description,
          handler: () => this.menuSubmit({ id, ...action }),
        };
      }),
    };
  }

  menuSubmit(action) {
    this.keyboardMenu?.end();
    this.onComplete({ action });
  }

  decide() {
    // The customer never submits in v1, but keep a safe fallback.
    const id = this.caster.actions[0];
    this.menuSubmit({ id, ...Actions[id] });
  }

  showMenu(container) {
    this.keyboardMenu = new KeyboardMenu();
    this.keyboardMenu.init(container);
    this.keyboardMenu.setOptions(this.getPages().root);
  }

  init(container) {
    if (this.caster.isPlayerControlled) {
      this.showMenu(container);
    } else {
      this.decide();
    }
  }
}
