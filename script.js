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
var radius = 0.2
var height = 2*radius;
var particles = []
const rows = simWidth/height;
const columns = simHeight/height;
const grid = [];
var gravity = {x:0 , y:-9.81};
var timestep = 1/30;
var elasticity = 1;
var cofr = 1;



class Cell {
  constructor(x, y) {
    const Xc = x;
    const Yc  =y;
    this.cell = {x:Xc , y:Yc};
    this.height = height;
    this.particles = [];
    this.neighbors = []; 
  }

}  


class Particle {
  constructor(){
  this.radius = radius;
  this.pos = {x : 0, y : 0};
  this.velocity = {x : 10, y : 10};
  this.mass =1000* 4/3 * Math.PI * (0.2)**3;
  this.timestep = 1/60;
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

};




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

function generategrid(){
    for (let i = 0; i < rows; i++){
        for (let j = 0; j < columns; j++){
            grid.push(new Cell);
        }
    }
}
function sortparticleindices(){
    linkedlist = [];
    for (let i = 0 ; i<particles.length; i++){
        
    }
}
function physics(){
  

}



function simulate(){
  physics();
  draw();
  requestAnimationFrame(simulate);
}


console.log(grid);
//ssimulate();