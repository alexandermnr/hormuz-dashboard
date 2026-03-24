// PostHog Analytics
// Set VITE_POSTHOG_KEY in Vercel environment variables:
//   Vercel Dashboard → Settings → Environment Variables → Add
//   Name: VITE_POSTHOG_KEY  Value: phc_your_key_here
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import posthog from 'posthog-js'
import App from './App'
import './index.css'

if (import.meta.env.VITE_POSTHOG_KEY) {
  posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
    api_host: 'https://app.posthog.com',
    autocapture: true
  })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
