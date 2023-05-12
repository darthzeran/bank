
export default function Setup({onFinishSetup, setGameRounds, setNumPlayers}) {

  return (
      <div id="setup">
          <h3>Choose a number of players:</h3>
          <input id="playerInput" onClick={(e)=> e.target.select()} onChange={e=>setNumPlayers(e.target.value)} type="number" min="2"/>
          
          <h3>Choose a number of round:</h3>
          <div onChange={e=>{setGameRounds(e.target.value)}}>
            
            <input className="radioRound" type="radio" value="5" name="rounds" /> 5
            <input className="radioRound" type="radio" value="10" name="rounds" /> 10
            <input className="radioRound" type="radio" value="15" name="rounds" /> 15
            <input className="radioRound" type="radio" value="20" name="rounds" /> 20
          </div>
        <div>
          <button id="setupButton" onClick={onFinishSetup}>Play!</button>
        </div>
        </div>
  );
}
