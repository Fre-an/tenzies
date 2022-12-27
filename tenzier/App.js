import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

export default function App() {

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [bestTime, setBestTime] = React.useState(JSON.parse(localStorage.getItem("best-time")) ||Infinity)
    const [currTime, setCurrTime] = React.useState(Infinity)
    const [startTime, setStartTime] = React.useState(undefined)
    const [endTime, setEndTime] = React.useState(undefined)
    
    React.useEffect(() => {
        if (!tenzies) {
            setStartTime(performance.now())
            setEndTime(undefined)
        } else {
            let time = Math.floor(endTime-startTime)
            time = time/1000
            setCurrTime(time)
            if(time < bestTime) {
                 setBestTime(time)
                 localStorage.setItem("best-time", JSON.stringify(time))
            }
            setStartTime(undefined)
        }
    }, [tenzies])
    
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
            setEndTime(performance.now())
        }
    }, [dice])

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function rollDice() {
        if(!tenzies) {
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
        } else {
            setTenzies(false)
            setDice(allNewDice())
        }
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    return (
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
            <div className="body-time">
                 <h5 className="curr-time">Current time: {currTime === Infinity ? 0 : currTime} sec</h5>
                <h5 className="best-time">Best time: {bestTime === Infinity ? 0 : bestTime} sec</h5>
            </div>
        </main>
    )
}