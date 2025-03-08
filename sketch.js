// Improved variable names for readability
let shapeOffsetX = 0, shapeOffsetY = 0; // Position offsets for the shape
let shapeVelocityX = 0.4, shapeVelocityY = 0.4; // Velocity of the shape
let lastMouseX, lastMouseY; // Previous mouse coordinates
let isDragging = false; // Tracks if the mouse is dragging the shape
const velocityDamping = 0.90; // Factor to reduce velocity over time
const bounceFactor = 8; // Elasticity for bounce effects

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
}

function checkEdges() {
  // Wrap around horizontally
  if (shapeOffsetX > width / 2) {
    shapeOffsetX = -width / 2;
  } else if (shapeOffsetX < -width / 2) {
    shapeOffsetX = width / 2;
  }

  // Wrap around vertically
  if (shapeOffsetY > height / 2) {
    shapeOffsetY = -height / 2;
  } else if (shapeOffsetY < -height / 2) {
    shapeOffsetY = height / 2;
  }
}

function draw() {
  let currentFrame = frameCount;
  background(0, 90);

  checkEdges(); // Adjust position if shape moves beyond edges

  if (mouseIsPressed) {
    let targetX = mouseX - width / 2;
    let targetY = mouseY - height / 2;
    shapeOffsetX = lerp(shapeOffsetX, targetX, 0.03);
    shapeOffsetY = lerp(shapeOffsetY, targetY, 0.03);
  } else {
    // Apply physics when not dragging
    shapeOffsetX += shapeVelocityX;
    shapeOffsetY += shapeVelocityY;

    // Apply damping to velocity
    shapeVelocityX *= velocityDamping;
    shapeVelocityY *= velocityDamping;

    // Ensure shape wraps around when out of bounds
    checkEdges();
  }

  const centerX = width / 2 + shapeOffsetX;
  const centerY = height / 2 + shapeOffsetY;

  stroke(255, 20);
  strokeWeight(1);
  noFill();

  translate(centerX - windowWidth / 2, centerY - windowHeight / 1.5);

  for (let angle = 1; angle <= 360; angle += 0.2) {
    drawMainShape(currentFrame, angle, centerX, centerY, 200 * noise(currentFrame / 300) + 100);
  }

  for (let angle = 1; angle <= 360; angle += 20) {
    drawSecondaryShape(currentFrame, angle, centerX, centerY);
  }
}

function mousePressed() {
  isDragging = true;
  lastMouseX = mouseX;
  lastMouseY = mouseY;
}

let mouseDeltaX = 0, mouseDeltaY = 0;

function mouseDragged() {
  // Un-comment if you want dragging physics
  // if (isDragging) {
  //   mouseDeltaX = lerp(mouseDeltaX, mouseX - lastMouseX, 0.1);
  //   mouseDeltaY = lerp(mouseDeltaY, mouseY - lastMouseY, 0.1);

  //   // Apply movement changes to offset and velocity
  //   shapeOffsetX += mouseDeltaX;
  //   shapeOffsetY += mouseDeltaY;
  //   shapeVelocityX = mouseDeltaX * 0.01; // Adjust for inertia
  //   shapeVelocityY = mouseDeltaY * 0.01;

  //   lastMouseX = mouseX;
  //   lastMouseY = mouseY;
  // }
}

function mouseReleased() {
  isDragging = false;
}

// Main shape (bell body)
function drawMainShape(currentFrame, angle, centerX, centerY, radius) {
  const x = centerX + radius * cos(radians(angle));
  const y = centerY + radius * sin(radians(angle)) + (200 - noise(radians(angle), currentFrame / 100) * 400);
  
  applyStrokeColor(currentFrame, angle);
  beginShape();
  curveVertex(centerX, centerY + 100);
  const noiseValues = computeNoiseValues(radius, currentFrame, angle, x, y, centerX, centerY);
  curveVertex(centerX, centerY - 120 + noiseValues.noiseY);
  curveVertex(x, y / 25 + 400 + noiseValues.noiseY2);
  curveVertex(x + noiseValues.noiseX, y / 10 + 1000);
  endShape();
}

// Tentacles
function drawSecondaryShape(currentFrame, angle, centerX, centerY) {
  const radius2 = 20 * noise(currentFrame / 300) + 20;
  const x = centerX + radius2 * 3 * cos(radians(angle));
  const x2 = centerX + (radius2 / 2) * cos(radians(angle));
  const y = centerY + radius2 * sin(radians(angle));
  
  applyStrokeColor(currentFrame, angle);
  strokeWeight(1.5);

  beginShape();
  const noiseValues = computeNoiseValues(radius2, currentFrame, angle, x, y, centerX, centerY);
  curveVertex(x2, centerY + 200);
  curveVertex(x2, centerY - 40 + noiseValues.noiseY);
  curveVertex(x + noiseValues.noiseX2, y / 1.1 + 500 + noiseValues.noiseY2);
  curveVertex(x + noiseValues.noiseX, y / 10 + 1000);
  endShape();
}

// Improved function name for stroke color
function applyStrokeColor(currentFrame, angle) {
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

// Improved function name for noise calculations
function computeNoiseValues(radius, currentFrame, angle, x, y, centerX, centerY) {
  return {
    noiseY: noise(radius / 100) * 100,
    noiseY2: 50 - noise(radius / 100, currentFrame / 120) * 100,
    noiseX: 500 - noise(radians(angle), currentFrame / 120) * 1100,
    noiseX2: 100 - noise(radians(360 - angle), currentFrame / 200) * 200
  };
}
