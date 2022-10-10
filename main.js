import * as THREE from './modules/three.module.js';

import { OrbitControls } from './modules/OrbitControls.js';
import { TransformControls } from './modules/TransformControls.js';
import { snapObjectToBottom } from './snapToGroundTHREE.js';

let camera;
let scene, renderer, control, orbit,mesh;
let floorMeshes = []
init();

document.getElementById("spanToGround").addEventListener("click", () => {
    // Snap box to floor
    snapObjectToBottom(mesh, floorMeshes)
})

function init() {

    // Renderer setup
    setupRenderer()

    // Camera setup
    setupCamera()
    
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color("grey")

    // Light setup
    setupLight()

    // Create bottom floor
    let planeGeo = new THREE.PlaneBufferGeometry(1000,1000,10,10)
    planeGeo.rotateX(-Math.PI/2)
    let planeMat = new THREE.MeshLambertMaterial({color: 'green',side: THREE.DoubleSide})
    let plane = new THREE.Mesh(planeGeo,planeMat)
    scene.add(plane)
    let planeMatWire = new THREE.MeshLambertMaterial({ color: 0xffff00,wireframe: true })
    let planeWire = new THREE.Mesh(planeGeo, planeMatWire)
    scene.add(planeWire)
    floorMeshes.push(plane)

    // Controls setup
    orbit = new OrbitControls(camera, renderer.domElement);
    orbit.update();
    control = new TransformControls(camera, renderer.domElement);
    control.addEventListener('dragging-changed', function (event) {
        orbit.enabled = !event.value;
    });
    scene.add(control);

    // Create box
    const texture = new THREE.TextureLoader().load('textures/crate.gif', render);
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const geometry = new THREE.BoxGeometry(100, 100, 100);
    const material = new THREE.MeshLambertMaterial({ map: texture, transparent: true });
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    
    control.attach(mesh);

    const baseBoxGeo = new THREE.BoxGeometry(200, 200, 200);
    const mat = new THREE.MeshLambertMaterial({ map: texture, transparent: true });
    const baseBox = new THREE.Mesh(baseBoxGeo, mat);
    baseBox.position.set(-200,100,-200)
    scene.add(baseBox);
    floorMeshes.push(baseBox)

    window.addEventListener('resize', onWindowResize);

    window.addEventListener('keydown', function (event) {

        switch (event.keyCode) {

            case 87: // W
                control.setMode('translate');
                break;

            case 69: // E
                control.setMode('rotate');
                break;

            case 82: // R
                control.setMode('scale');
                break;
        }
    });

    animate()

}

function onWindowResize() {

    const aspect = window.innerWidth / window.innerHeight;

    camera.aspect = aspect;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function render() {
    renderer.render(scene, camera);
}
function animate(){
    render()
    orbit.update()
    requestAnimationFrame(animate)
}

function setupLight() {
    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(1, 1, 1);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.5))
}

function setupRenderer() {
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}
function setupCamera() {
    const aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(50, aspect, 0.01, 30000);
    camera.position.set(1000, 500, 1000);
    camera.lookAt(0, 200, 0);
}


