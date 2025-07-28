import MainScene from './scene';

class FabricManager {
    constructor() {
        this.api = 'https://grand-le-mar.lc.webdevprojects.cloud/api/v1/';
        // this.api = 'http://192.168.11.51:4000/api/v1/';
        this.mainSceneInstance = new MainScene();
        console.log("FabricManager constructor");
        this.init();
    }

    init() {
        console.log("init");
        document.getElementById('update-fabric-button').addEventListener('click', () => {
            console.log("updateFabric button clicked");
            this.updateFabric()
        });
    }

    async updateFabric() {
        console.log("updateFabric");
        this.addLoader();
        try {
            const response = await axios.get(`${this.api}fetch/fabrics-insert-to-database`);
            console.log(response.data);
            this.removeLoader();
            const fabrics = await this.fetchFabrics();
            console.log("fabrics", fabrics);
            // this.showFabrics(fabrics);
            const successMessage = document.querySelector('.successmessage');
            successMessage.style.display = 'block';
        } catch (error) {
            console.error(error);
            // alert('Error occurred while updating fabric.');
            this.removeLoader();
        }
    }

    async fetchFabrics() {
        try {
            const response = await axios.get(`${this.api}fetch/fabrics`);
            console.log(response.data);
            this.showFabrics(response.data.data);
            return response.data.data; // Make sure to return the fabrics data
        } catch (error) {
            console.error(error);
            throw error; // Propagate error to be caught by the caller
        }
    }

    setSliderValue(value) {
        const slider = document.querySelector('.slider');
        const rangeValue = document.querySelector('.slider-value');
        slider.value = Number(value);
        rangeValue.textContent = Number(value);
    }

    async showFabrics(fabrics) {
        const container = document.getElementById('fabric-container');

        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        this.addLoader(); // Show loader before starting to load images

        const imageLoadPromises = fabrics.map(fabric => {
            if (fabric.repeatable_color_image_url) {
                const fabricDiv = document.createElement('div');
                fabricDiv.className = 'fabric-div';

                const img = document.createElement('img');
                img.src = fabric.repeatable_color_image_url;
                img.alt = fabric.id;
                img.className = 'fabric-image';

                const idDiv = document.createElement('div');
                idDiv.innerText = fabric.serial_number;
                idDiv.className = 'fabric-serial_number';

                const idDiv1 = document.createElement('div');
                idDiv1.innerText = fabric.id;
                idDiv1.className = 'fabric-id';

                fabricDiv.appendChild(img);
                fabricDiv.appendChild(idDiv);
                fabricDiv.appendChild(idDiv1);

                container.appendChild(fabricDiv);

                img.addEventListener('click', async () => {
                    img.classList.toggle('selected');
                    document.querySelector('.popup').style.display = 'block';
                    document.querySelector('.popup').style.animation = 'scaleIn 0.15s ease-out forwards';
                    this.setSliderValue(fabric.nRepetition);
                    const response = await this.mainSceneInstance.getLocalFabric(fabric.id);
                    console.log("response ::", response);
                });

                // Return a promise that resolves when the image is loaded
                return new Promise((resolve) => {
                    img.onload = resolve;
                    img.onerror = resolve; // Resolve even if there's an error to continue
                });
            }
        });

        await Promise.all(imageLoadPromises); // Wait for all images to load
        this.removeLoader(); // Remove loader after all images are loaded
    }

    updateMaterialFabric(fabric) {
        console.log(fabric.id);
        axios.post(`${this.api}delete/fabric-by-id`, { id: fabric.id })
            .then(response => {
                setTimeout(() => {
                    this.removeLoader();
                    const successMessage = document.querySelector('.successmessage');
                    successMessage.style.display = 'block';
                }, 2000);
            })
            .catch(error => {
                console.error(error);
                this.removeLoader();
            });
    }

    addLoader() {
        document.querySelector('.loader').style.display = 'block';
        document.querySelector('body').style.pointerEvents = 'none';
        document.querySelector('.loading-message').style.display = 'block';
    }

    removeLoader() {
        document.querySelector('.loader').style.display = 'none';
        document.querySelector('body').style.pointerEvents = 'auto';
        const successMessage = document.querySelector('.success-message');
        successMessage.style.display = 'none';
        document.querySelector('.loading-message').style.display = 'none';
    }
}

export default FabricManager;

