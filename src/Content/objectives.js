// Episode 1 objective list. The on-screen ObjectiveHud is driven entirely by story
// flags, so save/load restores objective state for free (storyFlags are saved).
//
// Each objective:
//   id        - unique key
//   label     - shown text
//   show      - storyFlag that makes it appear
//   complete  - storyFlag that crosses it off (it then strikes through + fades away)
//   optional  - (children only) renders italic with an "(optional)" tag
//   children  - sub-objectives; a child hides once its parent is complete
//
// Flags set during play (see OverworldMap cutscenes):
//   EP1_CALL_DONE      - opening phone call finished
//   EP1_ASKED_SECURITY - talked to the guard about Kenny
//   EP1_REACHED_7F     - arrived on the 7th floor after the elevator
//   EP1_MET_TOSHI      - Bridget asked you to show Toshi around
//   EP1_BUILDROOM / EP1_BATHROOM / EP1_CUBICLE / EP1_MET_DARIUS / EP1_MET_BROOKE
//   EP1_TOSHI_TOUR_DONE- finished showing Toshi around
//   EP1_GOT_BADGE      - Toshi has his HR badge
export const Objectives = [
  {
    id: "toBridget",
    label: "Head upstairs to Bridget's Office",
    show: "EP1_CALL_DONE",
    complete: "EP1_MET_TOSHI",
  },
  {
    id: "findKenny",
    label: "Find Kenny",
    show: "EP1_CALL_DONE",
    complete: "EP1_REACHED_7F",
    children: [
      {
        id: "askSecurity",
        label: "Ask Security about Kenny",
        optional: true,
        show: "EP1_CALL_DONE",
        complete: "EP1_ASKED_SECURITY",
      },
    ],
  },
  {
    id: "showToshi",
    label: "Show Toshi around the office",
    show: "EP1_MET_TOSHI",
    complete: "EP1_TOSHI_TOUR_DONE",
    children: [
      { id: "buildRoom", label: "Build Room", optional: true, show: "EP1_MET_TOSHI", complete: "EP1_BUILDROOM" },
      { id: "bathroom", label: "Bathroom", optional: true, show: "EP1_MET_TOSHI", complete: "EP1_BATHROOM" },
      { id: "cubicle", label: "Cubicle", optional: true, show: "EP1_MET_TOSHI", complete: "EP1_CUBICLE" },
      { id: "darius", label: "Meet Darius", optional: true, show: "EP1_MET_TOSHI", complete: "EP1_MET_DARIUS" },
      { id: "brooke", label: "Meet Brooke", optional: true, show: "EP1_MET_TOSHI", complete: "EP1_MET_BROOKE" },
    ],
  },
  {
    id: "badge",
    label: "Get a badge for Toshi",
    show: "EP1_MET_TOSHI",
    complete: "EP1_GOT_BADGE",
  },
  {
    // Darius's side quest. The label gets a live "[N of M remaining]" counter,
    // computed from how many EP1_FANNYPACK_1..5 flags are set.
    id: "fannyPacks",
    label: "Find Darius' Missing Fanny Packs",
    optional: true,
    show: "EP1_FANNYPACK_QUEST",
    complete: "EP1_FANNYPACK_DONE",
    progress: { total: 5, flagPrefix: "EP1_FANNYPACK_" },
  },
];
