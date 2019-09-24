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
    
    managerHired: boolean = false;

    readonly managerCost: number;
    
    private readonly _delay: (delayMs: number)=>Promise<any>;

    constructor(
        id: string, 
        name: string, 
        saleTimeMs: number, 
        earningsPerInstanceSale$: number, 
        costOfFirstInstance$: number, 
        instanceInflationFactor: number, 
        managerCost: number,
        delayFn: (delayMs: number)=>Promise<any>) {
        this.id = id
        this.name = name
        this._saleTimeMs = saleTimeMs
        this._earningsPerInstanceSale$ = earningsPerInstanceSale$
        this._isSaleInProgress = false
        this._costOfFirstInstance$ = costOfFirstInstance$
        this._instanceInflationFactor = instanceInflationFactor
        this._delay = delayFn
        this.managerCost = managerCost
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

/**
 * A manager for a business makes a sale without requiring the player to manually click. As soon as a sale can be made, the manager makes it.
 * The tab still needs to be open for the manager to click the button.
 * 
 * Managers can be permanently hired for a cost.
 * 
 * 
 */
export class Manager {
    readonly businessId: string;
    readonly cost: number;

    constructor(businessId: string, cost: number) {
        this.businessId = businessId
        this.cost = cost
    }
}