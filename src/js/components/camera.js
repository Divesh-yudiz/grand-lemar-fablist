import {
    OrthographicCamera,
    PerspectiveCamera
} from 'three'


export class Camera {
    scene
    constructor(scene) {
        this.scene = scene;

        // set orthographic camera
        const frustumSize = 3.5;
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new OrthographicCamera(
            frustumSize * aspect / -2, // left
            frustumSize * aspect / 2,  // right 
            frustumSize / 2,           // top
            frustumSize / -2,          // bottom
            0.1,                       // near
            1000                       // far
        );
        this.camera.position.set(0, 0, 8)

        this.camera.near = 1;  // Increase the near plane slightly
        this.camera.far = 1000;  // Ensure there's enough separation between near and far
        this.camera.updateProjectionMatrix();
        this.scene.add(this.camera)
    }
}