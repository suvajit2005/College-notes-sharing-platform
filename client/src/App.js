// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext';
// import Navbar from './components/Navbar';
// import Home from './pages/Home';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import TeacherDashboard from './pages/TeacherDashboard';
// import StudentPortal from './pages/StudentPortal';
// import './App.css';

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <div className="App">
//           <Navbar />
//           <div className="container mx-auto px-4">
//             <Routes>
//               <Route path="/" element={<Home />} />
//               <Route path="/login" element={<Login />} />
//               <Route path="/register" element={<Register />} />
//               <Route path="/teacher" element={<TeacherDashboard />} />
//               <Route path="/student" element={<StudentPortal />} />
//             </Routes>
//           </div>
//         </div>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentPortal from './pages/StudentPortal';
import UploadNotes from './pages/UploadNotes';
import MyUploads from './pages/MyUploads';
import Analytics from './pages/Analytics';
import BrowseNotes from './pages/BrowseNotes';
import MyDownloads from './pages/MyDownloads';
import ProtectedRoute from './components/ProtectedRoute';
import Unauthorized from './pages/Unauthorized';
import './App.css';

// Create placeholder components for any missing pages
const PlaceholderPage = ({ title, description }) => (
  <div className="page-container">
    <div className="container">
      <h1 className="page-title">{title}</h1>
      <p className="page-subtitle">{description}</p>
      <div className="card">
        <h2 className="card-title">Coming Soon</h2>
        <p className="card-content">This page is under development and will be available soon.</p>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <div className="container mx-auto px-4">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              {/* Notes Browsing (Public or Protected based on your preference) */}
              <Route path="/notes" element={
                <ProtectedRoute>
                  <BrowseNotes />
                </ProtectedRoute>
              } />
              
              {/* Teacher Routes */}
              <Route path="/teacher" element={
                <ProtectedRoute requiredRole="teacher">
                  <TeacherDashboard />
                </ProtectedRoute>
              } />
              <Route path="/upload" element={
                <ProtectedRoute requiredRole="teacher">
                  <UploadNotes />
                </ProtectedRoute>
              } />
              <Route path="/my-uploads" element={
                <ProtectedRoute requiredRole="teacher">
                  <MyUploads />
                </ProtectedRoute>
              } />
              <Route path="/analytics" element={
                <ProtectedRoute requiredRole="teacher">
                  <Analytics />
                </ProtectedRoute>
              } />
              
              {/* Student Routes */}
              <Route path="/student" element={
                <ProtectedRoute>
                  <StudentPortal />
                </ProtectedRoute>
              } />
              <Route path="/my-downloads" element={
                <ProtectedRoute>
                  <MyDownloads />
                </ProtectedRoute>
              } />
              
              {/* 404 Page */}
              <Route path="*" element={
                <div className="page-container text-center">
                  <h1 className="page-title">404 - Page Not Found</h1>
                  <p className="page-subtitle">The page you're looking for doesn't exist.</p>
                  <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
                    <h2 className="card-title">🚫 Not Found</h2>
                    <p className="card-content">
                      Please check the URL or navigate using the menu above.
                    </p>
                    <div className="flex justify-center mt-4">
                      <a href="/" className="btn btn-primary">Go Home</a>
                    </div>
                  </div>
                </div>
              } />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;