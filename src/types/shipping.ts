export type shipping = {
    order_id:string;
    total:number;
    address:string;
    status?:'CREATED'|'SHIPPED'|'DELIVERED'|'RETURNED';
    ordered_at:Date;
};
