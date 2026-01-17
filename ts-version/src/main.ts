// ============================================
// CUBO FUTURISTA - Three.js + TypeScript
// ============================================
// TypeScript adiciona TIPOS ao JavaScript
// Isso ajuda a evitar erros e melhora autocomplete
// ============================================

import * as THREE from 'three';

// ============================================
// TIPOS PERSONALIZADOS (TypeScript)
// ============================================

// Interface define a "forma" de um objeto
interface MousePosition {
    x: number;
    y: number;
}

// Type alias para configuracoes
type CubeConfig = {
    size: number;
    color: number;
    metalness: number;
    roughness: number;
};

// ============================================
// CLASSE PRINCIPAL DA APLICACAO
// ============================================

class FuturisticCube {
    // PROPRIEDADES com tipos definidos
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private cube: THREE.Mesh;
    private particles: THREE.Points;
    private mouse: MousePosition = { x: 0, y: 0 };

    // CONSTRUTOR - corre quando criamos new FuturisticCube()
    constructor(container: HTMLElement) {
        // Inicializar componentes Three.js
        this.scene = this.createScene();
        this.camera = this.createCamera();
        this.renderer = this.createRenderer(container);
        this.cube = this.createCube({
            size: 2,
            color: 0x00ffff,
            metalness: 0.7,
            roughness: 0.2
        });
        this.particles = this.createParticles(500);

        // Adicionar luzes
        this.addLights();

        // Configurar eventos
        this.setupEventListeners();

        // Iniciar animacao
        this.animate();
    }

    // ============================================
    // METODOS PRIVADOS (so acessiveis dentro da classe)
    // ============================================

    private createScene(): THREE.Scene {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0a0a);
        scene.fog = new THREE.Fog(0x0a0a0a, 5, 15);
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

    private createCube(config: CubeConfig): THREE.Mesh {
        // Geometria
        const geometry = new THREE.BoxGeometry(
            config.size,
            config.size,
            config.size
        );

        // Material
        const material = new THREE.MeshStandardMaterial({
            color: config.color,
            metalness: config.metalness,
            roughness: config.roughness
        });

        // Mesh
        const cube = new THREE.Mesh(geometry, material);

        // Adicionar wireframe como filho
        const edgesGeometry = new THREE.EdgesGeometry(geometry);
        const edgesMaterial = new THREE.LineBasicMaterial({
            color: config.color,
            transparent: true,
            opacity: 0.5
        });
        const wireframe = new THREE.LineSegments(edgesGeometry, edgesMaterial);
        cube.add(wireframe);

        this.scene.add(cube);
        return cube;
    }

    private createParticles(count: number): THREE.Points {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);

        for (let i = 0; i < count * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 20;
        }

        geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(positions, 3)
        );

        const material = new THREE.PointsMaterial({
            color: 0x00ffff,
            size: 0.02,
            transparent: true,
            opacity: 0.8
        });

        const particles = new THREE.Points(geometry, material);
        this.scene.add(particles);
        return particles;
    }

    private addLights(): void {
        // Luz ambiente
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        this.scene.add(ambientLight);

        // Luz ciano
        const pointLight1 = new THREE.PointLight(0x00ffff, 1, 100);
        pointLight1.position.set(5, 5, 5);
        this.scene.add(pointLight1);

        // Luz roxa
        const pointLight2 = new THREE.PointLight(0xff00ff, 0.5, 100);
        pointLight2.position.set(-5, -5, 5);
        this.scene.add(pointLight2);
    }

    private setupEventListeners(): void {
        // Mouse move
        document.addEventListener('mousemove', (event: MouseEvent) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        // Resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // METODO DE ANIMACAO (usa arrow function para manter o 'this')
    private animate = (): void => {
        requestAnimationFrame(this.animate);

        // Rotacao automatica
        this.cube.rotation.x += 0.005;
        this.cube.rotation.y += 0.005;

        // Seguir mouse
        this.cube.rotation.x += (this.mouse.y * 0.5 - this.cube.rotation.x) * 0.05;
        this.cube.rotation.y += (this.mouse.x * 0.5 - this.cube.rotation.y) * 0.05;

        // Rodar particulas
        this.particles.rotation.y += 0.001;

        // Renderizar
        this.renderer.render(this.scene, this.camera);
    };
}

// ============================================
// INICIAR APLICACAO
// ============================================

// Esperar que o DOM carregue
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('canvas-container');

    if (container) {
        // Criar instancia da aplicacao
        new FuturisticCube(container);
    } else {
        console.error('Container nao encontrado!');
    }
});

// ============================================
// DIFERENCAS TYPESCRIPT vs JAVASCRIPT:
// ============================================
//
// 1. TIPOS EXPLICITOS
//    JS:  let x = 5
//    TS:  let x: number = 5
//
// 2. INTERFACES (definir forma de objetos)
//    interface User { name: string; age: number; }
//
// 3. CLASSES com modificadores
//    private, public, protected
//
// 4. GENERICS (tipos flexiveis)
//    function first<T>(arr: T[]): T { return arr[0]; }
//
// 5. ERROS em tempo de desenvolvimento
//    O editor avisa se fizeres algo errado
//
// ============================================
