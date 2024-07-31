

export type Address = {
    country: string;
    city: string;
    street: string;
    apartment: string;
};

export type Product = {
    product_id: string;
    name: string;
    quantity: string;
};

export type Metadata = {
    order_id: string;
    name:{
        first:string;
        last:string
    },
    first_name?: string;
    last_name?: string;
    email: string;
    phone_number: string;
    address: Address;
    total: string;
    products:[]
};
