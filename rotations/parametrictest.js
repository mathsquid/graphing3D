var container, scene, camera, renderer, controls;

init();
var ff;
var a, b, numdisks;

var diskmat = new THREE.MeshPhongMaterial({
  color: 0x00ff00,
  color: 0xff7700,
  specular: 0x080808,
  transparent:true,
  opacity:1,
  side: THREE.DoubleSide
});
var diskmat2 = new THREE.MeshPhongMaterial({
  color: 0x00ff00,
  color: 0xff7700,
  specular: 0x080808,
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

function drawCurve(fORg){
  parseAndCompile();
  scene.remove(scene.getObjectByName("curve"+fORg));
  scene.remove(scene.getObjectByName("verticalLines"));
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


  var verticalLines = new THREE.Object3D();

  var a = math.parse(document.getElementById("avalue").value).compile().eval();
  var b = math.parse(document.getElementById("bvalue").value).compile().eval();

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


function hideDisks(){
  scene.remove(scene.getObjectByName("diskset"));
}

function drawDisks(){
  a = math.parse(document.getElementById("avalue").value).compile().eval();
  b = math.parse(document.getElementById("bvalue").value).compile().eval();
  numdisks = math.parse(document.getElementById("nvalue").value).compile().eval();


  scene.remove(scene.getObjectByName("diskset"));
  parseAndCompile();
  ff = f;

  var diskset = new THREE.Object3D;
  diskset.name ="diskset";
  var thickness = (b-a)/numdisks;
  for (var i=a+thickness*.5; i<b; i+=thickness){
    var radius=Math.abs(ff(i));
    var littleRadius = Math.abs(g(i));
    if (radius<.001) radius=.001;
    if (littleRadius<.001) littleRadius=.001;
    // var dg = new THREE.CylinderGeometry(radius,radius,thickness,50);
    var dg = washer(radius,littleRadius,thickness);
    var dm = new THREE.Mesh(dg,diskmat);
    dm.rotateZ(Math.PI/2)
    dm.position.x = i;
    diskset.add(dm);
  }
  scene.add(diskset);



}


function h123(){
  ds = scene.getObjectByName("diskset");
  for (var ii=0; ii<numdisks; ii++) ds.children[ii].visible = false;

{
  (function theLoop (i) {
    setTimeout(function () {
        if(i<numdisks-1) ds.children[i+1].visible = false;
        ds.children[i].visible = true;
      if (--i) {          // If i > 0, keep going
        theLoop(i);       // Call the loop again, and pass it the current value of i
      }
    }, 1000/numdisks);
  })(numdisks-1);
}
// for (var ii=0; ii<numdisks; ii++) ds.children[ii].visible = true;
}



function drawpt(){
  var surfaceGeometry = new THREE.ParametricGeometry(surfaceFunction, 128, 128);
  var material = new THREE.MeshPhongMaterial({
    // color: "white",
    color: 0x00ff00,
    color: 0xff7700,
    // wireframe:true,
    specular: 0x080808,
    side: THREE.DoubleSide
  });
  var surface = new THREE.Mesh( surfaceGeometry, material );
  scene.add(surface);
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


  // // draw the axes
  // axesgeometry.vertices.push(new THREE.Vector3(-END-2,0,0));
  // axesgeometry.vertices.push(new THREE.Vector3(END+2,0,0));
  // axesgeometry.vertices.push(new THREE.Vector3(0,0,0));
  // axesgeometry.vertices.push(new THREE.Vector3(0,END+2,0));
  // axesgeometry.vertices.push(new THREE.Vector3(0,-END-2,0));
  // axesgeometry.vertices.push(new THREE.Vector3(0,0,0));
  // axesgeometry.vertices.push(new THREE.Vector3(0,0,END+2));
  // axesgeometry.vertices.push(new THREE.Vector3(0,0,-END-2));
  //
  // var axesmaterial = new THREE.LineBasicMaterial( { color: 0x0FF0000, opacity: 0.5, linewidth:4} );
  // var axesline = new THREE.Line(axesgeometry, axesmaterial);
  // axesGroup.add(axesline);

  // add in the tickmarks


  // put balls at the ends of the axes
  //  var sg = new THREE.SphereGeometry(1);
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
