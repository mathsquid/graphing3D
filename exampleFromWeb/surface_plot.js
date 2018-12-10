var container, scene, camera, renderer, controls;

init();
initGraph();
animate();

function init(){
  scene = new THREE.Scene();
  var SCREEN_WIDTH=window.innerWidth, SCREEN_HEIGHT=window.innerHeight;
  var VIEW_ANGLE=45, ASPECT=SCREEN_WIDTH/SCREEN_HEIGHT, NEAR=0.1, FAR=2000;
  camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
  scene.add(camera);
  camera.position.set(0, 2, 50);
  camera.lookAt(scene.position);
  renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  container = document.getElementById('stage');
  container.appendChild(renderer.domElement);

  var positions = [[1,1,1],[-1,-1,1],[-1,1,1],[1,-1,1]];
  for(var i=0;i<4;i++){
    var light=new THREE.DirectionalLight(0xdddddd);
    light.position.set(positions[i][0],positions[i][1],0.4*positions[i][2]);
    scene.add(light);

    // var al = new THREE.AmbientLight();
    // scene.add(al);
  }
  initGrid();

  controls = new THREE.TrackballControls( camera );
  controls.rotateSpeed=10;
  renderer.setClearColor( 0xffffff, 1 );
}
//--END OF INIT FUNCTION---------------------------------------------------
//-------------------------------------------------------------------------

function drawCylinder(){


}




function initGrid(){
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

  var axesmaterial = new THREE.LineDashedMaterial( { color: 0x000000, opacity: 0.5, dashSize:4, gapSize: 1, linewidth:4} );
  var axesline = new THREE.Line(axesgeometry, axesmaterial);

  //axesline.type = THREE.LinePieces;
  scene.add(axesline);

  // var geometry = new THREE.Geometry();
  //
  // for(var i=BIGIN;i<=END;i+=2){
  //   geometry.vertices.push(new THREE.Vector3(BIGIN,i,0));
  //   geometry.vertices.push(new THREE.Vector3(END,i,0));
  //   geometry.vertices.push(new THREE.Vector3(END,i+2,0));
  //   geometry.vertices.push(new THREE.Vector3(BIGIN,i+2,0));
  // }
  //
  // for(var i=BIGIN;i<=END;i+=2){
  //   geometry.vertices.push(new THREE.Vector3(i,BIGIN,0));
  //   geometry.vertices.push(new THREE.Vector3(i,END,0));
  //   geometry.vertices.push(new THREE.Vector3(i+2,END,0));
  //   geometry.vertices.push(new THREE.Vector3(i+2,BIGIN,0));
  // }
  //
  // var material = new THREE.LineBasicMaterial( { color: 0x999999, opacity: 0.2 } );
  //
  // var line = new THREE.Line(geometry, material);
  // line.type = THREE.LinePieces;
  // scene.add(line)
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

  var material = new THREE.MeshPhongMaterial({ vertexColors: THREE.VertexColors});
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
