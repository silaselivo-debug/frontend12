import React, { useState } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import Student from './components/Student';
import Lecturer from './components/Lecturer';
import PrincipalLecturer from './components/PrincipalLecturer';
import ProgramLeader from './components/ProgramLeader';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [userRole, setUserRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (userData) => {
    setUserRole(userData.role);
    setCurrentUser(userData);
    setCurrentView(userData.role);
    setIsLoggedIn(true);
  };

  const handleSignup = (userData) => {
    // In a real app, you would send this to a backend
    alert(`Account created successfully! Please login with your credentials.`);
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentUser(null);
    setCurrentView('dashboard');
    setIsLoggedIn(false);
  };

  const renderContent = () => {
    if (!isLoggedIn) {
      return <Dashboard onLogin={handleLogin} onSignup={handleSignup} />;
    }

    switch (currentView) {
      case 'student':
        return <Student user={currentUser} onLogout={handleLogout} setCurrentView={setCurrentView} />;
      case 'lecturer':
        return <Lecturer user={currentUser} onLogout={handleLogout} setCurrentView={setCurrentView} />;
      case 'principalLecturer':
        return <PrincipalLecturer user={currentUser} onLogout={handleLogout} setCurrentView={setCurrentView} />;
      case 'programLeader':
        return <ProgramLeader user={currentUser} onLogout={handleLogout} setCurrentView={setCurrentView} />;
      default:
        return <Dashboard onLogin={handleLogin} onSignup={handleSignup} />;
    }
  };

  return (
    <div className="App">
      {renderContent()}
    </div>
  );
}

export default App;