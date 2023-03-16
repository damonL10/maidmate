export interface Provider {
    id: number;
    email: string;
    password: string;
    authentication?: string;
    is_available?: boolean;
    full_name: string;
    phone_no?: number;
    date_of_birth?: string;
    avatar?: string;
}

export interface User{
    id: number;
    email: string;
    password: string;
}

export interface Admin {
    id: number;
    username: string;
    password: string;
}

export interface ServiceType{
    id: number;
    service_name: string;
}

export interface Orders{
    id: number;
    status: string;
    service_type_id: number;
    selected_date: string;
    service_start_time: string;
}