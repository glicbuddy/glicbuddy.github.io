/* global document */
import '@/main.css'
import { Form, Notes, Settings, Stats } from '@/pages'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'

const app = createRoot(document.getElementById('root'))

app.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Notes />}>
        <Route path="/registrar" element={<Form />} />
        <Route path="/estatisticas" element={<Stats />} />
        <Route path="/configuracoes" element={<Settings />} />
      </Route>
    </Routes>
  </BrowserRouter>
)
