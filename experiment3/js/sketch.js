// sketch.js - purpose and description here
// Author: Aniruddh Sindhu
// Date: 4/23/24

let seed = 0;
let tilesetImage;
let currentGrid = [];
let numRows, numCols;



var myp5 = new p5((dungeon) => {
  dungeon.preload = () => {
    tilesetImage = dungeon.loadImage(
      "https://cdn.glitch.com/25101045-29e2-407a-894c-e0243cd8c7c6%2FtilesetP8.png?v=1611654020438"
    );
  }

  function reseed() {
    seed = (seed | 0) + 1109;
    dungeon.randomSeed(seed);
    dungeon.noiseSeed(seed);
    dungeon.select("#seedReport").html("seed " + seed);
    regenerateGrid();
  }
  
  function regenerateGrid() {
    dungeon.select("#asciiBox").value(gridToString(generateGrid(numCols, numRows)));
    reparseGrid();
  }
  
  function reparseGrid() {
    currentGrid = stringToGrid(dungeon.select("#asciiBox").value());
  }
  
  function gridToString(grid) {
    let rows = [];
    for (let i = 0; i < grid.length; i++) {
      rows.push(grid[i].join(""));
    }
    return rows.join("\n");
  }
  
  function stringToGrid(str) {
    let grid = [];
    let lines = str.split("\n");
    for (let i = 0; i < lines.length; i++) {
      let row = [];
      let chars = lines[i].split("");
      for (let j = 0; j < chars.length; j++) {
        row.push(chars[j]);
      }
      grid.push(row);
    }
    return grid;
  }
  
  dungeon.setup = () =>{
    numCols = dungeon.select("#asciiBox").attribute("rows") | 0;
    numRows = dungeon.select("#asciiBox").attribute("cols") | 0;
  
    dungeon.createCanvas(16 * numCols, 16 * numRows).parent("canvasContainer");
    dungeon.select("canvas").elt.getContext("2d").imageSmoothingEnabled = false;
  
    dungeon.select("#reseedButton").mousePressed(reseed);
    dungeon.select("#asciiBox").input(reparseGrid);
  
    reseed();
  }
  
  
  dungeon.draw = () => {
    dungeon.randomSeed(seed);
    drawGrid(currentGrid);
  }
  
  function placeTile(i, j, ti, tj) {
    dungeon.image(tilesetImage, 16 * j, 16 * i, 16, 16, 8 * ti, 8 * tj, 8, 8);
  }



  function generateGrid(numCols, numRows) {
    let grid = [];
    
    // Initialize grid with grass
    for (let i = 0; i < numRows; i++) {
      let row = [];
      for (let j = 0; j < numCols; j++) {
        row.push("_");
      }
      grid.push(row);
    }
  
    // Generate first room
    let roomWidth1, roomHeight1, roomX1, roomY1;
    do {
      roomWidth1 = dungeon.floor(dungeon.random(3, 9)); // Random width between 2 and 7
      roomHeight1 = dungeon.floor(dungeon.random(3, 9)); // Random height between 2 and 7
      roomX1 = dungeon.max(0, dungeon.floor(dungeon.random(numCols - roomWidth1))); // Random x-coordinate within grid bounds, ensure non-negative
      roomY1 = dungeon.max(0, dungeon.floor(dungeon.random(numRows - roomHeight1))); // Random y-coordinate within grid bounds, ensure non-negative
    } while (roomX1 + roomWidth1 > numCols || roomY1 + roomHeight1 > numRows);
  
    // Place the first room in the grid
    for (let i = roomY1; i < roomY1 + roomHeight1; i++) {
      for (let j = roomX1; j < roomX1 + roomWidth1; j++) {
        grid[i][j] = "|";
      }
    }
  
    // Generate second room
    let roomWidth2, roomHeight2, roomX2, roomY2;
    do {
      roomWidth2 = dungeon.floor(dungeon.random(3, 9)); // Random width between 2 and 7
      roomHeight2 = dungeon.floor(dungeon.random(3, 9)); // Random height between 2 and 7
      roomX2 = dungeon.max(0, dungeon.floor(dungeon.random(numCols - roomWidth2))); // Random x-coordinate within grid bounds, ensure non-negative
      roomY2 = dungeon.max(0, dungeon.floor(dungeon.random(numRows - roomHeight2))); // Random y-coordinate within grid bounds, ensure non-negative
    } while (roomX2 + roomWidth2 > numCols || roomY2 + roomHeight2 > numRows || (roomX2 >= roomX1 && roomX2 < roomX1 + roomWidth1) || (roomX1 >= roomX2 && roomX1 < roomX2 + roomWidth2) || (roomY2 >= roomY1 && roomY2 < roomY1 + roomHeight1) || (roomY1 >= roomY2 && roomY1 < roomY2 + roomHeight2));
  
    // Place the second room in the grid
    for (let i = roomY2; i < roomY2 + roomHeight2; i++) {
      for (let j = roomX2; j < roomX2 + roomWidth2; j++) {
        grid[i][j] = "|";
      }
    }
    
    // Determine which room to place the chest in (either first or second room)
    let chestRoom = dungeon.random() < 0.5 ? 1 : 2;
    let chestX, chestY;
    
    // Place the chest in the selected room at a random coordinate
    if (chestRoom === 1) {
      chestX = roomX1 + dungeon.floor(dungeon.random(roomWidth1-2))+1; // Random x-coordinate inside the first room
      chestY = roomY1 + dungeon.floor(dungeon.random(roomHeight1-2))+1; // Random y-coordinate inside the first room
    } else {
      chestX = roomX2 + dungeon.floor(dungeon.random(roomWidth2-2))+1; // Random x-coordinate inside the second room
      chestY = roomY2 + dungeon.floor(dungeon.random(roomHeight2-2))+1; // Random y-coordinate inside the second room
    }
    
    grid[chestY][chestX] = "c"; // Place the chest at the selected coordinate
  
    // Find closest points between the rooms
    let closestX1 = roomX1 + dungeon.floor(roomWidth1 / 2);
    let closestY1 = roomY1 + dungeon.floor(roomHeight1 / 2);
    let closestX2 = roomX2 + dungeon.floor(roomWidth2 / 2);
    let closestY2 = roomY2 + dungeon.floor(roomHeight2 / 2);
  
    // Generate corridor between the closest points
    while (closestX1 !== closestX2 || closestY1 !== closestY2) {
      if (closestX1 !== closestX2) {
        closestX1 += closestX1 < closestX2 ? 1 : -1;
        grid[closestY1][closestX1] = "|";
        grid[closestY1 + 1][closestX1] = "|"; // Place another tile below for width 2
      } else {
        closestY1 += closestY1 < closestY2 ? 1 : -1;
        grid[closestY1][closestX1] = "|";
        grid[closestY1][closestX1 + 1] = "|"; // Place another tile to the right for width 2
      }
    }
    
    return grid;
  }
  
  
  // if code matches and its gridCode is NOT 15, then draw with context
  function drawGrid(grid) {
    dungeon.background(128);
    let updateFreq = dungeon.millis() / 1000;
  
    for(let i = 0; i < grid.length; i++) {
      for(let j = 0; j < grid[i].length; j++) {
        //placeTile(i,j,20,22)    // grid is viewed in x,y coordinates, not i,j grid coordinates
        if (grid[i][j] == '_') {
          placeTile(i, j, (3 * dungeon.pow(dungeon.noise(updateFreq / 10, i, j / 4 + updateFreq), 0.5)) | 0 +1, (2 * dungeon.pow(dungeon.noise(updateFreq / 10, i, j / 4 + updateFreq), 0.8)) | 0 + 19);
        }
        if (grid[i][j] == '|') {
          placeTile(i, j, (dungeon.floor(dungeon.random(4))), 9);
          if (gridCode(grid, i, j, '|') != 15 && gridCode(grid, i, j, '|') != 0){
            drawContext(grid, i, j, '|', 0, 3)
          }
        }
        if (grid[i][j] == 'c'){
          placeTile(i,j,dungeon.random(6)|0,dungeon.random(3)|0+28)
        }
      }
    }
    //placeTile(i, j, (3 * pow(noise(t / 10, i, j / 4 + t), 2)) | 0, 14);
  }
  
  function gridCheck(grid, i, j, target){
    if (i < grid.length && i >= 0 && j >= 0 && j < grid[i].length && (grid[i][j] == target || grid[i][j] == 'c')){
      return true
    }
    return false
  }
  
  
  // Function to form a 4-bit code using gridCheck on the north/south/east/west neighbors
  function gridCode(grid, i, j, target) {
    let northBit = gridCheck(grid, i - 1, j, target) ? 1 : 0;
    let southBit = gridCheck(grid, i + 1, j, target) ? 1 : 0;
    let eastBit = gridCheck(grid, i, j + 1, target) ? 1 : 0;
    let westBit = gridCheck(grid, i, j - 1, target) ? 1 : 0;
    
    return (northBit << 0) + (southBit << 1) + (eastBit << 2) + (westBit << 3);
  }
  
  // Function to draw context based on code and target
  function drawContext(grid, i, j, target, ti, tj) {
    let code = gridCode(grid, i, j, target);    // code lets us know which surrounding tiles match the target
    const [tiOffset, tjOffset] = lookup[code];
    placeTile(i, j, ti + tiOffset, tj + tjOffset);
  }
  
  // Define the lookup array with hand-typed tile offset pairs
  // i,j is row#,col# so going "up" means you reduce i and etc.
  // dungeon will use (9,0) as base for auto tiling
  const lookup = [
    [0, 0], // Code 0: No offset
    [5, 2], // Code 1: north neighbor matches
    [5, 0], // Code 2: south
    [3, 6], // Code 3: north south
    [4, 1], // Code 4: east
    [4, 2], // Code 5: east north
    [4, 0], // Code 6: east south
    [4, 1], // Code 7: east north south
    [6, 1], // Code 8: west
    [6, 2], // Code 9: west north
    [6, 0], // Code 10: west south
    [6, 1], // Code 11: west north south
    [3, 6], // Code 12: west east
    [5, 2], // Code 13: west east north
    [5, 0], // Code 14: west east south
    [0, 0] // Code 15: west east south north
  ];

}, 'p5sketch')




