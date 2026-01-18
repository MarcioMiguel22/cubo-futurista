// ============================================
// CUBO FUTURISTA - Three.js + TypeScript
// ============================================

import * as THREE from 'three';

// ============================================
// TIPOS
// ============================================

interface MousePosition {
    x: number;
    y: number;
}

interface StoryStep {
    text: string;
    duration: number;
}

interface PlanetCube {
    mesh: THREE.Mesh;
    wireframe: THREE.LineSegments;
    basePosition: THREE.Vector3;
    label: string;
    index: number;
}

// ============================================
// CLASSE HERO (intro)
// ============================================

class FuturisticCube {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private currentMesh: THREE.Mesh;
    private stars: THREE.Points;
    private mouse: MousePosition = { x: 0, y: 0 };
    private time: number = 0;

    // Transformacao
    private currentGeometryIndex: number = 0;
    private geometries: THREE.BufferGeometry[] = [];

    // Historia
    private storyElement: HTMLElement | null = null;
    private currentStoryIndex: number = 0;
    private story: StoryStep[] = [
        { text: "Tudo começa com uma ideia...", duration: 4000 },
        { text: "Um pensamento simples, como um cubo.", duration: 4000 },
        { text: "Mas as ideias evoluem.", duration: 3000 },
        { text: "Ganham forma, complexidade...", duration: 4000 },
        { text: "Cada aresta é uma decisão.", duration: 3500 },
        { text: "Cada face, um desafio superado.", duration: 4000 },
        { text: "O código transforma o abstrato em real.", duration: 4500 },
        { text: "Linha por linha, a visão ganha vida.", duration: 4000 },
        { text: "Uma ideia que se tornou realidade.", duration: 4000 },
        { text: "Criado por Márcio Miguel.", duration: 5000 }
    ];

    constructor(container: HTMLElement) {
        this.scene = this.createScene();
        this.camera = this.createCamera();
        this.renderer = this.createRenderer(container);

        this.createGeometries();

        const { mesh } = this.createMesh(this.geometries[0]);
        this.currentMesh = mesh;

        this.stars = this.createStars(2000);
        this.createStoryElement();

        this.addLights();
        this.setupEventListeners();
        this.animate();

        // Iniciar transformacao apos 10 segundos
        setTimeout(() => this.startTransformation(), 10000);
    }

