var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");
canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 100;
var simMinWidth = 20.0;
var cScale = Math.min(canvas.width, canvas.height) / simMinWidth;
var simWidth = canvas.width / cScale;
var simHeight = canvas.height / cScale;
var numParticles = 1;
var radius = 0.2;
var gridSpacing = 2* radius;
var numX = Math.floor(canvas.width/gridSpacing);
var numY = Math.floor(canvas.height/gridSpacing);
var tableSize = Math.floor(numX * numY);

function cX(position){
    return position.x * cScale;
}

function cY(position){
    return position.y * cScale;
}

class Particle{
    constructor(x,y){
        this.position = new Vector(x,y)
        this.velocity = new Vector(1,0);
        this.radius = radius;
        this.smoothinglength = 2*radius;
        this.cellcoordinates = new Vector(Math.floor(x/gridSpacing),Math.floor(y/gridSpacing));
        this.density = 1;
        this.mass = Math.pow(this.radius,3)*(4/3)*1000;

    }
    updateAcceleration(){
        this.calculateDensity()
        this.calculatePressure()
        this.calculatePressureGradient()
        //console.log(this.pressuregradient,this.density)

        this.acceleration = this.pressuregradient.div(this.density).add(fluidSimulator.gravity);
        //console.log(this.acceleration)
    }
    simulateParticle(){
        this.updateAcceleration();
        this.velocity = this.velocity.add(this.acceleration.mulScalar(fluidSimulator.timestep));
        this.position = this.position.add(this.velocity.mulScalar(fluidSimulator.timestep));
        if (this.position.x - this.radius < 0.0) {
            this.position.x = 0.0 + this.radius;
            this.velocity.x = -this.velocity.x;
        }
        
        if (this.position.x + this.radius > simWidth) {
            this.position.x = simWidth - this.radius;
            this.velocity.x = -this.velocity.x;
        }
        
        if (this.position.y - this.radius < 0.0) {
            this.position.y = 0.0 + this.radius;
            this.velocity.y = -this.velocity.y;
        }
        
        if (this.position.y + this.radius > simHeight) {
            this.position.y = simHeight - this.radius; // Adjusted this line
            this.velocity.y = -this.velocity.y;
        }
        
    }

    calculateDensity(){
        let density = 1;
        for (const particlei of  fluidSimulator.particles){
            if (self != particlei){
                let dist = this.position.distanceFrom(particlei.position);
                density += particlei.mass*fluidSimulator.smoothingKernel(dist,this.smoothinglength);
            }
        }
        this.density = density;        
    }
    calculatePressure(){
        this.pressure = fluidSimulator.fluidconstant*(this.density-fluidSimulator.restdensity)
    }
    calculatePressureGradient(){
        let pressuregradientX = 0;
        let pressuregradientY = 0;
        for (const particlei of  fluidSimulator.particles){
            if (self != particlei){
                
                const deltaX = this.position.x - particlei.position.x;
                const deltaY = this.position.y - particlei.position.y;
    
                pressuregradientX += (this.pressure/this.density)*particlei.mass*fluidSimulator.derivativeOfSmoothingKernel(deltaX,this.smoothinglength);
                pressuregradientY += (this.pressure/this.density)*particlei.mass*fluidSimulator.derivativeOfSmoothingKernel(deltaY,this.smoothinglength);
            }
        }
        this.pressuregradient = new Vector(pressuregradientX,pressuregradientY);
    }
}

class Cell{
    constructor(coords){
        this.coordinates = coords;
        this.particlesincell = [];
    }
    addParticle(particle){
        this.particlesincell.push(particle);
    }
    removeParticle(particle){
        let index = this.particlesincell.indexOf(particle);
        if (index > -1){
            this.particlesincell.splice(index,1);
        }  
    }

}

class Grid{
    constructor(){
        this.grid = new Array(tableSize);
        for (let i =0; i < tableSize; i ++){
            let coordinates = new Vector(i % numX,Math.floor(i/numX))
            this.grid[i] = new Cell(coordinates);
        }
    }
    addParticleToCell(particle){
        let index = particle.cellcoordinates.x * numY + particle.cellcoordinates.y;
        this.grid[index].addParticle(particle)
    }
    removeParticleFromCell(particle){
        let index = particle.cellcoordinates.x * numY + particle.cellcoordinates.y;
        this.grid[index].removeParticle(particle)

    }
}

class SPHFluidSimulator{
    constructor(){
        //simulation constants
        this.timestep = 1/30;
        this.gravity = new Vector(0,0);
        this.collisionDamping = 1;
        this.particleSpacing = 0.1;
        this.restdensity = 10;
        this.fluidconstant = 460.5;
        this.particles = [];
        


    }
    
    initialiseParticle(particle) {
        // Add a particle to the simulation and update the grid
        this.particles.push(particle);
        simulationGrid.addParticleToCell(particle);
    }
    addParticle(particle){
        simulationGrid.addParticleToCell(particle);
    }
    removeParticle(particle){
        simulationGrid.removeParticleFromCell(particle);
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

    

    
      
    
}

function generateParticlesRandom() {
    for (let i = 0; i < numX; i++) {
        let particleX = Math.random() * simWidth;
        let particleY = Math.random() * simHeight;
        let particle = new Particle(particleX, particleY);
        fluidSimulator.initialiseParticle(particle);
    }
}

function physics(){
    for (const particle of fluidSimulator.particles){
        //fluidSimulator.removeParticle(particle)
        particle.simulateParticle();
        particle.calculateDensity(2*particle.radius);
        //console.log(particle.density);
        //fluidSimulator.addParticle(particle); 

    }

}
function draw(){
    
  c.clearRect(0, 0, canvas.width, canvas.height);
  c.fillStyle = "#005EB8";
  for (let i=0; i < numParticles; i++){
    let particle = fluidSimulator.particles[i];
    c.beginPath();	
    c.arc(cX(particle.position), cY(particle.position), cScale *radius, 0.0, 2.0 * Math.PI); 
    c.closePath();
    c.fill();		
  };		
}

function simulate(){
    physics();
    draw();
    requestAnimationFrame(simulate);
}

var fluidSimulator = new SPHFluidSimulator();
var simulationGrid = new Grid();
generateParticlesRandom();
simulate();
