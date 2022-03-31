(function () {
    var script = document.createElement('script'); script.onload = function () {
        var stats = new Stats(); document.body.appendChild(stats.dom); requestAnimationFrame(function loop() {
            stats.update(); requestAnimationFrame(loop)
        });
    }; script.src = '//mrdoob.github.io/stats.js/build/stats.min.js';
    document.head.appendChild(script);
})()

window.addEventListener('resize', function () {
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
})

var gui = new dat.GUI();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 5;

const light = new THREE.AmbientLight("white", 1);
gui.add(light, "intensity", 0, 2.0);
scene.add(light);

const loader = new THREE.GLTFLoader();
const Imgloader = new THREE.TextureLoader();

class Gallery {
    constructor() {
        loader.load("Gallery/Gallery/gallery.glb", (gltf) => {
            scene.add(gltf.scene);
            gltf.scene.scale.set(.4, .4, .4);
            gltf.scene.rotation.set(0, -1.56, 0);
            gltf.scene.position.set(0.2, -2, 2.5);
            this.gallery = gltf.scene;

            this.gallery.children[0].children[1].material.map = Imgloader.load("gallery/arts/1.png");
            this.gallery.children[1].children[1].material.map = Imgloader.load("gallery/arts/2.jpg");
            this.gallery.children[2].children[1].material.map = Imgloader.load("gallery/arts/3.jpg");
            this.gallery.children[3].children[1].material.map = Imgloader.load("gallery/arts/4.jpg");
            this.gallery.children[4].children[1].material.map = Imgloader.load("gallery/arts/5.jpg");
            this.gallery.children[5].children[1].material.map = Imgloader.load("gallery/arts/6.jpg");
            this.gallery.children[6].children[1].material.map = Imgloader.load("gallery/arts/7.jpg");
            this.gallery.children[7].children[1].material.map = Imgloader.load("gallery/arts/8.jpg");
            this.gallery.children[8].children[1].material.map = Imgloader.load("gallery/arts/9.jpg");
            this.gallery.children[9].children[1].material.map = Imgloader.load("gallery/arts/10.jpg");
            this.gallery.children[10].children[1].material.map = Imgloader.load("gallery/arts/11.jpg");
            this.gallery.children[11].children[1].material.map = Imgloader.load("gallery/arts/12.jpg");
            this.gallery.children[12].children[1].material.map = Imgloader.load("gallery/arts/13.jpg");
            this.gallery.children[13].children[1].material.map = Imgloader.load("gallery/arts/14.jpg");
            this.gallery.children[14].children[1].material.map = Imgloader.load("gallery/arts/15.jpg");
            this.gallery.children[15].children[1].material.map = Imgloader.load("gallery/arts/16.jpg");
            this.gallery.children[16].children[1].material.map = Imgloader.load("gallery/arts/17.jpg");
            this.gallery.children[17].children[1].material.map = Imgloader.load("gallery/arts/18.jpg");
            this.gallery.children[18].children[0].material.map = Imgloader.load("gallery/arts/floor.jpg");
            this.gallery.children[18].children[1].material.map = Imgloader.load("gallery/arts/wall.jpg");
        });
    }
}
var gallery = new Gallery();

let keys = {};
function keyDown(event) {
    keys[event.key] = true;
};
function keyUp(event) {
    delete keys[event.key]
};

document.onkeydown = keyDown;
document.onkeyup = keyUp;

const fbxloader = new THREE.FBXLoader();
let player = [];
let mixer = new THREE.AnimationMixer();
let clock = new THREE.Clock();
var playerCamera = new THREE.Object3D();
var humanModel;
var humanModels = {};
var modelaction = false;
var currentVisitor = [];
var Visitors = [];

const socket = io('http://localhost:3010/');
socket.on('chat message', handleMessage);
socket.on('newPlayer', newPlayer)
socket.on('upDateplayer', upDateplayer)
socket.on('disconnect', disconnect)

class User {
    constructor() {
        this.visitorModel("current")
    }

    visitorModel(id) {
        fbxloader.load("gallery/models/stickman.fbx", (object) => {
            object.scale.set(.0003, .00028, .0003);
            object.rotation.set(0, -3.1, 0);
            object.position.set(0.2, -2, 1);
            gui.add(object.rotation, "y", -10, 10);
            gui.add(object.position, "y", -10, 10);
            mixer = new THREE.AnimationMixer(object);
            const animateAction = mixer.clipAction(object.animations[2]).play();
            player.push(animateAction);
            scene.add(object);
            humanModel = object;
            humanModels[id] = object;
        })
    }

    forwardWalk(humanModel) {
        window.addEventListener("keydown", (event) => {
            if (event.key == "w") {
                if (!modelaction) {
                    modelaction = true;
                    mixer = new THREE.AnimationMixer(humanModel);
                    const animateAction = mixer.clipAction(humanModel.animations[1]).play();
                    player.push(animateAction);
                    scene.add(humanModel);
                }
            }
        })

        window.addEventListener("keyup", (event) => {
            if (event.key == "w") {
                modelaction = false;
                mixer = new THREE.AnimationMixer(humanModel);
                const animateAction = mixer.clipAction(humanModel.animations[2]).play();
                player.push(animateAction);
                scene.add(humanModel);
            }
        })
    }

