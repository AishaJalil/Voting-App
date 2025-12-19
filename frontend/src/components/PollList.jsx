import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { pollAPI } from '../services/api';

const PollList = () => {
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPolls();
    }, []);

    const fetchPolls = async () => {
        try {
            setLoading(true);
            const response = await pollAPI.getAllPolls();
            setPolls(response.data);
        } catch (err) {
            setError('Failed to fetch polls. Please try again.');
            console.error('Error fetching polls:', err);
        } finally {
            setLoading(false);
        }
    };

    const getTotalVotes = (poll) => {
        return poll.options.reduce((total, option) => total + option.voteCount, 0);
    };

    if (loading) return <div className="loading">Loading polls...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="poll-list-container">
            <div className="header">
                <h1>All Polls</h1>
                <Link to="/create" className="btn btn-primary">
                    Create New Poll
                </Link>
            </div>

            {polls.length === 0 ? (
                <div className="empty-state">
                    <h3>No polls available</h3>
                    <p>Be the first to create a poll!</p>
                    <Link to="/create" className="btn btn-primary">
                        Create Poll
                    </Link>
                </div>
            ) : (
                <div className="polls-grid">
                    {polls.map(poll => (
                        <div key={poll.id} className="poll-card">
                            <h3 className="poll-question">{poll.question}</h3>
                            <div className="poll-stats">
                <span className="vote-count">
                  {getTotalVotes(poll)} votes
                </span>
                                <span className="option-count">
                  {poll.options.length} options
                </span>
                            </div>
                            <div className="poll-actions">
                                <Link to={`/polls/${poll.id}`} className="btn btn-secondary">
                                    View & Vote
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PollList;