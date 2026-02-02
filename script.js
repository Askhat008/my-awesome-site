const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
const actions = ["Idle", "Run", "Jump"];

const palette = {
  outline: "#1c1c2e",
  shadow: "#2c3968",
  outfit: "#4f79d3",
  skin: "#f2b880",
  white: "#f5f5f5",
  accent: "#f04f4f",
  energy: "#5dd39e",
};

const canvas = document.getElementById("spriteSheet");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

function px(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawFrame({ col, row, direction, action }) {
  const ox = col * 32;
  const oy = row * 32;
  const centerX = ox + 16;

  ctx.clearRect(ox, oy, 32, 32);

  const facing = {
    N: { dx: 0, dy: -1 },
    NE: { dx: 1, dy: -1 },
    E: { dx: 1, dy: 0 },
    SE: { dx: 1, dy: 1 },
    S: { dx: 0, dy: 1 },
    SW: { dx: -1, dy: 1 },
    W: { dx: -1, dy: 0 },
    NW: { dx: -1, dy: -1 },
  }[direction];

  const headOffset = facing.dx * 1;
  const torsoOffset = facing.dx * 0;
  const legSpread = action === "Run" ? 4 : action === "Jump" ? 2 : 2;
  const armLift = action === "Jump" ? -2 : action === "Run" ? -1 : 0;
  const bounce = action === "Jump" ? -2 : action === "Run" ? -1 : 0;

  const headX = centerX - 4 + headOffset;
  const headY = oy + 4 + bounce;

  // Shadow base.
  px(ox + 8, oy + 26, 16, 3, palette.shadow);

  // Body.
  px(centerX - 6 + torsoOffset, oy + 14 + bounce, 12, 10, palette.outfit);
  px(centerX - 6 + torsoOffset, oy + 20 + bounce, 12, 2, palette.accent);

  // Head.
  px(headX, headY, 8, 8, palette.skin);
  px(headX, headY, 8, 2, palette.outline);

  // Face or hair depending on direction.
  if (direction === "N") {
    px(headX + 1, headY + 2, 6, 2, palette.outline);
  } else if (direction === "S") {
    px(headX + 2, headY + 3, 2, 2, palette.outline);
    px(headX + 5, headY + 3, 2, 2, palette.outline);
    px(headX + 3, headY + 6, 2, 1, palette.outline);
  } else {
    const eyeX = facing.dx > 0 ? headX + 5 : headX + 2;
    px(eyeX, headY + 3, 2, 2, palette.outline);
    px(eyeX, headY + 5, 2, 1, palette.white);
  }

  // Arms.
  const armY = oy + 14 + bounce + armLift;
  px(centerX - 10 + torsoOffset, armY, 3, 7, palette.outfit);
  px(centerX + 7 + torsoOffset, armY, 3, 7, palette.outfit);

  // Legs.
  const legY = oy + 23 + bounce;
  px(centerX - legSpread, legY, 4, 6, palette.outline);
  px(centerX + legSpread - 4, legY, 4, 6, palette.outline);

  if (action === "Run") {
    px(centerX - 7, legY + 2, 4, 2, palette.energy);
    px(centerX + 3, legY + 2, 4, 2, palette.energy);
  }

  if (action === "Jump") {
    px(centerX - 3, oy + 10 + bounce, 6, 2, palette.energy);
  }
}

function drawSheet() {
  actions.forEach((action, row) => {
    directions.forEach((direction, col) => {
      drawFrame({ col, row, direction, action });
    });
  });
}

drawSheet();