let seed2 = 0;
let tilesetImage2;
let currentGrid2 = [];
let numRows2, numCols2;

var myp5 = new p5((overworld) => {
  overworld.preload = () => {
    tilesetImage2 = overworld.loadImage(
      "https://cdn.glitch.com/25101045-29e2-407a-894c-e0243cd8c7c6%2FtilesetP8.png?v=1611654020438"
    );
  }

  function reseed2() {
    seed2 = (seed2 | 0) + 1109;
    overworld.random(seed2);
    overworld.noiseSeed(seed2);
    overworld.select("#seedReport2").html("seed " + seed2);
    regenerateGrid2();
  }
  
  function regenerateGrid2() {
    overworld.select("#asciiBox2").value(gridToString2(generateGrid(numCols2, numRows2)));
    reparseGrid2();
  }
  
  function reparseGrid2() {
    currentGrid2 = stringToGrid2(overworld.select("#asciiBox2").value());
  }
  
  function gridToString2(grid) {
    let rows = [];
    for (let i = 0; i < grid.length; i++) {
      rows.push(grid[i].join(""));
    }
    return rows.join("\n");
  }
  
  function stringToGrid2(str) {
    let grid = [];
    let lines = str.split("\n");
    for (let i = 0; i < lines.length; i++) {
      let row = [];
      let chars = lines[i].split("");
      for (let j = 0; j < chars.length; j++) {
        row.push(chars[j]);
      }
      grid.push(row);
    }
    return grid;
  }
  
  overworld.setup = () =>{
    numCols2 = overworld.select("#asciiBox2").attribute("rows") | 0;
    numRows2 = overworld.select("#asciiBox2").attribute("cols") | 0;
  
    overworld.createCanvas(16 * numCols2, 16 * numRows2).parent("canvasContainer2");
    overworld.select("canvas").elt.getContext("2d").imageSmoothingEnabled = false;
  
    overworld.select("#reseedButton2").mousePressed(reseed2);
    overworld.select("#asciiBox2").input(reparseGrid2);
  
    reseed2();
  }
  
  
  overworld.draw = () => {
    overworld.randomSeed(seed2);
    drawGrid(currentGrid2);
  }
  
  function placeTile(i, j, ti, tj) {
    overworld.image(tilesetImage, 16 * j, 16 * i, 16, 16, 8 * ti, 8 * tj, 8, 8);
  }




  function generateGrid(numCols, numRows2) {
    let grid = [];
    for (let i = 0; i < numRows2; i++) {
      let row = [];
      for (let j = 0; j < numCols2; j++) {
        // Determine if it's grass or dirt based on noise
        let isGrass = overworld.noise(i / 10, j / 10) < 0.4; // Adjust noise scale and threshold for grass
        let isDirt = !isGrass;  // Dirt is whatever is not grass
        
        // Assign symbols based on conditions
        if (isDirt) {
          row.push(":"); // Dirt
        } else {
          row.push("_"); // Grass
        }
      }
      grid.push(row);
    }
    
    // Find two random points in the dirt area
    let point1 = { x: overworld.floor(overworld.random(numCols2)), y: overworld.floor(overworld.random(numRows2)) };
    let point2 = { x: overworld.floor(overworld.random(numCols2)), y: overworld.floor(overworld.random(numRows2)) };
    
    // Ensure the two points are different
    while (point1.x === point2.x && point1.y === point2.y) {
      point2 = { x: overworld.floor(overworld.random(numCols2)), y: overworld.floor(overworld.random(numRows2)) };
    }
    
    // Ensure point1 is the leftmost point
    if (point1.x > point2.x) {
      let temp = point1;
      point1 = point2;
      point2 = temp;
    }
    
    // Generate water between the two points
    for (let i = point1.y; i <= point2.y; i++) {
      for (let j = point1.x; j <= point2.x; j++) {
        // Check if the tile is adjacent to grass
        let adjacentToGrass = 
          (grid[i - 1] && grid[i - 1][j] === "_") || // Check north
          (grid[i + 1] && grid[i + 1][j] === "_") || // Check south
          (grid[i][j - 1] === "_") || // Check west
          (grid[i][j + 1] === "_");   // Check east
        
        if (!adjacentToGrass) {
          grid[i][j] = "w"; // Water
        }
      }
    }
    
    return grid;
  }
  
  function drawGrid(grid) {
    overworld.background(128);
    let updateFreq = overworld.millis() / 1000
    for(let i = 0; i < grid.length; i++) {
      for(let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] == '_') {
          placeTile(i, j, (overworld.floor(overworld.random(4))), 0);
        }
        if (grid[i][j] == ':') {
          placeTile(i, j, (overworld.floor(overworld.random(4))), 3);
          if (gridCode(grid, i, j, ':') != 15 && gridCode(grid, i, j, ':') != 0){
            drawContextDirt(grid, i, j, ':', 0, 0)
          }
        }
        if (grid[i][j] == 'w') {
          placeTile(i, j, (4 * overworld.pow(overworld.noise(updateFreq / 10, i, j / 4 + updateFreq), 0.75)) | 0, 14);
          if (gridCode(grid, i, j, 'w') != 15 && gridCode(grid, i, j, 'w') != 0){
            drawContextDirt(grid, i, j, 'w', 5, 3)
          }
        }
      }
    }
  }
  
  function gridCheck(grid, i, j, target){
    if (i < grid.length && i >= 0 && j >= 0 && j < grid[i].length && (grid[i][j] == target || grid[i][j] == 'w')){
      return true
    }
    return false
  }
  
  
  // Function to form a 4-bit code using gridCheck on the north/south/east/west neighbors
  function gridCode(grid, i, j, target) {
    let northBit = gridCheck(grid, i - 1, j, target) ? 1 : 0;
    let southBit = gridCheck(grid, i + 1, j, target) ? 1 : 0;
    let eastBit = gridCheck(grid, i, j + 1, target) ? 1 : 0;
    let westBit = gridCheck(grid, i, j - 1, target) ? 1 : 0;
    
    return (northBit << 0) + (southBit << 1) + (eastBit << 2) + (westBit << 3);
  }
  
  // Function to draw context based on code and target
  function drawContextDirt(grid, i, j, target, ti, tj) {
    let code = gridCode(grid, i, j, target);    // code lets us know which surrounding tiles match the target
    const [tiOffset, tjOffset] = lookup[code];
    placeTile(i, j, ti + tiOffset, tj + tjOffset);
  }
  
  // Define the lookup array with hand-typed tile offset pairs
  // i,j is row#,col# so going "up" means you reduce i and etc.
  // dungeon will use (9,0) as base for auto tiling
  const lookup = [
    [0, 0], // Code 0: No offset
    [5, 2], // Code 1: north neighbor matches
    [5, 0], // Code 2: south
    [3, 3], // Code 3: north south
    [4, 1], // Code 4: east
    [4, 2], // Code 5: east north
    [4, 0], // Code 6: east south
    [4, 1], // Code 7: east north south
    [6, 1], // Code 8: west
    [6, 2], // Code 9: west north
    [6, 0], // Code 10: west south
    [6, 1], // Code 11: west north south
    [3, 3], // Code 12: west east
    [5, 2], // Code 13: west east north
    [5, 0], // Code 14: west east south
    [0, 0] // Code 15: west east south north
  ];
}, 'p5sketch')