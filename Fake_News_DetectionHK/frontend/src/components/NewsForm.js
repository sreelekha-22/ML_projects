import React, { useState } from 'react';

const NewsForm = ({ handleFormSubmit }) => {
    const [newsText, setNewsText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        handleFormSubmit(newsText); // Pass the news text to the parent component
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Enter news text..."
                value={newsText}
                onChange={(e) => setNewsText(e.target.value)}
            />
            <button type="submit">Check Fake News</button>
        </form>
    );
};

export default NewsForm;