import { playerState } from "./PlayerState.js";
import { utils } from "../utils.js";

// Single localStorage slot for the whole game. The title screen's Continue /
// Episodes options already read this key, so writing it lights them up.
const SAVE_KEY = "nerdAlertSave";

export function loadSave() {
  try {
    return JSON.parse(localStorage.getItem(SAVE_KEY)) || null;
  } catch {
    return null;
  }
}

export function hasSave() {
  return !!loadSave();
}

// Snapshot the live game (overworld position + everything on playerState) and
// persist it. Coords are stored in grid units (the inverse of utils.withGrid).
export function writeSave(overworld) {
  const hero = overworld.map.gameObjects.hero;
  const previous = loadSave();
  const save = {
    mapId: overworld.mapId,
    heroX: hero.x / 16,
    heroY: hero.y / 16,
    heroDirection: hero.direction,
    party: playerState.party,
    lineup: playerState.lineup,
    activeCharacterId: playerState.activeCharacterId,
    items: playerState.items,
    storyFlags: playerState.storyFlags,
    // Preserve whatever episode progress was already unlocked.
    episodesUnlocked: (previous && previous.episodesUnlocked) || 1,
  };
  localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  return save;
}

// Copy a save snapshot's state back onto the live playerState singleton. (The
// caller is responsible for switching to save.mapId and placing the hero.)
export function applySaveToPlayerState(save) {
  playerState.party = save.party;
  playerState.lineup = save.lineup;
  playerState.activeCharacterId = save.activeCharacterId ?? "s001";
  playerState.items = save.items;
  playerState.storyFlags = save.storyFlags;
  // Let the objective tracker (and anything else flag-driven) re-sync.
  utils.emitEvent("StoryFlagsChanged");
}
