import { EventEmitter } from '../base/Events';
import { IBuyer, TPayment, ValidationResult } from '../../types';

export class CustomerModel {
    private _payment: TPayment = '';
    private _address: string = '';
    private _email: string = '';
    private _phone: string = '';
    
    constructor(private events: EventEmitter) {}

    setPayment(payment: TPayment): void {
        this._payment = payment;
        this.events.emit('customer:changed');
    }

    setAddress(address: string): void {
        this._address = address;
        this.events.emit('customer:changed');
    }

    setEmail(email: string): void {
        this._email = email;
        this.events.emit('customer:changed');
    }

    setPhone(phone: string): void {
        this._phone = phone;
        this.events.emit('customer:changed');
    }

    getData(): IBuyer {
        return {
            payment: this._payment,
            address: this._address,
            email: this._email,
            phone: this._phone
        };
    }

    validate(): ValidationResult {
        const errors: ValidationResult = {};
        
        if (!this._payment) errors.payment = 'Выберите способ оплаты';
        if (!this._address.trim()) errors.address = 'Введите адрес';
        if (!this._email.trim()) errors.email = 'Введите email';
        if (!this._phone.trim()) errors.phone = 'Введите телефон';
        
        return errors;
    }

    clear(): void {
        this._payment = '';
        this._address = '';
        this._email = '';
        this._phone = '';
        this.events.emit('customer:changed');
    }
}

