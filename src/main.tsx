import './styles/index.css'
import './styles/common.css'

import { createRoot } from 'react-dom/client'

import App from './App.tsx'
import I18nLocaleProvider from './providers/I18nLocaleProvider.tsx'
import WalletProvider from './providers/WalletProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <I18nLocaleProvider>
    <WalletProvider>
      <App />
    </WalletProvider>
  </I18nLocaleProvider>
)
