import { OverworldMap, OverworldMaps } from "./OverworldMap.js";
import { Hud } from "./Hud.js";
import { DirectionInput } from "./DirectionInput.js";
import { KeyPressListener } from "./KeyPressListener.js";

export class Overworld {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector(".game-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.map = null;
  }
 
   startGameLoop() {
     //Never run two loops at once (a fast pause/unpause could otherwise stack them).
     if (this.gameLoopRunning) { return; }
     this.gameLoopRunning = true;
     const step = () => {
       //Clear off the canvas
       this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
 
       //Establish the camera focus. Defaults to the hero, but a cutscene can
       //point it at another object (cameraFollow) or pan it freely (cameraPan).
       const cameraPerson = this.map.cameraPerson || this.map.gameObjects.hero;
 
       //Update all objects
       Object.values(this.map.gameObjects).forEach(object => {
         object.update({
           arrow: this.directionInput.direction,
           map: this.map,
         })
       })
       
 
       //Draw Lower layer
       this.map.drawLowerImage(this.ctx, cameraPerson);
 
       //Draw Game Objects
       Object.values(this.map.gameObjects).sort((a,b) => {
         return a.y - b.y;
       }).forEach(object => {
         object.sprite.draw(this.ctx, cameraPerson);
       })
 
       //Draw Upper layer
       this.map.drawUpperImage(this.ctx, cameraPerson);
       
       if (!this.map.isPaused) {
         requestAnimationFrame(() => {
           step();
         })
       } else {
         //Paused: stop the loop and allow a fresh one to start on unpause.
         this.gameLoopRunning = false;
       }
     }
     step();
  }
 
  bindActionInput() {
    new KeyPressListener("Enter", () => {
      //Is there a person here to talk to?
      this.map.checkForActionCutscene()
    })
    new KeyPressListener("Escape", () => {
      if (!this.map.isCutscenePlaying) {
       this.map.startCutscene([
         { type: "pause" }
       ])
      }
    })
  }
 
  bindHeroPositionCheck() {
    document.addEventListener("PersonWalkingComplete", e => {
      if (e.detail.whoId === "hero") {
        //Hero's position has changed
        this.map.checkForFootstepCutscene()
      }
    })
  }
 
  startMap(mapConfig) {
   this.map = new OverworldMap(mapConfig);
   this.map.overworld = this;
   this.map.mountObjects();

   // Fire a cutscene the instant the map mounts (no key press / footstep needed).
   // Started synchronously so isCutscenePlaying is true before NPC idle loops kick
   // in, which keeps control until the cutscene finishes (e.g. the elevator scene).
   if (mapConfig.cutsceneOnLoad) {
     this.map.startCutscene(mapConfig.cutsceneOnLoad);
   }
  }
 
  init() {
 
   this.hud = new Hud();
   this.hud.init(document.querySelector(".game-container"));
 
   this.startMap(OverworldMaps.BackLotHallway);
 
 
   this.bindActionInput();
   this.bindHeroPositionCheck();
 
   this.directionInput = new DirectionInput();
   this.directionInput.init();
 
   this.startGameLoop();

   // Episode-style intro: cinematic bars + the episode title card. The bars stay
   // up through the card, then slide away as soon as the player takes their first
   // step. (Player can skip the card with Enter.)
   this.map.startCutscene([
     { type: "letterbox", on: true },
     { type: "titleCard", title: "Nerd Alert!", subtitle: "Episode 1: New Guy" },
   ])

   const liftIntroLetterbox = e => {
     if (e.detail.whoId === "hero") {
       document.removeEventListener("PersonWalkingComplete", liftIntroLetterbox);
       this.letterbox?.hide(() => {});
     }
   };
   document.addEventListener("PersonWalkingComplete", liftIntroLetterbox);
  }
 }