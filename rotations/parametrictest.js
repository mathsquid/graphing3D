var container, scene, camera, renderer, controls;

init();
var a, b, numdisks;
var rotAxisValue=0;

var diskmat = new THREE.MeshPhongMaterial({
  color: 0xff7700,
   specular: 0x080808,
  transparent:true,
  opacity:.7,
  side: THREE.DoubleSide
});

var diskmat3 = new THREE.MeshPhongMaterial({
  color: 0x007700,
  // specular: 0x080808,
  transparent:true,
  opacity:1,
  side: THREE.DoubleSide
});



function init(){
  scene = new THREE.Scene();
  var tt=0;
  var SCREEN_WIDTH=window.innerWidth;
  var SCREEN_HEIGHT=SCREEN_WIDTH*0.6;
  var VIEW_ANGLE=45, ASPECT=SCREEN_WIDTH/SCREEN_HEIGHT, NEAR=0.1, FAR=2000;
  // camera and lights
  camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
  var light = new THREE.DirectionalLight(0xffffff, 0.5);
  light.position.set(0,0,1);
  camera.add(light);  // Viewpoint light moves with camera.



  scene.add(camera);
  light = new THREE.PointLight(0xffffff, 1);  // A light shining from above the surface.
  light.position.set(0,20,0);
  scene.add(light);
  camera.position.set(20, 10, 40);
  camera.lookAt(scene.position);

  container = document.getElementById('stage');
  renderer = new THREE.WebGLRenderer({canvas: stage, antialias:true});
  document.body.appendChild(renderer.domElement);
  renderer.setSize(SCREEN_WIDTH*.8, SCREEN_HEIGHT*.8);
  renderer.setClearColor( 0xbbbbdd, 1 );
  controls = new THREE.TrackballControls( camera, container );
  controls.rotateSpeed=5;


  animate();
  function animate(){
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
  }

}
//--END OF INIT FUNCTION---------------------------------------------------
//-------------------------------------------------------------------------

function highlightRegion(){
  scene.remove(scene.getObjectByName("region"));

  a = math.parse(document.getElementById("avalue").value).compile().eval();
  b = math.parse(document.getElementById("bvalue").value).compile().eval();
  var width = (b-a)/100;

  var region = new THREE.Shape();
  region.moveTo(a,g(a));
  for (var i=a; i<=b; i+=width)region.lineTo(i,math.max(f(i),g(i)));
  region.lineTo(b,math.max(f(i),g(i)));
  for (var i=b; i>=a; i-=width)region.lineTo(i,math.min(f(i),g(i)));
  region.lineTo(a,math.min(f(i),g(i)));


  var regiongeom = new THREE.ShapeGeometry(region);
  var regionmat = new THREE.MeshPhongMaterial({transparent:true, opacity:.5, color:0x884444, side:THREE.DoubleSide});
  var regionMesh = new THREE.Mesh(regiongeom, regionmat);
  regionMesh.name="region";
  scene.add(regionMesh);
}

function unHighlightRegion(){
  scene.remove(scene.getObjectByName("region"));
}


function washer(bigR, littleR, thickness){

  var washer = new THREE.Shape();
  washer.moveTo(bigR,0);
  for (var i=0; i<50; i++){
    washer.lineTo(bigR*Math.cos(i*Math.PI*.04),bigR*Math.sin(i*Math.PI*.04));
  }
  washer.lineTo(bigR,0);
  var hole = new THREE.Path();
  hole.moveTo(littleR,0);
  for (var i=0; i<50; i++){
    hole.lineTo(littleR*Math.cos(i*Math.PI*.04),littleR*Math.sin(i*Math.PI*.04))
  }
  washer.lineTo(littleR,0);
  washer.holes.push(hole);
  var extrudeSettings = { depth: thickness, bevelEnabled: false };

  var geometry = new THREE.ExtrudeGeometry( washer, extrudeSettings );
  geometry.rotateX(Math.PI/2);
  return geometry;
  // var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial() );
  // scene.add(mesh);

}

