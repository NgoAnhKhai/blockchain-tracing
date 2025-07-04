# Wallet Graph Explorer

A real-time 3D blockchain wallet visualization built with React, Vite, Three.js (react-three-fiber) and Material‑UI. Explore transaction flows, hover/click nodes for details, and inspect transfers with an interactive sidebar.

---

## 🚀 Features

* **3D Wallet Graph**

  * Central wallet surrounded by interacting addresses on a spherical layout
  * Animated particle flow along edges to indicate transaction direction
  * Pause/resume rotation on hover
  * Dark/light theme support

* **Interactive Nodes**

  * Hover for 2D tooltips (`Html`) with smooth fade/scale animations
  * Pointer cursor on hover
  * Click to open detailed transaction sidebar

* **Searching Bar**

  * Global search input with **Ctrl+P** (or ⌘+P) focus shortcut
  * Focus-inset border highlighting for dark and light modes

* **Right Sidebar**

  * Drawer component showing transactions between central and selected node
  * Columns: Tx ID, Direction, Amount, Count, Timestamp
  * Click to open/close or click node to trigger

* **Theming**

  * Fully responsive layout with MUI dark & light palette
  * Canvas background syncs with MUI theme

---

## 📦 Installation

1. Clone the repo:

   ```bash
   git clone https://github.com/your-org/wallet-graph-explorer.git
   cd wallet-graph-explorer
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start development server:

   ```bash
   npm run dev
   ```

4. Build for production:

   ```bash
   npm run build
   ```

---

## 🔧 Scripts

| Command           | Description                    |
| ----------------- | ------------------------------ |
| `npm run dev`     | Start Vite dev server with HMR |
| `npm run build`   | Build production bundle        |
| `npm run preview` | Preview built site             |
| `npm run lint`    | Run ESLint on source files     |

---

## 📁 Project Structure

```text
src/
├─ components/
│  ├─ charts/
│  │  ├─ Graph.jsx
│  │  ├─ ParticleEdge.jsx
│  ├─ sidebar/
│  │  └─ RightSideBar.jsx
│  ├─ searching/
│  │  └─ SearchingBar.jsx
│  ├─ Node.jsx
│  └─ App.jsx
├─ pages/
│  └─ WalletGraphPage.jsx
├─ main.jsx
├─ index.css
vite.config.js
README.md
```

---

## 🛠️ Configuration

* **Vite** config in `vite.config.js` uses `@vitejs/plugin-react` for Fast Refresh.
* **ESLint** rules: adjust in `.eslintrc.js`.
* **Three.js** settings in `<Canvas>`: toneMapping, outputEncoding, shadows.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/your-feature`)
3. Commit your changes following [Conventional Commits](https://www.conventionalcommits.org/)
4. Push (`git push origin feat/your-feature`)
5. Open a Pull Request

---

## 📜 License

MIT © Your Name or Org
