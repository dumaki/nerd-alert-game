import { Sprite } from "./Sprite.js";
import { OverworldEvent } from "./OverworldEvent.js";

export class GameObject {
  constructor(config) {
    this.id = null;
    this.isMounted = false;
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.direction = config.direction || "down";
    // Hidden objects aren't drawn and lay down no wall. Used for party members
    // who have "merged" into the hero (e.g. after joining) and pop back out for
    // a later cutscene via the showObject event.
    this.isHidden = config.isHidden || false;
    this.sprite = new Sprite({
      gameObject: this,
      src: config.src || "images/characters/people/brett.png",
    });

    this.behaviorLoop = config.behaviorLoop || [];
    this.behaviorLoopIndex = 0;
    // When false, the behavior loop plays through once and then stops (the
    // character stays put). Useful for a one-time scripted walk that should not
    // freeze the player. Defaults to true (classic looping idle behavior).
    this.behaviorLoopRepeat = config.behaviorLoopRepeat ?? true;

    this.talking = config.talking || [];

  }

  mount(map) {
    this.isMounted = true;
    if (!this.isHidden) {
      map.addWall(this.x, this.y);
    }

    //If we have a behavior, kick off after a short delay
    setTimeout(() => {
      this.doBehaviorEvent(map);
    }, 10)
  }

  update() {
  }

  async doBehaviorEvent(map) {

    //Stop loops belonging to a map we've left. changeMap swaps overworld.map, but
    //each map keeps its own NPC instances whose loops would otherwise idle forever
    //in the background — every visited map would pile on, slowing the game over time.
    if (map.overworld && map.overworld.map !== map) {
      this.behaviorLoopActive = false;
      return;
    }

    //Don't do anything if there is a more important cutscene or I don't have config to do anything
    //anyway.
    if (map.isCutscenePlaying || this.behaviorLoop.length === 0 || this.isStanding) {
      return;
    }

    //A non-repeating loop that already finished sits at index === length; there's
    //nothing left to play (and reading behaviorLoop[length] would crash).
    if (this.behaviorLoopIndex >= this.behaviorLoop.length) {
      return;
    }

    //Don't run two behavior loops for the same object at once. When a cutscene
    //ends, the engine re-pokes EVERY object's behavior; without this guard a second
    //concurrent loop stacks up each time, and the game gets progressively slower.
    if (this.behaviorLoopActive) {
      return;
    }
    this.behaviorLoopActive = true;

    //Setting up our event with relevant info
    let eventConfig = this.behaviorLoop[this.behaviorLoopIndex];
    eventConfig.who = this.id;

    //An idle "stand" with no `time` resolves on setTimeout(0), which tight-loops
    //the CPU. Give looping idle stands a hold so they idle instead of spinning.
    //(Cutscene stands run through startCutscene, not here, so they're unaffected.)
    if (eventConfig.type === "stand" && eventConfig.time === undefined) {
      eventConfig.time = 1000;
    }

    //Create an event instance out of our next event config
    const eventHandler = new OverworldEvent({ map, event: eventConfig });
    await eventHandler.init();
    this.behaviorLoopActive = false;

    //Setting the next event to fire
    this.behaviorLoopIndex += 1;
    if (this.behaviorLoopIndex === this.behaviorLoop.length) {
      if (!this.behaviorLoopRepeat) { return; }
      this.behaviorLoopIndex = 0;
    }

    //Do it again!
    this.doBehaviorEvent(map);
    

  }


}
