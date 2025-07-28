console.log("scene.js is executing")

import {
  Color,
  TextureLoader,
  WebGLRenderer,
  Scene,
  AxesHelper,
  Raycaster,
  Vector2,
  RepeatWrapping,
  DirectionalLight,
  PointLight,
  ACESFilmicToneMapping,
  PCFSoftShadowMap,
  sRGBEncoding,
  HemisphereLight,
  Vector3,
  MeshStandardMaterial,
  Mesh,
  CapsuleGeometry,
  LinearMipmapLinearFilter,
  LinearFilter
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import LoaderManager from '@/js/managers/LoaderManager'
import GUI from 'lil-gui'
import { Camera } from './components/camera'
import coat from '../assets/coat-7.glb'
import texture from '../assets/repeatable_color_rgb.png'
import textureNormal from '../assets/repeatable_normal.png'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import axios from 'axios';
// import { fetchFabrics } from './fabList';
import FabricManager from './fabList';

let instance = null;
const api = 'https://grand-le-mar-be.virals.studio/api/v1/'

export default class MainScene {
  canvas
  renderer
  scene
  camera
  controls
  width
  height
  scene1
  aLight = []
  gui
  lightSettings
  lightHelpers = []
  fabricIds = ['9Z01xwP4', 'r4G8Em6j', 'Nj1xdDY4', '0ZXeN1n4', 'BjedQAw4', 'yVPJv0J4', 'x4Jmv9gZ']; // Add your fabric IDs here
  slider
  fabricsFetched = false; // Add a flag to track if fabrics have been fetched

  constructor() {
    if (instance) {
      return instance;
    }
    instance = this;
    console.log('MainScene constructor called');
    this.fabricManager = new FabricManager();
    this.canvas = document.querySelector('.scene')
    this.width = window.innerWidth - 100;
    this.height = window.innerHeight - 100;
    this.lightSettings = {}; // Initialize lightSettings
    this.showLoader(); // Show loader when initializing
    this.init();

    this.fabricControls = document.querySelector('.controls');
    // this.setupImageClickHandlers();
    this.slider = document.querySelector('#mySlider');
    this.setupSlider();
  }

  showLoader() {
    const loader = document.querySelector('.loader');
    if (loader) {
      loader.style.display = 'block';
    }
    const loaderContainer = document.querySelector('.loader-container');
    if (loaderContainer) {
      loaderContainer.style.display = 'block';
    }
  }

  hideLoader() {
    const loader = document.querySelector('.loader');
    if (loader) {
      loader.style.display = 'none';
    }
    const loaderContainer = document.querySelector('.loader-container');
    if (loaderContainer) {
      loaderContainer.style.display = 'none';
    }
  }

  init = async () => {
    // Preload assets before initiating the scene
    console.log("init is executing")
    const assets = [
      {
        name: 'model1',
        gltf: coat,
      },
      {
        name: 'texture',
        texture: texture,
      },
      {
        name: 'textureNormal',
        texture: textureNormal,
      }
    ]

    await LoaderManager.load(assets)

    if (!this.fabricsFetched) {
      try {
        // const fabrics = await fetchFabrics();
        const fabrics = await this.fabricManager.fetchFabrics();
        console.log("Fetched fabrics:", fabrics);
        this.allfabrics = fabrics;
        this.fabricsFetched = true; // Set the flag to true after fetching
      } catch (error) {
        console.error("Error fetching fabrics:", error);
        this.allfabrics = []; // Set to empty array if fetch fails
      }
    }
    this.setScene();
    // this.scene.background = new Color(0xEFEFEF);
    this.scene.background = new Color(0xE3E3E3);
    this.camera = new Camera(this.scene);
    this.setRender()
    this.updatedFabric();
    // this.getActualeData();
    this.modelSetUp();
    // this.light = new Light(this.scene);

    const addDirectionalLight = (x, y, z, intensity) => {
      const ambientLight = new HemisphereLight(0xffffff, 0x000000, 0.2); // Lower intensity
      this.scene.add(ambientLight);

      this.dirLight2 = new DirectionalLight(0xffffff, 0.2);
      this.aLight.push(this.dirLight2);
      this.dirLight2.target = this.scene1;
      this.dirLight2.position.set(37, 14, 74);
      this.scene.add(this.dirLight2);

      this.dirLight3 = new DirectionalLight(0xffffff, 0.2);
      this.aLight.push(this.dirLight3);
      this.dirLight3.castShadow = true;
      this.dirLight3.target = this.scene1;
      this.dirLight3.position.set(x, y, z);
      this.dirLight3.shadow.color = new Color(0x000000); // Set shadow color to black
      this.scene.add(this.dirLight3);

      const bulbGeometry = new CapsuleGeometry(0.5, 1, 4, 8);
      const bulbLight = new PointLight(0xffffff, 1.0, 100, 0.00001);

      const bulbMat = new MeshStandardMaterial({
        emissive: 0x000000,
        emissiveIntensity: 0,
        color: 0x000000,
        transparent: true,
        opacity: 0
      });
      bulbLight.add(new Mesh(bulbGeometry, bulbMat));
      bulbLight.position.set(0, -1.2, 0);
      bulbLight.castShadow = true;
      // this.scene.add(bulbLight);

      const bulbGeometry1 = new CapsuleGeometry(0.5, 2, 4, 8);
      const bulbLight1 = new PointLight(0xffffff, 1.0, 100, 0.00001);

      const bulbMat1 = new MeshStandardMaterial({
        emissive: 0x000000,
        emissiveIntensity: 0,
        color: 0x000000,
        transparent: true,
        opacity: 0
      });
      bulbLight1.add(new Mesh(bulbGeometry1, bulbMat1));
      bulbLight1.position.set(0, 0.5, 0);
      bulbLight1.castShadow = true;
      // this.scene.add(bulbLight1);

      const bulbGeometry2 = new CapsuleGeometry(0.5, 0.5, 4, 8);
      const bulbLight2 = new PointLight(0xffffff, 0.5, 100, 0.00001);

      const bulbMat2 = new MeshStandardMaterial({
        emissive: 0x000000,
        emissiveIntensity: 0,
        color: 0x000000,
        transparent: true,
        opacity: 0
      });
      bulbLight2.add(new Mesh(bulbGeometry2, bulbMat2));
      bulbLight2.position.set(0, 1, 0);
      bulbLight2.castShadow = true;
      // this.scene.add(bulbLight2);
      // bulbLight.visible = false;

      // Update shadow settings for dirLight3
      this.dirLight3.shadow.mapSize.width = 2048;  // Increased resolution for sharper shadows
      this.dirLight3.shadow.mapSize.height = 2048; // Increased resolution for sharper shadows
      this.dirLight3.shadow.camera.near = 0.5;
      this.dirLight3.shadow.camera.far = 500;
      this.dirLight3.shadow.bias = -0.00001; // Adjust bias to reduce shadow acne
      this.dirLight3.shadow.normalBias = 0.001;
      this.dirLight3.shadow.radius = 20;          // Reduced blur for sharper shadows
      this.dirLight3.shadow.camera.updateProjectionMatrix();

      // Tighter shadow camera frustum for better resolution
      this.dirLight3.shadow.camera.left = -1.5;     // Tighter bounds for better shadow detail
      this.dirLight3.shadow.camera.right = 1.5;
      this.dirLight3.shadow.camera.top = 1.5;
      this.dirLight3.shadow.camera.bottom = -1.5;

      // Shadow settings for bulbLight
      bulbLight.shadow.mapSize.width = 2048;       // Increased resolution for sharper shadows
      bulbLight.shadow.mapSize.height = 2048;      // Increased resolution for sharper shadows
      bulbLight.shadow.camera.near = 0.1;
      bulbLight.shadow.camera.far = 100;
      bulbLight.shadow.bias = -0.00005;            // Reduced bias for sharper edges
      bulbLight.shadow.normalBias = 0.001;         // Reduced normal bias for sharper edges
      bulbLight.shadow.radius = 0.5;               // Reduced blur for sharper shadows

      // Shadow settings for bulbLight1
      bulbLight1.shadow.mapSize.width = 2048;      // Increased resolution for sharper shadows
      bulbLight1.shadow.mapSize.height = 2048;     // Increased resolution for sharper shadows
      bulbLight1.shadow.camera.near = 0.1;
      bulbLight1.shadow.camera.far = 100;
      bulbLight1.shadow.bias = -0.00005;           // Reduced bias for sharper edges
      bulbLight1.shadow.normalBias = 0.001;        // Reduced normal bias for sharper edges
      bulbLight1.shadow.radius = 0.5;              // Reduced blur for sharper shadows

      bulbLight2.shadow.mapSize.width = 2048;      // Increased resolution for sharper shadows
      bulbLight2.shadow.mapSize.height = 2048;     // Increased resolution for sharper shadows
      bulbLight2.shadow.camera.near = 0.1;
      bulbLight2.shadow.camera.far = 100;
      bulbLight2.shadow.bias = -0.00005;           // Reduced bias for sharper edges
      bulbLight2.shadow.normalBias = 0.001;        // Reduced normal bias for sharper edges
      bulbLight2.shadow.radius = 0.5;              // Reduced blur for sharper shadows

    };
    addDirectionalLight(-49, 6, 50, 3);
    // this.setGUI();
    this.setControls()
    this.setRaycaster()
    // this.setAxesHelper();
    this.handleResize()
    this.events()
    this.currentFabricId = "YVw2kDoj"; // Default to first if index is invalid

    const updateBtn = document.querySelector('.update-button');
    if (updateBtn) {
      updateBtn.addEventListener('click', this.updateFabric);
    } else {
      console.error('Element with class .update-button not found');
    }
    console.log("setting up close button");


    const closeBtn = document.querySelector('.close-button');
    console.log("closeBtn", closeBtn);
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        document.querySelector('.popup').style.display = 'none';
        const element = document.querySelector('.selected'); // Replace with the actual class name
        if (element) {
          element.classList.remove('selected'); // Replace with the actual class name
        }
      });
    } else {
      console.error('Element with class .close-button not found');
    }


    const slider = document.querySelector('#mySlider');
    const value = slider.value;
    console.log("value", value);

    this.rangeValue = document.querySelector('.slider-value');
    this.rangeValue.textContent = value;


    slider.addEventListener('input', (event) => {
      const newValue = event.target.value;
      this.rangeValue.textContent = newValue;
    });

    await this.updatedFabric();
    this.hideLoader(); // Hide loader after adding scene1
    this.fabricControls.style.display = 'block';

  }

  async getLocalFabric(data) {
    console.time('getLocalFabric'); // Start timing
    this.showLoader();
    this.fabricControls.style.display = 'none';
    this.scene1.visible = false;
    this.currentFabricId = data;
    console.log("calling update fabrics from getLocalFabric");
    await this.updatedFabric();
    console.log("updated fabric");
    const time = console.timeEnd('getLocalFabric'); // End timing
    console.log(`getLocalFabric took ${(time / 1000).toFixed(2)} seconds`);
  }

  setRender() {
    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
      powerPreference: "high-performance",
      stencil: false,
      depth: true,
      precision: "highp",
      logarithmicDepthBuffer: true
    })

    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;
    this.renderer.shadowMap.autoUpdate = true;


    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.outputEncoding = sRGBEncoding;
    this.renderer.outputColorSpace = 'srgb';
    this.renderer.setSize(this.width, this.height);

    this.composer = new EffectComposer(this.renderer);
    const renderPass = new RenderPass(this.scene, this.camera.camera);
    this.composer.addPass(renderPass);

    // const contrastPass = new ShaderPass(BrightnessContrastShader);
    // contrastPass.uniforms['brightness'].value = -0.0001;  // Increase brightness (adjust as needed)
    // contrastPass.uniforms['contrast'].value = 0.000000005; // Reduce contrast
    // this.composer.addPass(contrastPass);

    // const fxaaPass = new ShaderPass(FXAAShader);
    // fxaaPass.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
    // this.composer.addPass(fxaaPass);

    // const ssaaPass = new SSAARenderPass(this.scene, this.camera.camera);
    // ssaaPass.sampleLevel = 2;
    // this.composer.addPass(ssaaPass);


  }



  setScene() {
    this.scene = new Scene();
    this.scene.background = new Color(0x000000);
  }

  setControls() {
    this.controls = new OrbitControls(this.camera.camera, this.renderer.domElement)
    this.controls.minPolarAngle = Math.PI / 2; // Lock vertical rotation
    this.controls.maxPolarAngle = Math.PI / 2; // Lock vertical rotation
    // this.controls.enableZoom = false;
  }

  modelSetUp() {
    this.scene1 = LoaderManager.assets[`model1`].gltf.scene
    this.scene1.scale.set(0.0125, 0.0125, 0.0125);
    this.scene1.visible = false;
    this.scene.add(this.scene1);
  }

  loadTextureFromURL(url) {
    console.time(`loadTextureFromURL: ${url}`); // Start timing
    return new Promise((resolve, reject) => {
      const textureLoader = new TextureLoader();

      textureLoader.load(
        url,
        (texture) => {
          texture.colorSpace = 'srgb';
          texture.needsUpdate = true;
          const time = console.timeEnd(`loadTextureFromURL: ${url}`); // End timing
          console.log(`loadTextureFromURL for ${url} took ${(time / 1000).toFixed(2)} seconds`);
          resolve(texture);
        },
        undefined,
        (error) => {
          console.error('Error loading texture:', error);
          const time = console.timeEnd(`loadTextureFromURL: ${url}`); // End timing
          console.log(`loadTextureFromURL for ${url} took ${(time / 1000).toFixed(2)} seconds`);
          reject(error);
        }
      );
    });
  }


  isPartOfButtons = (object) => {
    let current = object;
    while (current) {
      if (current.name === 'buttons') return true;
      current = current.parent;
    }
    return false;
  };

  updateTexture(colorTexture, normalTexture, nRepetations) {
    console.time('updateTexture'); // Start timing
    this.scene1.traverse((child) => {
      if (child.isMesh && !this.isPartOfButtons(child)) {
        child.castShadow = true;
        child.receiveShadow = true;

        // Clear previous textures
        child.material.map = null;
        child.material.normal = null;

        // Apply new textures
        child.material.map = colorTexture;
        child.material.normal = normalTexture;
        colorTexture.wrapS = RepeatWrapping;
        colorTexture.wrapT = RepeatWrapping;

        child.material.polygonOffset = true;
        child.material.polygonOffsetFactor = 1;
        child.material.polygonOffsetUnits = 1;

        colorTexture.repeat.set(
          nRepetations, nRepetations
        );
        normalTexture.repeat.set(
          nRepetations, nRepetations
        );

        const maxAnisotropy = this.renderer.capabilities.getMaxAnisotropy();
        colorTexture.anisotropy = maxAnisotropy;
        normalTexture.anisotropy = maxAnisotropy;

        colorTexture.generateMipmaps = true;
        colorTexture.minFilter = LinearMipmapLinearFilter;
        colorTexture.magFilter = LinearFilter;

        normalTexture.generateMipmaps = true;
        normalTexture.minFilter = LinearMipmapLinearFilter;
        normalTexture.magFilter = LinearFilter;

        child.material.depthWrite = true;
        child.material.depthTest = true;

        child.material.metalness = 0;
        child.material.roughness = 1;
        child.material.needsUpdate = true;
      }
    });
    console.log("adding scene1 to scene")
    this.scene1.visible = true;
    this.hideLoader();
    this.fabricControls.style.display = 'block';
    const time = console.timeEnd('updateTexture'); // End timing
    console.log(`updateTexture took ${(time / 1000).toFixed(2)} seconds`);
  }

  setAxesHelper() {
    const axesHelper = new AxesHelper(3)
    this.scene.add(axesHelper)
  }

  setGUI() {
    this.gui = new GUI()

    const lightFolder = this.gui.addFolder('Directional Lights')

    // Light 2 controls
    const light2 = lightFolder.addFolder('Light 2 Position')
    this.lightSettings.light2 = {
      x: this.dirLight2.position.x,
      y: this.dirLight2.position.y,
      z: this.dirLight2.position.z
    }
    light2.add(this.lightSettings.light2, 'x', -100, 100, 1)
      .onChange(value => this.dirLight2.position.x = value)
    light2.add(this.lightSettings.light2, 'y', -100, 100, 1)
      .onChange(value => this.dirLight2.position.y = value)
    light2.add(this.lightSettings.light2, 'z', -100, 100, 1)
      .onChange(value => this.dirLight2.position.z = value)

    // Light 3 controls
    const light3 = lightFolder.addFolder('Light 3 Position')
    this.lightSettings.light3 = {
      x: this.dirLight3.position.x,
      y: this.dirLight3.position.y,
      z: this.dirLight3.position.z
    }
    light3.add(this.lightSettings.light3, 'x', -100, 100, 1)
      .onChange(value => this.dirLight3.position.x = value)
    light3.add(this.lightSettings.light3, 'y', -100, 100, 1)
      .onChange(value => this.dirLight3.position.y = value)
    light3.add(this.lightSettings.light3, 'z', -100, 100, 1)
      .onChange(value => this.dirLight3.position.z = value)

    // Add shadow controls for Light 3
    const shadow3 = lightFolder.addFolder('Light 3 Shadow')
    this.lightSettings.shadow3 = {
      bias: -0.00001,
      normalBias: 0.005,
      radius: 0,
      mapSize: 4096,
      cameraLeft: -30,
      cameraRight: 30,
      cameraTop: 30,
      cameraBottom: -30,
      cameraNear: 0.1,
      cameraFar: 500
    }

    shadow3.add(this.lightSettings.shadow3, 'bias', -0.0001, 0.0001, 0.00001)
      .onChange(value => this.dirLight3.shadow.bias = value)
    shadow3.add(this.lightSettings.shadow3, 'normalBias', 0, 0.05, 0.001)
      .onChange(value => this.dirLight3.shadow.normalBias = value)
    shadow3.add(this.lightSettings.shadow3, 'radius', 0, 10, 0.1)
      .onChange(value => this.dirLight3.shadow.radius = value)
    shadow3.add(this.lightSettings.shadow3, 'mapSize', 512, 4096, 512)
      .onChange(value => {
        this.dirLight3.shadow.mapSize.width = value
        this.dirLight3.shadow.mapSize.height = value
      })
    shadow3.add(this.lightSettings.shadow3, 'cameraLeft', -100, 0, 1)
      .onChange(value => this.dirLight3.shadow.camera.left = value)
    shadow3.add(this.lightSettings.shadow3, 'cameraRight', 0, 100, 1)
      .onChange(value => this.dirLight3.shadow.camera.right = value)
    shadow3.add(this.lightSettings.shadow3, 'cameraTop', 0, 100, 1)
      .onChange(value => this.dirLight3.shadow.camera.top = value)
    shadow3.add(this.lightSettings.shadow3, 'cameraBottom', -100, 0, 1)
      .onChange(value => this.dirLight3.shadow.camera.bottom = value)
    shadow3.add(this.lightSettings.shadow3, 'cameraNear', 0.1, 10, 0.1)
      .onChange(value => this.dirLight3.shadow.camera.near = value)
    shadow3.add(this.lightSettings.shadow3, 'cameraFar', 100, 1000, 10)
      .onChange(value => this.dirLight3.shadow.camera.far = value)


  }

  events() {
    window.addEventListener('resize', this.handleResize, { passive: true })
    this.draw(0)
  }

  draw = (time) => {
    this.composer.render()
    this.raf = window.requestAnimationFrame(this.draw)
    if (this.controls) this.controls.update();

    // Get camera's direction vector
    const cameraDirection = new Vector3();
    this.camera.camera.getWorldDirection(cameraDirection);

    if (this.dirLight2) {
      const offsetX = 37;
      const offsetY = 14;
      const offsetZ = 74;

      const quaternion = this.camera.camera.quaternion;
      const offsetVector = new Vector3(offsetX, offsetY, offsetZ);
      offsetVector.applyQuaternion(quaternion);

      this.dirLight2.position.copy(this.camera.camera.position).add(offsetVector);
    }

    if (this.dirLight3) {
      const offsetX = -49;
      const offsetY = 14;
      const offsetZ = 74;

      const quaternion = this.camera.camera.quaternion;
      const offsetVector = new Vector3(offsetX, offsetY, offsetZ);
      offsetVector.applyQuaternion(quaternion);
      this.dirLight3.position.copy(this.camera.camera.position).add(offsetVector);
      this.dirLight3.target.position.copy(new Vector3(0, 0, 0));
      this.dirLight3.shadow.camera.updateProjectionMatrix();
      this.dirLight3.target.updateMatrixWorld();
    }
  }

  handleResize = () => {
    this.width = window.innerWidth - 100
    this.height = window.innerHeight - 100

    // Update camera
    this.camera.camera.aspect = this.width / this.height
    this.camera.camera.updateProjectionMatrix()
    this.renderer.setSize(this.width, this.height)
    this.composer.setSize(this.width, this.height)
  }

  setRaycaster() {
    this.ray = new Raycaster()
    this.mouse = new Vector2()
  }

  getFabricIndexFromURL() {
    const urlPath = window.location.pathname;
    const match = urlPath.match(/\/id=(\d+)/);
    return match ? parseInt(match[1], 10) : 0; // Default to 0 if no match
  }

  async updatedFabric() {
    console.time('updatedFabric'); // Start timing
    if (this.currentFabricId) {
      console.log("currentFabricId", this.currentFabricId)
      this.currentFabric = this.allfabrics.find(fabric => fabric.id === this.currentFabricId);
      console.log('currentFabric', this.currentFabric)
      this.colorTexture = await this.loadTextureFromURL(this.currentFabric.repeatable_color_image_url)
      this.normalTexture = await this.loadTextureFromURL(this.currentFabric.repeatable_normal_image_url)

      this.nRepetations = this.currentFabric.nRepetition
      if (this.colorTexture) {
        this.updateTexture(this.colorTexture, this.normalTexture, this.nRepetations)
      }
    }
    const time = console.timeEnd('updatedFabric'); // End timing
    console.log(`updatedFabric took ${(time / 1000).toFixed(2)} seconds`);
  }

  async getActualeData() {
    const response = await axios.get(
      `https://api.tg3ds.com/api/v1/fabrics?apikey=QaLQzsUNDDcXVPZei0p3fegHMD7AzhJpFoct&limit=150`
    );
    this.mainFabric = response.data.fabrics;
    const fabric = this.mainFabric.find(fabric => fabric.id === 'Nj1xdDY4');
    console.log("mainFabric", this.mainFabric)
    console.log("fabric with tg3ds url", fabric)
    this.colorTexture = await this.loadTextureFromURL(fabric.repeatable_color_image_url)
    this.normalTexture = await this.loadTextureFromURL(fabric.repeatable_normal_image_url)
    this.nRepetations = fabric.tiling_info
    if (this.colorTexture) {
      this.updateTexture(this.colorTexture, this.normalTexture, this.nRepetations)
    }
  }

  updateFabric = async () => {
    try {
      const sliderValue = this.slider ? this.slider.value : this.nRepetations;
      if (this.nRepetations !== Number(this.slider.value)) {
        const response = await axios.post(`${api}update/fabrics`, {
          id: this.currentFabricId,
          data: {
            nRepetition: Number(sliderValue)
          }
        });
        if (response.data.data.acknowledged == true) {
          document.querySelector('.popup').style.display = 'none';
          const element = document.querySelector('.selected'); // Replace with the actual class name
          if (element) {
            element.classList.remove('selected'); // Replace with the actual class name
          }
          this.currentFabric.nRepetition = Number(sliderValue)
          console.log("currentFabric ::", this.currentFabric)
        }
      } else {
        document.querySelector('.popup').style.display = 'none';
        const element = document.querySelector('.selected'); // Replace with the actual class name
        if (element) {
          element.classList.remove('selected'); // Replace with the actual class name
        }
        this.currentFabric.nRepetition = Number(sliderValue)
        console.log("currentFabric ::", this.currentFabric)
      }
    } catch (error) {
      console.error(error);
    }
  }

  // { id: 'BjedemA4', data: {nRepetition: 20, otherFields:"any data"} }

  setupSlider() {
    if (this.slider) {
      this.slider.addEventListener('input', (event) => {
        const newValue = event.target.value;
        this.updateTextureRepeat(newValue);
      });
    }
  }

  setSliderValue(value) {
    this.slider.value = Number(value);
    this.rangeValue.textContent = Number(value);
  }

  updateTextureRepeat(value) {
    this.scene1.traverse((child) => {
      if (child.isMesh && !this.isPartOfButtons(child)) {
        const repeatValue = parseFloat(value);

        child.material.map.repeat.set(repeatValue, repeatValue);
        child.material.normal.repeat.set(repeatValue, repeatValue);

        child.material.map.needsUpdate = true;
        child.material.normal.needsUpdate = true;
      }
    });
  }
}
