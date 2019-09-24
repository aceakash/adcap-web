import React from 'react';
import './App.css';
import { Game } from './core/game'
import { Business } from './core/business';


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

      <div className="panel-main">
        {Array.from(g.businesses.keys()).map(bid => {
          const business: Business = g.businesses.get(bid) as Business
          return (
            <div className="business-container" key={bid}>
              <BusinessDisplay
                business={business}
                makeSale={g.manualSale.bind(g)}
              />
              <button
                onClick={() => g.buyNewInstance(bid)}
                disabled={!g.canAffordNewInstance(bid)}>Buy next {business.name} at {formatDollars(business.calculateCostOfNextInstance())}
              </button>
            </div>
          )
        })}
      </div>

      <hr />

      <div className="panel-managers">
        {Array.from(g.businesses.keys()).map(bid => {
          const business: Business = g.businesses.get(bid) as Business
          return (
            <div key={"manager-" + bid}>
              <button onClick={() => g.hireManager(bid)} disabled={(g.funds$ < business.managerCost) || business.managerHired}>
                {business.name} Manager: { business.managerHired ? '[Active]' : formatDollars(business.managerCost)}</button>
            </div>
          )
        })}
      </div>
    </div>
  );
}

const BusinessDisplay: React.FC<BusinessDisplayProps> = (props) => {
  const b = props.business
  const makeSale = props.makeSale
  return (
    <div className="business-display-container">
      <div>{b.instanceCount}x {b.name}</div>
      <button disabled={b.instanceCount < 1 || b.isSaleInProgress} onClick={() => { makeSale(b.id) }}>
      {b.managerHired ? 'Manager selling...' 
        : (b.isSaleInProgress ? 'Selling...' 
          : 'Make a sale!')}
      </button>
      <div>Each sale earns ${formatDollars(b.earningsPerSale$)} and takes {b.saleTimeMs / 1000} second</div>
    </div>
  )
}

function formatDollars(dollarAmount: number): string {
  return `${dollarAmount.toFixed(2)}`
}

export default App;
