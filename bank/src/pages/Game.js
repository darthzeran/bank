import React, { useState, useEffect, useRef } from 'react';
import ReactDice from 'react-dice-complete';

import '../styles/game.css';
import '../styles/setup.css';
import Players from './Players';

export default function Game({ onNewGame, rounds, players }) {
    const reactDice = useRef(null);
    const [currentRound, setCurrentRound] = useState(0);
    const [playerData, setPlayerData] = useState({});
    const [playersReady, setPlayersReady] = useState(false);
    const [diceTotal, setDiceTotal] = useState(0);
    const [rollCount, setRollCount] = useState(0);
    const [isRolling, setIsRolling] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    // ai
    const [useAI, setUseAI] = useState(false);
    const [doubleCount, setDoubleCount] = useState(0);
    useEffect(() => {
        if(useAI){
            if (rollCount > 2 && doubleCount > 1 && !playerData?.ai?.isBanked) {
                // ai bank
                setPlayerData(old => {
                    let retObj = {
                        ...old,
                        ai: {
                            ...old.ai,
                            isBanked: true,
                            score: (old?.ai?.score || 0) + diceTotal
                        }
                    };
                    return retObj;
                });
            }
        }
    }, [useAI, rollCount, diceTotal, doubleCount, playerData]);


    // watch for winner hook
    useEffect(() => {
        if (Number(currentRound) === Number(rounds)) {
            let highScore = 0;
            let winner;
            Object.entries(playerData.players).forEach(([key, value]) => {
                if (value.score > highScore) {
                    highScore = value.score;
                    winner = value.name;
                }
                else if (Number(value.score) === Number(highScore)) {
                    winner = winner + " and " + value.name;
                }
            });
            if(useAI){
                if (playerData.ai.score > highScore) {
                    highScore = playerData.ai.score;
                    winner = playerData.ai.name;
                }
                else if (Number(playerData.ai.score) === Number(highScore)) {
                    winner = winner + " and " + playerData.ai.name;
                }
            }
            setGameOver(true);
            alert("WINNER IS " + winner);
        }
    }, [currentRound, playerData, rounds, useAI]);

    const endRound = ()=>{
        setCurrentRound(old => old + 1);
        setDiceTotal(0);
        setRollCount(0);
        // all banks cleared
        setPlayerData(old => {
            let retObj = {
                ...old
            };
            Object.keys(old.players).forEach(playerId => {
                retObj.players[playerId].isBanked = false;
            });
            if(useAI){
                retObj.ai= {
                    ...retObj?.ai,
                    isBanked: false
                }
                setDoubleCount(0)
            }
            return retObj;
        });
    }

    const onRoll = (dieValue, [d1, d2]) => {
        if (!playersReady) {
            return;
        }
        setIsRolling(false);
        if (rollCount < 3) {
            // is safe roll
            if (Number(dieValue) === 7) {
                dieValue = 70;
            }
            if (Number(d1) === Number(d2)) {
                setDoubleCount(count => count + 1);
            }
            setDiceTotal(old => old + dieValue);
        }
        else {
            if (Number(d1) === Number(d2)) {
                setDiceTotal(old => old * 2);
                setDoubleCount(count => count + 1);
            }
            else if (Number(dieValue) === 7) {
                return endRound();
            }
            else {
                setDiceTotal(old => old + dieValue);
            }

        }

        // end of turn logic
        setRollCount(old => old + 1);
    };

    return (
        // incrase roll time on last round
        // decrease roll time when all banked
        <div id="game">
            <Players
                numPlayers={players}
                playerData={playerData}
                onPlayersReady={(data) => {
                    setPlayerData(data);
                    setPlayersReady(true);
                }}
                useAI={useAI}
                onUseAI={() => {
                    setUseAI(true)
                    setDoubleCount(0)
                    setPlayerData(old => {
                        let retObj = {
                            ...old,
                            ai: {
                                name: 'Mr. AI',
                                isBanked: false
                            }
                        };
                        return retObj;
                    });
                }}
                onBank={playerId => {
                    setPlayerData(old => {
                        return {
                            ...old,
                            players: {
                                ...old.players,
                                [playerId]: {
                                    ...old.players[playerId],
                                    isBanked: !old.players[playerId].isBanked,
                                    score: (old.players[playerId].score || 0) + diceTotal
                                }
                            }
                        };
                    });
                }}
            />
            <div id="gameBody">
                <div>
                    <h3 id='roundHeader'>Round {Math.min(1 + currentRound, rounds)}/{rounds} {rollCount > 2 && <button id='skip' onClick={endRound}>End</button>}</h3>
                    <h3 id='scoreHeader'>Total: {diceTotal} {rollCount < 3 && <span id='safeBanner'>Safe</span>}</h3>
                </div>

                <ReactDice
                    numDice={2}
                    ref={reactDice}
                    rollDone={onRoll}
                    faceColor={'#ffffff'}
                    dotColor={'#000000'}
                    dieSize={250}
                    rollTime={1}
                    outline={true}
                    disableIndividual={true}
                />
                {gameOver ? <button id="gameOverButton" onClick={()=>{
                    onNewGame()
                    setUseAI(false)
                }}>New Game!</button>
                    : <button id="rollButton" onClick={() => {
                        if (playersReady && !isRolling) {
                            setIsRolling(true);
                            reactDice.current?.rollAll();
                        }
                    }}>{rollCount > 2 ? 'YOLO': 'ROLL'}</button>}
            </div>
        </div>
    );
}
