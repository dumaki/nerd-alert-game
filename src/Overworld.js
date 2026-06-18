import { OverworldMap, OverworldMaps } from "./OverworldMap.js";
import { Hud } from "./Hud.js";
import { DirectionInput } from "./DirectionInput.js";
import { KeyPressListener } from "./KeyPressListener.js";
import { FpsMeter } from "./FpsMeter.js";
import { ObjectiveHud } from "./ObjectiveHud.js";
import { playerState } from "./State/PlayerState.js";
import { Characters } from "./Content/characters.js";
import { utils } from "./utils.js";
import { SceneTransition } from "./SceneTransition.js";
import { loadSave, applySaveToPlayerState } from "./State/SaveSystem.js";

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
       //Dev FPS readout — counts every rendered frame.
       this.fpsMeter?.tick();

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
         if (object.isHidden) { return; }
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
 
  // Reskin the hero to whichever party member is currently active. Called after a
  // map mounts (each map's hero defaults to Brett's sheet) and whenever the player
  // swaps characters in the pause menu.
  applyActiveCharacterSprite() {
    const hero = this.map?.gameObjects?.hero;
    const config = Characters[playerState.activeCharacterId];
    if (hero && config?.overworldSrc) {
      hero.sprite.setImage(config.overworldSrc);
    }
  }

  startMap(mapConfig, mapId, { skipCutsceneOnLoad = false } = {}) {
   this.map = new OverworldMap(mapConfig);
   this.mapId = mapId;
   this.map.overworld = this;
   this.map.mountObjects();
   this.applyActiveCharacterSprite();

   // Fire a cutscene the instant the map mounts (no key press / footstep needed).
   // Started synchronously so isCutscenePlaying is true before NPC idle loops kick
   // in, which keeps control until the cutscene finishes (e.g. the elevator scene).
   // Skipped when restoring a save (we don't want to replay an onLoad scene).
   if (!skipCutsceneOnLoad && mapConfig.cutsceneOnLoad) {
     this.map.startCutscene(mapConfig.cutsceneOnLoad);
   }
  }

  // Drop the hero onto the tile/direction recorded in a save (coords are in grid
  // units). Re-sync the wall so the restored tile is occupied.
  placeHeroFromSave(save) {
    const hero = this.map.gameObjects.hero;
    this.map.removeWall(hero.x, hero.y);
    hero.x = utils.withGrid(save.heroX);
    hero.y = utils.withGrid(save.heroY);
    hero.direction = save.heroDirection || "down";
    this.map.addWall(hero.x, hero.y);
  }

  // Live-load a save while the game is already running (from the pause menu).
  // Fades out, restores state + map + hero, rebuilds the HUD, fades back in.
  loadGame(save) {
    const container = document.querySelector(".game-container");
    const transition = new SceneTransition();
    transition.init(container, () => {
      applySaveToPlayerState(save);
      this.startMap(OverworldMaps[save.mapId], save.mapId, { skipCutsceneOnLoad: true });
      this.placeHeroFromSave(save);
      this.hud.createElement();
      container.appendChild(this.hud.element);
      transition.fadeOut();
    });
  }

  // init() starts a fresh game with the episode intro. init(save) restores a
  // saved game (no intro, dropped straight back where you signed in).
  init(save) {

   const container = document.querySelector(".game-container");

   // Restore state before the HUD is built so it reflects the saved character.
   if (save) {
     applySaveToPlayerState(save);
   }

   this.hud = new Hud();
   this.hud.init(container);

   // Objective tracker (top-right). Driven by story flags, so it reflects the
   // restored state immediately when loading a save.
   this.objectiveHud = new ObjectiveHud();
   this.objectiveHud.init(container);

   if (save) {
     this.startMap(OverworldMaps[save.mapId], save.mapId, { skipCutsceneOnLoad: true });
     this.placeHeroFromSave(save);
   } else {
     this.startMap(OverworldMaps.BackLotHallway, "BackLotHallway");
   }

   this.bindActionInput();
   this.bindHeroPositionCheck();

   // Live-swap the hero sprite when the player picks a new character to play as.
   document.addEventListener("ActiveCharacterChanged", () => {
     this.applyActiveCharacterSprite();
   });

   // Pause-menu "Load" asks the overworld to restore the saved game.
   document.addEventListener("LoadGameRequested", () => {
     const latest = loadSave();
     if (latest) { this.loadGame(latest); }
   });

   this.directionInput = new DirectionInput();
   this.directionInput.init();

   // Dev FPS readout (toggle with the ` backtick key).
   this.fpsMeter = new FpsMeter();
   this.fpsMeter.init();
   new KeyPressListener("Backquote", () => this.fpsMeter.toggle());

   this.startGameLoop();

   // A restored game skips the episode intro.
   if (save) { return; }

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