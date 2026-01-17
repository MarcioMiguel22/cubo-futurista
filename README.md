# Cubo Futurista - Three.js

Site minimalista com cubo 3D futurista interativo.

## Versoes

### JavaScript (Simples)
```bash
cd js-version
# Abrir index.html no browser
```

### TypeScript (Profissional)
```bash
cd ts-version
npm install
npm run dev
```

## Estrutura Three.js

```
Scene (cena)
├── Camera (olhos)
├── Mesh (objetos 3D)
│   ├── Geometry (forma)
│   └── Material (aparencia)
├── Light (luzes)
└── Renderer (desenha)
```

## Comandos

| Comando | Descricao |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build para producao |
| `npm run preview` | Ver build local |
