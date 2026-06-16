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
    icon: "images/icons/spicy.png",
    actions: [ "saucyStatus", "clumsyStatus", "damage1" ],
  },
  "s002": {
    name: "Bacon Brigade",
    description: "A salty warrior who fears nothing",
    type: CharacterTypes.spicy,
    src: "images/characters/battlers/s002.png",
    icon: "images/icons/spicy.png",
    actions: [ "saucyStatus", "clumsyStatus", "damage1" ],
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
  }
}