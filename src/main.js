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

import { Overworld } from "./Overworld.js";

const overworld = new Overworld({
  element: document.querySelector(".game-container"),
});
overworld.init();
