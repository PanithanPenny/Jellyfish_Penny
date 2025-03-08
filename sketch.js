let offsetX = 0, offsetY = 0; // Current position offsets for the shape
let velocityX = 0.4, velocityY = 0.4; // Velocity of the shape
let prevMouseX, prevMouseY; // Previous mouse coordinates
let dragging = false; // Whether the mouse is dragging the shape
const damping = 0.90; // Damping factor to simulate friction
const elasticity = 8; // Elasticity for bounce

function setup() {
  createCanvas(windowWidth, windowHeight);
  // background(0);
  frameRate(60);
}


function checkEdges() {
  // Wrap around horizontally
  if (offsetX > width / 2) {
    offsetX = -width / 2;
  } else if (offsetX < -width / 2) {
    offsetX = width / 2;
  }

  // Wrap around vertically
  if (offsetY > height / 2) {
    offsetY = -height / 2;
  } else if (offsetY < -height / 2) {
    offsetY = height / 2;
  }
}

function draw() {
  let i = frameCount;
  background(0,90);

  checkEdges(); // Check and adjust for edges to wrap around

  if (mouseIsPressed) {
    let targetX = mouseX - width / 2;
    let targetY = mouseY - height / 2;
    offsetX = lerp(offsetX, targetX, 0.03);
    offsetY = lerp(offsetY, targetY, 0.03);
    
  } else {
    // Apply physics when not dragging
    offsetX += velocityX;
    offsetY += velocityY;

    // Apply damping
    velocityX *= damping;
    velocityY *= damping;

    // Check for canvas boundaries and bounce
    checkEdges();
    
   
  }

  const centerX = width / 2 + offsetX;
  const centerY = height / 2 + offsetY;

  stroke(255, 20);
  strokeWeight(1);
  noFill();
  // translate(0, -150);
  
    translate(centerX - windowWidth/2, centerY - windowHeight/1.5); // Ensure the translate reflects the current dragging position

  for (let angle = 1; angle <= 360; angle += 0.2) {
    drawMainShape(i, angle, centerX, centerY, 200 * noise(i / 300) + 100);
      }

  for (let angle = 1; angle <= 360; angle += 20) {
    drawSecondaryShape(i, angle, centerX, centerY);
  }
}

function mousePressed() {
  dragging = true;
  prevMouseX = mouseX;
  prevMouseY = mouseY;
}

let dx = 0, dy = 0;

function mouseDragged() {
//    if (dragging) {
//     dx = lerp(dx, mouseX - prevMouseX, 0.1);
//     dy = lerp(dy, mouseY - prevMouseY, 0.1);

//     // Apply the movement to offsets and velocity for both X and Y
//     offsetX += dx;
//     offsetY += dy;
//     velocityX = dx * 0.01; // Adjust for inertia
//     velocityY = dy * 0.01;

//     prevMouseX = mouseX;
//     prevMouseY = mouseY;
//   }
}

function mouseReleased() {
  dragging = false;

}



//Bell shape body
function drawMainShape(i, angle, centerX, centerY, radius) {
  const x = centerX + radius * cos(radians(angle));
  const y = centerY + radius * sin(radians(angle)) + (200- noise(radians(angle), i / 100) * 400);
  
  strokeColor(i, angle);
  beginShape();
  curveVertex(centerX, centerY + 100);
  const noiseValues = getNoiseValues(radius, i, angle, x, y, centerX, centerY);
  curveVertex(centerX, centerY - 120 + noiseValues.noiseY);
  curveVertex(x, y / 25 + 400 + noiseValues.noiseY2);
  curveVertex(x + noiseValues.noiseX, y / 10 + 1000);
  endShape();
}

//Tentacles
function drawSecondaryShape(i, angle, centerX, centerY) {
  const radius2 = 20 * noise(i / 300) + 20;
  const x = centerX + radius2 * 3 * cos(radians(angle));
  const x2 = centerX + (radius2 / 2) * cos(radians(angle));
  const y = centerY + radius2 * sin(radians(angle));
  
  strokeColor(i, angle);
  strokeWeight(3);
  
  beginShape();
  const noiseValues = getNoiseValues(radius2, i, angle, x, y, centerX, centerY);
  
  curveVertex(x2, centerY + 200);
  curveVertex(x2, centerY - 40 + noiseValues.noiseY);
  curveVertex(x + noiseValues.noiseX2, y / 1.1 + 500 + noiseValues.noiseY2);
  curveVertex(x + noiseValues.noiseX, y / 10 + 1000);
  endShape();
}

//Color here
function strokeColor(i, angle) {
  const noiseStrokeR = noise(radians(angle));
  const noiseStrokeG = noise(radians(angle),i/30);
  const noiseStrokeB = noise(radians(angle),i/60);
  
  stroke(
    Math.round(50 * noiseStrokeR),
    Math.round(200 * noiseStrokeG),
    Math.round(220 * noiseStrokeB + 50),
    70  // Alpha value remains the same for transparency control
  );
}

function getNoiseValues(radius, i, angle, x, y, centerX, centerY) {
  const noiseY = noise(radius / 100) * 100;
  const noiseY2 = 50 - noise(radius / 100, i / 120) * 100;
  const noiseX = 500 - noise(radians(angle), i / 120) * 1100;
  const noiseX2 = 100 - noise(radians(360 - angle), i / 200) * 200;
  return { noiseY, noiseY2, noiseX, noiseX2 };
}
