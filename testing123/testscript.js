var container, scene, camera, renderer, controls;

init();
drawAxes();
// addInVectors();
addInFaces();
animate();

function animate(){
  requestAnimationFrame(animate);
  render();
  controls.update();
}

function adjust(){
  camera.rotation.x=0;
  camera.position.x=0;

  camera.rotation.y=0;
  camera.position.y=0;

  camera.rotation.z=0;
  camera.position.z=50;
}

function logCamera(){
  console.log(camera.position);
  console.log(camera.rotation);
  document.getElementById("camPosX").innerHTML = (camera.position.x).toFixed(3);
  document.getElementById("camPosY").innerHTML = (camera.position.y).toFixed(3);
  document.getElementById("camPosZ").innerHTML = (camera.position.z).toFixed(3);
  document.getElementById("camRotX").innerHTML = (camera.rotation.x*180/Math.PI).toFixed(3);
  document.getElementById("camRotY").innerHTML = (camera.rotation.y*180/Math.PI).toFixed(3);
  document.getElementById("camRotZ").innerHTML = (camera.rotation.z*180/Math.PI).toFixed(3);
}

function render(){
  renderer.render(scene, camera);
}
function init(){
  scene = new THREE.Scene();
  var SCREEN_WIDTH=window.innerWidth, SCREEN_HEIGHT=window.innerHeight;
  var VIEW_ANGLE=45, ASPECT=SCREEN_WIDTH/SCREEN_HEIGHT, NEAR=0.1, FAR=2000;
  camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
  scene.add(camera);
  camera.position.set(50,50,50);
  camera.lookAt(scene.position);
  renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  container = document.getElementById('stage');
  container.appendChild(renderer.domElement);

  var positions = [[1,1,1],[-1,-1,1],[-1,1,1],[1,-1,1],[1,1,-1],[-1,-1,-1],[-1,1,-1],[1,-1,-1]];
  for(var i=0;i<8;i++){
    var light=new THREE.DirectionalLight(0xdddddd);
    light.position.set(positions[i][0],positions[i][1],0.4*positions[i][2]);
    scene.add(light);
  }

 controls = new THREE.TrackballControls( camera );
  controls.rotateSpeed=10;
 // renderer.setClearColor( 0xffffff, 1 );
}
//--END OF INIT FUNCTION---------------------------------------------------
//-------------------------------------------------------------------------


function drawAxes(){
  var BIGIN=-20, END=20, WIDTH=END-BIGIN;
  var plane_geometry = new THREE.PlaneGeometry(WIDTH,WIDTH);
  var plane_material = new THREE.MeshLambertMaterial({color:0xf0f0f0, overdraw: 0.5, side: THREE.DoubleSide});
  var plane = new THREE.Mesh(plane_geometry, plane_material);
  // scene.add(plane);

  var axesgeometry = new THREE.Geometry();
  axesgeometry.vertices.push(new THREE.Vector3(0,0,0));
  axesgeometry.vertices.push(new THREE.Vector3(END+2,0,0));
  axesgeometry.vertices.push(new THREE.Vector3(0,0,0));
  axesgeometry.vertices.push(new THREE.Vector3(0,END+2,0));
  axesgeometry.vertices.push(new THREE.Vector3(0,0,0));
  axesgeometry.vertices.push(new THREE.Vector3(0,0,END+2));

  var axesmaterial = new THREE.LineBasicMaterial( { color: 0x00FF00, opacity: 0.5, linewidth:4} );
  var axesline = new THREE.Line(axesgeometry, axesmaterial);

  scene.add(axesline);
}

function addInVectors(){
  var zAxisVector = new THREE.Vector3(0,0,1);
  var xAxisVector = new THREE.Vector3(1,0,0);
  var startVector = new THREE.Vector3(1,1,10);
  var numvecs = 100;

  for (var i=0; i<numvecs; i++){
    var vGeometry = new THREE.Geometry();
    vGeometry.vertices.push(new THREE.Vector3(0,0,0));
    var vecc=new THREE.Vector3();
    vecc.copy(startVector);
    vecc.applyAxisAngle(zAxisVector, 2*Math.PI/numvecs*i);
    vGeometry.vertices.push(vecc);
    console.log(vecc);
    scene.add(new THREE.Line(vGeometry, new THREE.LineBasicMaterial({color:0x0000ff, opacity:1})));
   }
}

