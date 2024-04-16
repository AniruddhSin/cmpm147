// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
let cloudsGenerated = false;
let mountainsGenerated = false;
let sunSize = 100;

// Globals
let myInstance;
let canvasContainer;
var centerHorz, centerVert;

let cloudCircles = []; // Array to store cloud circles
let mountains = [];
let maxY;

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

// setup() function is called once when the program starts
function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  // resize canvas is the page is resized


  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();

  noiseSeed(millis());
}


function draw() {
  // Your draw code...
  // Background
  background(0, 0, 100); // Dark blue background

  // Calculate the y-coordinate for the horizon line (1/3 of canvas height)
  let horizonY = height / 3;
  drawSun();
  sunSize = 100*sin((2 * PI * millis()) / 1839.0)+150
  // Draw the horizon line with noise
  stroke(210, 180, 140); // Tan color
  strokeWeight(3); // Line thickness
  noFill(); // Prevent filling shapes
  beginShape();
  maxY = 0; // Initialize maxY to minimum possible value
  for (let x = 0; x < width; x += 5) { // Adjust the increment to control the frequency of noise
    let noiseValue = noise(x * 0.01); // Adjust the multiplier to control the amplitude of noise
    let yOffset = map(noiseValue, 0, 1, -30, 30); // Adjust the range to control the amplitude of noise
    let y = horizonY + yOffset;
    vertex(x, y);
    if (y > maxY) {
      maxY = y; // Update maxY if a higher y-coordinate is found
    }
  }
  endShape();

  // Draw tangent line at the lowest point
  stroke(210, 180, 140); // Tan color
  strokeWeight(3); // Line thickness
  line(0, maxY, width, maxY); // Draw the tangent line

  // Fill the area between the lines
  fill(210, 180, 140); // Same tan color
  beginShape();
  for (let x = 0; x < width; x += 5) { // Adjust the increment to control the frequency of noise
    let noiseValue = noise(x * 0.01); // Adjust the multiplier to control the amplitude of noise
    let yOffset = map(noiseValue, 0, 1, -30, 30); // Adjust the range to control the amplitude of noise
    let y = horizonY + yOffset;
    vertex(x, y);
  }
  vertex(width, maxY); // Connect to the end of the tangent line
  vertex(0, maxY); // Connect back to the start of the tangent line
  endShape(CLOSE); // Close the shape and fill it

  // Fill the area below the horizon line with white
  fill(255); // White color
  rect(0, maxY, width, height - maxY); // Fill the area below the horizontal line

  if (!cloudsGenerated) {
    generateClouds();
    cloudsGenerated = true; // Set the flag to true after clouds are generated
  }
  if(!mountainsGenerated){
    generateMountains()
    mountainsGenerated = true;
  }
  // Draw the clouds
  drawClouds();
  drawMountains();
}

function generateClouds() {
  let minX = 0; // Minimum x-coordinate for the cloud
  let maxX = width; // Maximum x-coordinate for the cloud
  let minY = height / 3; // Minimum y-coordinate for the clouds (starting from the horizon)
  let maxY = height; // Maximum y-coordinate for the clouds (bottom of the canvas)
  let numClouds = int(random(250, 500)); // Random number of clouds between 5 and 10

  for (let i = 0; i < numClouds; i++) {
    let cloudY = random(minY+35, maxY); // Adjust the range to avoid overlapping with tan area
    generateCloud(cloudY);
  }
}

function generateCloud(cloudY) {
  let maxRadius = 40; // Maximum radius for circles
  let cloudCenterX = random(maxRadius, width - maxRadius); // Random x-coordinate for the center of the cloud
  let minRadius = 15; // Minimum radius for circles
  let numCircles = 15; // Number of circles in the cloud
  let horizontalSpread = 2; // Scaling factor for horizontal spread
  let verticalThinness = 0.8; // Scaling factor for vertical thinness

  // Calculate the angle increment based on the number of circles
  let angleIncrement = TWO_PI / numCircles;

  // Generate semi-circles around the center of the cloud
  for (let i = 0; i < numCircles; i++) {
    // Calculate angle for current circle
    let angle = angleIncrement * i;
    // Calculate x-coordinate for current circle with horizontal spread
    let newX = cloudCenterX + cos(angle) * maxRadius * horizontalSpread;
    // Calculate y-coordinate for current circle
    let newY = cloudY;
    // Calculate radius for current circle with vertical thinness
    let newRadius = random(minRadius, maxRadius) * verticalThinness;
    // Randomly set some circles to have an outline
    let hasOutline = random() < 0.3; // 30% chance of having an outline
    cloudCircles.push({ x: newX, y: newY, radius: newRadius, hasOutline: hasOutline });
  }
}

function drawClouds() {
  for (let i = 0; i < cloudCircles.length; i++) {
    let circle = cloudCircles[i];
    fill(173, 216, 230); // Very light baby blue color for clouds
    noStroke(); // No outline for clouds by default
    if (circle.hasOutline) {
      stroke(255); // White outline for some circles
      strokeWeight(2); // Outline thickness
    }
    ellipse(circle.x, circle.y, circle.radius * 2, circle.radius * 2);
  }
}

function generateMountains() {
  let numMountains = int(random(5, 10)); // Random number of mountains between 5 and 10
  let minY = height * 2 / 3; // Minimum y-coordinate for mountains (starting from the latter third of the screen)
  let maxY = height; // Maximum y-coordinate for mountains (bottom of the canvas)

  for (let i = 0; i < numMountains; i++) {
    let mountainX = random(width); // Random x-coordinate for the mountain
    let mountainY = random(height*2 / 3, maxY); // Random y-coordinate for the mountain in the latter third of the screen near the bottom
    let mountainWidth = random(25,75); // Random width for the mountain (around 20% of the screen width)
    let mountainHeight = random(height * 0.05, height * 0.2); // Random height for the mountain (between 5% and 20% of the screen height)
    mountains.push({ x: mountainX, y: mountainY, width: mountainWidth, height: mountainHeight });
  }
}

function drawMountains() {
  for (let i = 0; i < mountains.length; i++) {
    let mountain = mountains[i];
    fill(139, 69, 19); // Brown color for mountains
    stroke(139, 69, 19); // Brown color for stroke
    strokeWeight(1); // Set stroke weight

    // Draw base of mountain
    beginShape();
    vertex(mountain.x - mountain.width, mountain.y);
    vertex(mountain.x, mountain.y - mountain.height);
    vertex(mountain.x + mountain.width, mountain.y);
    endShape(CLOSE);
  }
}

function drawSun() {
  fill(255, 255, 0); // Yellow color for the sun
  noStroke(); // No outline for the sun
  ellipse(250, 100, sunSize, sunSize); // Draw the sun at the top left corner
}

// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
    // code to run when mouse is pressed
}