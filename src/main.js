// Styles (Vite bundles these — they used to be <link> tags in index.html)
import "../styles/global.css";
import "../styles/Hud.css";
import "../styles/KeyboardMenu.css";
import "../styles/TextMessage.css";
import "../styles/Menus.css";
import "../styles/SceneTransition.css";
import "../styles/TitleCard.css";
import "../styles/Letterbox.css";
import "../styles/Battle.css";
import "../styles/Combatant.css";
import "../styles/Team.css";
import "../styles/SubmissionMenu.css";
import "../styles/TitleScreen.css";
import "../styles/FpsMeter.css";
import "../styles/ObjectiveHud.css";

import { Overworld } from "./Overworld.js";
import { TitleScreen } from "./TitleScreen.js";

const container = document.querySelector(".game-container");

// Boot the game at an episode. (Only Episode 1 has content for now; "Start" and
// "Episodes -> Episode 1" both begin it from the beginning.) When `save` is
// provided (the title's Continue option), the overworld restores from it instead
// of playing the intro.
function startGame(episodeNumber, save) {
  const overworld = new Overworld({ element: container });
  overworld.init(save);
}

// Show the title menu first; it calls startGame when the player picks Start.
const titleScreen = new TitleScreen({ onStart: startGame });
titleScreen.init(container);
