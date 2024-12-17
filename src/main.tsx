import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ListExample from './ListExample.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ListExample />
  </StrictMode>,
)
