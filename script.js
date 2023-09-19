
// canvas setup -------------------------------------------------------

var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");

canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 100;

var simMinWidth = 20.0;
var cScale = Math.min(canvas.width, canvas.height) / simMinWidth;
var simWidth = canvas.width / cScale;
var simHeight = canvas.height / cScale;

function cX(pos) {
  return pos.x * cScale;
}

function cY(pos) {
  return canvas.height - pos.y * cScale;
}

// scene -------------------------------------------------------

var gravity = { x: 0, y: -9.81};
var timeStep = 1.0 / 60;

class Ball {
  constructor(){
  this.radius = 0.2;
  this.pos = {x : 0.2, y : 0.2};
  this.vel = {x : 10.0, y : 15.0};
  }
  simulate_ball(){
    this.vel.x += gravity.x * timeStep;
    this.vel.y += gravity.y * timeStep;
    this.pos.x += this.vel.x * timeStep;
    this.pos.y += this.vel.y * timeStep;
    if (this.pos.x < 0.0) {
      this.pos.x = 0.0;
      this.vel.x = -this.vel.x;
    }
    if (this.pos.x > simWidth) {
      this.pos.x = simWidth;
      this.vel.x = -this.vel.x ;
    }
    if (this.pos.y < 0.0) {
      this.pos.y = 0.0;
      this.vel.y = -this.vel.y;
    }
    if (this.pos.y > simHeight){
      this.pos.y = simHeight;
      this.vel.y = -this.vel.y;
    }
  }

};

num_of_particles = 1;
const particles = [];
for (let i = 0; i < num_of_particles; i++){
  var particle = new Ball();
  particle.pos.x += Math.random()*simWidth;
  particle.pos.y += Math.random()*simHeight;
  particles.push(particle);
}
// drawing -------------------------------------------------------

function draw() {
  c.clearRect(0, 0, canvas.width, canvas.height);

  c.fillStyle = "#FF0000";

 
  for (let i=0; i < particles.length; i++){
    c.beginPath();	
    c.arc(cX(particles[i].pos), cY(particles[i].pos), cScale * particles[i].radius, 0.0, 2.0 * Math.PI); 
    c.closePath();
    c.fill();		
  };		
	
}

// simulation ----------------------------------------------------

function simulate() {

  for (let i=0; i < particles.length; i++){
    particles[i].simulate_ball();
  };
}


// make browser to call us repeatedly -----------------------------------

function update() {
  simulate();
  draw();
  requestAnimationFrame(update);
};

update();
