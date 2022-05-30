import React from 'react';
import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from './pages/Home';
import About from './pages/About';
import Profile from './pages/Profile';
import Statistics from './pages/Statistics';

import { QueryClient } from 'react-query'
import { QueryClientProvider } from 'react-query';
import { rtr } from './services/authService';
import { rtrCtx } from './common/React/context/rtr' 

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <rtrCtx.Provider value={rtr}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />}>
            </Route>
            <Route path="/about" element={<About />}>
            </Route>
            <Route path="/profile" element={<Profile />}>
            </Route>
            <Route path="/statistics" element={<Statistics />}>
            </Route>
            <Route path="/statistics/:url" element={<Statistics />}>
            </Route>
          </Routes>
        </BrowserRouter>
      </rtrCtx.Provider>
    </QueryClientProvider>
  );
}

export default App;