    private createScene(): THREE.Scene {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0a0a);
        return scene;
    }

    private createCamera(): THREE.PerspectiveCamera {
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.z = 5;
        return camera;
    }

    private createRenderer(container: HTMLElement): THREE.WebGLRenderer {
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);
        return renderer;
    }

    private createGeometries(): void {
        const size = 2;
        this.geometries.push(new THREE.BoxGeometry(size, size, size));
        this.geometries.push(new THREE.OctahedronGeometry(size * 0.7));
        this.geometries.push(new THREE.DodecahedronGeometry(size * 0.7));
        this.geometries.push(new THREE.IcosahedronGeometry(size * 0.7));
        this.geometries.push(new THREE.IcosahedronGeometry(size * 0.7, 1));
        this.geometries.push(new THREE.IcosahedronGeometry(size * 0.7, 2));
        this.geometries.push(new THREE.IcosahedronGeometry(size * 0.7, 3));
        this.geometries.push(new THREE.SphereGeometry(size * 0.7, 32, 32));
    }

    private createMesh(geometry: THREE.BufferGeometry): { mesh: THREE.Mesh, wireframe: THREE.LineSegments } {
        const material = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            metalness: 0.3,
            roughness: 0.4
        });

        const mesh = new THREE.Mesh(geometry, material);

        const edgesGeometry = new THREE.EdgesGeometry(geometry);
        const edgesMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.3
        });
        const wireframe = new THREE.LineSegments(edgesGeometry, edgesMaterial);
        mesh.add(wireframe);

        this.scene.add(mesh);
        return { mesh, wireframe };
    }

    private createStars(count: number): THREE.Points {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);

        for (let i = 0; i < count * 3; i += 3) {
            const radius = 50 + Math.random() * 100;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;

            positions[i] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i + 2] = radius * Math.cos(phi);
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.08,
            transparent: true,
            opacity: 0.8
        });

        const stars = new THREE.Points(geometry, material);
        this.scene.add(stars);
        return stars;
    }

    private createStoryElement(): void {
        this.storyElement = document.createElement('div');
        this.storyElement.id = 'story';
        this.storyElement.style.cssText = `
            position: fixed;
            bottom: 15%;
            left: 50%;
            transform: translateX(-50%);
            color: #ffffff;
            font-family: 'Segoe UI', sans-serif;
            font-size: 1.2rem;
            font-weight: 300;
            letter-spacing: 0.1rem;
            text-align: center;
            opacity: 0;
            transition: opacity 1s ease;
            pointer-events: none;
            max-width: 80%;
            z-index: 100;
        `;
        document.body.appendChild(this.storyElement);
    }

    private showStoryText(text: string): void {
        if (this.storyElement) {
            this.storyElement.style.opacity = '0';
            setTimeout(() => {
                if (this.storyElement) {
                    this.storyElement.textContent = text;
                    this.storyElement.style.opacity = '0.8';
                }
            }, 500);
        }
    }

    private startTransformation(): void {
        this.currentGeometryIndex = 0;
        this.currentStoryIndex = 0;

        const overlay = document.querySelector('.overlay') as HTMLElement;
        if (overlay) {
            overlay.style.transition = 'opacity 2s ease';
            overlay.style.opacity = '0';
        }

        this.advanceStory();
    }

    private advanceStory(): void {
        if (this.currentStoryIndex < this.story.length) {
            const step = this.story[this.currentStoryIndex];
            this.showStoryText(step.text);

            if (this.currentStoryIndex % 1 === 0 && this.currentGeometryIndex < this.geometries.length - 1) {
                setTimeout(() => this.morphToNextGeometry(), 2000);
            }

            this.currentStoryIndex++;
            setTimeout(() => this.advanceStory(), step.duration);
        } else {
            setTimeout(() => {
                if (this.storyElement) {
                    this.storyElement.style.opacity = '0';
                }
                setTimeout(() => this.startImplosion(), 2000);
            }, 2000);
        }
    }

    private startImplosion(): void {
        this.implodeToNextGeometry();
    }

    private implodeToNextGeometry(): void {
        if (this.currentGeometryIndex > 0) {
            this.currentGeometryIndex--;

            const currentRotation = {
                x: this.currentMesh.rotation.x,
                y: this.currentMesh.rotation.y,
                z: this.currentMesh.rotation.z
            };

            this.scene.remove(this.currentMesh);

            const { mesh } = this.createMesh(this.geometries[this.currentGeometryIndex]);
            this.currentMesh = mesh;

            this.currentMesh.rotation.x = currentRotation.x;
            this.currentMesh.rotation.y = currentRotation.y;
            this.currentMesh.rotation.z = currentRotation.z;

            this.currentMesh.scale.set(1.1, 1.1, 1.1);

            setTimeout(() => this.implodeToNextGeometry(), 2500);
        } else {
            setTimeout(() => {
                const overlay = document.querySelector('.overlay') as HTMLElement;
                if (overlay) {
                    overlay.style.opacity = '1';
                }

                setTimeout(() => this.showSiteName(), 1500);
            }, 1000);
        }
    }

    private showSiteName(): void {
        const overlay = document.querySelector('.overlay') as HTMLElement;
        const siteName = document.querySelector('.site-name') as HTMLElement;

        if (overlay && siteName) {
            overlay.classList.add('fade-out');

            setTimeout(() => {
                siteName.classList.add('visible');

                // Habilitar scroll
                document.body.classList.add('scroll-enabled');

                // Adicionar evento de clique
                siteName.addEventListener('click', () => {
                    const universe = document.getElementById('universe');
                    if (universe) {
                        universe.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            }, 500);
        }
    }

    private morphToNextGeometry(): void {
        if (this.currentGeometryIndex < this.geometries.length - 1) {
            this.currentGeometryIndex++;

            const currentRotation = {
                x: this.currentMesh.rotation.x,
                y: this.currentMesh.rotation.y,
                z: this.currentMesh.rotation.z
            };

            this.scene.remove(this.currentMesh);

            const { mesh } = this.createMesh(this.geometries[this.currentGeometryIndex]);
            this.currentMesh = mesh;

            this.currentMesh.rotation.x = currentRotation.x;
            this.currentMesh.rotation.y = currentRotation.y;
            this.currentMesh.rotation.z = currentRotation.z;

            this.currentMesh.scale.set(0.8, 0.8, 0.8);
        }
    }

    private addLights(): void {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);

        const pointLight1 = new THREE.PointLight(0xffffff, 1, 100);
        pointLight1.position.set(5, 5, 5);
        this.scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0xffffff, 0.5, 100);
        pointLight2.position.set(-5, -5, 5);
        this.scene.add(pointLight2);
    }

    private setupEventListeners(): void {
        document.addEventListener('mousemove', (event: MouseEvent) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    private animate = (): void => {
        requestAnimationFrame(this.animate);

        this.time += 0.008;

        this.currentMesh.rotation.x = Math.sin(this.time * 0.5) * 0.5 + Math.sin(this.time * 0.3) * 0.3;
        this.currentMesh.rotation.y = Math.cos(this.time * 0.4) * 0.5 + Math.cos(this.time * 0.2) * 0.3;
        this.currentMesh.rotation.z = Math.sin(this.time * 0.3) * 0.2;

        this.currentMesh.rotation.x += this.mouse.y * 0.1;
        this.currentMesh.rotation.y += this.mouse.x * 0.1;

        const targetScale = 1;
        const scaleSpeed = 0.008;
        const diff = targetScale - this.currentMesh.scale.x;
        if (Math.abs(diff) > 0.001) {
            this.currentMesh.scale.x += diff * scaleSpeed * 2;
            this.currentMesh.scale.y += diff * scaleSpeed * 2;
            this.currentMesh.scale.z += diff * scaleSpeed * 2;
        }

        this.stars.rotation.y += 0.0002;

        this.renderer.render(this.scene, this.camera);
    };
}

// ============================================
// CLASSE UNIVERSO (5 cubos em estrela)
// ============================================

class UniverseScene {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private planets: PlanetCube[] = [];
    private stars: THREE.Points;
    private mouse: MousePosition = { x: 0, y: 0 };
    private time: number = 0;
    private raycaster: THREE.Raycaster;
    private hoveredPlanet: PlanetCube | null = null;
    private container: HTMLElement;

    // Animacao para linha
    private isAnimating: boolean = false;
    private animationProgress: number = 0;
    private linePositions: THREE.Vector3[] = [];
    private starPositions: THREE.Vector3[] = [];

    // Animacao de foco (expansão do cubo)
    private focusedPlanet: PlanetCube | null = null;
    private focusProgress: number = 0;
    private isFocusing: boolean = false;
    private isUnfocusing: boolean = false;

    private planetNames = ['PROJETOS', 'SOBRE', 'SKILLS', 'CONTACTO', 'BLOG'];

    constructor(container: HTMLElement) {
        this.container = container;
        this.scene = this.createScene();
        this.camera = this.createCamera();
        this.renderer = this.createRenderer(container);
        this.raycaster = new THREE.Raycaster();

        this.stars = this.createStars(1500);
        this.createPlanets();
        this.calculatePositions();
        this.addLights();
        this.setupEventListeners();
        this.animate();

        // Observar quando a secção fica visível para iniciar animação
        this.observeVisibility();
    }

    private isMobile(): boolean {
        return window.innerWidth < 768;
    }

    private calculatePositions(): void {
        // Guardar posições originais (estrela)
        for (let i = 0; i < this.planets.length; i++) {
            this.starPositions.push(this.planets[i].basePosition.clone());
        }

        // Calcular posições em linha (horizontal em desktop, vertical em mobile)
        const spacing = this.isMobile() ? 1.8 : 2.5;

        if (this.isMobile()) {
            // Linha vertical em mobile
            const startY = ((this.planets.length - 1) * spacing) / 2;
            for (let i = 0; i < this.planets.length; i++) {
                this.linePositions.push(new THREE.Vector3(0, startY - i * spacing, 0));
            }
        } else {
            // Linha horizontal em desktop
            const startX = -((this.planets.length - 1) * spacing) / 2;
            for (let i = 0; i < this.planets.length; i++) {
                this.linePositions.push(new THREE.Vector3(startX + i * spacing, 0, 0));
            }
        }
    }

    private observeVisibility(): void {
        const universeSection = document.getElementById('universe');
        if (universeSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.isAnimating) {
                        // Esperar 0.5 segundos depois de visível
                        setTimeout(() => {
                            this.isAnimating = true;
                        }, 500);
                    }
                });
            }, { threshold: 0.3 });

            observer.observe(universeSection);
        }
    }

    private createScene(): THREE.Scene {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0a0a);
        return scene;
    }

    private createCamera(): THREE.PerspectiveCamera {
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        // Câmara mais afastada em mobile para ver linha vertical
        camera.position.z = this.isMobile() ? 10 : 8;
        return camera;
    }

    private createRenderer(container: HTMLElement): THREE.WebGLRenderer {
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);
        return renderer;
    }

    private createStars(count: number): THREE.Points {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);

        for (let i = 0; i < count * 3; i += 3) {
            const radius = 30 + Math.random() * 70;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;

            positions[i] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i + 2] = radius * Math.cos(phi);
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.05,
            transparent: true,
            opacity: 0.7
        });

        const stars = new THREE.Points(geometry, material);
        this.scene.add(stars);
        return stars;
    }

    // Criar 5 cubos em forma de estrela
    private createPlanets(): void {
        // Raio menor em mobile
        const radius = this.isMobile() ? 2.5 : 3.5;
        const angleOffset = -Math.PI / 2; // Começar do topo

        for (let i = 0; i < 5; i++) {
            const angle = angleOffset + (i * 2 * Math.PI) / 5;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            const planet = this.createPlanetCube(i, x, y, 0);
            this.planets.push(planet);
        }
    }

    private createPlanetCube(index: number, x: number, y: number, z: number): PlanetCube {
        const size = 0.6;
        const geometry = new THREE.BoxGeometry(size, size, size);

        const material = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            metalness: 0.3,
            roughness: 0.4,
            transparent: true,
            opacity: 0.9
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);

        // Wireframe
        const edgesGeometry = new THREE.EdgesGeometry(geometry);
        const edgesMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.5
        });
        const wireframe = new THREE.LineSegments(edgesGeometry, edgesMaterial);
        mesh.add(wireframe);

        this.scene.add(mesh);

        return {
            mesh,
            wireframe,
            basePosition: new THREE.Vector3(x, y, z),
            label: this.planetNames[index],
            index
        };
    }

    private addLights(): void {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);

        const pointLight1 = new THREE.PointLight(0xffffff, 1, 100);
        pointLight1.position.set(5, 5, 5);
        this.scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0xffffff, 0.5, 100);
        pointLight2.position.set(-5, -5, 5);
        this.scene.add(pointLight2);
    }

    private setupEventListeners(): void {
        document.addEventListener('mousemove', (event: MouseEvent) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            this.checkHover();
        });

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Clique nos cubos
        this.container.addEventListener('click', () => {
            if (this.hoveredPlanet) {
                this.onPlanetClick(this.hoveredPlanet);
            }
        });
    }

    private checkHover(): void {
        this.raycaster.setFromCamera(new THREE.Vector2(this.mouse.x, this.mouse.y), this.camera);

        const meshes = this.planets.map(p => p.mesh);
        const intersects = this.raycaster.intersectObjects(meshes);

        // Esconder todos os labels
        this.planets.forEach((_planet, i) => {
            const label = document.getElementById(`label-${i}`);
            if (label) label.style.opacity = '0';
        });

        if (intersects.length > 0) {
            const intersectedMesh = intersects[0].object;
            const planet = this.planets.find(p => p.mesh === intersectedMesh);

            if (planet) {
                this.hoveredPlanet = planet;
                document.body.style.cursor = 'pointer';

                // Mostrar label
                const label = document.getElementById(`label-${planet.index}`);
                if (label) {
                    const screenPos = this.getScreenPosition(planet.mesh.position);
                    label.style.left = `${screenPos.x}px`;
                    label.style.top = `${screenPos.y - 50}px`;
                    label.style.opacity = '1';
                }
            }
        } else {
            this.hoveredPlanet = null;
            document.body.style.cursor = 'default';
        }
    }

    private getScreenPosition(position: THREE.Vector3): { x: number, y: number } {
        const vector = position.clone();
        vector.project(this.camera);

        const universeSection = document.getElementById('universe');
        const offsetTop = universeSection ? universeSection.offsetTop : window.innerHeight;

        return {
            x: (vector.x * 0.5 + 0.5) * window.innerWidth,
            y: (-(vector.y * 0.5) + 0.5) * window.innerHeight + offsetTop
        };
    }

    private onPlanetClick(planet: PlanetCube): void {
        // Se já há um cubo focado
        if (this.focusedPlanet) {
            // Clicar no cubo focado = voltar atrás
            if (this.focusedPlanet === planet) {
                this.isUnfocusing = true;
                this.isFocusing = false;
            }
            return;
        }

        // Focar no cubo clicado
        this.focusedPlanet = planet;
        this.isFocusing = true;
        this.isUnfocusing = false;
        this.focusProgress = 0;
    }

    private animate = (): void => {
        requestAnimationFrame(this.animate);

        this.time += 0.008;

        // Progredir animação de estrela para linha
        if (this.isAnimating && this.animationProgress < 1) {
            this.animationProgress += 0.006; // Velocidade suave
            if (this.animationProgress > 1) this.animationProgress = 1;
        }

        // Progredir animação de foco
        if (this.isFocusing && this.focusProgress < 1) {
            this.focusProgress += 0.04;
            if (this.focusProgress > 1) this.focusProgress = 1;
        }
        if (this.isUnfocusing && this.focusProgress > 0) {
            this.focusProgress -= 0.04;
            if (this.focusProgress <= 0) {
                this.focusProgress = 0;
                this.isUnfocusing = false;
                this.focusedPlanet = null;
            }
        }

        // Animar cada cubo
        this.planets.forEach((planet, i) => {
            // Rotacao individual
            planet.mesh.rotation.x += 0.005;
            planet.mesh.rotation.y += 0.008;

            // Animação de estrela para linha
            if (this.isAnimating && this.starPositions[i] && this.linePositions[i]) {
                const starPos = this.starPositions[i];
                const linePos = this.linePositions[i];

                // Ease out cubic - movimento natural
                const ease = 1 - Math.pow(1 - this.animationProgress, 3);

                // Interpolar posições
                planet.mesh.position.x = starPos.x + (linePos.x - starPos.x) * ease;
                planet.mesh.position.y = starPos.y + (linePos.y - starPos.y) * ease;
                planet.mesh.position.z = starPos.z + (linePos.z - starPos.z) * ease;

                // Ondulação durante transição
                if (this.animationProgress < 1) {
                    const wave = Math.sin(this.time * 3 + i * 0.8) * (1 - this.animationProgress) * 0.3;
                    planet.mesh.position.y += wave;
                }

                // Atualizar basePosition quando terminar
                if (this.animationProgress >= 1) {
                    planet.basePosition.copy(linePos);
                }
            }

            // Movimento flutuante depois de formado em linha
            if (this.animationProgress >= 1) {
                const floatOffset = Math.sin(this.time + i * 1.2) * 0.1;
                planet.mesh.position.y = planet.basePosition.y + floatOffset;
            } else if (!this.isAnimating) {
                // Movimento flutuante antes da animação
                const floatOffset = Math.sin(this.time + i * 1.2) * 0.1;
                planet.mesh.position.y = planet.basePosition.y + floatOffset;
            }

            // Animação de foco
            if (this.focusedPlanet && this.focusProgress > 0) {
                const ease = 1 - Math.pow(1 - this.focusProgress, 3);

                if (this.focusedPlanet === planet) {
                    // Cubo focado: aproxima e expande
                    const targetZ = 4; // Aproximar da câmara
                    const targetScale = 2.5; // Expandir

                    planet.mesh.position.z = planet.basePosition.z + targetZ * ease;
                    const scale = 1 + (targetScale - 1) * ease;
                    planet.mesh.scale.set(scale, scale, scale);
                } else {
                    // Outros cubos: afastar e diminuir opacidade
                    const targetZ = -3;
                    planet.mesh.position.z = planet.basePosition.z + targetZ * ease;

                    // Reduzir opacidade
                    const material = planet.mesh.material as THREE.MeshStandardMaterial;
                    material.opacity = 0.9 - 0.6 * ease;

                    const scale = 1 - 0.3 * ease;
                    planet.mesh.scale.set(scale, scale, scale);
                }
            } else {
                // Escala quando hover (só se não estiver em modo foco)
                const targetScale = this.hoveredPlanet === planet ? 1.3 : 1;
                planet.mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

                // Reset z e opacidade
                planet.mesh.position.z = planet.basePosition.z;
                const material = planet.mesh.material as THREE.MeshStandardMaterial;
                material.opacity = 0.9;
            }
        });

        // Estrelas rodam
        this.stars.rotation.y += 0.0001;

        this.renderer.render(this.scene, this.camera);
    };
}

// ============================================
// INICIAR
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const heroContainer = document.getElementById('canvas-container');
    const universeContainer = document.getElementById('universe-container');

    if (heroContainer) {
        new FuturisticCube(heroContainer);
    }

    if (universeContainer) {
        new UniverseScene(universeContainer);
    }
});
