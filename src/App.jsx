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
import ModalPage from './pages/ModalPage'
import Layout from './layouts/Layout'
import ProtectedRoute from './middlewares/ProtectedRoutes'
import Posts from './components/Posts'
import ProfilePage from './pages/ProfilePage'
import ScrollToTop from './components/ScrollToTop'
import PostPage from './pages/PostPage'
function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path='*' element={<NotFound />} />
        <Route element={<RegisterLayout />}>
          <Route path="/register" element={<Register />} />
          <Route path='/verify-email' element={<Verification />} />
          <Route path='/complete-profile' element={<Profile />} />
        </Route>
        <Route path='/check-email' element={<CheckMail />} />
        <Route path='/validate-code' element={<ValidateCode />} />
        <Route path='/change-password' element={<ChangePassword />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path='/home' element={<HomePage />} />
            <Route path='/profile/:id' element={<ProfilePage />} />
            <Route path='/posts/:id' element={<PostPage />} />
          </Route>
        </Route>
        <Route path='/modal' element={<ModalPage />} />
        <Route path='/post' element={<PostPage />} />

      </Routes>
    </>
  )
}

export default App
