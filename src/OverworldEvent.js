import { utils } from "./utils.js";
import { TextMessage } from "./TextMessage.js";
import { SceneTransition } from "./SceneTransition.js";
import { PauseMenu } from "./PauseMenu.js";
import { OverworldMaps } from "./OverworldMap.js";
import { playerState } from "./State/PlayerState.js";
import { Enemies } from "./Content/enemies.js";
import { Battle } from "./Battle/Battle.js";
import { TitleCard } from "./TitleCard.js";
import { Letterbox } from "./Letterbox.js";
import { writeSave } from "./State/SaveSystem.js";
import { Characters } from "./Content/characters.js";

export class OverworldEvent {
  constructor({ map, event}) {
    this.map = map;
    this.event = event;
  }

  stand(resolve) {
    const who = this.map.gameObjects[ this.event.who ];
    who.startBehavior({
      map: this.map
    }, {
      type: "stand",
      direction: this.event.direction,
      time: this.event.time
    })
    
    //Set up a handler to complete when correct person is done walking, then resolve the event
    const completeHandler = e => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener("PersonStandComplete", completeHandler);
        resolve();
      }
    }
    document.addEventListener("PersonStandComplete", completeHandler)
  }

  walk(resolve) {
    const who = this.map.gameObjects[ this.event.who ];
    who.startBehavior({
      map: this.map
    }, {
      type: "walk",
      direction: this.event.direction,
      retry: true
    })

    //Set up a handler to complete when correct person is done walking, then resolve the event
    const completeHandler = e => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener("PersonWalkingComplete", completeHandler);
        resolve();
      }
    }
    document.addEventListener("PersonWalkingComplete", completeHandler)

  }

  textMessage(resolve) {

    if (this.event.faceHero) {
      const obj = this.map.gameObjects[this.event.faceHero];
      obj.direction = utils.oppositeDirection(this.map.gameObjects["hero"].direction);
    }

    const message = new TextMessage({
      text: this.event.text,
      speaker: this.event.speaker,
      onComplete: () => resolve()
    })
    message.init( document.querySelector(".game-container") )
  }

  titleCard(resolve) {
    const card = new TitleCard({
      title: this.event.title,
      subtitle: this.event.subtitle,
      duration: this.event.duration,
      onComplete: () => resolve()
    })
    card.init( document.querySelector(".game-container") )
  }

  letterbox(resolve) {
    const overworld = this.map.overworld;
    if (!overworld.letterbox) {
      overworld.letterbox = new Letterbox();
      overworld.letterbox.init(document.querySelector(".game-container"));
    }
    if (this.event.on === false) {
      overworld.letterbox.hide(resolve);
    } else {
      overworld.letterbox.show(resolve);
    }
  }

  addToParty(resolve) {
    playerState.addToParty(this.event.characterId);
    resolve();
  }

  // Hide a character (e.g. they've "merged" into the hero after joining the
  // party). Stops drawing them and clears the wall they occupied so others can
  // walk through that tile.
  hideObject(resolve) {
    const who = this.map.gameObjects[this.event.who];
    if (who) {
      who.isHidden = true;
      this.map.removeWall(who.x, who.y);
    }
    resolve();
  }

  // Reveal a hidden character, optionally snapping them to a tile/direction
  // first (e.g. a party member popping back out of the hero at the right spot).
  showObject(resolve) {
    const who = this.map.gameObjects[this.event.who];
    if (who) {
      // Clear any wall the object currently holds before relocating, so moving an
      // already-visible object (e.g. snapping the hero) leaves no phantom wall.
      this.map.removeWall(who.x, who.y);
      // atHero pops the object out onto the hero's tile (e.g. a party member
      // emerging from the leader), which keeps cutscenes position-independent.
      if (this.event.atHero) {
        const hero = this.map.gameObjects.hero;
        who.x = hero.x;
        who.y = hero.y;
      }
      if (this.event.x !== undefined) { who.x = utils.withGrid(this.event.x); }
      if (this.event.y !== undefined) { who.y = utils.withGrid(this.event.y); }
      if (this.event.direction) { who.direction = this.event.direction; }
      who.isHidden = false;
      this.map.addWall(who.x, who.y);
    }
    resolve();
  }

  // Run several event sequences at the same time (e.g. two characters walking
  // together). this.event.events is an array of sequences; each sequence is a
  // list of events run in order, and the sequences themselves run concurrently.
  async parallel(resolve) {
    await Promise.all(
      this.event.events.map(sequence => this.runSequence(sequence))
    );
    resolve();
  }

  async runSequence(events) {
    for (const event of events) {
      await new OverworldEvent({ map: this.map, event }).init();
    }
  }

  // Smoothly glide the camera to a world tile (x, y) over `time` ms, leaving the
  // characters where they are. Uses a free-floating camera object the game loop reads.
  cameraPan(resolve) {
    const map = this.map;
    const from = map.cameraPerson || map.gameObjects.hero;
    const startX = from.x;
    const startY = from.y;
    const targetX = utils.withGrid(this.event.x);
    const targetY = utils.withGrid(this.event.y);
    const duration = this.event.time ?? 1000;

    const camera = { x: startX, y: startY };
    map.cameraPerson = camera;

    let startTime = null;
    const step = (now) => {
      if (startTime === null) { startTime = now; }
      const t = Math.min(1, (now - startTime) / duration);
      const ease = t * (2 - t); // easeOutQuad
      camera.x = startX + (targetX - startX) * ease;
      camera.y = startY + (targetY - startY) * ease;
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        resolve();
      }
    };
    requestAnimationFrame(step);
  }

  // Snap the camera back onto a game object (e.g. { who: "hero" } to resume following).
  cameraFollow(resolve) {
    this.map.cameraPerson = this.map.gameObjects[this.event.who];
    resolve();
  }

  changeMap(resolve) {

    const sceneTransition = new SceneTransition();
    sceneTransition.init(document.querySelector(".game-container"), () => {
      const overworld = this.map.overworld;
      overworld.startMap( OverworldMaps[this.event.map], this.event.map );

      // Optional arrival tile/direction — used by door teleports so you land in
      // front of the matching door instead of the map's default spawn.
      if (this.event.x !== undefined || this.event.y !== undefined) {
        const hero = overworld.map.gameObjects.hero;
        overworld.map.removeWall(hero.x, hero.y);
        if (this.event.x !== undefined) { hero.x = utils.withGrid(this.event.x); }
        if (this.event.y !== undefined) { hero.y = utils.withGrid(this.event.y); }
        if (this.event.direction) { hero.direction = this.event.direction; }
        overworld.map.addWall(hero.x, hero.y);
      }

      resolve();

      sceneTransition.fadeOut();

    })
  }

  // Persist the game (used when the player signs in with the security guard) and
  // flash a "Saving..." note in the top-left corner. Non-blocking — the note
  // fades on its own so control returns immediately.
  saveGame(resolve) {
    writeSave(this.map.overworld);
    const container = document.querySelector(".game-container");
    const note = document.createElement("div");
    note.classList.add("SaveNote");
    note.textContent = "Saving...";
    container.appendChild(note);
    setTimeout(() => note.remove(), 1500);
    resolve();
  }

  battle(resolve) {
    const battle = new Battle({
      enemy: Enemies[this.event.enemyId],
      onComplete: (didWin) => {
        resolve(didWin ? "WON_BATTLE" : "LOST_BATTLE");
      }
    })
    battle.init(document.querySelector(".game-container"));

  }

  pause(resolve) {
    this.map.isPaused = true;
    const menu = new PauseMenu({
      onComplete: () => {
        resolve();
        this.map.isPaused = false;
        this.map.overworld.startGameLoop();
      }
    });
    menu.init(document.querySelector(".game-container"));
  }

  addStoryFlag(resolve) {
    playerState.storyFlags[this.event.flag] = true;
    utils.emitEvent("StoryFlagsChanged");
    resolve();
  }

  // Temporarily render the hero as a specific character for a cutscene WITHOUT
  // changing who you're playing as (activeCharacterId/HUD stay put). Used so a
  // story scene that also spawns a party member as a separate sprite doesn't end
  // up with two of the same person on screen (e.g. playing as Kenny when the
  // cutscene's own Kenny pops out of Brett). Pair with restoreHeroSprite.
  setHeroSprite(resolve) {
    const hero = this.map.gameObjects.hero;
    const config = Characters[this.event.characterId];
    if (hero && config?.overworldSrc) {
      hero.sprite.setImage(config.overworldSrc);
    }
    resolve();
  }

  // Put the hero back to whichever character you're actually playing as.
  restoreHeroSprite(resolve) {
    this.map.overworld.applyActiveCharacterSprite();
    resolve();
  }

  init() {
    return new Promise(resolve => {
      this[this.event.type](resolve)      
    })
  }

}
