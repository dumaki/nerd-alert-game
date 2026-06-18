import { playerState } from "./State/PlayerState.js";
import { Objectives } from "./Content/objectives.js";

// On-screen objective tracker (top-right). Driven by story flags: an objective
// shows once its `show` flag is set and crosses off (strike-through + fade) once
// its `complete` flag is set. Re-renders on StoryFlagsChanged.
//
// Visibility: hidden by default so text isn't always on screen. It auto-reveals
// for a few seconds whenever the list changes (longer when something is added,
// just long enough to play the cross-off when something completes), and the
// player can hold Left Shift to peek at it any time.
export class ObjectiveHud {
  constructor() {
    this.element = null;
    this.displayed = new Set(); // ids currently rendered as active
    this.hasRows = false;       // is anything in the list right now
    this.heldVisible = false;   // Left Shift held
    this.autoVisible = false;   // temporary auto-reveal active
    this.autoHideTimer = null;
  }

  flag(name) {
    return !!playerState.storyFlags[name];
  }

  // Should this objective/child be visible right now (active, not yet done)?
  isActive(node, parent) {
    if (parent && this.flag(parent.complete)) { return false; }
    return this.flag(node.show) && !this.flag(node.complete);
  }

  rowHtml(node, depth, state) {
    const optional = node.optional ? ` <span class="ObjectiveHud_opt">(optional)</span>` : "";
    return `<li class="ObjectiveHud_row ObjectiveHud_row--d${depth} ObjectiveHud_row--${state}">${node.label}${optional}</li>`;
  }

  // Render all currently-active rows, plus any that just completed (`fading`)
  // one last time with a strike-through fade-out.
  render(fading) {
    const rows = [];
    Objectives.forEach(obj => {
      const objActive = this.isActive(obj);
      if (objActive) {
        rows.push(this.rowHtml(obj, 0, "active"));
      } else if (fading.has(obj.id)) {
        rows.push(this.rowHtml(obj, 0, "done"));
      }
      (obj.children || []).forEach(child => {
        const childActive = this.isActive(child, obj);
        if (childActive && objActive) {
          rows.push(this.rowHtml(child, 1, "active"));
        } else if (fading.has(child.id)) {
          rows.push(this.rowHtml(child, 1, "done"));
        }
      });
    });

    this.hasRows = rows.length > 0;
    this.element.innerHTML = this.hasRows
      ? `<p class="ObjectiveHud_title">Objectives</p><ul class="ObjectiveHud_list">${rows.join("")}</ul>`
      : "";

    // Remove each fading row once its animation ends.
    this.element.querySelectorAll(".ObjectiveHud_row--done").forEach(row => {
      row.addEventListener("animationend", () => row.remove(), { once: true });
    });
  }

  applyVisibility() {
    const visible = this.hasRows && (this.heldVisible || this.autoVisible);
    this.element.classList.toggle("ObjectiveHud--hidden", !visible);
  }

  revealTemporarily(ms) {
    this.autoVisible = true;
    this.applyVisibility();
    clearTimeout(this.autoHideTimer);
    this.autoHideTimer = setTimeout(() => {
      this.autoVisible = false;
      this.applyVisibility();
    }, ms);
  }

  update() {
    const active = new Set();
    Objectives.forEach(obj => {
      if (this.isActive(obj)) { active.add(obj.id); }
      (obj.children || []).forEach(child => {
        if (this.isActive(child, obj)) { active.add(child.id); }
      });
    });

    const added = [...active].some(id => !this.displayed.has(id));
    const fading = new Set([...this.displayed].filter(id => !active.has(id)));

    this.render(fading);
    this.displayed = active;
    this.applyVisibility();

    // Reveal on change: longer for additions, just enough to play the cross-off
    // fade (1.8s) when something only completed.
    if (added) {
      this.revealTemporarily(5000);
    } else if (fading.size > 0) {
      this.revealTemporarily(2200);
    }
  }

  init(container) {
    this.element = document.createElement("div");
    this.element.classList.add("ObjectiveHud", "ObjectiveHud--hidden");
    container.appendChild(this.element);
    this.update();

    document.addEventListener("StoryFlagsChanged", () => this.update());

    // Hold Left Shift to peek at the objectives.
    document.addEventListener("keydown", e => {
      if (e.code === "ShiftLeft") { this.heldVisible = true; this.applyVisibility(); }
    });
    document.addEventListener("keyup", e => {
      if (e.code === "ShiftLeft") { this.heldVisible = false; this.applyVisibility(); }
    });
  }
}
