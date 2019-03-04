import React, { Component } from 'react';
import './App.css';
import Game from "./components/Game";

class App extends Component {
  state = { game: null }
  initializeGame(game){
    this.setState({ game })
  }

  render() {
    return (
      <div className="App">
        <h1>The Dude</h1>
        <Game
            game={this.state.game}
            initializeGame={this.initializeGame.bind(this)}
        />
      </div>
    );
  }
}

export default App;
