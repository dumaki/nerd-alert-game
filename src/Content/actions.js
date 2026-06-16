// Battle actions. The help-desk v1 moves below are menu metadata only (name +
// description) — their outcomes are computed dynamically in Battle/ticketBattle.js
// based on the ticket. damage1 / item_recoverHp are legacy tutorial moves kept for
// the (currently passive) enemy data and the future items system.
export const Actions = {
  smack: {
    name: "Smack it",
    description: "Percussive maintenance. Might fix anything.",
  },
  checkCords: {
    name: "Check the cords",
    description: "Good for monitors, laptops and printers.",
  },
  replaceBatteries: {
    name: "Replace batteries",
    description: "For wireless mice and keyboards.",
  },
  ask: {
    name: "Ask",
    description: "\"Have you tried turning it off and on again?\"",
  },

  damage1: {
    name: "Whomp!",
    description: "Pillowy punch of dough",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}!"},
      { type: "animation", animation: "spin"},
      { type: "stateChange", damage: 10}
    ]
  },
  //Items
  item_recoverHp: {
    name: "Parmesan",
    targetType: "friendly",
    success: [
      { type:"textMessage", text: "{CASTER} sprinkles on some {ACTION}!", },
      { type:"stateChange", recover: 10, },
      { type:"textMessage", text: "{CASTER} recovers HP!", },
    ]
  },
}