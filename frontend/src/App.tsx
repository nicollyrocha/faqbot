import { Route, Routes } from 'react-router-dom'
import { Home } from './pages/home'
import MainLayout from './layouts/MainLayout'

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={''} />
        <Route path="/dashboard" element={''} />
      </Route>
    </Routes>
  )
}

export default App
