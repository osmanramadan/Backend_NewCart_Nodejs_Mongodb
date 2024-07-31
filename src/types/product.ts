
export type product={
    product_id?:number,
    name?: String,
    description?:String,   
    price?:number,
    category?:String,
    color?:[],
    size?:[],
    image?:String,
    stock?:number,
    flashsales?:Boolean,
    discount?:number,
    offer?:Boolean
}

export type orderProduct={
    product_id?:number,
    order_id?:number,
    quantity:number,
    name?:string
}

