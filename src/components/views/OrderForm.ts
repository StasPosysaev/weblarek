import { Form } from './Form';
import { OrderFormData, TPayment } from '../../types';
import { EventEmitter } from '../base/Events';

export class OrderForm extends Form<OrderFormData> {
    private paymentButtons: NodeListOf<HTMLButtonElement>;
    private addressInput: HTMLInputElement;

    constructor(protected events: EventEmitter, container: HTMLElement) {
        super(container, events);

        this.paymentButtons = this.container.querySelectorAll('.button_alt');
        this.addressInput = this.container.querySelector('input[name="address"]')!;

        this.paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.events.emit('order.payment:change', { 
                    payment: button.name as TPayment 
                });
            });
        });

        this.addressInput.addEventListener('input', () => {
            this.events.emit('order.address:change', { 
                address: this.addressInput.value 
            });
        });
    }

    set payment(value: TPayment) {
        this.paymentButtons.forEach(button => {
            if (button.name === value) {
                button.classList.add('button_alt-active');
            } else {
                button.classList.remove('button_alt-active');
            }
        });
    }

    set address(value: string) {
        this.addressInput.value = value;
    }

    protected handleSubmit(): void {
        this.events.emit('order:submit');
    }
}