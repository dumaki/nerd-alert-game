// TODO: theme — These are placeholders inherited from the original tutorial.
// The character roster, names, descriptions, battler art (images/characters/battlers/)
// and the "type" taxonomy below are all cooking-themed leftovers. Replace with the
// real Nerd Alert cast and decide what (if anything) "types" should represent.
// NOTE: the type *values* (spicy/veggie/...) are load-bearing keys referenced by
// battle logic and icons — rename them deliberately across the codebase, not piecemeal.
export const CharacterTypes = {
  normal: "normal",
  spicy: "spicy",
  veggie: "veggie",
  fungi: "fungi",
  chill: "chill",
}

export const Characters = {
  "s001": {
    name: "Brett",
    description: "Character desc here",
    type: CharacterTypes.spicy,
    src: "images/characters/people/brett001.png",
    // overworldSrc is the walk-around sprite sheet (distinct from `src`, the
    // small battle portrait). Characters with one can be steered in the
    // overworld via the pause menu's "Play as" options.
    overworldSrc: "images/characters/people/brett.png",
    icon: "images/icons/spicy.png",
    actions: [ "smack", "checkCords", "replaceBatteries", "ask" ],
  },
  "s002": {
    name: "Bacon Brigade",
    description: "A salty warrior who fears nothing",
    type: CharacterTypes.spicy,
    src: "images/characters/battlers/s002.png",
    icon: "images/icons/spicy.png",
    actions: [ "damage1" ],
  },
  "v001": {
    name: "Call Me Kale",
    description: "Character desc here",
    type: CharacterTypes.veggie,
    src: "images/characters/battlers/v001.png",
    icon: "images/icons/veggie.png",
    actions: [ "damage1" ],
  },
  "f001": {
    name: "Portobello Express",
    description: "Character desc here",
    type: CharacterTypes.fungi,
    src: "images/characters/battlers/f001.png",
    icon: "images/icons/fungi.png",
    actions: [ "damage1" ],
  },
  "kenny": {
    name: "Kenny",
    description: "Your coworker on the IT help desk.",
    type: CharacterTypes.chill,
    src: "images/characters/people/kenny001.png",
    overworldSrc: "images/characters/people/kenny.png",
    icon: "images/icons/chill.png",
    actions: [ "damage1" ],
  },
  // MOCK help-desk "customer" you battle. TODO: src reuses Brett's battle portrait
  // as a placeholder — make a small (~27x21) portrait for the real customer art.
  "customer": {
    name: "Frazzled Coworker",
    description: "A coworker who needs IT help.",
    type: CharacterTypes.chill,
    src: "images/characters/people/brett001.png",
    icon: "images/icons/chill.png",
    actions: [ "damage1" ],
  },
  // Recruitable party member (joins at the end of Act I).
  "toshi": {
    name: "Toshi",
    description: "The new guy - a tech genius from far away.",
    type: CharacterTypes.chill,
    src: "images/characters/people/toshi001.png",
    overworldSrc: "images/characters/people/Toshi.png",
    icon: "images/icons/chill.png",
    actions: [ "smack", "checkCords", "replaceBatteries", "ask" ],
  },

  // Dialogue-only NPCs. They aren't party members or battlers — these entries
  // exist so the chat box can show their portrait when they speak (matched by
  // name from a "NAME:" prefix, or via an explicit `speaker` on the textMessage).
  // No overworldSrc, so they never appear in the pause menu's "Play as" list.
  "bridget": {
    name: "Bridget",
    description: "Your manager.",
    type: CharacterTypes.chill,
    src: "images/characters/people/bridget001.png",
    icon: "images/icons/chill.png",
    actions: [ "damage1" ],
  },
  "postman": {
    name: "Postman",
    description: "Always busy delivering the mail.",
    type: CharacterTypes.chill,
    src: "images/characters/people/postman001.png",
    icon: "images/icons/chill.png",
    actions: [ "damage1" ],
  },
  "securityGuard": {
    name: "Security Guard",
    description: "Watches the lobby. Make sure you sign in.",
    type: CharacterTypes.chill,
    src: "images/characters/people/securityguard001.png",
    icon: "images/icons/chill.png",
    actions: [ "damage1" ],
  }
}