function drawVerticalLines(){
  var verticalLines = new THREE.Object3D();
  var cm = new THREE.LineBasicMaterial({color: 0x0077ff});


  a = math.parse(document.getElementById("avalue").value).compile().eval();
  b = math.parse(document.getElementById("bvalue").value).compile().eval();

  scene.remove(scene.getObjectByName("verticalLines"));
  var lineaG = new THREE.Geometry();
  lineaG.vertices.push(new THREE.Vector3(a, g(a), 0));
  lineaG.vertices.push(new THREE.Vector3(a, f(a), 0));
  var lineaL=new THREE.Line(lineaG,cm);
  verticalLines.add(lineaL);
  var lineaG = new THREE.Geometry();
  lineaG.vertices.push(new THREE.Vector3(b, g(b), 0));
  lineaG.vertices.push(new THREE.Vector3(b, f(b), 0));
  var lineaL=new THREE.Line(lineaG,cm);
  verticalLines.add(lineaL);
  verticalLines.name="verticalLines";
  scene.add(verticalLines);

}

function drawCurve(fORg){
  parseAndCompile();
  scene.remove(scene.getObjectByName("curve"+fORg));
  scene.remove(scene.getObjectByName("diskset"));

  var c = new THREE.Curve()
  c.getPoint = function(t){
    var  s = (t-.5)*12*Math.PI;
    if (fORg=='f') return new THREE.Vector2(s,f(s));
    if (fORg=='g') return new THREE.Vector2(s,g(s));
  };

  var gg = new THREE.BufferGeometry().setFromPoints(c.getPoints(200));
  var cm = new THREE.LineBasicMaterial({color: 0x0077ff});
  var co = new THREE.Line(gg, cm);
  co.name="curve"+fORg;
  scene.add(co);
  drawVerticalLines();




}

function rotateRegion(){
  var orientation = document.getElementById("orientation");
  if (orientation.value == "x") drawShells();
  if (orientation.value == "y") drawDisks();
}

function hideDisks(){
  scene.remove(scene.getObjectByName("diskset"));
}

function drawDisks(){
  a = math.parse(document.getElementById("avalue").value).compile().eval();
  b = math.parse(document.getElementById("bvalue").value).compile().eval();
  numdisks = math.parse(document.getElementById("nvalue").value).compile().eval();


  scene.remove(scene.getObjectByName("diskset"));
  parseAndCompile();

  var volume = 0;
  var diskset = new THREE.Object3D;
  diskset.name ="diskset";
  var thickness = (b-a)/numdisks;
  for (var i=a+thickness*.5; i<b; i+=thickness){
    var radius=Math.max(Math.abs(f(i)-rotAxisValue),Math.abs(g(i)-rotAxisValue));
    var littleRadius = Math.min(Math.abs(g(i)-rotAxisValue),Math.abs(f(i)-rotAxisValue));
    if (radius<.001) radius=.001;
    if (littleRadius<.001) littleRadius=.001;
    // var dg = new THREE.CylinderGeometry(radius,radius,thickness,50);
    var dg = washer(radius,littleRadius,thickness);
    // var dm = new THREE.Mesh(dg,[diskmat,diskmat3]);
    var dm = new THREE.Mesh(dg,diskmat);
    dm.rotateZ(Math.PI/2)
    dm.position.x = i;
    dm.position.y +=rotAxisValue;
    diskset.add(dm);
    volume += Math.PI*(radius*radius - littleRadius*littleRadius)*thickness;
  }
  scene.add(diskset);
  var aa = document.getElementById("volumeOutput");
  var b = volume/Math.PI
  aa.innerHTML = "Volume &#8776 "+ volume.toFixed(4) +" &#8776 "+ b.toFixed(4)+"&#960";
}


function sweep(speed){
  drawDisks()
  ds = scene.getObjectByName("diskset");
  for (var ii=0; ii<numdisks; ii++) ds.children[ii].visible = false;

{
  (function theLoop (i) {
    setTimeout(function () {
        if(i<numdisks-1) ds.children[i+1].material = [diskmat,diskmat3];
        ds.children[i].visible = true;
      if (--i) {          // If i > 0, keep going
        theLoop(i);       // Call the loop again, and pass it the current value of i
      }
    }, 1000*speed/numdisks);
  })(numdisks-1);
}
// for (var ii=0; ii<numdisks; ii++) ds.children[ii].visible = true;
}


function changeShellOpacity(){
  var shellOpacitySlider = document.getElementById("shellOpacitySlider")
  diskmat.opacity=1/(1.4**(10-shellOpacitySlider.value));

}


