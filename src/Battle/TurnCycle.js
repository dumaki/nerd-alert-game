import { resolveTicketMove } from "./ticketBattle.js";

// Help-desk v1: a player-only loop. The customer never takes a turn of their own
// — they only counter the player's misses (handled inside resolveTicketMove).
export class TurnCycle {
  constructor({ battle, onNewEvent, onWinner }) {
    this.battle = battle;
    this.onNewEvent = onNewEvent;
    this.onWinner = onWinner;
  }

  async turn() {
    const player = this.battle.combatants[this.battle.activeCombatants.player];
    const customer = this.battle.combatants[this.battle.activeCombatants.enemy];

    // Player chooses an IT move.
    const submission = await this.onNewEvent({
      type: "submissionMenu",
      caster: player,
      enemy: customer,
    });

    // Resolve it against the ticket -> a list of textMessage / stateChange events.
    const events = resolveTicketMove({
      moveId: submission.action.id,
      battle: this.battle,
      player,
      customer,
    });
    for (const event of events) {
      await this.onNewEvent({ ...event, caster: player });
    }

    // Fixed (customer HP 0) -> win. Out of patience (player HP 0) -> lose.
    const winner = this.getWinningTeam();
    if (winner) {
      await this.onNewEvent({
        type: "textMessage",
        text: winner === "player" ? "Ticket resolved!" : "...you'll have to escalate this one.",
      });
      this.onWinner(winner);
      return;
    }

    // Straight back to the player — no enemy turn.
    this.turn();
  }

  getWinningTeam() {
    const alive = {};
    Object.values(this.battle.combatants).forEach(c => {
      if (c.hp > 0) { alive[c.team] = true; }
    });
    if (!alive["player"]) { return "enemy"; }
    if (!alive["enemy"]) { return "player"; }
    return null;
  }

  async init() {
    const customer = this.battle.combatants[this.battle.activeCombatants.enemy];
    await this.onNewEvent({
      type: "textMessage",
      text: `${customer.name}: ${this.battle.ticket.complaint}`,
    });
    this.turn();
  }
}
