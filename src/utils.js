export const utils = {
  withGrid(n) {
    return n * 16;
  },

  // Where the world origin sits on the canvas so the camera person renders
  // centered. Derived from the canvas size, so changing the resolution
  // (e.g. the 4:3 playfield) keeps everything centered automatically.
  // The -8 centers a 16px tile horizontally; the -3 nudges the framing so the
  // hero sits slightly above the vertical center (matches the original look).
  cameraOffsetX(canvas) {
    return canvas.width / 2 - 8;
  },
  cameraOffsetY(canvas) {
    return canvas.height / 2 - 3;
  },
  asGridCoord(x,y) {
    return `${x*16},${y*16}`
  },
  nextPosition(initialX, initialY, direction) {
    let x = initialX;
    let y = initialY;
    const size = 16;
    if (direction === "left") { 
      x -= size;
    } else if (direction === "right") {
      x += size;
    } else if (direction === "up") {
      y -= size;
    } else if (direction === "down") {
      y += size;
    }
    return {x,y};
  },
  oppositeDirection(direction) {
    if (direction === "left") { return "right" }
    if (direction === "right") { return "left" }
    if (direction === "up") { return "down" }
    return "up"
  },

  wait(ms) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, ms)
    })
  },

  randomFromArray(array) {
    return array[ Math.floor(Math.random()*array.length) ]
  },

  emitEvent(name, detail) {
    const event = new CustomEvent(name, {
      detail
    });
    document.dispatchEvent(event);
  }
  
}