function addInFaces(){
  var material = new THREE.MeshLambertMaterial({ vertexColors: THREE.VertexColors});
  material.side = THREE.DoubleSide;
  //material.vertexColors = 0xff0000;
  //create a triangular geometry
  var geometry = new THREE.Geometry();
  geometry.vertices.push( new THREE.Vector3(  0,  10, 0 ) );
  geometry.vertices.push( new THREE.Vector3(   0,  0, 0 ) );
  geometry.vertices.push( new THREE.Vector3(  10,  0, 0 ) );

  geometry.vertices.push( new THREE.Vector3(  0, 0, 0 ) );
  geometry.vertices.push( new THREE.Vector3(  0, 10, 0 ) );
  geometry.vertices.push( new THREE.Vector3(   0,  0, 10 ) );

  geometry.vertices.push( new THREE.Vector3(  10, 0, 0 ) );
  geometry.vertices.push( new THREE.Vector3(  0, 0, 0 ) );
  geometry.vertices.push( new THREE.Vector3(   0,  0, 10 ) );

  //create a new face using vertices 0, 1, 2
  console.log("aaa");
  var normal = new THREE.Vector3( 0, 1, 0 ); //optional
  var normalb = new THREE.Vector3( 0, -1, 0 ); //optional
  var color = new THREE.Color( 0xffaa00 ); //optional
  var materialIndex = 0; //optional
  var face = new THREE.Face3( 0, 1, 2, normal, color, materialIndex );

  //add the face to the geometry's faces array
  geometry.faces.push( face );

  //the face normals and vertex normals can be calculated automatically if not supplied above
  geometry.computeFaceNormals();
  geometry.computeVertexNormals();

  scene.add( new THREE.Mesh( geometry, material ) );



  //create a new face using vertices 0, 1, 2
  console.log("aaa");
   normal = new THREE.Vector3( 0, 1, 0 ); //optional
  color = new THREE.Color( 0xff0000 ); //optional
  materialIndex = 0; //optional
  face = new THREE.Face3( 3, 4, 5, normal, color, materialIndex );

  //add the face to the geometry's faces array
  geometry.faces.push( face );

  //create a new face using vertices 0, 1, 2
  console.log("aaa");
   normal = new THREE.Vector3( 0, 1, 0 ); //optional
  color = new THREE.Color( 0xff0ff0 ); //optional
  materialIndex = 0; //optional
  face = new THREE.Face3( 6, 7, 8, normal, color, materialIndex );

  //add the face to the geometry's faces array
  geometry.faces.push( face );

  //the face normals and vertex normals can be calculated automatically if not supplied above
  geometry.computeFaceNormals();
  geometry.computeVertexNormals();

  scene.add( new THREE.Mesh( geometry, material ) );

}




  // for(var x=0;x<width-1;x++){
  //   for(var y=0;y<height-1;y++){
  //     var vec0 = new THREE.Vector3(), vec1 = new THREE.Vector3(), n_vec = new THREE.Vector3();
  //     // one of two triangle polygons in one rectangle
  //     vec0.subVectors(geometry.vertices[offset(x,y)],geometry.vertices[offset(x+1,y)]);
  //     vec1.subVectors(geometry.vertices[offset(x,y)],geometry.vertices[offset(x,y+1)]);
  //     n_vec.crossVectors(vec0,vec1).normalize();
  //     geometry.faces.push(new THREE.Face3(offset(x,y),offset(x+1,y),offset(x,y+1), n_vec, [colors[offset(x,y)],colors[offset(x+1,y)],colors[offset(x,y+1)]]));
  //     geometry.faces.push(new THREE.Face3(offset(x,y),offset(x,y+1),offset(x+1,y), n_vec.negate(), [colors[offset(x,y)],colors[offset(x,y+1)],colors[offset(x+1,y)]]));
  //     // the other one
  //     vec0.subVectors(geometry.vertices[offset(x+1,y)],geometry.vertices[offset(x+1,y+1)]);
  //     vec1.subVectors(geometry.vertices[offset(x,y+1)],geometry.vertices[offset(x+1,y+1)]);
  //     n_vec.crossVectors(vec0,vec1).normalize();
  //     geometry.faces.push(new THREE.Face3(offset(x+1,y),offset(x+1,y+1),offset(x,y+1), n_vec, [colors[offset(x+1,y)],colors[offset(x+1,y+1)],colors[offset(x,y+1)]]));
  //     geometry.faces.push(new THREE.Face3(offset(x+1,y),offset(x,y+1),offset(x+1,y+1), n_vec.negate(), [colors[offset(x+1,y)],colors[offset(x,y+1)],colors[offset(x+1,y+1)]]));
  //   }
  // }
