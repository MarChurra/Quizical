import React, { useState, useEffect } from "react";
import Opening from "./Components/Opening.js";
import Game from "./Components/Game.js";
import Loader from "./Components/Loader.js";
import Notification from "./Components/Notification.js"

export default function App() {

    // App States
    const [gameStarted, setGameStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [error, setError] = useState(null);
    const [sessionToken, setSessionToken] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [selectedQuestionAmount, setSelectedQuestionAmount] = useState(5)
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0)
    const [gameWon, setGameWon] = useState(false)
    const [showNotification, setShowNotification] = React.useState(false)

    //Fetch session token
    useEffect(() => {
        if (gameStarted && !sessionToken) {
            fetchSessionToken();
        }
    }, [gameStarted, sessionToken]);

    function fetchSessionToken() {
        setLoading(true);
        fetch("https://opentdb.com/api_token.php?command=request")
            .then((res) => res.json())
            .then((data) => {
                setSessionToken(data.token)
            });
    }

    // Fetch API Data
    useEffect(() => {
        if (sessionToken) {
            fetchQuestions();
        }
    }, [sessionToken]);

    function fetchQuestions() {
        fetch(`https://opentdb.com/api.php?amount=${selectedQuestionAmount}&type=multiple&token=${sessionToken}`)
            .then((response) => response.json())
            .then((data) => {
                setQuestions(data.results);
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                console.warn(error);
            });
    }

    //Manage the selected Options
    const handleAnswerChange = (questionIndex, answer) => {
        setSelectedAnswers((prevAnswers) => Object.assign({}, prevAnswers, { [questionIndex]: answer }));
    };

    //Check the Results 
    function checkResults() {
        if (Object.keys(selectedAnswers).length !== questions.length) {
            setShowNotification(true);
            return;
        }
        setShowNotification(false);

        let newScore = 0;

        questions.forEach((question, index) => {
            const correctAnswer = question.correct_answer;
            if (selectedAnswers[index] === correctAnswer) {
                newScore++;
            }
        });

        setScore((prevScore) => prevScore + newScore);

        if (newScore === questions.length) {
            setGameWon(true);
        }

        setGameOver(true);
        setShowResults(true);
        disableOptions();
    }

    // Disable options function
    function disableOptions() {
        const options = document.querySelectorAll('input');
        options.forEach((option) => {
            option.disabled = true;
        });
    }

    // Manage Game State and Loadings
    function startGame() {
        setGameStarted(true);
    }

    function startNewGame() {
        setGameOver(false);
        setShowResults(false);
        setGameStarted(true);
        setQuestions([]);
        setSelectedAnswers({});
        fetchQuestions();
        setScore(0);
        setGameWon(false);
    }

    function questionAmount(amount) {
        setSelectedQuestionAmount(amount);
    }

    // Rendering the Game
    if (loading) {
        return <Loader />;
    } else {
        return gameStarted && questions ? (
            <div>
                {showNotification && <Notification
                    showNotification={showNotification}
                    onHide={() => setShowNotification(false)}
                />}
                <Game questions={questions}
                    error={error}
                    handleAnswerChange={handleAnswerChange}
                    checkResults={checkResults}
                    selectedAnswers={selectedAnswers}
                    showResults={showResults}
                    gameOver={gameOver}
                    gameStarted={gameStarted}
                    newGame={startNewGame}
                    score={score}
                    gameWon={gameWon}
                />
            </div>

        ) : (
            <Opening startGame={startGame} setNumQuestions={(amount) => questionAmount(amount)} />
        );
    }
}