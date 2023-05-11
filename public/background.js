let stars = [];

const STARS_COUNT = 20;
const STAR_SIZE = [5, 20];
const BIDIRECTIONAL = `BIDIRECTIONAL`;
const UNIDIRECTIONAL = `UNIDIRECTIONAL`;
const STAR_GENERATION_MODE = UNIDIRECTIONAL;
const STAR_VELOCITY_MIN_AND_MAX = [1.5, 20];
const SIZE_DECREASE_FACTOR = [0.1, 0.4];
const RED = `#F70000`;
const ALMOST_GREEN = `#3DD2D0`;
const MAIN_COLOR = ALMOST_GREEN;

const _50ms = 50;
const _100ms = 50 * 2;
const _1s = _100ms * 10;
const _5s = _1s * 5;
const _10s = _5s * 2;

const GRADIENT_ANIMATION_DURATION = _5s;

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  canvas = createCanvas(innerWidth, innerHeight);

  canvas.parent("2");

  const [_, maxSize] = STAR_SIZE.map(Math.abs);
  const starsCount = STARS_COUNT || max(windowWidth, windowHeight) / maxSize;
  stars = Array.from({ length: starsCount }).map((_) => createStar());
}

function draw() {
  background(255);

  noStroke();

  setLinearGradientBackground();

  for (const star of stars) {
    drawStar(star);

    const updatedStar = updateStar(star);

    if (starIsVisible(updatedStar)) {
      stars[stars.indexOf(star)] = updatedStar;
    } else {
      stars[stars.indexOf(star)] = createStar();
    }
  }
}

function setLinearGradientBackground() {
  background(0, 0, 20);

  const value =
    (millis() % GRADIENT_ANIMATION_DURATION) / GRADIENT_ANIMATION_DURATION;

  const curve = value > 0.5 ? 1 - value : value;

  const gradientAlpha = curve * 255;

  const gradientColor = color(...hex2rgb(MAIN_COLOR), gradientAlpha);

  setGradient(0, 0, width, height, color(0, 0, 0, 0), gradientColor);
}

function createStar() {
  const [minSize, maxSize] = STAR_SIZE.map(Math.abs);

  const size = random(minSize, maxSize);

  const velocityX = random(...STAR_VELOCITY_MIN_AND_MAX);
  const velocityY = random(...STAR_VELOCITY_MIN_AND_MAX);

  return {
    velocity: {
      x: velocityX / 3,
      y: STAR_GENERATION_MODE === BIDIRECTIONAL ? velocityY : velocityX,
    },
    size,
    position: generateRandomInitialPosition(),
    sizeDecreaseFactor: random(...SIZE_DECREASE_FACTOR),
    initialSize: size,
  };
}

function drawStar(star) {
  const alpha = (star.size / star.initialSize) * 255;

  const rgb = hex2rgb(MAIN_COLOR);

  fill(...rgb, alpha);

  rect(star.position.x, star.position.y, star.size, star.size);
}

function hex2rgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function generateRandomInitialPosition() {
  const randomBottomPosition = random() <= 0.9;

  return {
    x: randomBottomPosition ? random() * width : width,
    y: randomBottomPosition ? height : random() * height,
  };
}

function updateStar({
  position,
  velocity,
  size,
  sizeDecreaseFactor,
  initialSize,
}) {
  return {
    position: {
      x: position.x - velocity.x,
      y: position.y - velocity.y,
    },
    size: size - sizeDecreaseFactor,
    initialSize,
    sizeDecreaseFactor,
    velocity,
  };
}

function starIsVisible(star) {
  return (
    star.position.x + star.size < width &&
    star.position.x + star.size > 0 &&
    star.position.y + star.size < height &&
    star.position.y + star.size > 0 &&
    star.size > 0
  );
}

function setGradient(x, y, w, h, c1, c2) {
  noFill();

  for (let i = y; i <= y + h; i++) {
    let inter = map(i, y, y + h, 0, 1);
    let c = lerpColor(c1, c2, inter);
    stroke(c);
    line(x, i, x + w, i);
  }
}
