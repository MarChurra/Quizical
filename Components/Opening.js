import React from "react";

export default function Opening(props) {

    const handleSelectChange = (event) => {
        const value = Number(event.target.value)
        props.setNumQuestions(value)
    }

    return (
        <section className="opening-screen fade-in">
            <h1>Quizzical</h1>
            <p>From the master of quizzes,
            the sultan of questions
            and the lord of trivias...
            I present you...
            <strong>Quizzical!</strong>
            </p>
            <label>How many questions do you want?
            <select name="amount" id="amount" onChange={handleSelectChange}>
                    <option value="5"> 5 </option>
                    <option value="10"> 10 </option>
                    <option value="15"> 15 </option>
                </select>
            </label>
            <button onClick={props.startGame}>Start playing!</button>
        </section>
    )
}