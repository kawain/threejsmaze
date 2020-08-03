import * as THREE from "three"
import makeMaze from "./maze.js"
import image from "./img/end.jpg";

let level = -1
let offset = 0
let maze, scene, camera, renderer, mesh, obj, cylinder, spotLight

class Player {
    constructor() {
        this.direction = "N"
        this.end = false
    }

    left() {
        switch (this.direction) {
            case "N":
                this.direction = "W"
                break
            case "S":
                this.direction = "E"
                break
            case "W":
                this.direction = "S"
                break
            case "E":
                this.direction = "N"
                break
        }
    }

    right() {
        switch (this.direction) {
            case "N":
                this.direction = "E"
                break
            case "S":
                this.direction = "W"
                break
            case "W":
                this.direction = "N"
                break
            case "E":
                this.direction = "S"
                break
        }
    }

    move(maze, p) {
        const i = p.z + offset
        const j = p.x + offset

        switch (this.direction) {
            case "N":
                if (maze[i - 1] === undefined) {
                    p.z--
                } else if (maze[i - 1][j] === undefined) {
                    p.z--
                } else if (maze[i - 1][j] === 3) {
                    p.z--
                    this.end = true
                } else if (maze[i - 1][j] !== 1) {
                    p.z--
                }
                break
            case "S":
                if (maze[i + 1] === undefined) {
                    p.z++
                } else if (maze[i + 1][j] === undefined) {
                    p.z++
                } else if (maze[i + 1][j] === 3) {
                    p.z++
                    this.end = true
                } else if (maze[i + 1][j] !== 1) {
                    p.z++
                }
                break
            case "W":
                if (maze[i] === undefined) {
                    p.x--
                } else if (maze[i][j - 1] === undefined) {
                    p.x--
                } else if (maze[i][j - 1] === 3) {
                    p.x--
                    this.end = true
                } else if (maze[i][j - 1] !== 1) {
                    p.x--
                }
                break
            case "E":
                if (maze[i] === undefined) {
                    p.x++
                } else if (maze[i][j + 1] === undefined) {
                    p.x++
                } else if (maze[i][j + 1] === 3) {
                    p.x++
                    this.end = true
                } else if (maze[i][j + 1] !== 1) {
                    p.x++
                }
                break
        }
    }
}

function init(SIZE) {

    maze = makeMaze(SIZE)

    obj = new Player()

    offset = Math.ceil(SIZE / 2.0) - 1

    // シーン
    scene = new THREE.Scene()

    // カメラ
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0, 0, offset + 5)

    // レンダラー
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: document.querySelector("#maze_canvas")
    })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)

    const gridHelper = new THREE.GridHelper(100, 100)
    gridHelper.position.set(0, -0.5, 0)
    scene.add(gridHelper)

    // const axisHelper = new THREE.AxisHelper(100)
    // scene.add(axisHelper)

    // 複数のオブジェクトを作成
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshStandardMaterial({ color: 0xcc0000, roughness: 0 })

    // ゴール用
    const texture = new THREE.TextureLoader().load(image)
    const textureMaterial = new THREE.MeshStandardMaterial({ map: texture })

    for (let i = 0; i < maze.length; i++) {
        for (let j = 0; j < maze[i].length; j++) {
            if (maze[i][j] === 1) {
                mesh = new THREE.Mesh(geometry, material)
                mesh.position.z = i - offset
                mesh.position.x = j - offset
                mesh.name = `${i},${j}`
                scene.add(mesh)
            } else if (maze[i][j] === 3) {
                cylinder = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.5, 0.5, 1, 100),
                    textureMaterial
                );
                cylinder.position.z = i - offset
                cylinder.position.x = j - offset
                scene.add(cylinder)
            }
        }
    };

    spotLight = new THREE.SpotLight(0xFFFFFF, 1, 1200, Math.PI * 0.5, 100, 0.5)
    scene.add(spotLight)

    const ambientLight = new THREE.AmbientLight(0xffffff)
    scene.add(ambientLight)

    scene.fog = new THREE.Fog(0x000000, 1, 5);
}

function animate() {
    if (obj.end) {
        tryBtn.style.display = "block"
        camera.position.y += 0.01
        camera.lookAt(scene.position)
        scene.fog = "";
    } else {
        cylinder.rotation.y -= 0.01
    }
    renderer.render(scene, camera)
    requestAnimationFrame(animate)
}

function onWindowResize() {
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
}

window.addEventListener("resize", onWindowResize)

document.addEventListener("keydown", onDocumentKeyDown)

function onDocumentKeyDown(event) {
    if (obj.end) {
        return
    }

    const keyCode = event.which
    if (keyCode == 38) {
        // up
        obj.move(maze, camera.position)
    } else if (keyCode == 37) {
        // left
        camera.rotation.y += Math.PI * 0.5
        obj.left()
    } else if (keyCode == 39) {
        // right
        camera.rotation.y -= Math.PI * 0.5
        obj.right()
    }
}

document.getElementById("try_again").addEventListener("click", startGame)
const tryBtn = document.getElementById("try_again")

function startGame() {
    tryBtn.style.display = "none"

    let levelArray = [11, 15, 19, 23, 27, 31, 35, 39, 45, 51]

    level++
    if (level > levelArray.length) {
        level--
    }

    document.getElementById("level").innerText = `level ${level + 1}`

    init(levelArray[level])
    animate()
}

startGame()
