import './styles/index.css'
import './styles/common.css'

import { createRoot } from 'react-dom/client'

import AppGame from './App.game.tsx'

// createRoot(document.getElementById('root')!).render(
//   <I18nLocaleProvider>
//     <WalletProvider>
//       <App />
//     </WalletProvider>
//   </I18nLocaleProvider>
// )
createRoot(document.getElementById('root')!).render(<AppGame />)
