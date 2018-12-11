var container, scene, camera, renderer, controls;

init();
drawAxes();
// drawpt();
drawCurve();

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
  camera.position.set(0, 2, 75);
  camera.lookAt(scene.position);

  renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  renderer.setClearColor( 0xbbbbdd, 1 );
  container = document.getElementById('stage');
  container.appendChild(renderer.domElement);

  controls = new THREE.TrackballControls( camera );
  controls.rotateSpeed=10;

  var helix = new THREE.Curve();
  helix.getPoint = function(t){
    var s = (t-0.5)*Math.PI;
    return new THREE.Vector2(Math.PI*2*Math.cos(s+tt), s);
  }

  var nmat = new THREE.MeshPhongMaterial({
    transparent: true, color: 0x000055,
    emissive:0x000f0f,
    wireframe:true, side: THREE.DoubleSide,
  });

  var l = new THREE.LatheGeometry(helix.getPoints(25), 25, 0);
  var h = new THREE.Mesh(l,nmat);
  // scene.add(h);


var theta = 0;
  animate();
  function animate(){
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
  }

}
//--END OF INIT FUNCTION---------------------------------------------------
//-------------------------------------------------------------------------
function drawCurve(){
  var c = new THREE.Curve()
  c.getPoint = function(t){
    var  s = (t-.5)*12*Math.PI;
    return new THREE.Vector2(s,1*Math.cos(s));
  };

  var gg = new THREE.BufferGeometry().setFromPoints(c.getPoints(200));
  var cm = new THREE.LineBasicMaterial({color: 0x0077ff});
  var co = new THREE.Line(gg, cm);
  scene.add(co);
}




function surfaceFunction( u, v, target ) {
    var x,y,z;  // A point on the surface, calculated from u,v.
                // u  and v range from 0 to 1.
                // x = 50 * (u - 0.5);  // x and z range from -10 to 10
                // z = 50 * (v - 0.5);
                // y = 2*(Math.sin(x/2) * Math.cos(z));
                x = 10*Math.PI*(u-.5);  // x and z range from -10 to 10
                y = 10*Math.PI*(v-.5);
                z = Math.cos(Math.sqrt(x*x+y*y));
    target.set( x, y, z );
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

function drawAxes(){
  var BIGIN=-20, END=20, WIDTH=END-BIGIN;
  var axesGroup = new THREE.Object3D;

  var axesgeometry = new THREE.Geometry();
  var xaxisGeometry = new THREE.Geometry();
  xaxisGeometry.vertices.push(new THREE.Vector3(-END-2,0,0));
  xaxisGeometry.vertices.push(new THREE.Vector3( END+2,0,0));

  var yaxisGeometry = new THREE.Geometry();
  yaxisGeometry.vertices.push(new THREE.Vector3(0,-END-2,0));
  yaxisGeometry.vertices.push(new THREE.Vector3(0, END+2,0));

  var zaxisGeometry = new THREE.Geometry();
  zaxisGeometry.vertices.push(new THREE.Vector3(0,0,-END-2));
  zaxisGeometry.vertices.push(new THREE.Vector3(0,0, END+2));

  var axesmaterial = new THREE.LineBasicMaterial( { color: 0x0FF0000, opacity: 1} );
  var xaxisLine = new THREE.Line(xaxisGeometry,axesmaterial);
  var yaxisLine = new THREE.Line(yaxisGeometry,axesmaterial);
  var zaxisLine = new THREE.Line(zaxisGeometry,axesmaterial);

  axesGroup.add(xaxisLine);
  axesGroup.add(yaxisLine);
  axesGroup.add(zaxisLine);


  // add in tickmarks
  var xticklength=Math.PI/2;
  for (var i =0; i<END; i+=xticklength){
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


  var yticklength=1;
  for (var i =0; i<END; i+=yticklength){
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

  var zticklength=1;
  for (var i =0; i<END; i+=zticklength){
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
  var sg = new THREE.SphereGeometry(1);
  var smat = new THREE.MeshPhongMaterial({color:0xff0000});
  var smesh = new THREE.Mesh(sg, smat);
  smesh.translateX(END+2);
  axesGroup.add(smesh);
  var sg = new THREE.SphereGeometry(1);
  var smat = new THREE.MeshPhongMaterial({color:0x00ff00});
  var smesh = new THREE.Mesh(sg, smat);
  smesh.translateY(END+2);
  axesGroup.add(smesh);
  var sg = new THREE.SphereGeometry(1);
  var smat = new THREE.MeshPhongMaterial({color:0x0000ff});
  var smesh = new THREE.Mesh(sg, smat);
  smesh.translateZ(END+2);
  axesGroup.add(smesh);
  scene.add(axesGroup);
}
