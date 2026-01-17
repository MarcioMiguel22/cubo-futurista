// ============================================
// CUBO FUTURISTA - Three.js Tutorial
// ============================================
// Este ficheiro explica passo a passo como
// criar uma cena 3D com Three.js
// ============================================

// ============================================
// PASSO 1: CONFIGURACAO INICIAL
// ============================================

// Guardar posicao do mouse (de -1 a 1)
const mouse = {
    x: 0,
    y: 0
};

// Ouvir movimento do mouse
document.addEventListener('mousemove', (event) => {
    // Converter posicao do pixel para coordenadas normalizadas (-1 a 1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// ============================================
// PASSO 2: CRIAR A CENA
// ============================================

// A CENA e como um palco de teatro - onde tudo acontece
const scene = new THREE.Scene();

// Cor de fundo da cena (preto)
scene.background = new THREE.Color(0x0a0a0a);

// Adicionar nevoeiro para efeito de profundidade
scene.fog = new THREE.Fog(0x0a0a0a, 5, 15);

// ============================================
// PASSO 3: CRIAR A CAMERA
// ============================================

// A CAMERA e os "olhos" que veem a cena
// PerspectiveCamera simula visao humana (objetos distantes parecem menores)
const camera = new THREE.PerspectiveCamera(
    75,                                     // FOV (campo de visao) em graus
    window.innerWidth / window.innerHeight, // Aspect ratio (proporcao da tela)
    0.1,                                    // Near plane (minimo visivel)
    1000                                    // Far plane (maximo visivel)
);

// Posicionar camera afastada do centro
camera.position.z = 5;

// ============================================
// PASSO 4: CRIAR O RENDERER
// ============================================

// O RENDERER desenha a cena no ecra (usa WebGL)
const renderer = new THREE.WebGLRenderer({
    antialias: true,  // Suavizar bordas
    alpha: true       // Permitir transparencia
});

// Definir tamanho do canvas (tela toda)
renderer.setSize(window.innerWidth, window.innerHeight);

// Melhorar qualidade em ecras de alta resolucao
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Adicionar o canvas ao HTML
document.getElementById('canvas-container').appendChild(renderer.domElement);

// ============================================
// PASSO 5: CRIAR O CUBO
// ============================================

// GEOMETRIA - a forma 3D (cubo de 2x2x2 unidades)
const geometry = new THREE.BoxGeometry(2, 2, 2);

// MATERIAL - a aparencia da superficie
// MeshStandardMaterial reage a luz (mais realista)
const material = new THREE.MeshStandardMaterial({
    color: 0x00ffff,       // Cor ciano (aqua)
    metalness: 0.7,        // Quao metalico (0-1)
    roughness: 0.2,        // Quao aspero/polido (0-1)
    wireframe: false       // Mostrar so linhas? (false = solido)
});

// MESH - combina geometria + material para criar objeto
const cube = new THREE.Mesh(geometry, material);

// Adicionar cubo a cena
scene.add(cube);

// ============================================
// PASSO 6: CRIAR CUBO WIREFRAME (bordas)
// ============================================

// Criar um segundo cubo so com as linhas (efeito futurista)
const edgesGeometry = new THREE.EdgesGeometry(geometry);
const edgesMaterial = new THREE.LineBasicMaterial({
    color: 0x00ffff,
    linewidth: 2,
    transparent: true,
    opacity: 0.5
});
const wireframe = new THREE.LineSegments(edgesGeometry, edgesMaterial);
cube.add(wireframe); // Adicionar como filho do cubo (move junto)

// ============================================
// PASSO 7: ADICIONAR LUZES
// ============================================

// LUZ AMBIENTE - ilumina tudo igualmente (suave)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

// LUZ PONTUAL 1 - como uma lampada (ciano)
const pointLight1 = new THREE.PointLight(0x00ffff, 1, 100);
pointLight1.position.set(5, 5, 5);
scene.add(pointLight1);

// LUZ PONTUAL 2 - luz roxa do outro lado
const pointLight2 = new THREE.PointLight(0xff00ff, 0.5, 100);
pointLight2.position.set(-5, -5, 5);
scene.add(pointLight2);

// ============================================
// PASSO 8: CRIAR PARTICULAS DE FUNDO
// ============================================

// Criar geometria para particulas
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 500;

// Arrays para guardar posicoes (x, y, z para cada particula)
const positions = new Float32Array(particlesCount * 3);

// Gerar posicoes aleatorias
for (let i = 0; i < particlesCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 20; // -10 a 10
}

// Adicionar posicoes a geometria
particlesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
);

// Material das particulas
const particlesMaterial = new THREE.PointsMaterial({
    color: 0x00ffff,
    size: 0.02,
    transparent: true,
    opacity: 0.8
});

// Criar sistema de particulas
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// ============================================
// PASSO 9: ANIMACAO (Loop)
// ============================================

// Funcao que corre a cada frame (~60x por segundo)
function animate() {
    // Pedir ao browser para chamar animate() no proximo frame
    requestAnimationFrame(animate);

    // ROTACAO AUTOMATICA
    // Rodar o cubo lentamente
    cube.rotation.x += 0.005;
    cube.rotation.y += 0.005;

    // ROTACAO COM MOUSE
    // O cubo segue suavemente o mouse
    cube.rotation.x += (mouse.y * 0.5 - cube.rotation.x) * 0.05;
    cube.rotation.y += (mouse.x * 0.5 - cube.rotation.y) * 0.05;

    // Rodar particulas lentamente
    particles.rotation.y += 0.001;

    // Renderizar a cena (desenhar no ecra)
    renderer.render(scene, camera);
}

// Iniciar animacao
animate();

// ============================================
// PASSO 10: RESPONSIVIDADE
// ============================================

// Quando a janela muda de tamanho, atualizar tudo
window.addEventListener('resize', () => {
    // Atualizar proporcao da camera
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Atualizar tamanho do renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ============================================
// RESUMO DA ESTRUTURA THREE.JS:
// ============================================
//
// Scene (cena)
//   |
//   |-- Camera (olhos)
//   |
//   |-- Mesh (objetos 3D)
//   |     |-- Geometry (forma)
//   |     |-- Material (aparencia)
//   |
//   |-- Light (luzes)
//   |
//   |-- Renderer (desenha no ecra)
//
// ============================================
