export interface ApiResponse<T>{
    message?:string
    data: T;
}




export interface ProductosInterface{

    id_product?:string;
    name:string;
    description:string;
    cost: string,
    price:string;
    available_quantity:string;
    image:string;
    category:string;
    supplier:string;
}

