//https://stackoverflow.com/questions/74452866/how-preview-a-html-file-github-codespaces
var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");

canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 100;

var simMinWidth = 20.0;
var cScale = Math.min(canvas.width, canvas.height) / simMinWidth;
var simWidth = canvas.width / cScale;
var simHeight = canvas.height / cScale;

gravity = new Vector(0,0)
timestep = 1/30;
function cX(pos) {
  return pos.x*cScale;
}

function cY(pos) {
  return canvas.height - pos.y * cScale;
}
var num_particles = 100;
var particles = [];
class Particle {
  constructor(x,y){
    this.radius = 0.2;
    this.position = new Vector(x,y);
    this.velocity = new Vector(0,0);
  }
}
radius = 0.2;
collisionDamping = 1;
particleSpacing = 0.1;
smoothingRadius = 1;

function smoothingKernel(r,h){
  let smoothingvalue = 0.0
  if (r>=0 && r<=h){
    smoothingvalue = 1-1.5*(r/h)**2 + 0.75*(r/h)**3
  }
  else if (r>=h && r<=2*h){
    smoothingvalue = 0.25*(2-r/h)**3
  }
  return smoothingvalue
}

function calculateDensity(samplepoint){
  mass = 1;
  density = 0;
  for (let i = 0; i < num_particles; i++){
    dist = samplepoint.distanceFrom(particles[i].position);
    density += mass*smoothingKernel(dist,smoothingRadius);

  }
  console.log(density);
}
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
console.log("by");
setupParticlesGrid();
calculateDensity(new Vector(simWidth/2,simHeight/2));

function simulate(){
  physics();
  draw();
  requestAnimationFrame(simulate);
}
simulate();
