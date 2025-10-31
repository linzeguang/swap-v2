import './styles/index.css'
import './styles/common.css'

import { createRoot } from 'react-dom/client'

import App from './App.tsx'
import WalletProvider from './providers/WalletProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <WalletProvider>
    <App />
  </WalletProvider>
)
