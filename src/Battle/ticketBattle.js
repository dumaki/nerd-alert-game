import { utils } from "../utils.js";

// =============================================================================
// Help-desk battle v1 — a coworker files a "ticket" (a problem) and you try to
// fix it. Fixing wins instantly; the customer counters your misses and drains
// Brett's patience (his HP). Losing all patience loses the battle.
//
// All the knobs live here so the feel is easy to tune.
// =============================================================================

export const PATIENCE_MAX = 50;          // Brett's starting patience (his HP bar)
export const PROBLEM_MAX = 100;          // customer's "problem" HP (a fix zeroes it -> win)
export const COUNTER_BASE_CHANCE = 0.30; // chance the customer counters after a miss
export const COUNTER_DAMAGE = 12;        // patience lost per counter
export const ASK_CALM_REDUCTION = 0.15;  // counter-chance drop per effective "Ask"
export const ASK_MAX_EFFECTIVE = 2;      // how many Asks still calm before it stops working

// Odds a fix lands when the move is the right tool for the ticket.
const FIX_CHANCE = {
  smack: 0.5,             // universal gamble — works on anything
  checkCords: 0.7,
  replaceBatteries: 0.8,
  passwordRemember: 0.5,  // "Ask" on a forgotten password
};

// Which tickets each move can actually fix. (Smack works on everything, so it's
// not listed here. Anything not effective is a guaranteed miss.)
const EFFECTIVE = {
  checkCords: ["monitor", "laptop", "printer"],
  replaceBatteries: ["mouse"],
};

// The customer's frustrated line when a move misses, themed per move.
const MISS_LINE = {
  smack: "It's still not working!",
  checkCords: "I don't think that's the issue...",
  replaceBatteries: "Are you sure you know what you're doing?",
};

export const TICKETS = [
  { id: "monitor",  complaint: "My monitor won't turn on!" },
  { id: "webcam",   complaint: "My webcam isn't working!" },
  { id: "laptop",   complaint: "My laptop won't charge!" },
  { id: "mouse",    complaint: "My mouse stopped working!" },
  { id: "printer",  complaint: "The printer is jammed!" },
  { id: "password", complaint: "I forgot my password!" },
];

export function pickTicket() {
  return utils.randomFromArray(TICKETS);
}

const roll = (chance) => Math.random() < chance;

// A successful fix: say so, then zero the customer's "problem" HP (-> player wins).
function fixEvents(text, customer) {
  return [
    { type: "textMessage", text },
    { type: "stateChange", damage: customer.maxHp, target: customer },
  ];
}

// A miss: the themed frustration line, then maybe a counter that costs patience.
function missEvents(line, battle, player) {
  const events = [{ type: "textMessage", text: line }];
  if (roll(battle.counterChance)) {
    events.push({ type: "stateChange", damage: COUNTER_DAMAGE, target: player });
  }
  return events;
}

// Resolve a chosen move into a list of battle events. May mutate per-battle state
// (battle.counterChance / battle.askUses). Reuses the existing textMessage and
// stateChange BattleEvent handlers — no new event types needed.
export function resolveTicketMove({ moveId, battle, player, customer }) {
  const ticket = battle.ticket.id;

  if (moveId === "smack") {
    return roll(FIX_CHANCE.smack)
      ? fixEvents("WHACK! ...huh, it's working now.", customer)
      : missEvents(MISS_LINE.smack, battle, player);
  }

  if (moveId === "checkCords" || moveId === "replaceBatteries") {
    if (!EFFECTIVE[moveId].includes(ticket)) {
      return missEvents(MISS_LINE[moveId], battle, player); // wrong tool -> guaranteed miss
    }
    return roll(FIX_CHANCE[moveId])
      ? fixEvents("That did it!", customer)
      : missEvents(MISS_LINE.smack, battle, player); // right tool, fix didn't take
  }

  if (moveId === "ask") {
    // Forgotten password: Ask IS the fix attempt (a chance to jog their memory).
    if (ticket === "password") {
      if (roll(FIX_CHANCE.passwordRemember)) {
        return [
          { type: "textMessage", text: 'BRETT: "Think back — what was your last one?"' },
          { type: "textMessage", text: "I think I remember it now!" },
          { type: "stateChange", damage: customer.maxHp, target: customer },
        ];
      }
      return [{ type: "textMessage", text: "Hmm... still drawing a blank." }];
    }
    // Otherwise: calm the customer (lower their counter chance), only twice.
    const events = [{ type: "textMessage", text: 'BRETT: "Have you tried turning it off and on again?"' }];
    if (battle.askUses < ASK_MAX_EFFECTIVE) {
      battle.askUses += 1;
      battle.counterChance = Math.max(0, battle.counterChance - ASK_CALM_REDUCTION);
      events.push({ type: "textMessage", text: "...okay, that's a little better." });
    } else {
      events.push({ type: "textMessage", text: "That's not helping anymore." });
    }
    return events;
  }

  return [{ type: "textMessage", text: "..." }];
}
