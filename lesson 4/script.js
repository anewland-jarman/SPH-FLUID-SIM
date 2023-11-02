//https://stackoverflow.com/questions/74452866/how-preview-a-html-file-github-codespaces
var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");

canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 100;

var simMinWidth = 20.0;
var cScale = Math.min(canvas.width, canvas.height) / simMinWidth;
var simWidth = canvas.width / cScale;
var simHeight = canvas.height / cScale;


var timestep = 1/30;
var collisionDamping = 1;
var particleSpacing = 0.1;
var restpressure = 1000;

var num_particles = 10;
var radius = 0.2;
var gridspacing = 2 * radius
var numX = Math.floor(canvas.width/gridspacing);
var numY = Math.floor(canvas.height/gridspacing);
var tableSize = Math.ceil(numX * numY);


function cX(pos) {
  return pos.x*cScale;
}

function cY(pos) {
  return canvas.height - pos.y * cScale;
}

class Particle {
  constructor(x,y){
    this.radius = radius;
    this.position = new Vector(x,y);
    this.xi = Math.floor(this.position.x/gridspacing);
    this.yi = Math.floor(this.position.y/gridspacing);
    this.velocity = new Vector(0,0);
    this.acceleration = fluidSimulator.gravity;
    this.mass = 1000*(4/3)*(Math.PI)*(this.radius)**3;            // Particle mass
    this.density = 1; 
    this.pressure = restpressure;
    this.pressureGradientX = 0;
    this.pressureGradientY = 0;
    this.xi = Math.floor(this.position.x/gridspacing);
    this.yi = Math.floor(this.position.y/gridspacing);
    this.cell = new Vector(this.xi,this.yi);
  }
  updateCell(){
    this.xi = Math.floor(this.position.x/gridspacing);
    this.yi = Math.floor(this.position.y/gridspacing);
    this.cell = new Vector(this.xi,this.yi);
  }



}
class Grid{
  constructor(){
    //console.log(tableSize)
    this.grid = new Array(tableSize);
    for (let i = 0; i < tableSize; i++) {
      this.grid[i] = [];
    }


  }
  returnclosecells(particle){
    particle.updateCell();
    let neighbours = [particle.cell];
    var coords = particle.cell;
    var directions = [
      Vector.up, Vector.down, Vector.left, Vector.right,
      Vector.upRight, Vector.upLeft, Vector.downRight, Vector.downLeft];
    

    if (coords.x == 0){
      directions = directions.filter(direction => direction.x !== -1);
    }   

    if (coords.x == numX) {
        directions = directions.filter(direction => direction.x !== 1);
    }
    if (coords.y == numY) {
        directions = directions.filter(direction => direction.y !== 1);
    }
    if (coords.y == 0) {
      directions = directions.filter(direction => direction.y !== -1);
  }
    
    if (coords.x == 0 && coords.y == 0){
      directions = directions.filter(direction => direction.x !== -1 && direction.y !== -1);

    }
    if (coords.x == numX && coords.y == 0) {
      directions = directions.filter(direction => direction.x !== 1 && direction.y !== -1);
    }
    if (coords.x == 0 && coords.y == numY) {
        directions = directions.filter(direction => direction.x !== -1 && direction.y !== 1);
    }
    if (coords.x == numX && coords.y == numY) {
        directions = directions.filter(direction => direction.x !== 1 && direction.y !== 1);
    }
  directions.forEach(direction => neighbours.push(particle.cell.add(direction)));
  for (const cell of neighbours){
    let newneighbours = []
    //console.log(cell)
    let index = cell.x * numY + cell.y;
    //console.log(simulationgrid.grid[index])
    for (let i=0; i<simulationgrid.grid[index].length; i++){
      newneighbours.push(neighbours[index][i])
      //console.log(neighbours[index][i])
    }
  }
  return neighbours;
  }
}
class SPHFluidSimulator {
  constructor() {
    this.particles = [];
    this.smoothinglength = 2 * radius;
    this.restdensity = 1000;
    this.fluidconstant = 460.5;
    this.gravity = new Vector(0,0)
  }
  

  addParticle(particle) {
      // Add a particle to the simulation and update the grid
      this.particles.push(particle);
  }

