import React, { useState, useEffect } from 'react';

function HighScores() {
    const [highScores, setHighScores] = useState([]);

    useEffect(() => {
        const scores = JSON.parse(localStorage.getItem('highScores') || '[]');
        setHighScores(scores);
    }, []);

    return (
        <div style={{ padding: '2rem' }}>
            <h2>High Scores</h2>
            <ul>
                {highScores.map((score, index) => (
                    <li key={index}>
                        Score: {Math.floor(score.score)} - Date: {new Date(score.date).toLocaleString()}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default HighScores;