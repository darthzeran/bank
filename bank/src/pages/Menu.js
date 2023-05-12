
import bank from '../bank.png';


export default function Menu({onStart}) {

  return (
      <>
        <header className="App-header">
          <h1> Welcome to Bank!</h1>
        </header>
        <div id="menu-div">
          <img src={bank} className="App-logo" alt="logo" />
          <button id="start" onClick={onStart}>Start!</button>
        </div>
        </>
  );
}
