import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ListExample from './ListExampleSix.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ListExample />
  </StrictMode>,
)
