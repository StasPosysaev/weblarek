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

export interface CatalogCardData {
    id: string;
    title: string;
    image: string;
    category: string;
    price: number | null;
}

export interface PreviewCardData extends CatalogCardData {
    description: string;
    inBasket: boolean;
}

export interface BasketCardData {
    id: string;
    title: string;
    price: number | null;
    index: number;
}

export interface BasketViewData {
    items: HTMLElement[];
    total: number;
    isEmpty: boolean;
}

export interface HeaderData {
    counter: number;
}

export interface OrderFormData {
    payment: TPayment;
    address: string;
    errors?: Record<string, string>;
}

export interface ContactsFormData {
    email: string;
    phone: string;
    errors?: Record<string, string>;
}

export interface SuccessData {
    total: number;
}

export interface ICardActions {
    onClick?: () => void;
    onToggle?: () => void;
    onDelete?: () => void;
}

export interface GalleryViewData {
    items: HTMLElement[];
}