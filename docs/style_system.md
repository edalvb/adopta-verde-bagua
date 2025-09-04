# 🌿 Sistema de Diseño — Vivero Municipal de Bagua

## 🎨 Paleta de Colores

Inspirada en naturaleza, frescura y transparencia:

* **Verdes (Naturaleza)**

  * `--green-primary: #4CAF50` → Botones, acentos.
  * `--green-secondary: #81C784` → Hover, resaltes.
  * `--green-dark: #2E7D32` → Titulares, contrastes.
* **Blancos y grises translúcidos (Glass)**

  * `--glass-light: rgba(255, 255, 255, 0.2)`
  * `--glass-medium: rgba(255, 255, 255, 0.35)`
  * `--glass-strong: rgba(255, 255, 255, 0.6)`
* **Apoyo**

  * `--accent-yellow: #FFEB3B` → Call to action (adoptar planta).
  * `--neutral-bg: #E8F5E9` → Fondo general (verde muy claro).

### Gradientes (usados en fondos)

```css
--gradient-green: linear-gradient(135deg, #A8E063 0%, #56AB2F 100%);
--gradient-glass: linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05));
```

---

## ✨ Estilo Glassmorphism

Principios:

1. **Transparencia + desenfoque:** usar `background: rgba(..., 0.2)` y `backdrop-filter: blur(10px)`.
2. **Bordes suaves:** radios amplios (`rounded-2xl`) y bordes con `1px solid rgba(255,255,255,0.3)`.
3. **Sombras suaves:** difusas para destacar el “cristal” sobre el fondo.
4. **Capas:** fondos degradados naturales, encima tarjetas translúcidas.

Ejemplo de tarjeta glass:

```css
.glass-card {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 1rem;
  backdrop-filter: blur(12px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}
```

---

## 🖋 Tipografía

* **Titulares:** `Poppins` (moderna, clara, peso bold).
* **Texto general:** `Inter` o `Roboto` (legible en pantallas).
* **Jerarquía:**

  * H1 → `text-4xl font-bold text-green-dark`
  * H2 → `text-2xl font-semibold text-green-primary`
  * P → `text-base text-gray-800`

---

## 🧩 Componentes clave (Glassmorphism)

### 1. **Navbar**

* Fondo glass (`.glass-card` con blur).
* Logo del vivero (icono de hoja) + links (`Inicio`, `Plantas`, `Adopta`, `Contacto`).
* Hover → ligero cambio en transparencia.

### 2. **Hero Section**

* Fondo degradado verde (`--gradient-green`).
* Sobre él: tarjeta glass con mensaje motivador:
  *“Adopta una planta, regala vida a Bagua 🌱”*
* CTA → botón amarillo `Adopta ahora`.

### 3. **Tarjetas de plantas**

* Imagen circular de la planta.
* Nombre común (verde oscuro).
* Nombre científico (italic, gris translúcido).
* Botón “Adoptar” → estilo glass amarillo.

### 4. **Formulario de adopción**

* Card glass centrada.
* Inputs → campos glass con borde translúcido.
* Botón `Enviar a WhatsApp` → verde brillante con sombra suave.
* Validación en rojo suave, también con efecto translúcido.

### 5. **Footer**

* Fondo glass oscuro (`rgba(0,0,0,0.3)` + blur).
* Links mínimos: contacto, redes, créditos.

---

## 🎛 Tokens de TailwindCSS (ejemplo de config extendida)

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        green: {
          primary: "#4CAF50",
          secondary: "#81C784",
          dark: "#2E7D32",
        },
        accent: {
          yellow: "#FFEB3B",
        },
        neutral: {
          bg: "#E8F5E9",
        },
      },
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "8px",
        lg: "12px",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
};
```

---

## 🔘 Botones (Glassmorphism)

* **Primario (verde):**

  ```html
  <button class="px-6 py-3 rounded-xl 
    bg-green-primary text-white font-semibold 
    shadow-glass hover:bg-green-dark transition">
    Adoptar planta
  </button>
  ```
* **Secundario (glass):**

  ```html
  <button class="px-6 py-3 rounded-xl 
    bg-white/20 text-green-dark font-medium 
    border border-white/30 backdrop-blur-md 
    hover:bg-white/30 transition">
    Ver más
  </button>
  ```

---

## 🌐 Estilo general de fondo

* Fondo fijo: degradado verde muy claro con manchas sutiles (`blob shapes` en SVG o canvas).
* Encima: capas glass para tarjetas y secciones.

Ejemplo:

```css
body {
  background: linear-gradient(135deg, #E8F5E9, #C8E6C9);
}
```

---

👉 Este sistema crea una experiencia **ligera, natural y moderna**, manteniendo el **Glassmorphism** como elemento visual unificador y transmitiendo la idea de frescura y naturaleza.