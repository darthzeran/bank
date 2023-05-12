import React, { useState } from 'react';
import Menu from './pages/Menu';
import Setup from './pages/Setup';
import Game from './pages/Game';

import './styles/App.css';

const GameState = {
  HOME: 'HOME',
  SETUP: 'SETUP',
  GAME: 'GAME'
};

function App() {
  const [gameState, setGameState] = useState(GameState.HOME);
  const [gameRounds, setGameRounds] = useState(null);
  const [numPlayers, setNumPlayers] = useState(null);

  return (
    <div className="App">
      {/* onImgClick -> state to HOME */}
      {gameState === GameState.HOME && (
        <Menu onStart={() => setGameState(GameState.SETUP)} />
      )}
      {gameState === GameState.SETUP &&
        <Setup
          setGameRounds={setGameRounds}
          setNumPlayers={setNumPlayers}
          onFinishSetup={() => {
            if(gameRounds && numPlayers){
              setGameState(GameState.GAME);
            }
          }}
        />
      }
      {gameState === GameState.GAME && 
        <Game 
          rounds={gameRounds} 
          players={numPlayers} 
          onNewGame={() => {  
            setGameState(GameState.HOME)
          }} 
        />
      }
    </div>
  );
}

export default App;
