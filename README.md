# diegoadg53.github.io

Portafolio personal de Diego Duarte, ingeniero mecatrónico. Es un sitio estático (HTML, CSS y JS sin dependencias) servido con GitHub Pages en **https://diegoadg53.github.io**.

## Estructura

```
index.html            Página principal (hero, proyecto destacado, experiencia, habilidades, contacto)
robotic-arm.html      Caso de estudio de la tesis
assets/css/style.css  Estilos (colores en :root, modo oscuro automático)
assets/js/main.js     Cambio ES/EN, visor de imágenes, animaciones
assets/img/           Fotos y figuras (arm/ = figuras de la tesis)
assets/video/         Videos cortos y sus portadas (.webp)
assets/docs/          CV en PDF
```

## Cómo editar

- **Textos bilingües:** cada texto tiene dos versiones, `<span lang="es">…</span>` y `<span lang="en">…</span>`. Edita las dos.
- **Agregar un proyecto:** copia una tarjeta `<article class="card mini">` en la sección "Otros proyectos" de `index.html`. Si el proyecto merece página propia, duplica `robotic-arm.html`.
- **Actualizar el CV:** reemplaza `assets/docs/CV_DiegoDuarte.pdf` con el mismo nombre.
- **Vista previa local:** `python -m http.server 8000` dentro de esta carpeta y abre http://localhost:8000.

## Publicar

Haz commit y push a `main`. En GitHub ve a *Settings → Pages* y elige *Deploy from a branch → main / (root)*. El sitio se actualiza en un par de minutos.
