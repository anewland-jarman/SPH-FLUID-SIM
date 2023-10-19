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
num_particles = 100;
positions = [];
velocitys = [];

radius = 0.2;
collisionDamping = 1;
particleSpacing = 0.1;
smoothingRadius = 10;

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
function setupParticlesGrid() {
  particlesPerRow = Math.ceil(Math.sqrt(num_particles));
  particlesPerCol = Math.ceil(num_particles / particlesPerRow);
  spacing = radius * 2 + particleSpacing;
  let i = 0;

  for (let row = 0; row < particlesPerRow; row++) {
    for (let col = 0; col < particlesPerCol; col++) {
      x = col * spacing + simHeight / 2;
      y = row * spacing + simWidth / 2;
      positions[i] = new Vector(x, y);
      velocitys[i] = new Vector(0, 0);
      i++;
    }
  }
}
function setupParticlesRandom(){
  for (let i =0 ; i < num_particles; i++){
    x = simWidth*Math.random();
    y= simHeight*Math.random();
    positions[i] = new Vector(x, y);
    velocitys[i] = new Vector(0, 0);
  }
}




function draw(){
  c.clearRect(0, 0, canvas.width, canvas.height);

  c.fillStyle = "#005EB8";
  for (let i=0; i < num_particles; i++){
    c.beginPath();	
    c.arc(cX(positions[i]), cY(positions[i]), cScale *radius, 0.0, 2.0 * Math.PI); 
    c.closePath();
    c.fill();		
  };		
};

function physics(){
  for (let i = 0; i < num_particles; i ++){
    velocitys[i].x +=  gravity.x * timestep;
    velocitys[i].y +=  gravity.y * timestep;
    positions[i].x  += velocitys[i].x * timestep ;
    positions[i].y  += velocitys[i].y * timestep;
    if (positions[i].x + this.radius > simWidth) {
      positions[i].x = simWidth - this.radius;
      velocitys[i].x = -collisionDamping*velocitys[i].x ;
    }
    if (positions[i].y - this.radius < 0.0) {
      positions[i].y = 0.0 + this.radius;
      velocitys[i].y = -collisionDamping*velocitys[i].y;
    }
    if (positions[i].y + this.radius> simHeight){
      positions[i].y = simHeight - this.radius;
      velocitys[i].y = -collisionDamping*velocitys[i].y;
    }
  }
}
console.log(smoothingKernel(2,5));
setupParticlesRandom();
function simulate(){
  physics();
  draw();
  requestAnimationFrame(simulate);
}
simulate();
