import {
    Vector3,
    MathUtils
} from 'three'
import { Sky } from 'three/examples/jsm/objects/Sky.js';

export function setupSky(scene) {
    const sky = new Sky();
    sky.scale.setScalar(450000);
    scene.add(sky);

    const skyUniforms = sky.material.uniforms;
    skyUniforms['turbidity'].value = 10;
    skyUniforms['rayleigh'].value = 0.5;
    skyUniforms['mieCoefficient'].value = 0.005;
    skyUniforms['mieDirectionalG'].value = 0.8;

    const sun = new Vector3();
    const phi = MathUtils.degToRad(90);
    const theta = MathUtils.degToRad(90);
    sun.setFromSphericalCoords(100000, phi, theta);
    skyUniforms['sunPosition'].value.copy(sun);

    return sky;

}