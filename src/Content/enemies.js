export const Enemies = {
    "toshi": {
        name: "Toshi",
        src: "images/characters/people/Toshi.png",
        party: {
            "a": {
                characterId: "v001",
                maxHp: 50,
                level: 1,
            },
            "b": {
                characterId: "s002",
                maxHp: 50,
                level: 1,
            },
        }
    },
    "kenny": {
        name: "Kenny",
        src: "images/characters/people/kenny.png",
        party: {
            "a": {
                hp: 1,
                characterId: "f001",
                maxHp: 50,
                level: 1,
            },
        }
    },
    "postman": {
        name: "Postman",
        src: "images/characters/people/Postman.png",
        party: {
            "a": {
                hp: 1,
                characterId: "f001", // TODO: theme — was "f002", which doesn't exist in Characters (would crash the Postman battle). Set to Postman's real fighter.
                maxHp: 50,
                level: 1,
            },
        }
    },

}