// Improved variable names for clarity and maintainability
// Refactored into Class-Based Jellyfish
// Magic numbers replaced with named constants

const DEFAULT_RADIUS_NOISE_SCALE = 300;
const BASE_RADIUS = 200;
const RADIUS_OFFSET = 100;
const VELOCITY_DAMPING = 0.90;
const BODY_Y_OFFSET = 200;
const BODY_NOISE_AMPLITUDE = 400;
const TENTACLE_RADIUS_MULTIPLIER = 3;
const TENTACLE_RADIUS_OFFSET = 20;
const TENTACLE_STROKE_WEIGHT = 6;
const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 800;

const NOISE_DIVISORS = {
  noiseY: 1 / 120,
  noiseY2: 1 / 120,
  noiseX: 1 / 120,
  noiseX2: 1 / 200,
  strokeG: 1 / 30,
  strokeB: 1 / 60,
  bodyOffset: 1 / 100
};

class Jellyfish {
  constructor(xOffset, yOffset, xVelocity, yVelocity) {
    this.offsetX = xOffset;
    this.offsetY = yOffset;
    this.velocityX = xVelocity;
    this.velocityY = yVelocity;
  }

  updatePosition(mouseIsPressed, mouseX, mouseY, frameRateValue) {
    if (mouseIsPressed) {
      const targetX = mouseX - CANVAS_WIDTH / 2;
      const targetY = mouseY - CANVAS_HEIGHT / 2;
      this.offsetX = lerp(this.offsetX, targetX, 0.03);
      this.offsetY = lerp(this.offsetY, targetY, 0.03);
    } else {
      this.offsetX += this.velocityX;
      this.offsetY += this.velocityY;
      this.velocityX *= VELOCITY_DAMPING;
      this.velocityY *= VELOCITY_DAMPING;
    }
    this.wrapAroundEdges(CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  wrapAroundEdges(canvasWidth, canvasHeight) {
    if (this.offsetX > canvasWidth / 2) this.offsetX = -canvasWidth / 2;
    if (this.offsetX < -canvasWidth / 2) this.offsetX = canvasWidth / 2;
    if (this.offsetY > canvasHeight / 2) this.offsetY = -canvasHeight / 2;
    if (this.offsetY < -canvasHeight / 2) this.offsetY = canvasHeight / 2;
  }

  draw(frame) {
    const centerX = CANVAS_WIDTH / 2 + this.offsetX;
    const centerY = CANVAS_HEIGHT / 2 + this.offsetY;
    translate(centerX - CANVAS_WIDTH / 2, centerY - CANVAS_HEIGHT / 1.5);
    const radius = BASE_RADIUS * noise(frame / DEFAULT_RADIUS_NOISE_SCALE) + RADIUS_OFFSET;

    for (let angle = 1; angle <= 360; angle += 0.2) {
      this.drawBody(frame, angle, centerX, centerY, radius);
    }
    for (let angle = 1; angle <= 360; angle += 20) {
      this.drawTentacle(frame, angle, centerX, centerY);
    }
  }

  drawBody(frame, angle, centerX, centerY, radius) {
    const x = centerX + radius * cos(radians(angle));
    const y = centerY + radius * sin(radians(angle)) + 
      (BODY_Y_OFFSET - noise(radians(angle), frame * NOISE_DIVISORS.bodyOffset) * BODY_NOISE_AMPLITUDE);

    this.applyStrokeColor(frame, angle);
    beginShape();
    curveVertex(centerX, centerY + 100);
    const n = computeNoise(radius, frame, angle);
    curveVertex(centerX, centerY - 120 + n.noiseY);
    curveVertex(x, y / 25 + 400 + n.noiseY2);
    curveVertex(x + n.noiseX, y / 10 + 1000);
    endShape();
  }

  drawTentacle(frame, angle, centerX, centerY) {
    const radius = TENTACLE_RADIUS_OFFSET * noise(frame / DEFAULT_RADIUS_NOISE_SCALE) + TENTACLE_RADIUS_OFFSET;
    const x = centerX + radius * TENTACLE_RADIUS_MULTIPLIER * cos(radians(angle));
    const x2 = centerX + (radius / 2) * cos(radians(angle));
    const y = centerY + radius * sin(radians(angle));

    this.applyStrokeColor(frame, angle);
    strokeWeight(TENTACLE_STROKE_WEIGHT);
    beginShape();
    const n = computeNoise(radius, frame, angle);
    curveVertex(x2, centerY + 200);
    curveVertex(x2, centerY - 40 + n.noiseY);
    curveVertex(x + n.noiseX2, y / 1.1 + 500 + n.noiseY2);
    curveVertex(x + n.noiseX, y / 10 + 1000);
    endShape();
  }

  applyStrokeColor(frame, angle) {
    const r = noise(radians(angle));
    const g = noise(radians(angle), frame * NOISE_DIVISORS.strokeG);
    const b = noise(radians(angle), frame * NOISE_DIVISORS.strokeB);
    stroke(50 * r, 180 * g, 220 * b + 50, 40);
  }
}

function computeNoise(radius, frame, angle) {
  return {
    noiseY: noise(radius / 100) * 100,
    noiseY2: 50 - noise(radius / 100, frame * NOISE_DIVISORS.noiseY2) * 100,
    noiseX: 500 - noise(radians(angle), frame * NOISE_DIVISORS.noiseX) * 1100,
    noiseX2: 100 - noise(radians(360 - angle), frame * NOISE_DIVISORS.noiseX2) * 200
  };
}

// P5 Setup
let CreateJellyfish;

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  frameRate(60);
  CreateJellyfish = new Jellyfish(0, 0, 0.4, 0.4);
}

function draw() {
  background(0, 90);
  CreateJellyfish.updatePosition(mouseIsPressed, mouseX, mouseY, frameRate());
  CreateJellyfish.draw(frameCount);
}

function mousePressed() {
  isDragging = true;
  lastMouseX = mouseX;
  lastMouseY = mouseY;
}

function mouseReleased() {
  isDragging = false;
}
