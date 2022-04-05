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

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const loader = new THREE.GLTFLoader();
const Imgloader = new THREE.TextureLoader();
var goal, follow;
var angel = new THREE.Vector3;
var dir = new THREE.Vector3;
var a = new THREE.Vector3;
var b = new THREE.Vector3;
var SafetyDistance = 0.3;
var velocity = 0.0;
var speed = 0.0;
var environment = [];

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
camera.lookAt(scene.position);

goal = new THREE.Object3D;
follow = new THREE.Object3D;
follow.position.z = -SafetyDistance;

const light = new THREE.AmbientLight("white", 1);
gui.add(light, "intensity", 0, 2.0);
scene.add(light);

class Gallery {
    constructor() {
        loader.load("gallery/Gallery/gallery.glb", (gltf) => {
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
            object.position.set(0.2, -2, -1.2);

            mixer = new THREE.AnimationMixer(object);
            const animateAction = mixer.clipAction(object.animations[2]).play();
            player.push(animateAction);
            humanModel = object;
            humanModel.add(follow);
            scene.add(humanModel);
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
}, 140);

const playerCollider = new THREE.Capsule(new THREE.Vector3(0, 0.35, 0), new THREE.Vector3(0, 1, 0), 0.35);

function stopPLayerIfobj() {
    setTimeout(() => {
        if (humanModel.position.x <= -3) {
            playerCollider.start.set(0, 0.35, 0);
            playerCollider.end.set(-4, -1.9, humanModel.position.z);
            playerCollider.radius = 0.35;
            humanModel.position.copy(playerCollider.end);
        }
    }, 180);
}

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
        // humanModels[id].position.z -= 0.09
    };

    if (data.key == "s") {
        playerCamera.position.x += data.x
        playerCamera.position.z += data.z
        // humanModels[id].position.z += 0.09
    };

    if (data.key == "d") {
        playerCamera.position.x += data.x
        playerCamera.position.z += data.z
        // humanModels[id].position.x += 0.09
    };
    if (data.key == "a") {
        playerCamera.position.x -= data.x
        playerCamera.position.z -= data.z
        // humanModels[id].position.x -= 0.09
    }
}

camera.position.set(0, 0, 5);

renderer.domElement.onclick = () =>
    renderer.domElement.requestPointerLock()
document.addEventListener('pointerlockchange', lockChangeAlert, false);
document.addEventListener('mozpointerlockchange', lockChangeAlert, false);

playerCamera.add(camera)
playerCamera.position.set(0, 1.8, 0)

goal.add(playerCamera);
scene.add(goal);

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

    speed = 0.0;

    if (keys["w"]) {
        speed = 0.05
        velocity += (speed - velocity) * .3;
        humanModel.translateZ(velocity);

    };

    if (keys["s"]) {
        speed = -0.05;
        velocity += (speed - velocity) * .3;
        humanModel.translateZ(velocity);
    };

    if (keys["d"]) {
        humanModel.rotateY(-0.05);
    };

    if (keys["a"]) {
        humanModel.rotateY(0.05);
    }
    setTimeout(() => {
        a.lerp(humanModel.position, 0.4);
        b.copy(goal.position);

        dir.copy(a).sub(b).normalize();
        const dis = a.distanceTo(b) - SafetyDistance;
        goal.position.addScaledVector(dir, dis);
        goal.position.lerp(angel, 0.02);
        angel.setFromMatrixPosition(follow.matrixWorld);

        camera.lookAt(humanModel.position);
    }, 120);

    mixer.update(clock.getDelta());

    stopPLayerIfobj();
};
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    update();
};
animate();