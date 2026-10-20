import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './app/App'
import { Lab } from './app/Lab'

const root = document.getElementById('root')
if (!root) throw new Error('Missing #root element')

// `?lab` renders a single frozen frame — used by the screenshot script to
// validate poses without driving the whole player UI.
const isLab = new URLSearchParams(window.location.search).has('lab')

createRoot(root).render(<StrictMode>{isLab ? <Lab /> : <App />}</StrictMode>)
