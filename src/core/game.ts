import {delay} from './util'

export class Business {
    static calculateNextInstanceCost(currentInstanceCount: number, costOfFirstInstance: number, instanceInflationFactor: number) {
        if (currentInstanceCount === 0) {
            return costOfFirstInstance
        }
        return costOfFirstInstance * Math.pow((1 + instanceInflationFactor), currentInstanceCount)    
    }

    
    
    readonly id: string;
    readonly name: string;
    
    private _instanceCount: number = 0;
    get instanceCount(): number {
        return this._instanceCount
    }

    private _saleTimeMs: number;
    get saleTimeMs(): number {
        return this._saleTimeMs
    }

    private _earningsPerInstanceSale$: number;
    get earningsPerSale$(): number {
        return this._earningsPerInstanceSale$ * this._instanceCount
    }

    private _isSaleInProgress: boolean;
    get isSaleInProgress(): boolean {
        return this._isSaleInProgress
    }

    private _costOfFirstInstance$: number;
    get costOfFirstInstance$(): number {
        return this._costOfFirstInstance$
    }

    
    private _instanceInflationFactor: number;
    /**  instanceInflationFactor is how much the next instance is more expensive by. 
     e.g. if the first instance costs 100, and the instanceInflationFactor is 0.10, 
     then the second instance will cost 100 * (1 + 0.10) = 110, 
     and the third will cost 121
    */
    get instanceInflationFactor(): number {
        return this._instanceInflationFactor
    }

    private readonly _delay: (delayMs: number)=>Promise<any>;

    constructor(id: string, name: string, saleTimeMs: number, earningsPerInstanceSale$: number, costOfFirstInstance$: number, instanceInflationFactor: number, delayFn: (delayMs: number)=>Promise<any>) {
        this.id = id
        this.name = name
        this._saleTimeMs = saleTimeMs
        this._earningsPerInstanceSale$ = earningsPerInstanceSale$
        this._isSaleInProgress = false
        this._costOfFirstInstance$ = costOfFirstInstance$
        this._instanceInflationFactor = instanceInflationFactor
        this._delay = delayFn
    }

    async manualSale(): Promise<number> {
        if (this._instanceCount === 0) {
            throw new Error("No instances of this business yet")
        }
        if (this._isSaleInProgress) {
            throw new Error("A sale is already in progress")
        }
        this._isSaleInProgress = true
        await this._delay(this._saleTimeMs)
        this._isSaleInProgress = false
        return this.earningsPerSale$
    }

    buyNewInstance() {
        this._instanceCount += 1
    }
    
    calculateCostOfNextInstance(): number {
        return Business.calculateNextInstanceCost(this._instanceCount, this._costOfFirstInstance$, this._instanceInflationFactor)
    }
}





export class Game {
    private _funds$: number;
    get funds$(): number {
        return this._funds$
    }

    readonly businesses: Business[];


    constructor(delayFn: (delayMs: number)=>Promise<any> = delay) {
        this._funds$ = 4
        this.businesses = [
            new Business('lemonadeStand', 'Lemonade Stand', 1000, 1, 4, 0.07, delayFn),
            new Business('newsPapers', 'Newspaper Stall', 2 * 1000, 60, 60, 0.15, delayFn),
            new Business('carWash', 'Car Wash', 6 * 1000, 540, 720, 0.14, delayFn),
            new Business('pizzaDelivery', 'Pizza Delivery', 12 * 1000, 4320, 8640, 0.13, delayFn),
        ]
    }

    /*
    car wash   starts at 720, 820.80, 
    earns 540
    */

    /**
     * Executes a manual sale (e.g. when user clicks) 
     */
    async manualSale(businessId: string): Promise<any>  {
        let business = this.businesses.find(b => b.id === businessId)
        if (business === undefined) {
            throw new Error(`Unknown businessId ${businessId}`)
        }
        const earnings$ = await business.manualSale()
        this._funds$ += earnings$
        return
    }

    canAffordNewInstance(businessId: string): boolean {
        let business = this.getBusinessWithId(businessId)
        return business.calculateCostOfNextInstance() <= this._funds$
    }

    getBusinessWithId(businessId: string): Business {
        let business = this.businesses.find(b => b.id === businessId)
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
        const costOfNextInstance$ = business.calculateCostOfNextInstance()
        
        if (this._funds$ < costOfNextInstance$) {
            
        }
        this._funds$ -= costOfNextInstance$
        business.buyNewInstance()
    }
}