var hls = 0;
function highlightShell(){
  var s = scene.getObjectByName("diskset");
  var slider = document.getElementById("myRange")
  var prev=hls;
  hls=Math.floor(slider.value/100*numdisks)-1;
  if (hls==-1) hls=0;
  s.children[prev].material=diskmat;
  s.children[hls].material=diskmat3;
}


function hideShells(){
  scene.remove(scene.getObjectByName("diskset"));
}

function drawShells(){
  a = math.parse(document.getElementById("avalue").value).compile().eval();
  b = math.parse(document.getElementById("bvalue").value).compile().eval();
  numdisks = math.parse(document.getElementById("nvalue").value).compile().eval();

  scene.remove(scene.getObjectByName("diskset"));
  parseAndCompile();

  var volume = 0;
  var diskset = new THREE.Object3D;
  diskset.name ="diskset";
  var thickness = (b-a)/numdisks;
//---------------------------------------------
  for (var i=a+thickness*.5; i<b; i+=thickness){
    var height = math.abs(f(i)-g(i));
    var shellRadius = Math.abs(i-rotAxisValue);
    var dg = washer(shellRadius+thickness,shellRadius,height);
    var dm = new THREE.Mesh(dg,diskmat);
    dm.rotateX(Math.PI);
    dm.position.x +=rotAxisValue;
    dm.position.y +=math.min(f(i),g(i));
    diskset.add(dm);
    volume += 2*Math.PI * shellRadius * height *thickness;
  }
  scene.add(diskset);
  var aa = document.getElementById("volumeOutput");
  var b = volume/Math.PI
  aa.innerHTML = "Volume &#8776 "+ volume.toFixed(4) +" &#8776 "+ b.toFixed(4)+"&#960";
//---------------------------------------------}
}






function parseAndCompile(){
  var ftf = document.getElementById("ffunctionString").value;
  expf = math.parse(ftf).compile();
  var ftg = document.getElementById("gfunctionString").value;
  expg = math.parse(ftg).compile();
  //  deriv = math.derivative(ft, "x").compile();
}

function f(x) {
  return expf.eval({"x":x});
}
function g(x) {
  return expg.eval({"x":x});
}



