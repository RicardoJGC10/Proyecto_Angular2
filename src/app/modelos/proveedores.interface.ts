export interface ApiResponse<T>{
    message?:string
    data: T;
}




export interface ProveedoresInterface{

    id_supplier?:string;
    name:string;
    name_contact:string;
    email:string;
    address:string;
    country:string;
    cp:string;
    phone:string;
}