import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App, { AppState } from './App';
import * as serviceWorker from './serviceWorker';
import {Game} from './core/game'


const game = new Game()
game.buyNewInstance('lemonadeStand')
const appState: AppState = {
    game
};

(window as any).appState = appState



setInterval(() => {
    ReactDOM.render(<App game={game} />, document.getElementById('root'));
}, 100)


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
