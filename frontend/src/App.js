import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import PollList from './components/PollList';
import PollDetail from './components/PollDetail';
import CreatePoll from './components/CreatePoll';
import './styles/App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Navigation />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<PollList />} />
                        <Route path="/polls" element={<PollList />} />
                        <Route path="/polls/:id" element={<PollDetail />} />
                        <Route path="/create" element={<CreatePoll />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;