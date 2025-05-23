
import {
    DirectionalLight,
    AmbientLight,
    HemisphereLight,
    Color
} from 'three'

export class Light {
    scene
    constructor(scene) {
        this.scene = scene;


        // this.frontLight = new DirectionalLight(new Color(1, 1, 1, 1), 2);
        // this.frontLight.position.set(0, 0, 5); // Front
        // this.scene.add(this.frontLight);

        // this.backLight = new DirectionalLight(new Color(1, 1, 1, 1), 2);
        // this.backLight.position.set(0, 0, -5); // Back
        // this.scene.add(this.backLight);

        // this.leftLight = new DirectionalLight(new Color(1, 1, 1, 1), 2);
        // this.leftLight.position.set(-5, 0, 0); // Left
        // this.scene.add(this.leftLight);

        // this.rightLight = new DirectionalLight(new Color(1, 1, 1, 1), 0.2);
        // this.rightLight.position.set(5, 0, 0); // Right
        // this.scene.add(this.rightLight);

        // this.topLight = new DirectionalLight(new Color(1, 1, 1, 1), 2);
        // this.topLight.position.set(0, 5, 0); // Above
        // this.scene.add(this.topLight);


        // this.mainLight2 = new AmbientLight(new Color(1, 1, 1, 0.5));
        // this.mainLight2.position.set(0, 5, 5)
        // this.scene.add(this.mainLight2);
    }
}