import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/global.css'
// Desktop-only presentation frame; adds nothing below its breakpoint.
import './styles/presentation.css'
import { startPresentationFit } from './styles/presentationFit'

const container = document.getElementById('root')
if (!container) throw new Error('Root element #root not found')

startPresentationFit()

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
