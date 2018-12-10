var container, scene, camera, renderer, controls;

init();
// initGraph();
drawAxes();
// drawCircle(0);
animate();

// drawgrid(1,100);
drawgrid();

render();

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
      f1.color.setRGB(i/NUMPTS, 0,1);
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


function drawCircle(h){
  var g = new THREE.Geometry();
  var v1=new THREE.Vector3(0,0,h);
  g.vertices.push(v1);

  var rad=10;
  var numberSectors =25;
  for (var i=0; i<numberSectors; i++){
    var v2=new THREE.Vector3(rad*Math.cos(2*Math.PI* i   /numberSectors),rad*Math.sin(2*Math.PI* i   /numberSectors),h );
    g.vertices.push(v2);
    vq=new THREE.Vector3(rad*Math.cos(2*Math.PI* i   /numberSectors),rad*Math.sin(2*Math.PI* i   /numberSectors),h+1);
    g.vertices.push(vq);
    vw=new THREE.Vector3(rad*Math.cos(2*Math.PI*(i+1)/numberSectors),rad*Math.sin(2*Math.PI*(i+1)/numberSectors),h);
    g.vertices.push(vw);
  }

  for (var i=0; i<numberSectors*3-1; i++){
    f1 = new THREE.Face3(i,i+1,0,);
    f2 = new THREE.Face3(i+1,i+2,0);
    g.faces.push(f1);
    g.faces.push(f2);



    // g.faces.push(new THREE.Face3(i,i+1,0,));
    // g.faces.push(new THREE.Face3(i+1,i+2,0));
  }
  // g.computeFaceNormals();

  var m = new THREE.MeshNormalMaterial({side:THREE.DoubleSide});
  // var m = new THREE.MeshBasicMaterial({wireframe:false, transparent:false, opacity:.5, color:0xff00ff, side:THREE.DoubleSide});
  var mm = new THREE.Mesh(g,m);
  mm.translateZ(10);
  scene.add(mm);

}


function drawAxes(){
  var BIGIN=-20, END=20, WIDTH=END-BIGIN;
  // var plane_geometry = new THREE.PlaneGeometry(WIDTH,WIDTH);
  // var plane_material = new THREE.MeshLambertMaterial({color:0xf0f0f0, overdraw: 0.5, side: THREE.DoubleSide});
  // var plane = new THREE.Mesh(plane_geometry, plane_material);
  // scene.add(plane);

  var axesGroup = new THREE.Object3D;

  var axesgeometry = new THREE.Geometry();
  axesgeometry.vertices.push(new THREE.Vector3(0,0,0));
  axesgeometry.vertices.push(new THREE.Vector3(END+2,0,0));
  axesgeometry.vertices.push(new THREE.Vector3(0,0,0));
  axesgeometry.vertices.push(new THREE.Vector3(0,END+2,0));
  axesgeometry.vertices.push(new THREE.Vector3(0,0,0));
  axesgeometry.vertices.push(new THREE.Vector3(0,0,END+2));

  var axesmaterial = new THREE.LineBasicMaterial( { color: 0x0FF0000, opacity: 0.5, linewidth:4} );
  var axesline = new THREE.Line(axesgeometry, axesmaterial);
  axesGroup.add(axesline);

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

function initGraph(){
  data = initData();
  var geometry = new THREE.Geometry();
  var colors = [];
  var width = data.length, height = data[0].length;
  data.forEach(function(col){
    col.forEach(function(val){
      geometry.vertices.push(new THREE.Vector3(val.x,val.y,val.z))
      colors.push(getColor(2.5,0,val.z));
    });
  });

  var offset = function(x,y){
    return x*width+y;
  }

  for(var x=0;x<width-1;x++){
    for(var y=0;y<height-1;y++){
      var vec0 = new THREE.Vector3(), vec1 = new THREE.Vector3(), n_vec = new THREE.Vector3();
      // one of two triangle polygons in one rectangle
      vec0.subVectors(geometry.vertices[offset(x,y)],geometry.vertices[offset(x+1,y)]);
      vec1.subVectors(geometry.vertices[offset(x,y)],geometry.vertices[offset(x,y+1)]);
      n_vec.crossVectors(vec0,vec1).normalize();
      geometry.faces.push(new THREE.Face3(offset(x,y),offset(x+1,y),offset(x,y+1), n_vec, [colors[offset(x,y)],colors[offset(x+1,y)],colors[offset(x,y+1)]]));
      geometry.faces.push(new THREE.Face3(offset(x,y),offset(x,y+1),offset(x+1,y), n_vec.negate(), [colors[offset(x,y)],colors[offset(x,y+1)],colors[offset(x+1,y)]]));
      // the other one
      vec0.subVectors(geometry.vertices[offset(x+1,y)],geometry.vertices[offset(x+1,y+1)]);
      vec1.subVectors(geometry.vertices[offset(x,y+1)],geometry.vertices[offset(x+1,y+1)]);
      n_vec.crossVectors(vec0,vec1).normalize();
      geometry.faces.push(new THREE.Face3(offset(x+1,y),offset(x+1,y+1),offset(x,y+1), n_vec, [colors[offset(x+1,y)],colors[offset(x+1,y+1)],colors[offset(x,y+1)]]));
      geometry.faces.push(new THREE.Face3(offset(x+1,y),offset(x,y+1),offset(x+1,y+1), n_vec.negate(), [colors[offset(x+1,y)],colors[offset(x,y+1)],colors[offset(x+1,y+1)]]));
    }
  }
  var material = new THREE.MeshPhongMaterial({wireframe:false, opacity: 0.5, transparent: true, vertexColors: THREE.VertexColors});
  var mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

}



function getColor(max,min,val){
  var MIN_L=40,MAX_L=100;
  var color = new THREE.Color();
  var h = 20/240;
  var s = 80/240;
  var l = (((MAX_L-MIN_L)/(max-min))*val)/240;
  //  color.setHSL(h,s,l);
  color.setRGB(h,s,l);
  color.alpha = .5;
  return color;
}

function initData(){
  var BIGIN=-20, END=20;
  var data = new Array();
  for(var x=BIGIN;x<END;x++){
    var row = [];
    for(var y=BIGIN;y<END;y++){
      z = 3*(Math.sin(Math.sqrt(.5*(x*x+y*y)))+1);
      row.push({x: x, y: y, z: z});
    }
    data.push(row);
  }
  return data;
}

function animate(){
  requestAnimationFrame(animate);
  render();
  controls.update();
}

function render(){
  renderer.render(scene, camera);
}
