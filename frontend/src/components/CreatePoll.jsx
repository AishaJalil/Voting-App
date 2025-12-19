import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pollAPI } from '../services/api';

const CreatePoll = () => {
    const navigate = useNavigate();
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const addOption = () => {
        if (options.length < 10) {
            setOptions([...options, '']);
        }
    };

    const removeOption = (index) => {
        if (options.length > 2) {
            const newOptions = options.filter((_, i) => i !== index);
            setOptions(newOptions);
        }
    };

    const updateOption = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!question.trim()) {
            setError('Please enter a question');
            return;
        }

        const validOptions = options.filter(option => option.trim());
        if (validOptions.length < 2) {
            setError('Please provide at least 2 options');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const pollData = {
                question: question.trim(),
                options: validOptions.map(option => ({
                    optionText: option.trim(),
                    voteCount: 0
                }))
            };

            const response = await pollAPI.createPoll(pollData);
            navigate(`/polls/${response.data.id}`);
        } catch (err) {
            setError('Failed to create poll. Please try again.');
            console.error('Error creating poll:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-poll-container">
            <div className="create-poll-header">
                <h1>Create New Poll</h1>
                <p>Ask a question and provide options for people to vote on</p>
            </div>

            <form onSubmit={handleSubmit} className="create-poll-form">
                {error && <div className="error">{error}</div>}

                <div className="form-group">
                    <label htmlFor="question" className="form-label">
                        Poll Question *
                    </label>
                    <input
                        type="text"
                        id="question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="What would you like to ask?"
                        className="form-input"
                        maxLength={200}
                    />
                    <small className="form-help">
                        {question.length}/200 characters
                    </small>
                </div>

                <div className="form-group">
                    <label className="form-label">Poll Options *</label>
                    {options.map((option, index) => (
                        <div key={index} className="option-input-group">
                            <input
                                type="text"
                                value={option}
                                onChange={(e) => updateOption(index, e.target.value)}
                                placeholder={`Option ${index + 1}`}
                                className="form-input option-input"
                                maxLength={100}
                            />
                            {options.length > 2 && (
                                <button
                                    type="button"
                                    onClick={() => removeOption(index)}
                                    className="btn btn-danger btn-sm remove-option"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}

                    {options.length < 10 && (
                        <button
                            type="button"
                            onClick={addOption}
                            className="btn btn-secondary add-option"
                        >
                            + Add Option
                        </button>
                    )}
                    <small className="form-help">
                        Minimum 2 options required, maximum 10 options allowed
                    </small>
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        onClick={() => navigate('/polls')}
                        className="btn btn-secondary"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                    >
                        {loading ? 'Creating...' : 'Create Poll'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePoll;