import React from 'react';
import './App.css';
import { Game } from './core/game'
import { Business } from './core/business';
import numeral from 'numeral'



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

      <h1>{formatDollars(g.funds$)}</h1>

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
              <button onClick={() => g.hireManager(bid)} disabled={business.instanceCount === 0 || (g.funds$ < business.managerCost) || business.managerHired}>
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
  let timeLeftSec = Math.ceil((b.saleTimeMs - ((new Date().getTime()) - (b.saleStartedTime || 0)))/1000)
  
  return (
    <div className="business-display-container">
      <div>{b.instanceCount}x {b.name}</div>
      <button style={ getButtonStyle(timeLeftSec) } 
        disabled={b.managerHired || b.instanceCount < 1 || b.saleStartedTime != null} onClick={() => { makeSale(b.id) }}>
      { b.managerHired ? `Manager selling...${timeLeftSec}s left` 
        : (b.saleStartedTime != null ? `Selling... ${timeLeftSec}s left`
          : 'Make a sale!')
        }
      </button>
      <div>Each sale earns {formatDollars(b.earningsPerSale$)} and takes {b.saleTimeMs / 1000} second{b.saleTimeMs === 1000 ? '' : 's'}</div>
    </div>
  )

  function getButtonStyle(timeLeftSec: number) : any {
    const progress = 1 - ((timeLeftSec*1000)/b.saleTimeMs)
    const opacity = 0.2 + progress*0.8
    if (b.saleStartedTime != null) { 
      return {opacity: opacity}
    } else {
      return undefined
    }
  }
}

function formatDollars(dollarAmount: number): string {
  const n = numeral(dollarAmount)
  if (dollarAmount > 10*1000*1000*1000*1000) {
    return `$${n.format('0,0.00 a')}`.replace(' t', ' trillion')
  }
  if (dollarAmount > 1*1000*1000*1000*1000) {
    return `$${n.format('0,0.000 a')}`.replace(' t', ' trillion')
  }
  if (dollarAmount > 10*1000*1000*1000) {
    return `$${n.format('0,0.00 a')}`.replace(' b', ' billion')
  }
  if (dollarAmount > 1*1000*1000*1000) {
    return `$${n.format('0,0.000 a')}`.replace(' b', ' billion')
  }
  if (dollarAmount > 10*1000*1000) {
    return `$${n.format('0,0.00 a')}`.replace(' m', ' million')
  }
  if (dollarAmount > 1*1000*1000) {
    return `$${n.format('0,0.000 a')}`.replace(' m', ' million')
  }
  return `$${n.format('0,0.00')}`
}

export default App;
