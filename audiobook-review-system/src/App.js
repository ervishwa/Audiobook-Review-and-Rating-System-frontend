import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import AudiobookList from './components/AudiobookList';
import AudiobookDetails from './components/AudiobookDetails';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<AudiobookList />} />
        <Route path="/audiobooks/:id" element={<AudiobookDetails />} />
      </Routes>
    </div>
  );
}

export default App;