import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ListExampleFive from './ListExampleFive.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ListExampleFive />
  </StrictMode>,
)
