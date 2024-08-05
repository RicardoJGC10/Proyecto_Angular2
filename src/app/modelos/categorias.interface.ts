export interface ApiResponse<T>{
    message?:string;
    data: T;
}




export interface CategoriasInterface{

    id_categorie?:string;
    name:string;
    description:string;
}