import React, { useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Box, Sphere } from '@react-three/drei';

// Bird component
function Bird({ position, rotation }) {
    return (
        <Sphere position={position} rotation={rotation} args={[0.5, 32, 32]}>
            <meshStandardMaterial color="yellow" />
        </Sphere>
    );
}

// Pipe component
function Pipe({ position }) {
    return (
        <Box position={position} args={[1, 10, 1]}>
            <meshStandardMaterial color="green" />
        </Box>
    );
}

// Scene component
function Scene({ birdPosition, pipes }) {
    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <Bird position={birdPosition} rotation={[0, Math.PI / 2, 0]} />
            {pipes.map((pipe, index) => (
                <Pipe key={index} position={pipe.position} />
            ))}
            <Box position={[0, 0, -5]} args={[20, 20, 0.1]}>
                <meshStandardMaterial color="skyblue" />
            </Box>
        </>
    );
}

// Main game component
function Game() {
    const [birdPosition, setBirdPosition] = useState([0, 0, 0]);
    const [birdVelocity, setBirdVelocity] = useState(0);
    const [pipes, setPipes] = useState([]);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    const updateGameState = useCallback((delta) => {
        if (gameOver) return;

        // Update bird position
        setBirdPosition((prev) => [
            prev[0],
            prev[1] + birdVelocity * delta,
            prev[2],
        ]);

        // Apply gravity
        setBirdVelocity((prev) => prev - 9.8 * delta);

        // Move pipes
        setPipes((prevPipes) =>
            prevPipes.map((pipe) => ({
                ...pipe,
                position: [pipe.position[0] - 2 * delta, pipe.position[1], pipe.position[2]],
            }))
        );

        // Remove off-screen pipes
        setPipes((prevPipes) => prevPipes.filter((pipe) => pipe.position[0] > -10));

        // Add new pipes
        if (pipes.length === 0 || pipes[pipes.length - 1].position[0] < 5) {
            const newPipeY = Math.random() * 10 - 5;
            setPipes((prevPipes) => [
                ...prevPipes,
                { position: [10, newPipeY + 7, 0] },
                { position: [10, newPipeY - 7, 0] },
            ]);
        }

        // Check for collisions
        pipes.forEach((pipe) => {
            if (
                Math.abs(birdPosition[0] - pipe.position[0]) < 1 &&
                Math.abs(birdPosition[1] - pipe.position[1]) < 5
            ) {
                setGameOver(true);
                // Save high score
                const highScores = JSON.parse(localStorage.getItem('highScores') || '[]');
                highScores.push({ score, date: new Date().toISOString() });
                highScores.sort((a, b) => b.score - a.score);
                localStorage.setItem('highScores', JSON.stringify(highScores.slice(0, 10)));
            }
        });

        // Update score
        setScore((prevScore) => prevScore + delta);
    }, [birdPosition, birdVelocity, pipes, score, gameOver]);

    useEffect(() => {
        let lastTime = 0;
        const gameLoop = (currentTime) => {
            const delta = (currentTime - lastTime) / 1000;
            lastTime = currentTime;

            updateGameState(delta);

            if (!gameOver) {
                requestAnimationFrame(gameLoop);
            }
        };

        requestAnimationFrame(gameLoop);

        const handleKeyPress = (event) => {
            if (event.code === 'Space' && !gameOver) {
                setBirdVelocity(0.5);
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [gameOver, updateGameState]);

    return (
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
            <Canvas style={{ background: 'skyblue' }}>
                <Scene birdPosition={birdPosition} pipes={pipes} />
            </Canvas>
            <div style={{ position: 'absolute', top: 10, left: 10, color: 'white', fontSize: '24px' }}>
                Score: {Math.floor(score)}
            </div>
            {gameOver && (
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', fontSize: '32px', backgroundColor: 'rgba(0,0,0,0.5)', padding: '20px' }}>
                    Game Over! Your score: {Math.floor(score)}
                </div>
            )}
        </div>
    );
}

export default Game;