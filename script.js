
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
var cofr = 0.7;
var elasticity = 0.8;
class Ball {
  constructor(){
  this.radius = 0.2;
  this.pos = {x : 0, y : 0};
  this.vel = {x : 10.0, y : 15.0};
  this.mass =1000* 4/3 * Math.PI * (0.2)**3;
  this.impulse = {x : this.mass*this.vel.x, y : this.mass*this.vel.y};
  }
  simulate_ball(){
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

};
var particles = [];
var userball = new Ball();
function loadAndRenderParticles(){
  slider = document.getElementById("particleSlider")
  num_of_particles = parseInt(slider.value,10);
  document.getElementById("particleCount").textContent = num_of_particles;
  particles = [];
  for (let i = 0; i < num_of_particles; i++){
    var particle = new Ball();
    particle.pos.x += Math.random()*simWidth;
    particle.pos.y += Math.random()*simHeight;
    particles.push(particle);
  }

  userball.pos.x += Math.random()*simWidth;
  userball.pos.y += Math.random()*simHeight;
  userball.radius = 1;
  userball.vel.x = 0;
  userball.vel.y = 0;
  particles.push(userball);
}
// drawing -------------------------------------------------------

function handleballcollisions(){
  for (let i = 0; i < particles.length; i++) {
    for ( let j = 0; j < particles.length; j ++){
      if (j != i ){
        var dx = particles[i].pos.x -particles[j].pos.x;
        var dy = particles[i].pos.y -particles[j].pos.y;
        var angle = Math.atan2(dy,dx);
        var length =  Math.sqrt(dx**2 + dy**2);
        if (length + 1e-1 < particles[i].radius + particles[j].radius){
          var p1 = particles[i];
          var p2 = particles[j];
          var momentumP1i_x = p1.mass * p1.vel.x;
          var momentumP1i_y = p1.mass * p1.vel.y;
          var momentumP2i_x = p2.mass * p2.vel.x;
          var momentumP2i_y = p2.mass * p2.vel.y; 
          var Vr_x = p1.vel.x - p2.vel.x;
          var Vr_y = p1.vel.y - p2.vel.y;
          var Vra_x = -cofr*Vr_x;
          var Vra_y = -cofr*Vr_y;
          p1.vel.x = (momentumP1i_x + momentumP2i_x + p2.mass*Vra_x)/(p1.mass + p2.mass);
          p1.vel.y = (momentumP1i_y + momentumP2i_y + p2.mass*Vra_y)/(p1.mass + p2.mass);
          p2.vel.x = -(momentumP1i_x + momentumP2i_x + p1.mass*Vra_x)/(p1.mass + p2.mass);
          p2.vel.y = -(momentumP1i_y + momentumP2i_y + p1.mass*Vra_y)/(p1.mass + p2.mass);

          const displacementX = (dx/length) *(p1.radius + p2.radius - length)/2 + 1e-4;
          const displacementY = (dy/length) *(p1.radius + p2.radius - length)/2 + 1e-4;
          p1.pos.x += displacementX;
          p1.pos.y += displacementY;
          p2.pos.x -= displacementX;
          p2.pos.y -= displacementY;
          


        };
      };
    };


  };

};

function updateConsts(){
  slider = document.getElementById("cofrSlider");
  cofr = parseInt(slider.value,10)/10;
  slider = document.getElementById("elasticityslider");
  elasticity = parseInt(slider.value,10)/10;
  document.getElementById("cofr").textContent = cofr;
  document.getElementById("elasticity").textContent = elasticity;

};
function size(x,y){
  return Math.sqrt(x**2+y**2)
}
function dotproduct(a,b){
  return a.x*b.x + a.y*b.y
}
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

canvas.addEventListener('mousedown', event=>{
  userBallSimulate(event.x,event.y)
})
// simulation ----------------------------------------------------


function simulate() {

  for (let i=0; i < particles.length; i++){
    particles[i].simulate_ball();
  };
  userball.simulate_ball();
  handleballcollisions();
}

function drawBall(x, y){
// https://stackoverflow.com/questions/49711651/javascript-controlling-a-balls-movement-using-mouse
};

function userBallSimulate(x,y){
  document.onmousedown = function(e){
    userball.pos.x = cX(x);
    userball.pos.y = cY(y);
    console.log(userball.pos.x);
  }
};


// make browser to call us repeatedly -----------------------------------

function update() {
  simulate();
  draw();
  requestAnimationFrame(update);
};

update();
