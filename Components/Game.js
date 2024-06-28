import React, { useState, useEffect } from "react";
import he from "he";
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'


const ConfettiComponent = (props) => {
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        setShowConfetti(true)
        const timer = setTimeout(() => {
            setShowConfetti(false);
        }, 3000);
        return () => {
            clearTimeout(timer);
        };
    }, []);

    return (
        <div>
            {showConfetti && <Confetti className="confetti" />}
        </div>
    );
};


export default function Game(props) {

    const questions = props.questions;

    const [shuffledQuestions, setShuffledQuestions] = useState([]);

    useEffect(() => {
        const shuffledQuestions = questions.map((question) => {
            const answers = [...question.incorrect_answers, question.correct_answer];
            const shuffledAnswers = shuffleArray(answers);
            return Object.assign({}, question, { answers: shuffledAnswers });
        });
        setShuffledQuestions(shuffledQuestions);
    }, [questions]);

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }


    return (
        props.error ? (
            <h1 className="main-error">I´m sorry, something went wrong... Please try again within a few seconds</h1>
        ) : (
            <main className="game-screen decrease">

                {shuffledQuestions.map((question, questionIndex) => {

                    const correctAnswer = question.correct_answer;
                    const incorrectAnswer = question.incorrect_answer;

                    return (
                        <div className="question-line fade-in" key={questionIndex}>
                            <h2>{he.decode(question.question)}</h2>
                            <form>
                                {question.answers.map((answer, answerIndex) => (
                                    <label key={answerIndex}>
                                        <input
                                            className={props.showResults ? (answer === correctAnswer ? 'correct-answer game-over' : 'incorrect-answer game-over') : ''}
                                            type="radio"
                                            name={`question-${questionIndex}`}
                                            value={he.decode(answer.replace(/;$/, ''))}
                                            onChange={(event) =>
                                                props.handleAnswerChange(questionIndex, he.decode(answer.replace(/;$/, '')))
                                            }
                                        />
                                        <span className={props.showResults ? (answer === correctAnswer ? 'correct-answer' : 'incorrect-answer') : ''}>
                                            {he.decode(answer.replace(/;$/, ''))}</span>
                                    </label>
                                ))}
                            </form>
                        </div>
                    );
                })}


                {questions.length > 0 && (
                    <div>
                        {props.gameStarted && !props.gameOver && (
                            <button className="submit-btn game-btn fade-in" onClick={() => props.checkResults(props.selectedAnswers)}>
                                Check Answers
                            </button>
                        )}
                        {props.gameOver && (
                            <div>
                                {props.gameWon && <ConfettiComponent />}
                                <div className="results">
                                    <p className="final-results">You scored {props.score} / {questions.length} correct answers!</p>
                                    <button className="submit-btn" onClick={props.newGame}>
                                        Play again
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}


            </main >
        )
    );
}