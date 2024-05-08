/* exported getInspirations, initDesign, renderDesign, mutateDesign */

let factor = 32

function getInspirations() {
  return [
    {
      name: "Elden Ring Logo", 
      assetUrl: "img/elden-ring-logo.png",
      credit: "Elden Ring, FromSoftware, 2022"
    },
    {
      name: "Helluva Boss Fanart", 
      assetUrl: "img/another-stolas.jpg",
      credit: "https://wall.alphacoders.com/big.php?i=1207135"
    },
    {
      name: "Tetons and the Snake", 
      assetUrl: "img/the-tetons-and-the-snake.jpg",
      credit: "The Tetons and The Snake River, Ansel Adams, 1942"
    },
  ];
}

function initDesign(inspiration) {
    // Thank You Wes Modes for this code snippet to fit the image into the canvas container
    // set the canvas size based on the container
    let canvasContainer = $('.image-container'); // Select the container using jQuery
    let canvasWidth = canvasContainer.width(); // Get the width of the container
    let aspectRatio = inspiration.image.height / inspiration.image.width;
    let canvasHeight = canvasWidth * aspectRatio; // Calculate the height based on the aspect ratio
    //resizeCanvas(canvasWidth, canvasHeight);
    resizeCanvas(inspiration.image.width, inspiration.image.height);
    $(".caption").text(inspiration.credit); // Set the caption text
  
    // add the original image to #original
    const imgHTML = `<img src="${inspiration.assetUrl}" style="width:${inspiration.image.width}px;">`
    $('#original').empty();
    $('#original').append(imgHTML);
  
  let design = {
    bg: 128,
    fg: []
  }
  
  for(let i = 0; i < 1000; i++) {
    design.fg.push({x: random(width),
                    y: random(height),
                    w: random(width/factor),
                    h: random(height/factor),
                    fill: random(255)})
  }
  return design;
}

function renderDesign(design, inspiration) {
  noStroke();
  for(let quad of design.fg) {
    let baseColor = inspiration.image.get(quad.x,quad.y)
    fill(baseColor,quad.fill)
    ellipse(quad.x-quad.w/2, quad.y-quad.h/2, quad.w, quad.h);
  }
}

function mutateDesign(design, inspiration, rate) {
  //rate = 0.01
  design.bg = mut(design.bg, 0, 255, rate);
  for(let quad of design.fg) {
    quad.x = mut(quad.x, 0, width, rate);
    quad.y = mut(quad.y, 0, height, rate);
    quad.w = mut(quad.w, 0, width/factor, rate);
    quad.h = mut(quad.h, 0, height/factor, rate);
    quad.fill = mut(quad.fill,0,255,rate);
  }
}

function mut(num, min, max, rate) {
  return constrain(randomGaussian(num, (rate * (max - min)) / 10), min, max);
}
