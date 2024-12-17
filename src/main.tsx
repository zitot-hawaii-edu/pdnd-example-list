import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ListExampleTwo from './ListExampleTwo.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ListExampleTwo />
  </StrictMode>,
)
