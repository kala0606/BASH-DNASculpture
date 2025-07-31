let y, y2, a, b, c, d, e, f;
let mic, fft;
let cumulativefft = 0;
let sketchStarted = false;

// Anaglyph variables
let anaglyph;
let is3D = false; // Toggle for 3D mode

// Regeneration feedback
let regenerationTimer = 0;
let showRegenerationMsg = false;

let clr1, clr1A, clr1B;
let clr1Num, clr1Blk = 1000,
  clr1Cnt = -1;
let clr2Num, clr2Blk = 100,
  clr2Cnt = -1;
let clr1Len;

function regenerateStructure() {
  // Regenerate all the random parameters for a new structure
  a = random(10, 200);
  b = random(10, 200);
  c = random(10, 200);
  d = random(500, 1000);
  e = random(500, 1000);
  f = random(10, 50);
  g = random(500, width*2);
  h = random(500, width*2);
  
  // Reset cumulative FFT for fresh audio response
  cumulativefft = 0;
  
  // Regenerate color tables with new parameters
  setColourTables();
  
  // Show regeneration feedback
  showRegenerationMsg = true;
  regenerationTimer = millis();
  
  console.log("Structure regenerated!");
}

function setColourTables() {
  clr1A = [];
  clr1B = [];

  for (let i = 0; i < clr1Num; i++) {
    if (i % clr1Blk == 0) clr1Cnt = (clr1Cnt + 1) % clr1Len;
    let c1 = color(clr1[clr1Cnt][0], clr1[clr1Cnt][1], clr1[clr1Cnt][2]);
    let c2 = color(clr1[(clr1Cnt + 1) % clr1Len][0], clr1[(clr1Cnt + 1) % clr1Len][1], clr1[(clr1Cnt + 1) % clr1Len][2]);
    clr1A[i] = lerpColor(c1, c2, map(i, clr1Cnt * clr1Blk, (clr1Cnt + 1) * clr1Blk, 0.0, 1.0));
  }

  for (let i = 0; i < clr2Num; i++) {
    if (i % clr2Blk == 0) clr2Cnt = (clr2Cnt + 1) % clr1Len;
    let c1 = color(clr1[clr2Cnt][0], clr1[clr2Cnt][1], clr1[clr2Cnt][2]);
    let c2 = color(clr1[(clr2Cnt + 1) % clr1Len][0], clr1[(clr2Cnt + 1) % clr1Len][1], clr1[(clr2Cnt + 1) % clr1Len][2]);
    clr1B[i] = lerpColor(c1, c2, map(i, clr2Cnt * clr2Blk, (clr2Cnt + 1) * clr2Blk, 0.0, 1.0));
  }
}


function setup() {
  createCanvas(window.innerWidth, window.innerHeight, WEBGL);
  
  // Initialize anaglyph
  anaglyph = createAnaglyph(this);
  
  background(255)
  textAlign(CENTER, CENTER);
  // strokeWeight(0.3)
  mic = new p5.AudioIn();
  mic.start();
  // fft = new p5.FFT();
  // fft.setInput(mic);

  y = height / 2;
  y2 = height / 2
  rectMode(CENTER);
  a = random(10, 200);
  b = random(10, 200);
  c = random(10, 200);
  d = random(1000, 3000);
  e = random(500, 1000);
  f = random(10, 100);
  g = random(100, width*2);
  h = random(100, width);

  clr1 = [[255, 107, 53], [247, 197, 159], [0, 78, 137], [26, 101, 158]];
  clr1Len = clr1.length;
  clr1Num = clr1Len * clr1Blk;
  clr2Num = clr1Len * clr2Blk;
  setColourTables();


  noiseSeed(200)

}

function draw() {
  if (!sketchStarted) {
    // background(255);
    fill(0);
    text('Click to start\nPress \'3\' to toggle 3D anaglyph mode\nClick again to regenerate structure', 0, 0);
    return;
  }
  let amp = mic.getLevel();
  cumulativefft += amp*100;
  print(cumulativefft)
  
  // Toggle between normal and anaglyph modes
  if (is3D) {
    anaglyph.draw(scene);
  } else {
    scene();
  }
  
  // Show 3D mode indicator
  if (is3D) {
    push();
    translate(-width/2 + 100, -height/2 + 50, 1000);
    fill(255, 0, 0);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(16);
    text('3D MODE ON\n(Red-Cyan Glasses)', 0, 0);
    pop();
  }
  
  // Show regeneration message temporarily
  if (showRegenerationMsg && millis() - regenerationTimer < 2000) {
    push();
    translate(width/2 - 150, -height/2 + 50, 1000);
    fill(0, 255, 0);
    noStroke();
    textAlign(RIGHT, TOP);
    textSize(16);
    text('STRUCTURE\nREGENERATED!', 0, 0);
    pop();
  } else if (millis() - regenerationTimer >= 2000) {
    showRegenerationMsg = false;
  }
}

