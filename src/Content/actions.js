// TODO: theme — Move names, descriptions and flavor text are cooking-themed
// placeholders from the original tutorial (e.g. "Tomato Squeeze", "Parmesan").
// Rewrite these as Nerd Alert attacks/argument moves. The mechanics (damage,
// status, recover) and the status keys "saucy"/"clumsy" are intentionally left
// intact so battles keep working until you redesign them.
export const Actions = {
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