function drawAxes(){
  scene.remove(scene.getObjectByName("axesobject"));

  var XBIGIN=-20, XEND=20, XWIDTH=XEND-XBIGIN;
  var YBIGIN=-10, YEND=10, YWIDTH=YEND-YBIGIN;
  var ZBIGIN=-10, ZEND=10, ZWIDTH=ZEND-ZBIGIN;
  var axesGroup = new THREE.Object3D;
  axesGroup.name="axesobject";

  var axesgeometry = new THREE.Geometry();
  var xaxisGeometry = new THREE.Geometry();
  xaxisGeometry.vertices.push(new THREE.Vector3(-XEND,0,0));
  xaxisGeometry.vertices.push(new THREE.Vector3( XEND,0,0));

  var yaxisGeometry = new THREE.Geometry();
  yaxisGeometry.vertices.push(new THREE.Vector3(0,-YEND,0));
  yaxisGeometry.vertices.push(new THREE.Vector3(0, YEND,0));

  var zaxisGeometry = new THREE.Geometry();
  zaxisGeometry.vertices.push(new THREE.Vector3(0,0,-ZEND));
  zaxisGeometry.vertices.push(new THREE.Vector3(0,0, ZEND));

  var axesmaterial = new THREE.LineBasicMaterial( { color: 0x0FF0000, opacity: 1} );
  var xaxisLine = new THREE.Line(xaxisGeometry,axesmaterial);
  var yaxisLine = new THREE.Line(yaxisGeometry,axesmaterial);
  var zaxisLine = new THREE.Line(zaxisGeometry,axesmaterial);

  axesGroup.add(xaxisLine);
  axesGroup.add(yaxisLine);
  axesGroup.add(zaxisLine);


  // add in tickmarks
  var xticklength = math.parse(document.getElementById("x_tick").value).compile().eval();
  for (var i =0; i<XEND; i+=xticklength){
    xtG = new THREE.Geometry();
    xtG.vertices.push(new THREE.Vector3(i, .2,0));
    xtG.vertices.push(new THREE.Vector3(i,-.2,0));
    xtL = new THREE.Line(xtG, axesmaterial);
    axesGroup.add(xtL);
    xtG = new THREE.Geometry();
    xtG.vertices.push(new THREE.Vector3(-i, .2,0));
    xtG.vertices.push(new THREE.Vector3(-i,-.2,0));
    xtL = new THREE.Line(xtG, axesmaterial);
    axesGroup.add(xtL);
  }


  var yticklength = math.parse(document.getElementById("y_tick").value).compile().eval();
  for (var i =0; i<YEND; i+=yticklength){
    ytG = new THREE.Geometry();
    ytG.vertices.push(new THREE.Vector3( .2, i, 0));
    ytG.vertices.push(new THREE.Vector3(-.2, i, 0));
    ytL = new THREE.Line(ytG, axesmaterial);
    axesGroup.add(ytL);
    ytG = new THREE.Geometry();
    ytG.vertices.push(new THREE.Vector3( .2,-i, 0));
    ytG.vertices.push(new THREE.Vector3(-.2,-i, 0));
    ytL = new THREE.Line(ytG, axesmaterial);
    axesGroup.add(ytL);
  }

  var zticklength = math.parse(document.getElementById("z_tick").value).compile().eval();
  for (var i =0; i<ZEND; i+=zticklength){
    ztG = new THREE.Geometry();
    ztG.vertices.push(new THREE.Vector3( .2, 0,i));
    ztG.vertices.push(new THREE.Vector3(-.2, 0,i));
    ztL = new THREE.Line(ztG, axesmaterial);
    axesGroup.add(ztL);
    ztG = new THREE.Geometry();
    ztG.vertices.push(new THREE.Vector3( .2,0,-i));
    ztG.vertices.push(new THREE.Vector3(-.2,0,-i));
    ztL = new THREE.Line(ztG, axesmaterial);
    axesGroup.add(ztL);
  }

  // put balls at the ends of the axes
  //  var sg = new THREE.SphereGeometry(1);
  // put arrows at the end of the axes
  var sg = new THREE.CylinderGeometry(.2,0,1,10);
  var smat = new THREE.MeshPhongMaterial({color:0xff0000});
  var smesh = new THREE.Mesh(sg, smat);
  smesh.translateX(XEND);
  smesh.rotateZ(Math.PI/2);
  axesGroup.add(smesh);
  // var sg = new THREE.SphereGeometry(1);
  var sg = new THREE.CylinderGeometry(.2,0,1,10);
  var smat = new THREE.MeshPhongMaterial({color:0x00ff00});
  var smesh = new THREE.Mesh(sg, smat);
  smesh.translateY(YEND);
  smesh.rotateZ(Math.PI);
  axesGroup.add(smesh);
  // var sg = new THREE.SphereGeometry(1);
  var sg = new THREE.CylinderGeometry(.2,0,1,10);
  var smat = new THREE.MeshPhongMaterial({color:0x0000ff});
  var smesh = new THREE.Mesh(sg, smat);
  smesh.translateZ(ZEND);
  smesh.rotateX(-Math.PI/2);
  axesGroup.add(smesh);
  scene.add(axesGroup);
}

function drawRotAxis(){
  var orientation = document.getElementById("orientation");
  scene.remove(scene.getObjectByName("rotAxisLine"));
  rotAxisValue = math.parse(document.getElementById("rotAxisValue").value).compile().eval();

  if (orientation.value=="y"){
    var XBIGIN=-20, XEND=20, XWIDTH=XEND-XBIGIN;
    var rotAxisGeometry = new THREE.Geometry();
    rotAxisGeometry.vertices.push(new THREE.Vector3(-XEND,rotAxisValue,0));
    rotAxisGeometry.vertices.push(new THREE.Vector3( XEND,rotAxisValue,0));
  }

  if (orientation.value=="x"){
    var YBIGIN=-10, YEND=10, YWIDTH=YEND-YBIGIN;
    var rotAxisGeometry = new THREE.Geometry();
    rotAxisGeometry.vertices.push(new THREE.Vector3(rotAxisValue,-YEND,0));
    rotAxisGeometry.vertices.push(new THREE.Vector3(rotAxisValue, YEND,0));
  }

  var rotAxisMaterial = new THREE.LineBasicMaterial( { color: 0x0000000, opacity: 1} );
  var rotAxisLine = new THREE.Line(rotAxisGeometry,rotAxisMaterial);
  rotAxisLine.name ="rotAxisLine";
  scene.add(rotAxisLine);
}
