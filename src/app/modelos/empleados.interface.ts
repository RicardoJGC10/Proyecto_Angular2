export interface ApiResponse<T>{
    message?:string;
    data: T;
}




export interface EmpleadosInterface{

    employee_id?:string;
    name:string;
    email:string;
    phone:string;
    department:string;

}