    backwordWalk() {
        window.addEventListener("keydown", (event) => {
            if (event.key == "s") {
                if (!modelaction) {
                    modelaction = true;
                    mixer = new THREE.AnimationMixer(humanModel);
                    const animateAction = mixer.clipAction(humanModel.animations[1]);

                    if (animateAction.time == 0) {
                        animateAction.time = animateAction.getClip().duration;
                    }
                    animateAction.paused = false;
                    animateAction.setLoop(THREE.LoopOnce);
                    animateAction.timeScale = -0.8;
                    animateAction.play();

                    player.push(animateAction);
                    scene.add(humanModel);
                }
            }
        })

        window.addEventListener("keyup", (event) => {
            if (event.key == "s") {
                modelaction = false;
                mixer = new THREE.AnimationMixer(humanModel);
                const animateAction = mixer.clipAction(humanModel.animations[2]).play();
                player.push(animateAction);
                scene.add(humanModel);
            }
        })
    }
}

class UserLocal extends User {
    constructor() {
        super()
    }

    updatePlayer(data) {
        socket.emit("upDateplayer", data)
    }
    
    updatePlayerAnimation(data) {
        socket.emit("upDateanimation", data)
    }
}

var local = new UserLocal();

setTimeout(() => {
    local.forwardWalk(humanModel);
    local.backwordWalk(humanModel);
}, 118);

function handleMessage(msg) {
    console.log("msg=>", msg)
}

function newPlayer(player) {
    local.visitorModel(player.playerId)
    Visitors.push(player.playerId)
    console.log("==>", humanModels);
}

function disconnect(id) {
    console.log("disconnect ==>", id)
}

function upDateplayer(data, id) {
    if (data.key == "w") {
        playerCamera.position.x -= data.x
        playerCamera.position.z -= data.z
        humanModels[id].position.z -= 0.09
        console.log("model ==->>", humanModels);
        console.log("current id ===->", id);
    };

    if (data.key == "s") {
        playerCamera.position.x += data.x
        playerCamera.position.z += data.z
        humanModels[id].position.z += 0.09
    };

    if (data.key == "d") {
        playerCamera.position.x += data.x
        playerCamera.position.z += data.z
        humanModels[id].position.x += 0.09
    };
    if (data.key == "a") {
        playerCamera.position.x -= data.x
        playerCamera.position.z -= data.z
        humanModels[id].position.x -= 0.09
    }
}

camera.position.set(0, 0, 0);

renderer.domElement.onclick = () =>
    renderer.domElement.requestPointerLock()
document.addEventListener('pointerlockchange', lockChangeAlert, false);
document.addEventListener('mozpointerlockchange', lockChangeAlert, false);

playerCamera.position.set(0, 0, 5)

playerCamera.add(camera);
scene.add(playerCamera);

function updatePosition(event) {
    camera.rotation.order = 'YZX'
    let { movementX, movementY } = event
    let rotateSpeed = 0.002
    playerCamera.rotation.y -= movementX * rotateSpeed
    camera.rotation.x -= movementY * rotateSpeed
    camera.rotation.x = Math.max(-Math.PI / 2, Math.min(camera.rotation.x, Math.PI / 2))
    camera.rotation.order = 'XYZ'
}

function lockChangeAlert() {
    if (document.pointerLockElement == renderer.domElement) {
        document.addEventListener("mousemove", updatePosition, false)
    } else {
        document.removeEventListener("mousemove", updatePosition, false)
    }
}

function update() {

    let moveSpeed = 0.09

    if (keys["w"]) {
        playerCamera.position.x -= Math.sin(playerCamera.rotation.y) * moveSpeed;
        playerCamera.position.z -= Math.cos(playerCamera.rotation.y) * moveSpeed;
        humanModel.position.z -= 0.09
        const obj = {
            x: Math.sin(playerCamera.rotation.y) * moveSpeed,
            z: Math.cos(playerCamera.rotation.y) * moveSpeed,
            key: "w"
        };
        local.updatePlayer(obj);
    };

    if (keys["s"]) {
        playerCamera.position.x += Math.sin(playerCamera.rotation.y) * moveSpeed;
        playerCamera.position.z += Math.cos(playerCamera.rotation.y) * moveSpeed;
        humanModel.position.z += 0.09
        const obj = {
            x: Math.sin(playerCamera.rotation.y) * moveSpeed,
            z: Math.cos(playerCamera.rotation.y) * moveSpeed,
            key: "s"
        };
        local.updatePlayer(obj);
    };

    if (keys["d"]) {
        playerCamera.position.x += moveSpeed * Math.sin(playerCamera.rotation.y + Math.PI / 2)
        playerCamera.position.z += moveSpeed * Math.cos(playerCamera.rotation.y - Math.PI / 2)
        humanModel.position.x += 0.09
        const obj = {
            x: moveSpeed * Math.sin(playerCamera.rotation.y + Math.PI / 2),
            z: moveSpeed * Math.cos(playerCamera.rotation.y - Math.PI / 2),
            key: "d"
        };
        local.updatePlayer(obj);
    };
    
    if (keys["a"]) {
        playerCamera.position.x -= moveSpeed * Math.sin(playerCamera.rotation.y + Math.PI / 2)
        playerCamera.position.z -= moveSpeed * Math.cos(playerCamera.rotation.y - Math.PI / 2)
        humanModel.position.x -= 0.09
        const obj = {
            x: moveSpeed * Math.sin(playerCamera.rotation.y + Math.PI / 2),
            z: moveSpeed * Math.cos(playerCamera.rotation.y - Math.PI / 2),
            key: "a"
        };
        local.updatePlayer(obj);
    }
    
    mixer.update(clock.getDelta());
};
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    update();
};
animate();