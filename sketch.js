// Improved variable names for clarity and maintainability
let jellyfishOffsetX = 0, jellyfishOffsetY = 0; // Position offsets for movement
let jellyfishVelocityX = 0.4, jellyfishVelocityY = 0.4; // Movement speed
let lastMouseX, lastMouseY; // Stores previous mouse position
let isDragging = false; // Tracks if the user is dragging
const VELOCITY_DAMPING = 0.90; // Reduces velocity over time
const BOUNCE_FACTOR = 8; // Defines elasticity for bounce effects

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
}

function wrapAroundEdges() {
  // Horizontally wrap
  if (jellyfishOffsetX > width / 2) {
    jellyfishOffsetX = -width / 2;
  } else if (jellyfishOffsetX < -width / 2) {
    jellyfishOffsetX = width / 2;
  }

  // Vertically wrap
  if (jellyfishOffsetY > height / 2) {
    jellyfishOffsetY = -height / 2;
  } else if (jellyfishOffsetY < -height / 2) {
    jellyfishOffsetY = height / 2;
  }
}

function draw() {
  let currentFrame = frameCount;
  background(0, 90);

  wrapAroundEdges(); 

  if (mouseIsPressed) {
    let targetX = mouseX - width / 2;
    let targetY = mouseY - height / 2;
    jellyfishOffsetX = lerp(jellyfishOffsetX, targetX, 0.03);
    jellyfishOffsetY = lerp(jellyfishOffsetY, targetY, 0.03);
  } else {
    // Apply physics when not dragging
    jellyfishOffsetX += jellyfishVelocityX;
    jellyfishOffsetY += jellyfishVelocityY;

    // Apply damping to velocity
    jellyfishVelocityX *= VELOCITY_DAMPING;
    jellyfishVelocityY *= VELOCITY_DAMPING;

    // Ensure shape wraps around when out of bounds
    wrapAroundEdges();
  }

  const centerX = width / 2 + jellyfishOffsetX;
  const centerY = height / 2 + jellyfishOffsetY;

  stroke(255, 20);
  strokeWeight(1);
  noFill();

  translate(centerX - windowWidth / 2, centerY - windowHeight / 1.5);

  drawJellyfish(currentFrame, centerX, centerY);
}

function mousePressed() {
  isDragging = true;
  lastMouseX = mouseX;
  lastMouseY = mouseY;
}

function mouseReleased() {
  isDragging = false;
}

// Draws the jellyfish body and tentacles
function drawJellyfish(currentFrame, centerX, centerY) {
  const baseRadius = 200 * noise(currentFrame / 300) + 100;

  for (let angle = 1; angle <= 360; angle += 0.2) {
    drawJellyfishBody(currentFrame, angle, centerX, centerY, baseRadius);
  }

  for (let angle = 1; angle <= 360; angle += 20) {
    drawJellyfishTentacles(currentFrame, angle, centerX, centerY);
  }
}

// Draws the main body of the jellyfish
function drawJellyfishBody(currentFrame, angle, centerX, centerY, radius) {
  const x = centerX + radius * cos(radians(angle));
  const y = centerY + radius * sin(radians(angle)) + (200 - noise(radians(angle), currentFrame / 100) * 400);

  applyDynamicStrokeColor(currentFrame, angle);
  beginShape();
  curveVertex(centerX, centerY + 100);
  const noiseValues = computeNoise(radius, currentFrame, angle, x, y, centerX, centerY);
  curveVertex(centerX, centerY - 120 + noiseValues.noiseY);
  curveVertex(x, y / 25 + 400 + noiseValues.noiseY2);
  curveVertex(x + noiseValues.noiseX, y / 10 + 1000);
  endShape();
}

// Draws the jellyfish tentacles
function drawJellyfishTentacles(currentFrame, angle, centerX, centerY) {
  const tentacleRadius = 20 * noise(currentFrame / 300) + 20;
  const x = centerX + tentacleRadius * 3 * cos(radians(angle));
  const x2 = centerX + (tentacleRadius / 2) * cos(radians(angle));
  const y = centerY + tentacleRadius * sin(radians(angle));

  applyDynamicStrokeColor(currentFrame, angle);
  strokeWeight(6);

  beginShape();
  const noiseValues = computeNoise(tentacleRadius, currentFrame, angle, x, y, centerX, centerY);
  curveVertex(x2, centerY + 200);
  curveVertex(x2, centerY - 40 + noiseValues.noiseY);
  curveVertex(x + noiseValues.noiseX2, y / 1.1 + 500 + noiseValues.noiseY2);
  curveVertex(x + noiseValues.noiseX, y / 10 + 1000);
  endShape();
}

// Applies dynamic stroke color based on movement and noise
function applyDynamicStrokeColor(currentFrame, angle) {
  const noiseStrokeR = noise(radians(angle));
  const noiseStrokeG = noise(radians(angle), currentFrame / 30);
  const noiseStrokeB = noise(radians(angle), currentFrame / 60);

  stroke(
    50 * noiseStrokeR,
    180 * noiseStrokeG, 
    220 * noiseStrokeB + 50,
    40
  );
}

// Computes noise values for fluid movement effects
function computeNoise(radius, currentFrame, angle, x, y, centerX, centerY) {
  return {
    noiseY: noise(radius / 100) * 100,
    noiseY2: 50 - noise(radius / 100, currentFrame / 120) * 100,
    noiseX: 500 - noise(radians(angle), currentFrame / 120) * 1100,
    noiseX2: 100 - noise(radians(360 - angle), currentFrame / 200) * 200
  };
}



