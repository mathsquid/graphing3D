var container, scene, camera, renderer, controls;

init();
drawAxes();
animate();
drawgrid();





function init(){
  scene = new THREE.Scene();
  var SCREEN_WIDTH=window.innerWidth;
  var SCREEN_HEIGHT=SCREEN_WIDTH*0.6;
  var VIEW_ANGLE=45, ASPECT=SCREEN_WIDTH/SCREEN_HEIGHT, NEAR=0.1, FAR=2000;
  camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
  scene.add(camera);
  camera.position.set(0, 2, 50);
  camera.lookAt(scene.position);
  renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  container = document.getElementById('stage');
  container.appendChild(renderer.domElement);

  scene.add( new THREE.HemisphereLight( 0xbbbbbb, 0x000000 ) );
  scene.add( new THREE.AmbientLight());

  controls = new THREE.TrackballControls( camera );
  controls.rotateSpeed=10;
  // renderer.setClearColor( 0x111111, 1 );
}
//--END OF INIT FUNCTION---------------------------------------------------
//-------------------------------------------------------------------------


function drawgrid(){
  var NUMPTS = 50;
  var scale=02;
  var g = new THREE.Geometry();


  for (var i=0; i<NUMPTS; i++){
    for (var j=0; j<NUMPTS; j++){
      g.vertices.push(new THREE.Vector3(i,j,2*Math.cos(Math.sqrt((i-10)/scale*(i-10)/scale+(j-10)/scale*(j-10)/scale))));

    }
  }

  var f1, f2, nvec1, nvec2;
  for (var i=0; i<NUMPTS-1; i++){
    for (var j=0; j<NUMPTS-1; j++){
      nvec1 = new THREE.Vector3().crossVectors(g.vertices[j*NUMPTS+i    ], g.vertices[(j+1)*NUMPTS+i  ]).normalize();
      nvec2 = new THREE.Vector3().crossVectors(g.vertices[(j+1)*NUMPTS+i], g.vertices[(j+1)*NUMPTS+i+1]).normalize();
      f1    = new THREE.Face3(    j*NUMPTS+i, (j+1)*NUMPTS+i  , j*NUMPTS+i+1, nvec1);
      f1.color.setRGB(i/NUMPTS,0,1);
      f2    = new THREE.Face3((j+1)*NUMPTS+i, (j+1)*NUMPTS+i+1, j*NUMPTS+i+1, nvec2);
      f2.color.setRGB(i/NUMPTS, 1,0);
      g.faces.push(f1);
      g.faces.push(f2);
    }
  }
 var gmat = new THREE.MeshPhongMaterial({
    shininess:00,
    wireframe:false,
    opacity: 0.5,
    transparent: true,
    vertexColors: THREE.FaceColors,
    side:THREE.DoubleSide
  });
  var gmsh = new THREE.Mesh(g,gmat);

  scene.add(gmsh);
}




function drawAxes(){
  var BIGIN=-20, END=20, WIDTH=END-BIGIN;
//   var plane_geometry = new THREE.PlaneGeometry(WIDTH,WIDTH);
//   var plane_geometry = new THREE.PlaneGeometry(.3,.3);
// //  var plane_geometry = new THREE.SphereGeometry(1);
//   var plane_material = new THREE.MeshLambertMaterial({color:0xf0f0f0, overdraw: 0.5, side: THREE.DoubleSide});
//   var plane = new THREE.Mesh(plane_geometry, plane_material);
//
//   for (var iii=0; iii<314; iii++){
//   var plane = new THREE.Mesh(plane_geometry, plane_material);
//   plane.translateX(5*Math.sin(iii/10));
//   plane.translateY(5*Math.cos(iii/10));
//   plane.translateZ(iii/50);
//   scene.add(plane);
// }


  var axesGroup = new THREE.Object3D;

  var axesgeometry = new THREE.Geometry();
  // draw the axes
  axesgeometry.vertices.push(new THREE.Vector3(0,0,0));
  axesgeometry.vertices.push(new THREE.Vector3(END+2,0,0));
  axesgeometry.vertices.push(new THREE.Vector3(0,0,0));
  axesgeometry.vertices.push(new THREE.Vector3(0,END+2,0));
  axesgeometry.vertices.push(new THREE.Vector3(0,0,0));
  axesgeometry.vertices.push(new THREE.Vector3(0,0,END+2));

  var axesmaterial = new THREE.LineBasicMaterial( { color: 0x0FF0000, opacity: 0.5, linewidth:4} );
  var axesline = new THREE.Line(axesgeometry, axesmaterial);
  axesGroup.add(axesline);

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

function animate(){
  requestAnimationFrame(animate);
  render();
  controls.update();
}

function render(){
  renderer.render(scene, camera);
}
