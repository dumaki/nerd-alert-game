class OverworldMap {
  constructor(config) {
    this.gameObjects = config.gameObjects;
    this.walls = config.walls || {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;
  }

  drawLowerImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.lowerImage,
      utils.withGrid(10.5) - cameraPerson.x,
      utils.withGrid(6) - cameraPerson.y
      )
  }

  drawUpperImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.upperImage,
      utils.withGrid(10.5) - cameraPerson.x,
      utils.withGrid(6) - cameraPerson.y
    )
  }

  isSpaceTaken(currentX, currentY, direction) {
    const {x,y} = utils.nextPosition(currentX, currentY, direction);
    return this.walls[`${x},${y}`] || false;
  }

  mountObjects() {
    Object.values(this.gameObjects).forEach(o => {

      //TODO: determine if this object should actually mount
      o.mount(this);

    })
  }

  addWall(x,y) {
    this.walls[`${x},${y}`] = true;
  }
  removeWall(x,y) {
    delete this.walls[`${x},${y}`]
  }
  moveWall(wasX, wasY, direction) {
    this.removeWall(wasX, wasY);
    const {x,y} = utils.nextPosition(wasX, wasY, direction);
    this.addWall(x,y);
  }

}

window.OverworldMaps = {
  OpeningHallway: {
    lowerSrc: "images/maps/OpeningHallwayLower.png",
    upperSrc: "images/maps/OpeningHallwayUpper.png",
    gameObjects: {
//Player Controlled Character
      player: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(3),
        y: utils.withGrid(3),
      }),
//Additional Characters
      bridget: new Person({
        x: utils.withGrid(7),
        y: utils.withGrid(9),
        src: "images/characters/people/bridget.png"
      })
    },
    walls: {
//Left-Side of Map
      [utils.asGridCoord(-1,4)] : true,
      [utils.asGridCoord(-1,5)] : true,
      [utils.asGridCoord(-1,6)] : true,
      [utils.asGridCoord(-1,7)] : true,
      [utils.asGridCoord(-1,8)] : true,
      [utils.asGridCoord(-1,9)] : true,
      [utils.asGridCoord(-1,10)] : true,
      [utils.asGridCoord(-1,11)] : true,
      [utils.asGridCoord(-1,12)] : true,
      [utils.asGridCoord(-1,13)] : true,
      [utils.asGridCoord(-1,14)] : true,
// //Top of Map
      [utils.asGridCoord(0,3)] : true,
      [utils.asGridCoord(1,3)] : true,
      [utils.asGridCoord(2,3)] : true,
      [utils.asGridCoord(3,2)] : true,
      [utils.asGridCoord(4,2)] : true,
      [utils.asGridCoord(5,3)] : true,
      [utils.asGridCoord(6,3)] : true,
      [utils.asGridCoord(7,3)] : true,
// //Right-Side of Map
      [utils.asGridCoord(8,4)] : true,
      [utils.asGridCoord(8,5)] : true,
      [utils.asGridCoord(8,6)] : true,
      [utils.asGridCoord(8,7)] : true,
      [utils.asGridCoord(8,8)] : true,
      [utils.asGridCoord(8,9)] : true,
      [utils.asGridCoord(8,10)] : true,
      [utils.asGridCoord(8,11)] : true,
      [utils.asGridCoord(8,12)] : true,
      [utils.asGridCoord(8,13)] : true,
      [utils.asGridCoord(8,14)] : true,
// //Bottom of Map
      [utils.asGridCoord(0,14)] : true,
      [utils.asGridCoord(1,14)] : true,
      [utils.asGridCoord(1,14)] : true,
      [utils.asGridCoord(1,15)] : true,
      [utils.asGridCoord(6,14)] : true,
      [utils.asGridCoord(7,14)] : true,
      [utils.asGridCoord(6,14)] : true,
      [utils.asGridCoord(6,15)] : true,
    }
  },
  HallwayCredits: {
    lowerSrc: "images/maps/HallwayCreditsLower.png",
    upperSrc: "images/maps/HallwayCreditsUpper.png",
    gameObjects: {
      player: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(7),
        y: utils.withGrid(7),
      }),
    },
    walls: {
      //Left-Side of Map
            [utils.asGridCoord(5,7)]   : true,
            [utils.asGridCoord(5,8)]   : true,
            [utils.asGridCoord(5,9)]   : true,
            [utils.asGridCoord(5,10)]  : true,
      //Top of Map
            [utils.asGridCoord(10,9)] : true,
            [utils.asGridCoord(11,9)] : true,
            [utils.asGridCoord(12,9)] : true,
            [utils.asGridCoord(13,9)] : true,
            [utils.asGridCoord(14,9)] : true,
            [utils.asGridCoord(15,9)] : true,
            [utils.asGridCoord(16,9)] : true,
            [utils.asGridCoord(17,9)] : true,
            [utils.asGridCoord(18,9)] : true,
            [utils.asGridCoord(19,9)] : true,
            [utils.asGridCoord(20,9)] : true,
            [utils.asGridCoord(21,9)] : true,
            [utils.asGridCoord(22,9)] : true,
            [utils.asGridCoord(23,9)] : true,
            [utils.asGridCoord(24,9)] : true,
            [utils.asGridCoord(25,9)] : true,
            [utils.asGridCoord(26,9)] : true,
            [utils.asGridCoord(27,9)] : true,
            [utils.asGridCoord(28,9)] : true,
            [utils.asGridCoord(29,9)] : true,
            [utils.asGridCoord(30,9)] : true,
            [utils.asGridCoord(31,9)] : true,
            [utils.asGridCoord(32,9)] : true,
            [utils.asGridCoord(33,9)] : true,
            [utils.asGridCoord(34,9)] : true,
            [utils.asGridCoord(35,9)] : true,
            [utils.asGridCoord(36,9)] : true,
            [utils.asGridCoord(37,9)] : true,
            [utils.asGridCoord(38,9)] : true,
            [utils.asGridCoord(39,9)] : true,
            [utils.asGridCoord(40,9)] : true,
            [utils.asGridCoord(41,9)] : true,
            [utils.asGridCoord(42,9)] : true,
            [utils.asGridCoord(43,9)] : true,
            [utils.asGridCoord(44,9)] : true,
            [utils.asGridCoord(45,9)] : true,
            [utils.asGridCoord(46,9)] : true,
            [utils.asGridCoord(47,9)] : true,
            [utils.asGridCoord(48,9)] : true,
            [utils.asGridCoord(49,9)] : true,
            [utils.asGridCoord(50,9)] : true,
            [utils.asGridCoord(51,9)] : true,
            [utils.asGridCoord(52,9)] : true,
            [utils.asGridCoord(53,9)] : true,
            [utils.asGridCoord(54,9)] : true,
            [utils.asGridCoord(55,9)] : true,
            [utils.asGridCoord(56,9)] : true,
            [utils.asGridCoord(57,9)] : true,
            [utils.asGridCoord(58,9)] : true,
            [utils.asGridCoord(59,9)] : true,
            [utils.asGridCoord(60,9)] : true,
            [utils.asGridCoord(61,9)] : true,
            [utils.asGridCoord(62,9)] : true,
            [utils.asGridCoord(63,9)] : true,
            [utils.asGridCoord(64,9)] : true,
            [utils.asGridCoord(65,9)] : true,
            [utils.asGridCoord(66,9)] : true,
            [utils.asGridCoord(67,9)] : true,
            [utils.asGridCoord(68,9)] : true,
            [utils.asGridCoord(69,9)] : true,
            [utils.asGridCoord(70,9)] : true,
            [utils.asGridCoord(71,9)] : true,
            [utils.asGridCoord(72,9)] : true,
            [utils.asGridCoord(73,9)] : true,
            [utils.asGridCoord(74,9)] : true,
            [utils.asGridCoord(75,9)] : true,
            [utils.asGridCoord(76,9)] : true,
            [utils.asGridCoord(77,9)] : true,
            [utils.asGridCoord(78,9)] : true,
            [utils.asGridCoord(79,9)] : true,
            [utils.asGridCoord(80,9)] : true,
            [utils.asGridCoord(81,9)] : true,
            [utils.asGridCoord(82,9)] : true,
            [utils.asGridCoord(83,9)] : true,
            [utils.asGridCoord(84,9)] : true,
            [utils.asGridCoord(85,9)] : true,
            [utils.asGridCoord(86,9)] : true,
            [utils.asGridCoord(87,9)] : true,
            [utils.asGridCoord(88,9)] : true,
            [utils.asGridCoord(89,9)] : true,
            [utils.asGridCoord(90,9)] : true,
            [utils.asGridCoord(91,9)] : true,
            [utils.asGridCoord(92,9)] : true,
            [utils.asGridCoord(93,9)] : true,
            [utils.asGridCoord(94,9)] : true,
            [utils.asGridCoord(95,9)] : true,
            [utils.asGridCoord(96,9)] : true,
            [utils.asGridCoord(97,9)] : true,
            [utils.asGridCoord(98,9)] : true,
            [utils.asGridCoord(99,9)] : true,
            [utils.asGridCoord(100,9)]: true,
            [utils.asGridCoord(101,9)]: true,
            [utils.asGridCoord(102,9)]: true,
            [utils.asGridCoord(103,9)]: true,
            [utils.asGridCoord(104,9)]: true,
            [utils.asGridCoord(105,9)]: true,
            [utils.asGridCoord(106,9)]: true,
            [utils.asGridCoord(107,9)]: true,
            [utils.asGridCoord(108,9)]: true,
            [utils.asGridCoord(109,9)]: true,
            [utils.asGridCoord(110,9)]: true,
            [utils.asGridCoord(111,9)]: true,
      //Right-Side of Map
            [utils.asGridCoord(10,0)]  : true,
            [utils.asGridCoord(10,1)]  : true,
            [utils.asGridCoord(10,2)]  : true,
            [utils.asGridCoord(10,3)]  : true,
            [utils.asGridCoord(10,4)]  : true,
            [utils.asGridCoord(10,5)]  : true,
            [utils.asGridCoord(10,6)]  : true,
            [utils.asGridCoord(10,7)]  : true,
            [utils.asGridCoord(10,8)]  : true,
            [utils.asGridCoord(10,9)]  : true,
      //Bottom of Map
            [utils.asGridCoord(6,11)]  : true,
            [utils.asGridCoord(7,11)]  : true,
            [utils.asGridCoord(8,11)]  : true,
            [utils.asGridCoord(9,11)]  : true,
            [utils.asGridCoord(10,11)] : true,
            [utils.asGridCoord(11,11)] : true,
            [utils.asGridCoord(12,11)] : true,
            [utils.asGridCoord(13,11)] : true,
            [utils.asGridCoord(14,11)] : true,
            [utils.asGridCoord(15,11)] : true,
            [utils.asGridCoord(16,11)] : true,
            [utils.asGridCoord(17,11)] : true,
            [utils.asGridCoord(18,11)] : true,
            [utils.asGridCoord(19,11)] : true,
            [utils.asGridCoord(20,11)] : true,
            [utils.asGridCoord(21,11)] : true,
            [utils.asGridCoord(22,11)] : true,
            [utils.asGridCoord(23,11)] : true,
            [utils.asGridCoord(24,11)] : true,
            [utils.asGridCoord(25,11)] : true,
            [utils.asGridCoord(26,11)] : true,
            [utils.asGridCoord(27,11)] : true,
            [utils.asGridCoord(28,11)] : true,
            [utils.asGridCoord(29,11)] : true,
            [utils.asGridCoord(30,11)] : true,
            [utils.asGridCoord(31,11)] : true,
            [utils.asGridCoord(32,11)] : true,
            [utils.asGridCoord(33,11)] : true,
            [utils.asGridCoord(34,11)] : true,
            [utils.asGridCoord(35,11)] : true,
            [utils.asGridCoord(36,11)] : true,
            [utils.asGridCoord(37,11)] : true,
            [utils.asGridCoord(38,11)] : true,
            [utils.asGridCoord(39,11)] : true,
            [utils.asGridCoord(40,11)] : true,
            [utils.asGridCoord(41,11)] : true,
            [utils.asGridCoord(42,11)] : true,
            [utils.asGridCoord(43,11)] : true,
            [utils.asGridCoord(44,11)] : true,
            [utils.asGridCoord(45,11)] : true,
            [utils.asGridCoord(46,11)] : true,
            [utils.asGridCoord(47,11)] : true,
            [utils.asGridCoord(48,11)] : true,
            [utils.asGridCoord(49,11)] : true,
            [utils.asGridCoord(50,11)] : true,
            [utils.asGridCoord(51,11)] : true,
            [utils.asGridCoord(52,11)] : true,
            [utils.asGridCoord(53,11)] : true,
            [utils.asGridCoord(54,11)] : true,
            [utils.asGridCoord(55,11)] : true,
            [utils.asGridCoord(56,11)] : true,
            [utils.asGridCoord(57,11)] : true,
            [utils.asGridCoord(58,11)] : true,
            [utils.asGridCoord(59,11)] : true,
            [utils.asGridCoord(60,11)] : true,
            [utils.asGridCoord(61,11)] : true,
            [utils.asGridCoord(62,11)] : true,
            [utils.asGridCoord(63,11)] : true,
            [utils.asGridCoord(64,11)] : true,
            [utils.asGridCoord(65,11)] : true,
            [utils.asGridCoord(66,11)] : true,
            [utils.asGridCoord(67,11)] : true,
            [utils.asGridCoord(68,11)] : true,
            [utils.asGridCoord(69,11)] : true,
            [utils.asGridCoord(70,11)] : true,
            [utils.asGridCoord(71,11)] : true,
            [utils.asGridCoord(72,11)] : true,
            [utils.asGridCoord(73,11)] : true,
            [utils.asGridCoord(74,11)] : true,
            [utils.asGridCoord(75,11)] : true,
            [utils.asGridCoord(76,11)] : true,
            [utils.asGridCoord(77,11)] : true,
            [utils.asGridCoord(78,11)] : true,
            [utils.asGridCoord(79,11)] : true,
            [utils.asGridCoord(80,11)] : true,
            [utils.asGridCoord(81,11)] : true,
            [utils.asGridCoord(82,11)] : true,
            [utils.asGridCoord(83,11)] : true,
            [utils.asGridCoord(84,11)] : true,
            [utils.asGridCoord(85,11)] : true,
            [utils.asGridCoord(86,11)] : true,
            [utils.asGridCoord(87,11)] : true,
            [utils.asGridCoord(88,11)] : true,
            [utils.asGridCoord(89,11)] : true,
            [utils.asGridCoord(90,11)] : true,
            [utils.asGridCoord(91,11)] : true,
            [utils.asGridCoord(92,11)] : true,
            [utils.asGridCoord(93,11)] : true,
            [utils.asGridCoord(94,11)] : true,
            [utils.asGridCoord(95,11)] : true,
            [utils.asGridCoord(96,11)] : true,
            [utils.asGridCoord(97,11)] : true,
            [utils.asGridCoord(98,11)] : true,
            [utils.asGridCoord(99,11)] : true,
            [utils.asGridCoord(100,11)]: true,
            [utils.asGridCoord(101,11)]: true,
            [utils.asGridCoord(102,11)]: true,
            [utils.asGridCoord(103,11)]: true,
            [utils.asGridCoord(104,11)]: true,
            [utils.asGridCoord(105,11)]: true,
            [utils.asGridCoord(106,11)]: true,
            [utils.asGridCoord(107,11)]: true,
            [utils.asGridCoord(108,11)]: true,
            [utils.asGridCoord(109,11)]: true,
            [utils.asGridCoord(110,11)]: true,
            [utils.asGridCoord(111,11)]: true,
    }
  },
}
