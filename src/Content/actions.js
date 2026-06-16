// TODO: theme — Move names, descriptions and flavor text are cooking-themed
// placeholders from the original tutorial (e.g. "Whomp!", "Parmesan"). Rewrite
// these as Nerd Alert attacks (the battles will be random NPCs at the IT help
// desk asking for help). Only the basic damage move and an HP-recover item remain
// — design the real move set when wiring up the battle system.
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