import { Form } from './Form';
import { OrderFormData, TPayment } from '../../types';
import { EventEmitter } from '../base/Events';

export class OrderForm extends Form<OrderFormData> {
    private paymentButtons: NodeListOf<HTMLButtonElement>;
    private addressInput: HTMLInputElement;
    private currentPayment: TPayment = '';

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container, events);

        this.paymentButtons = container.querySelectorAll('.button_alt');
        this.addressInput = container.querySelector('input[name="address"]')!;

        this.paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.selectPayment(button.name as TPayment);
            });
        });

        this.addressInput.addEventListener('input', () => {
            this.updateSubmitButton();
        });
    }

    render(data?: OrderFormData): HTMLElement {
        if (data) {
            this.currentPayment = data.payment;
            this.address = data.address;
            if (data.errors) {
                this.errors = data.errors;
            }
            this.updatePaymentButtons();
            this.updateSubmitButton(); 
        }
        return this.container;
    }

    private selectPayment(payment: TPayment): void {
        this.currentPayment = payment;
        this.updatePaymentButtons();
        this.updateSubmitButton(); 
        this.events.emit('form:input');
    }

    private updatePaymentButtons(): void {
        this.paymentButtons.forEach(button => {
            if (button.name === this.currentPayment) {
                button.classList.add('button_alt-active');
            } else {
                button.classList.remove('button_alt-active');
            }
        });
    }

    private updateSubmitButton(): void {
        const errors = this.getValidationErrors();
        this.showErrors(errors);
        this.submitButton.disabled = Object.keys(errors).length > 0;
    }

    private getValidationErrors(): { payment?: string; address?: string } {
        const errors: { payment?: string; address?: string } = {};
        
        if (!this.currentPayment) {
            errors.payment = 'Выберите способ оплаты';
        }
        
        if (!this.addressInput.value.trim()) {
            errors.address = 'Введите адрес доставки';
        }
        
        return errors;
    }

    protected validate(): boolean {
        const errors = this.getValidationErrors();
        this.showErrors(errors);
        return Object.keys(errors).length === 0;
    }

    protected handleSubmit(): void {
        const data: OrderFormData = {
            payment: this.currentPayment,
            address: this.addressInput.value.trim()
        };
        this.events.emit('order:submit', data);
    }

    protected showErrors(errors: Record<string, string>): void {
        const errorMessages = Object.values(errors).filter(Boolean);
        this.errorsElement.textContent = errorMessages.join(', ');
    }

    set payment(value: TPayment) {
        this.currentPayment = value;
        this.updatePaymentButtons();
        this.updateSubmitButton();
    }

    set address(value: string) {
        this.addressInput.value = value;
        this.updateSubmitButton();
    }

    set errors(value: { payment?: string; address?: string }) {
        this.showErrors(value);
    }
}