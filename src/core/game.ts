import { delay } from './util'

import { Business } from './business'



export class Game {
    private _funds$: number;
    get funds$(): number {
        return this._funds$
    }

    readonly businesses: Map<string, Business>


    constructor(delayFn: (delayMs: number) => Promise<any> = delay) {
        this._funds$ = 4
        this.businesses = new Map<string, Business>()

        this.businesses.set('lemonadeStand', new Business('lemonadeStand', 'Lemonade Stand', 1000, 1, 4, 0.07, 1000, delayFn))
        this.businesses.set('newsPapers', new Business('newsPapers', 'Newspaper Stall', 2 * 1000, 60, 60, 0.15, 15000, delayFn))
        this.businesses.set('carWash', new Business('carWash', 'Car Wash', 6 * 1000, 540, 720, 0.14, 100000, delayFn))
        this.businesses.set('pizzaDelivery', new Business('pizzaDelivery', 'Pizza Delivery', 12 * 1000, 4320, 8640, 0.13, 500000, delayFn))
        this.businesses.set('donutShop', new Business('donutShop', 'Donut Shop', 18 * 1000, 51840, 103680, 0.12, 1200000, delayFn))
        this.businesses.set('shrimpBoat', new Business('shrimpBoat', 'Shrimp Boat', 96 * 1000, 622080, 1244160, 0.11, 10*1000*1000, delayFn))
        this.businesses.set('hockeyTeam', new Business('hockeyTeam', 'Hockey Team', 384 * 1000, 7464000, 14929920, 0.1, 111111111, delayFn))
        this.businesses.set('movieStudio', new Business('movieStudio', 'Movie Studio', 1536 * 1000, 89579000, 179159040, 0.09, 555555555, delayFn))
        this.businesses.set('bank', new Business('bank', 'Bank', 6144 * 1000, 1074000000, 2149908480, 0.08, 10*1000*1000*1000, delayFn))
    }


    /**
     * Executes a manual sale (e.g. when user clicks) 
     */
    async manualSale(businessId: string): Promise<any> {
        let business = this.getBusinessWithId(businessId)
        const earnings$ = await business.manualSale()
        this._funds$ += earnings$
        return
    }

    canAffordNewInstance(businessId: string): boolean {
        let business = this.getBusinessWithId(businessId)
        return business.calculateCostOfNextInstance() <= this._funds$
    }

    getBusinessWithId(businessId: string): Business {
        let business = this.businesses.get(businessId)
        if (business === undefined) {
            throw new Error(`Unknown businessId ${businessId}`)
        }
        return business
    }

    buyNewInstance(businessId: string): void {
        let business = this.getBusinessWithId(businessId)
        if (!this.canAffordNewInstance(businessId)) {
            throw new Error(`Not enough funds to buy next instance of ${businessId}`)
        }
        this._funds$ -= business.calculateCostOfNextInstance()
        business.buyNewInstance()
    }

    hireManager(businessId: string): void {
        let business = this.getBusinessWithId(businessId)
        if (this._funds$ < business.managerCost) {
            throw new Error(`Not enough funds to hire manager for ${businessId}`)
        }
        this._funds$ -= business.managerCost
        business.managerHired = true
        const that = this
        setInterval(() => {
            if (business.saleStartedTime == null) {
                that.manualSale(businessId)
            }
        }, 500)
    }
}
