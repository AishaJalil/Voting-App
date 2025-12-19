import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { pollAPI } from '../services/api';

const PollDetail = () => {
    const { id } = useParams();
    const [poll, setPoll] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [voting, setVoting] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [hasVoted, setHasVoted] = useState(false);

    useEffect(() => {
        fetchPoll();
    }, [id]);

    const fetchPoll = async () => {
        try {
            setLoading(true);
            const response = await pollAPI.getPoll(id);
            setPoll(response.data);
        } catch (err) {
            setError('Failed to fetch poll. Please try again.');
            console.error('Error fetching poll:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleVote = async () => {
        if (selectedOption === null) return;

        try {
            setVoting(true);
            await pollAPI.vote({
                pollId: parseInt(id),
                optionIndex: selectedOption
            });

            setHasVoted(true);
            // Refresh poll data to show updated vote counts
            await fetchPoll();
        } catch (err) {
            setError('Failed to submit vote. Please try again.');
            console.error('Error voting:', err);
        } finally {
            setVoting(false);
        }
    };

    const getTotalVotes = () => {
        return poll.options.reduce((total, option) => total + option.voteCount, 0);
    };

    const getPercentage = (voteCount) => {
        const total = getTotalVotes();
        return total > 0 ? ((voteCount / total) * 100).toFixed(1) : 0;
    };

    if (loading) return <div className="loading">Loading poll...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!poll) return <div className="error">Poll not found</div>;

    return (
        <div className="poll-detail-container">
            <div className="poll-header">
                <Link to="/polls" className="back-link">← Back to Polls</Link>
                <h1 className="poll-question">{poll.question}</h1>
                <p className="poll-stats">Total Votes: {getTotalVotes()}</p>
            </div>

            <div className="poll-content">
                {!hasVoted ? (
                    <div className="voting-section">
                        <h3>Cast your vote:</h3>
                        <div className="options-list">
                            {poll.options.map((option, index) => (
                                <label key={index} className="option-label">
                                    <input
                                        type="radio"
                                        name="pollOption"
                                        value={index}
                                        checked={selectedOption === index}
                                        onChange={() => setSelectedOption(index)}
                                        className="option-radio"
                                    />
                                    <span className="option-text">{option.optionText}</span>
                                </label>
                            ))}
                        </div>
                        <button
                            onClick={handleVote}
                            disabled={selectedOption === null || voting}
                            className="btn btn-primary vote-btn"
                        >
                            {voting ? 'Submitting...' : 'Submit Vote'}
                        </button>
                    </div>
                ) : (
                    <div className="thank-you-message">
                        <h3>✅ Thank you for voting!</h3>
                        <p>Your vote has been recorded.</p>
                    </div>
                )}

                <div className="results-section">
                    <h3>Current Results:</h3>
                    <div className="results-list">
                        {poll.options.map((option, index) => (
                            <div key={index} className="result-item">
                                <div className="result-header">
                                    <span className="option-name">{option.optionText}</span>
                                    <span className="vote-info">
                    {option.voteCount} votes ({getPercentage(option.voteCount)}%)
                  </span>
                                </div>
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${getPercentage(option.voteCount)}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PollDetail;