
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// 🧩 Importaciones de estilos globales
import 'bootstrap/dist/css/bootstrap.min.css'   // Bootstrap
import './styles/styles.scss'                   // Tu archivo SCSS principal
import App from './App.jsx'

// 🚀 Renderizado principal
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
