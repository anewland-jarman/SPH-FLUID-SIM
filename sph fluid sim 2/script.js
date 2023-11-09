var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");
canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 100;
var simMinWidth = 20.0;
var cScale = Math.min(canvas.width, canvas.height) / simMinWidth;
var simWidth = canvas.width / cScale;
var simHeight = canvas.height / cScale;



class Particle{

}

class Cell{

}

class Grid{

}

class SPHFluidSimulator{
    constructor(){
        //simulation constants
        this.timestep = 1/30;
        this.collisionDamping = 1;
        this.particleSpacing = 0.1;
        this.restpressure = 1000;
        
        //particle and grid data
        this.numParticles = 10;
        this.radius = 0.2;
        this.gridSpacing = 2* this.radius;
        this.numX = Math.floor(canvas.width/this.gridSpacing);
        this.numY = Math.floor(canvas.height/this.gridSpacing);
        this. tableSize = Math.floor(this.numX * this.numY);


    }
    cX(position){
        return position.x * cScale;
    }
    cY(position){
        return position.y * cScale;
    }
    addParticle(particle) {
        // Add a particle to the simulation and update the grid
        this.particles.push(particle);
    }
    
}

function physics(){

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
}

function simulate(){
    physics();
    draw();
    requestAnimationFrame(simulate);
}
var fluidSimulator = new SPHFluidSimulator();
simulate();