import React, { useState } from 'react';
import '../styles/game.css';

export default function Players({ numPlayers, playerData, onPlayersReady, onBank, useAI, onUseAI }) {
    const [playerNames, setPlayerNames] = useState({});

    return (
        <div id="players">
            {!playerData?.players || (Object.keys(playerData.players).length < numPlayers) ?
                <>
                    {[...Array.from({ length: numPlayers })].map((_, i) => {
                        const key = "player" + (i + 1);
                        return <div className="playerNameWrite" key={key}>
                            <input className="playerNameInput" placeholder={key} value={playerNames?.[i + 1]?.name || ''} onChange={e => {
                                if (e.target.value) {
                                    setPlayerNames((old) => {
                                        return {
                                            ...old,
                                            [i + 1]: { name: e.target.value }
                                        };
                                    });
                                }
                            }}
                                type="text" />
                        </div>;
                    })}
                    <button id="namesDone" onClick={() => {
                        if (Object.keys(playerNames).length === Number(numPlayers)) {
                            onPlayersReady({ players: playerNames });
                        }
                    }}>Done</button>
                </>
                :
                <>
                    <div className={"playerDisplay"} key={"PlayerTitle"}>
                        <span>Player</span>
                        <span>Score</span>
                        <span>Bank</span>

                    </div>
                    {Object.keys(playerData.players).map(playerId => {
                        const key = "player" + playerId;
                        return <div key={key} className={"playerDisplay"}>
                            <span>{playerData.players[playerId].name}</span>
                            <span>{playerData.players[playerId].score || 0}</span>
                            <input disabled={playerData.players[playerId].isBanked} type="checkbox" className={'bank'} checked={playerData.players[playerId].isBanked}
                                onChange={() => {
                                    onBank(playerId);
                                }}
                            />
                        </div>;
                    })}
                    {useAI ? <div key={'ai'} className={"playerDisplay aiDisplay"}>
                            <span>{playerData?.ai?.name || 'Mr. AI'}</span>
                            <span>{playerData?.ai?.score || 0}</span>
                            <input disabled={true} type="checkbox" className={'bank'} checked={playerData?.ai?.isBanked} />
                        </div>
                        
                    :<button id="aiButton" onClick={onUseAI}>Use AI</button>}
                </>
            }
        </div>
    );
}
