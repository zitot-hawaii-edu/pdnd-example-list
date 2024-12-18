import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ListExampleFour from './ListExampleFour.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ListExampleFour />
  </StrictMode>,
)
