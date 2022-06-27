
export class DialogDataModel<T> {
    constructor(
        public Data?: T,
        public Lookups?: {[key:string]: any[]},
        public lang?: string,
        public type?: string
    ) {
    }

}
