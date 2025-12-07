import { Form } from './Form';
import { ContactsFormData } from '../../types';
import { EventEmitter } from '../base/Events';

export class ContactsForm extends Form<ContactsFormData> {
    private emailInput: HTMLInputElement;
    private phoneInput: HTMLInputElement;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container, events);

        this.emailInput = this.container.querySelector('input[name="email"]')!;
        this.phoneInput = this.container.querySelector('input[name="phone"]')!;

        this.emailInput.addEventListener('input', () => {
            this.events.emit('contacts.email:change', { email: this.emailInput.value });
        });

        this.phoneInput.addEventListener('input', () => {
            this.events.emit('contacts.phone:change', { phone: this.phoneInput.value });
        });
    }

    set email(value: string) {
        this.emailInput.value = value;
    }

    set phone(value: string) {
        this.phoneInput.value = value;
    }

    protected handleSubmit(): void {
        this.events.emit('contacts:submit');
    }
}