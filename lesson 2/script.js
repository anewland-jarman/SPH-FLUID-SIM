var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");

canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 100;

var simMinWidth = 20.0;
var cScale = Math.min(canvas.width, canvas.height) / simMinWidth;
var simWidth = canvas.width / cScale;
var simHeight = canvas.height / cScale;

function cX(pos) {
  return pos.x*cScale;
}

function cY(pos) {
  return canvas.height - pos.y * cScale;
}
var height = 100;
var particles = []
const rows = canvas.width/height;
const columns = canvas.height/height;
const grid = [];
var gravity = {x:0 , y:-9.81};
var timestep = 1/30;
var elasticity = 1;
var cofr = 1;
class cell {
  constructor(x, y) {
    const Xc = x;
    const Yc  =y;
    this.cell = {x:Xc , y:Yc};
    this.height = height;
    this.velocity = {x : 2, y : 2};
    this.particles = []
    this.neighbors = []; // Array to store neighbor cell instances
  }
  drawsquare() {
    c.strokeRect(
      this.height * this.cell.x,
      this.height * this.cell.y,
      this.height,
      this.height
    );

    c.fillText(
      `(${this.cell.x}, ${this.cell.y})`,
      this.height * this.cell.x + 2,
      this.height * this.cell.y + 10
    );
  }


  // Function to compute and store neighbors (above, below, and sides)
  setNeighbors(grid) {
    const rows = grid.length;
    const columns = grid[0].length;
    const x = this.cell.x;
    const y = this.cell.y;

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
      this.neighbors.push(grid[x][y +  1]); // Right
    }
  }
solveIncompressibility() {
  if (
    this.neighbors[0] &&
    this.neighbors[1] &&
    this.neighbors[2] &&
    this.neighbors[3]
  ) {
    const deltaX = this.neighbors[1].velocity.x - this.neighbors[0].velocity.x;
    const deltaY = this.neighbors[2].velocity.y - this.neighbors[3].velocity.y;

    const divergence = deltaX + deltaY;
    const s = this.neighbors.length;

    this.neighbors[0].velocity.x += divergence / s;
    this.neighbors[1].velocity.x -= divergence / s;
    this.neighbors[2].velocity.y += divergence / s;
    this.neighbors[3].velocity.y -= divergence / s;
  }
}

}  


class Particle {
  constructor(){
  this.radius = 0.2;
  this.pos = {x : 0, y : 0};
  this.velocity = {x : 10, y : 10};
  this.mass =1000* 4/3 * Math.PI * (0.2)**3;
  this.timestep = 1/60;
  //this.impulse = {x : this.mass*this.vel.x, y : this.mass*this.vel.y};
  }
  simulate_particle(){
    this.velocity.x += gravity.x * this.timestep;
    this.velocity.y += gravity.y * this.timestep;
    this.pos.x += this.velocity.x * this.timestep;
    this.pos.y += this.velocity.y * this.timestep;
    if (this.pos.x - this.radius < 0.0) {
      this.pos.x = 0.0 + this.radius;
      this.velocity.x = -this.velocity.x;
    }
    if (this.pos.x + this.radius > simWidth) {
      this.pos.x = simWidth - this.radius;
      this.velocity.x = -this.velocity.x ;
    }
    if (this.pos.y - this.radius < 0.0) {
      this.pos.y = 0.0 + this.radius;
      this.velocity.y = -this.velocity.y;
    }
    if (this.pos.y + this.radius> simHeight){
      this.pos.y = simHeight - this.radius;
      this.velocity.y = -this.velocity.y;
    }
  }
  particle_to_cell() {
    this.Xcell = Math.floor(cX(this.pos)/height);
    this.Ycell = Math.floor(cY(this.pos)/height);
    this.dx = this.pos.x - this.Xcell * height;
    this.dy = this.pos.y - this.Ycell * height;
    this.pic = grid[this.Xcell][this.Ycell];// Use "this" to access Xcell and Ycell
    this.pic.cell = {x:this.Xcell, y:this.Ycell};
    this.pic.velocity.x =0
    this.pic.velocity.y = 0
    this.pic.velocity.x += this.velocity.x;
    this.pic.velocity.y += this.velocity.y;
    //console.log(this.Ycell,this.pos.y,height,this.pic);

  }



};

function generate_grid(){
  for (let i = 0; i < rows; i++) {
    grid[i] = [];
    for (let j = 0; j < columns; j++) {
      var cell1 = new cell(i,j);
      grid[i][j] = cell1;
      //cell1.drawsquare();
    }
  }
}


function draw(){
  c.clearRect(0, 0, canvas.width, canvas.height);

  c.fillStyle = "#FF0000";
  for (let i=0; i < particles.length; i++){
    c.beginPath();	
    c.arc(cX(particles[i].pos), cY(particles[i].pos), cScale * particles[i].radius, 0.0, 2.0 * Math.PI); 
    c.closePath();
    c.fill();		
  };		
};

function physics(){
  for (let i=0; i < particles.length; i++){

    particles[i].particle_to_cell();
    particles[i].pic.setNeighbors(grid);
    particles[i].pic.solveIncompressibility();
    particles[i].simulate_particle();
  }
  

}

for (var i = 0; i < 10; i++) {
  for (var j = 0; j < 10; j++) {
    var p1 = new Particle(); // Create a new particle
    // Adjust the position of the particle to make them more tightly packed
    p1.pos = { x: i * 0.2, y: j * 0.2 }; // You can adjust the factor (e.g., 10) as needed
    particles.push(p1);
  }
}



generate_grid();
function simulate(){
  physics();
  draw();
  requestAnimationFrame(simulate);
}
simulate();
