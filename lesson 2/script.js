var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");

canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 100;

var simMinWidth = 20.0;
var cScale = Math.min(canvas.width, canvas.height) / simMinWidth;
var simWidth = canvas.width / cScale;
var simHeight = canvas.height / cScale;
var height = 10;

class cell {
  constructor(x, y) {
    this.Xcell = x;
    this.Ycell = y;
    this.height = 10;
    this.velocity = {x : 0, y : 0};
    this.neighbors = []; // Array to store neighbor cell instances
  }
  drawsquare() {
    c.strokeRect(
      this.height * this.Xcell,
      this.height * this.Ycell,
      this.height,
      this.height
    );
  }
  // Function to compute and store neighbors (above, below, and sides)
  setNeighbors(grid) {
    const rows = grid.length;
    const columns = grid[0].length;
    const x = this.Xcell;
    const y = this.Ycell;

    // Check and add neighbors above, below, and to the sides
    if (x > 0) {
      this.neighbors.push(grid[x - 1][y]); // Above
    }
    if (x < rows - 1) {
      this.neighbors.push(grid[x + 1][y]); // Below
    }
    if (y > 0) {
      this.neighbors.push(grid[x][y - 1]); // Left
    }
    if (y < columns - 1) {
      this.neighbors.push(grid[x][y + 1]); // Right
    }
  }
  solveIncompressibility() {
    const deltaX = this.neighbors[1].velocity.x - this.neighbors[0].velocity.x;
    const deltaY = this.neighbors[2].velocity.y - this.neighbors[3].velocity.y;
  

    const divergence = deltaX + deltaY;
    const s = this.neighbors.length();
  
    this.neighbors[0].velocity.x += divergence/s;
    this.neighbors[1].velocity.x -= divergence/s;
    this.neighbors[2].velocity.y += divergence/s;
    this.neighbors[3].velocity.y -= divergence/s;
  }
}  

class Particle {
  constructor(){
  this.radius = 0.2;
  this.pos = {x : 0, y : 0};
  this.vel = {x : 10.0, y : 15.0};
  this.mass =1000* 4/3 * Math.PI * (0.2)**3;
  this.impulse = {x : this.mass*this.vel.x, y : this.mass*this.vel.y};
  }
  simulate_particle(){
    this.vel.x += gravity.x * timeStep;
    this.vel.y += gravity.y * timeStep;
    this.pos.x += this.vel.x * timeStep;
    this.pos.y += this.vel.y * timeStep;
    if (this.pos.x - this.radius < 0.0) {
      this.pos.x = 0.0 + this.radius;
      this.vel.x = -elasticity*this.vel.x;
    }
    if (this.pos.x + this.radius > simWidth) {
      this.pos.x = simWidth - this.radius;
      this.vel.x = -elasticity*this.vel.x ;
    }
    if (this.pos.y - this.radius < 0.0) {
      this.pos.y = 0.0 + this.radius;
      this.vel.y = -elasticity*this.vel.y;
    }
    if (this.pos.y + this.radius> simHeight){
      this.pos.y = simHeight - this.radius;
      this.vel.y = -elasticity*this.vel.y;
    }
  }
  particle_to_cell(){
    this.Xcell = Math.round(this.pos.x/height);
    this.Ycell = Math.round(this.pos.y/height);
    dx = this.pos.x - this.Xcell*this.height;
    dy = this.pos.y - this.Ycell*this.height;
    this.pic = grid[x][y];
    this.pic.velocity = this.velocity;
  }

};
const rows = canvas.width / height;
const columns = canvas.height / height;

const grid = [];

for (let i = 0; i < rows; i++) {
  grid[i] = [];
  for (let j = 0; j < columns; j++) {
    var cell1 = new cell(i, j);
    grid[i][j] = cell1;
    cell1.setNeighbors(grid); // Compute and store neighbors (above, below, and sides)
    cell1.drawsquare();
  }
}

