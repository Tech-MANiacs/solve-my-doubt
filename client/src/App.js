import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import { useSelector } from 'react-redux';
import Spinner from './components/Spinner';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import ApplyMentor from './pages/ApplyMentor';
import NotificationPage from './pages/NotificationPage';
import Users from './pages/admin/Users';
import Mentors from './pages/admin/Mentors';
import Profile from './pages/mentor/Profile';
import BookingPage from './pages/BookingPage';
import Appointments from './pages/Appointments';
import MentorAppointments from './pages/mentor/MentorAppointments';
function App() {
  //getting the boolean from the store

  //using this state we can target reducer which in our case is alerts

  //this is constantly fetching the state from the store,
  //In the login and register pages we are updating the loading boolean and whenever it is updated, this entire section renders again and hence invoking the spinner component if loading is true 
  const { loading } = useSelector(state => state.alerts);
  return (
    <>
      <BrowserRouter>
        {/* if loading? show spinner componenet else visit routes */}
        {loading ? (
          <Spinner />
        ) : (
          <Routes>

            
            <Route path="/apply-mentor" element={
              <ProtectedRoute>
                <ApplyMentor />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            } />
            <Route path="/admin/mentors" element={
              <ProtectedRoute>
                <Mentors />
              </ProtectedRoute>
            } />

            {/* because this will be dynamic i.e profile will shown based on the id and we defined it in layout in the profile mentor data */}
            <Route path="/mentor/profile/:id" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />

            <Route path="/mentor/book-appointment/:id" element={
              <ProtectedRoute>
                <BookingPage />
              </ProtectedRoute>
            } />

            <Route path="/notification" element={
              <ProtectedRoute>
                <NotificationPage />
              </ProtectedRoute>
            } />
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } />
            <Route path="/appointments" element={
              <ProtectedRoute>
                <Appointments />
              </ProtectedRoute>
            } />
            <Route path="/mentor-appointments" element={
              <ProtectedRoute>
                <MentorAppointments />
              </ProtectedRoute>
            } />
            <Route path="/" element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } />
          </Routes>
        )}

      </BrowserRouter>
    </>
  );
}

export default App;
