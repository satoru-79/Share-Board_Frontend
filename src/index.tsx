import React, { createContext, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Board from './Board';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Information from './Information';
import Auth from './Auth';
import CheckAuth from './CheckAuth';

 
const NotFound = () => <h2>404 Not Found</h2>;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(

  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}/>
      <Route path='/login' element={<Auth role={"ログイン"}/>}/>
      <Route path='/signup' element={<Auth  role={"新規登録"}/>}/>
      <Route path="/board" element={<Board type=''/>}/>
      <Route path='/auth' element={<CheckAuth />}>
        <Route path="create_board" element={<Board type='create'/>}/>
        <Route path='view_board' element={<Board type='share'/>}/>
        <Route path='edit_board' element={<Board type='edit' />} />
      </Route>
      <Route path='/information' element={<Information />} />
      <Route path='*' element={<NotFound />}></Route>
    </Routes>
    
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