function scene(pg) {
  // Use pg (pGraphics) if provided, otherwise use the main canvas (this)
  let canvas = pg || this;
  
  // camera(0, 0, (height / 2.0) / tan(PI / 6.0) * 2, 0, 0, 0, 0, 1, 0);
  canvas.background(255);
  // canvas.scale(1.55)
  // noStroke();
  canvas.stroke(255)
  canvas.strokeWeight(0.3)
  canvas.push();
  canvas.translate(0, 0, -2000); // Moved much further back for more depth
  // pg.scale(3*sin(frameCount/100));

  // let spectrum = fft.analyze();
  // let bass = fft.getEnergy("high");
  // let amp = mic.getLevel();
  // cumulativefft += amp*100;
  // print(cumulativefft)

  // ambientLight(100);
  // directionalLight(120, 120, 120, 0.5, 1, -1);
  // pointLight(200, 200, 200, 0, -200, 200);

  // left
  for (let y = -height*2; y < height*2; y += f) {

    let colorIndex1 = floor(map(y, height / 2, -height / 2, 0, clr1Num - 1));
    if (clr1A[colorIndex1]) {
      canvas.fill(0);
    }

    // Add dramatic z-depth variation based on y position and audio
    let zDepth1 = map(y, -height*2, height*2, -500, 500) + sin(y/100 + cumulativefft/200) * 80;

    canvas.push();
    canvas.translate(0, y, zDepth1)
    canvas.rotateY(y / d + cumulativefft / a)
    canvas.box(g , 3*noise(y/c), 3*noise(y/c))
    canvas.pop();

    canvas.push()
    canvas.rotateY(y / d + cumulativefft / a)
    canvas.translate(-g / 2, y, zDepth1 + 200)
    canvas.sphere(15)
    canvas.pop();

    canvas.push()
    canvas.rotateY(y / d + cumulativefft / a)
    canvas.translate(g / 2, y, zDepth1 - 200)
    canvas.sphere(15)
    canvas.pop();


  }

  for(let y2 = -height*2; y2 < height*2 ; y2+=f) {

    let colorIndex2 = floor(map(y2, height * 2, -height * 2, 0, clr2Num - 1));
    if (clr1B[colorIndex2]) {
      canvas.fill(0);
    }

    // Add even more dramatic z-depth with noise and audio reactivity
    let zDepth2 = map(y2, -height*2, height*2, -2000, 2000) + 
                  noise(y2/150, cumulativefft/300) * 100 + 
                  cos(y2/80 + cumulativefft/150) * 100;

    canvas.push();
    canvas.translate(0, y2, zDepth2)
    canvas.rotateY(y2/e + cumulativefft/b)
    strokeWeight(0.3)
    stroke(255)
    canvas.box(h/2 , 40*noise(y2/c),30)
    canvas.pop();

    canvas.push()
    canvas.rotateY(y2/e + cumulativefft/b)
    canvas.translate(-h / 8, y2, zDepth2 + 400)
    canvas.sphere(25*noise(y2/c, cumulativefft/b))
    canvas.pop();

    canvas.push()
    canvas.rotateY(y2/e + cumulativefft/b)
    canvas.translate(h / 8, y2, zDepth2 - 400)
    canvas.sphere(25*noise(y2/c, cumulativefft/b))
    canvas.pop();

    
  }
  canvas.pop();

}

function mousePressed() {
  if (!sketchStarted) {
    userStartAudio();
    sketchStarted = true;
  } else {
    // Regenerate structure when sketch is already running
    regenerateStructure();
  }
}

function keyPressed() {
  // Toggle 3D anaglyph mode when '3' key is pressed
  if (key === '3') {
    is3D = !is3D;
    console.log('3D mode:', is3D ? 'ON (red-cyan glasses needed)' : 'OFF');
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}