  updateGrid() {

  }
  
  
  smoothingKernel(r,h){
    let smoothingvalue = 0.0
    if (r>=0 && r<=h){
      smoothingvalue = 1-1.5*(r/h)**2 + 0.75*(r/h)**3
    }
    else if (r>=h && r<=2*h){
      smoothingvalue = 0.25*(2-r/h)**3
    }
    return ((Math.PI*h**3)**(-1))*smoothingvalue
  }
  derivativeOfSmoothingKernel(r,h){
    let smoothingchange = 0.0
    if (r>=0 && r<=h){
      smoothingchange = (2.25*r**2 - 3*h*r)/h**3
    }
    else if (r>=h && r<=2*h){
      smoothingchange = -(3*(h - 0.5*r)**2)/h**3
    }
    return ((Math.PI*h**3)**(-1))*smoothingchange
    
  }
  calculateDensity(particle,neighbours){
    let density = 0;
    for (const cell of neighbours){
      //console.log(cell)
      let index = cell.x * numY + cell.y;
      for (const cparticle of simulationgrid.grid[index]){
        if (cparticle !== particle){
          let dist = particle.position.distanceFrom(cparticle.position);
          density += cparticle.mass*this.smoothingKernel(dist,this.smoothinglength);
        }
      }
    }
    particle.density = density;

  }
  calculatePressure(particle){
    let pressure = this.fluidconstant*(particle.density - this.restdensity);
    particle.pressure = pressure;
  }
  calculatePressureGradientX(particle,neighbours){
    let pressureGradientX = 0;
    for (const cell of neighbours){
      //console.log(cell)
      let index = cell.x * numY + cell.y;
      for (const cparticle of simulationgrid.grid[index]){
        if (cparticle !== particle){
          let dist = particle.position.x - cparticle.position.x;
          pressureGradientX += cparticle.mass*this.derivativeOfSmoothingKernel(dist,this.smoothinglength);
        }
      }
    }
    particle.pressureGradientX = pressureGradientX;

  }
  calculatePressureGradientY(particle,neighbours){
    let pressureGradientY = 0;
    for (const cell of neighbours){
      //console.log(cell)
      let index = cell.x * numY + cell.y;
      for (const cparticle of simulationgrid.grid[index]){
        if (cparticle !== particle){
          let dist = particle.position.Y - cparticle.position.Y;
          pressureGradientY += cparticle.mass*this.derivativeOfSmoothingKernel(dist,this.smoothinglength);
        }
      }
    }
    particle.pressureGradientY = pressureGradientY;

  }
  

  updateDensitiesAndForces() {
    //Update particle densities and calculate forces (pressure, viscosity, etc.)
    for (const particle of this.particles) {
      let neighbours = simulationgrid.returnclosecells(particle);
      this.calculateDensity(particle,neighbours)
      this.calculatePressure(particle);
    }
  }
  updateAcceleration(particle){
    particle.acceleration.x = particle.pressureGradientX/particle.density + this.gravity.x;
    particle.acceleration.y = particle.pressureGradientY/particle.density + this.gravity.y;
  }
  handleBoundaryCollision(particle) {
    if (particle.position.x + particle.radius > simWidth) {
      particle.position.x = simWidth - particle.radius;
      particle.velocity.x = -collisionDamping * particle.velocity.x;
    }
    if (particle.position.x - particle.radius < 0) {
      particle.position.x = particle.radius;
      particle.velocity.x = -collisionDamping * particle.velocity.x;
    }
    if (particle.position.y - particle.radius < 0) {
      particle.position.y = 0 + particle.radius;
      particle.velocity.y = -collisionDamping * particle.velocity.y;
    }
    if (particle.position.y + particle.radius > simHeight) {
      particle.position.y = simHeight - particle.radius;
      particle.velocity.y = -collisionDamping * particle.velocity.y;
    }
  }
  


  integrateTimeStep() {
    for (const particle of this.particles){  
      this.updateAcceleration(particle); 
      let neighbours = simulationgrid.returnclosecells(particle); 
      particle.velocity = particle.velocity.add(particle.acceleration.mulScalar(timestep))
      particle.position = particle.position.add(particle.velocity.mulScalar(timestep));
      this.handleBoundaryCollision(particle);
    }
  }

  // Other simulation methods (e.g., handling boundaries, neighbor search) can be added here.
}

function setupParticlesGrid() {
  particlesPerRow = Math.ceil(Math.sqrt(num_particles));
  particlesPerCol = Math.ceil(num_particles / particlesPerRow);
  spacing = this.radius * 2 + particleSpacing;
  let i = 0;

  for (let row = 0; row < particlesPerRow; row++) {
    for (let col = 0; col < particlesPerCol; col++) {
      x = col * spacing + simWidth / 2;
      y = row * spacing + simHeight / 2;
      var particle = new Particle(x,y);
      fluidSimulator.addParticle(particle)
      i++;
    }
  }
}
function setupParticlesRandom(){
  for (let i =0 ; i < num_particles; i++){
    x = simWidth*Math.random();
    y= simHeight*Math.random();
    var particle = new Particle(x,y);
    fluidSimulator.addParticle(particle);
    
  }
}




function draw(){
  c.clearRect(0, 0, canvas.width, canvas.height);

  c.fillStyle = "#005EB8";
  for (let i=0; i < num_particles; i++){
    var particle = fluidSimulator.particles[i];
    c.beginPath();	
    c.arc(cX(particle.position), cY(particle.position), cScale *radius, 0.0, 2.0 * Math.PI); 
    c.closePath();
    c.fill();		
  };		
};

function physics(){
  fluidSimulator.integrateTimeStep();
  fluidSimulator.updateGrid();
  fluidSimulator.updateDensitiesAndForces();
}
var simulationgrid = new Grid();
var fluidSimulator = new SPHFluidSimulator();
setupParticlesGrid();

function simulate(){
  physics();
  draw();
  requestAnimationFrame(simulate);
}
simulate();
