import React from 'react';
import './App.css';
import { Business, Game } from './core/game'

export interface AppState {
  game: Game;
}

interface BusinessDisplayProps {
  business: Business;
  makeSale: any;
}

const App: React.FC<AppState> = (props) => {
  const g = props.game
  return (
    <div className="App">
      <h1>${formatDollars(g.funds$)}</h1>

      {g.businesses.map(b => (
        <div className="business-container" key={b.id}>
          <BusinessDisplay
            business={b}
            makeSale={g.manualSale.bind(g)}
          />
          <button
            onClick={() => g.buyNewInstance(b.id)}
            disabled={!g.canAffordNewInstance(b.id)}>Buy next {b.name} at {formatDollars(b.calculateCostOfNextInstance())}
          </button>
        </div>
      ))}


    </div>
  );
}

const BusinessDisplay: React.FC<BusinessDisplayProps> = (props) => {
  const b = props.business
  const makeSale = props.makeSale
  return (
    <div className="business-display-container">
      <div>{b.instanceCount}x {b.name}</div>
      <button disabled={b.instanceCount < 1 || b.isSaleInProgress} onClick={() => { makeSale(b.id) }}>{b.isSaleInProgress ? 'Selling...' : 'Make a sale!'}</button>
      <div>Each sale earns ${formatDollars(b.earningsPerSale$)} and takes {b.saleTimeMs / 1000} second</div>
    </div>
  )
}

function formatDollars(dollarAmount: number): string {
  return `${dollarAmount.toFixed(2)}`
}

export default App;
