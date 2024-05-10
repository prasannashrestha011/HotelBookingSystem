import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'

import AuthProvider from './Context/AuthProvider';
import LoginPage from './Component/LoginPage';
import AuthRequire from './Component/AuthRequire';
import RegisterPage from './Component/RegisterPage';
import './index.css'
import ShowRoomDetails from './Component/showRoomDetails';
import HomePage from './Component/Home';
import UploadFile from './Component/uploadFile';
import BookTracking from './AdminComp/booktracking';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  <AuthProvider>
    <Router>
      <Routes>
      <Route path='/'element={<App/>}/>
      <Route path='/register' element={<RegisterPage/>} />
      <Route path='/login' element={<LoginPage/>}/>
      <Route path='/file-test' element={<UploadFile/>} />
      <Route element={<AuthRequire/>}>
          
            
            <Route path='/home' element={<HomePage/>} />
            <Route path='/room-details' element={<ShowRoomDetails/>} />
            <Route path='/book-trackings' element={<BookTracking/>} />
        </Route>
      </Routes>
    </Router>
    </AuthProvider>
   

  </React.StrictMode>
);

