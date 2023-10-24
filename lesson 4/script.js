//https://stackoverflow.com/questions/74452866/how-preview-a-html-file-github-codespaces
var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");

canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 100;

var simMinWidth = 20.0;
var cScale = Math.min(canvas.width, canvas.height) / simMinWidth;
var simWidth = canvas.width / cScale;
var simHeight = canvas.height / cScale;

var gravity = new Vector(0,-9.81)
var timestep = 1/30;
var restdensity = 1000;
var restpressure = 1000;
var k=5;
function cX(pos) {
  return pos.x*cScale;
}

function cY(pos) {
  return canvas.height - pos.y * cScale;
}
var num_particles = 9;
var particles = [];
var radius = 0.2;
class Particle {
  constructor(x,y){
    this.radius = radius;
    this.position = new Vector(x,y);
    this.velocity = new Vector(0,0);
    this.density = 0;
    this.smoothingLength = 2 * this.radius;
  }
  updatePressure(){
    this.pressure = (restpressure*(this.density/restdensity)**k-1);
  }
}

collisionDamping = 1;
particleSpacing = 0.1;



function setupParticlesGrid() {
  particlesPerRow = Math.ceil(Math.sqrt(num_particles));
  particlesPerCol = Math.ceil(num_particles / particlesPerRow);
  spacing = radius * 2 + particleSpacing;
  let i = 0;

  for (let row = 0; row < particlesPerRow; row++) {
    for (let col = 0; col < particlesPerCol; col++) {
      x = col * spacing + simWidth / 2;
      y = row * spacing + simHeight / 2;
      var particle = new Particle(x,y);
      particles[i] = particle;
      particles[i].velocity = new Vector(0, 0);
      i++;
    }
  }
}
function setupParticlesRandom(){
  for (let i =0 ; i < num_particles; i++){
    x = simWidth*Math.random();
    y= simHeight*Math.random();
    var particle = new Particle(x,y);
    particles[i] = particle;
    particles[i].velocity = new Vector(0, 0);
  }
}




function draw(){
  c.clearRect(0, 0, canvas.width, canvas.height);

  c.fillStyle = "#005EB8";
  for (let i=0; i < num_particles; i++){
    c.beginPath();	
    c.arc(cX(particles[i].position), cY(particles[i].position), cScale *radius, 0.0, 2.0 * Math.PI); 
    c.closePath();
    c.fill();		
  };		
};

function physics(){
  for (let i = 0; i < num_particles; i ++){    
    particles[i].velocity.x +=  gravity.x * timestep;
    particles[i].velocity.y +=  gravity.y * timestep;
    particles[i].position.x  += particles[i].velocity.x * timestep ;
    particles[i].position.y  += particles[i].velocity.y * timestep;
    if (particles[i].position.x + this.radius > simWidth) {
      particles[i].position.x = simWidth - this.radius;
      particles[i].velocity.x = -collisionDamping*particles[i].velocity.x ;
    }
    if (particles[i].position.y - this.radius < 0.0) {
      particles[i].position.y = 0.0 + this.radius;
      particles[i].velocity.y = -collisionDamping*particles[i].velocity.y;
    }
    if (particles[i].position.y + this.radius> simHeight){
      particles[i].position.y = simHeight - this.radius;
      particles[i].velocity.y = -collisionDamping*particles[i].velocity.y;
    }
  }
}


setupParticlesGrid();

function simulate(){

  physics();
  draw();
  requestAnimationFrame(simulate);
}
simulate();
