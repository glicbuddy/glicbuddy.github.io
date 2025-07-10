/* global document */
import '@/main.css'
import { NotesPage } from '@/pages'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'

const app = createRoot(document.getElementById('root'))

app.render(
  <BrowserRouter>
    <Routes>
      <Route index path="/" element={<NotesPage />} />
    </Routes>
  </BrowserRouter>
)
