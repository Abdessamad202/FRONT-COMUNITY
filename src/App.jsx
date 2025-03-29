import { Route, Routes } from 'react-router'
import Landing from './pages/Landing'
import NotFound from './pages/NotFound'
import Register from './pages/Register'
import RegisterLayout from './layouts/RegisterLayout'
import Verification from './pages/Verification'
import Login from './pages/Login'
import Profile from './pages/Profile'
import CheckMail from './pages/CheckMail'
import ValidateCode from './pages/ValidateCode'
import ChangePassword from './pages/ChangePassword'
import HomePage from './pages/Home'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path='*' element={<NotFound />} />
      <Route element={<RegisterLayout />}>
        <Route path="/register" element={<Register />} />
        <Route path='/verify-email' element={<Verification />} />
        <Route path='/complete-profile' element={<Profile />} />
      </Route>
      <Route path='/check-email' element={<CheckMail/>} />
      <Route path='/validate-code' element={<ValidateCode />}/>
      <Route path='/change-password' element={<ChangePassword />}/>
      <Route path='/home' element={<HomePage />} />
    </Routes>
  )
}

export default App
