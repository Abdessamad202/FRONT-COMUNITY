import { Route, Routes } from 'react-router'
import Landing from './pages/Landing'
import NotFound from './pages/NotFound'
import Register from './pages/Register'
import RegisterLayout from './layouts/RegisterLayout'
import Confirmation from './pages/Confirmation'
function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing/>}/>
      <Route path='*' element={<NotFound/>}/>
      <Route element={<RegisterLayout/>}>
        <Route path="/register" element={<Register/>}/>
        <Route path='/verify' element={<Confirmation/>}/>
      </Route>
    </Routes>
  )
}

export default App
