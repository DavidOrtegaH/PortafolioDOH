# David Ortega Hoyas · Portafolio

[Visitar el portafolio](https://davidortegah.github.io/PortafolioDOH/)

Soy desarrollador web Full Stack de Parla, Madrid. Aquí reúno aplicaciones que puedes probar, el trabajo que hice durante mis prácticas en el Ayuntamiento de Humanes de Madrid y mis proyectos de formación en DAW.

## Desarrollo local

Con Node.js 22 y npm instalados, ejecuta:

```sh
npm ci
npm run build
python -m http.server 8000 --directory dist
```

Abre http://localhost:8000. El sitio utiliza HTML, CSS y TypeScript. La compilación genera una web estática en `dist/`.

## Especificación y publicación

Los [criterios de aceptación](specs/portafolio.md) guían el desarrollo. GitHub Actions comprueba las ramas `feature`, `develop`, `release` y `main`. La versión de `main` se publica en GitHub Pages.

El código está disponible para consulta según la [licencia propietaria](LICENSE). Este repositorio [no acepta contribuciones externas](CONTRIBUTING.md).
