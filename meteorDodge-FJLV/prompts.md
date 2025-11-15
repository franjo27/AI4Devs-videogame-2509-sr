# Prompts utilizados para Meteor Dodge - FJLV

## Prompt inicial (15 de noviembre de 2025)

```
Actúa como desarrollador web especializado en videojuegos simples. Vas a ayudarme a crear un juego llamado **Meteor Dodge – FJLV** como parte de un ejercicio de curso para aprender desarrollo con IA.

🎮 Concepto del juego:
- El jugador controla una nave que se mueve horizontalmente con las teclas ← y →.
- Desde la parte superior caen meteoritos desde posiciones aleatorias.
- Si un meteorito colisiona con la nave, el juego termina (Game Over).
- El puntaje aumenta por tiempo sobrevivido o meteoritos esquivados.
- La dificultad aumenta gradualmente: meteoritos más rápidos y frecuentes.

📁 Estructura esperada:
1. Crea una carpeta principal llamada `meteorDodge-FJLV`.
2. Dentro de ella, genera los siguientes archivos:
   - `index.html`: estructura básica del juego.
   - `style.css`: estilos visuales.
   - `script.js`: lógica del juego.
   - `prompts.md`: donde se documentarán los prompts utilizados.
   - Carpeta `assets/` si se usan imágenes (puedes usar marcadores de posición).

📄 Ejemplo de referencia:
Antes de comenzar, analiza el ejemplo de otro juego llamado `snake-EHS`, que contiene:
- El código fuente del juego dividido en HTML, CSS y JS.
- El archivo `prompts.md` con los prompts utilizados para generarlo.
Este ejemplo sirve como guía para la estructura, estilo de codificación y documentación.

🧩 Requisitos técnicos:
- Usa solo HTML, CSS y JavaScript puro (sin frameworks).
- El juego debe funcionar en navegadores modernos.
- El diseño puede ser simple pero claro.
- El código debe estar bien organizado y comentado.
```

## Decisiones de implementación

### Estructura del proyecto
- Se creó la carpeta `meteorDodge-FJLV` como contenedor principal
- Se separó el código en 3 archivos: HTML, CSS y JS para mejor organización
- Se documentaron todos los prompts en este archivo

### Características implementadas
1. **Control de la nave**: Teclas de flecha izquierda/derecha para movimiento horizontal
2. **Meteoritos**: Generación aleatoria desde la parte superior con diferentes velocidades
3. **Sistema de colisiones**: Detección precisa de colisiones usando coordenadas
4. **Sistema de puntaje**: Incremento por tiempo sobrevivido y meteoritos esquivados
5. **Dificultad progresiva**: Incremento gradual de velocidad y frecuencia de meteoritos
6. **Pantalla Game Over**: Muestra puntaje final con opción de reinicio

### Tecnologías utilizadas
- HTML5 Canvas para renderizado del juego
- CSS3 para estilos y diseño responsive
- JavaScript puro (ES6+) para la lógica del juego
- RequestAnimationFrame para animaciones fluidas
