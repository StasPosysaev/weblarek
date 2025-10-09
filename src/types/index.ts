export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export type TPayment = 'card' | 'cash' | '';

export interface IBuyer {
    payment: TPayment;
    address: string;
    email: string;
    phone: string;
}

export interface ValidationResult {
    payment?: string;
    address?: string;
    email?: string;
    phone?: string;
}

export interface OrderResult {
    id: string;
    total: number;
}

export interface IOrder extends IBuyer {
    total: number; 
    items: string[];
}

export interface ProductListResponse {
    items: IProduct[];
}