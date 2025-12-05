import { Form } from './Form';
import { ContactsFormData } from '../../types';
import { EventEmitter } from '../base/Events';

export class ContactsForm extends Form<ContactsFormData> {
    private emailInput: HTMLInputElement;
    private phoneInput: HTMLInputElement;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container, events);

        this.emailInput = container.querySelector('input[name="email"]')!;
        this.phoneInput = container.querySelector('input[name="phone"]')!;

        this.emailInput.addEventListener('input', () => {
            this.updateSubmitButton();
        });

        this.phoneInput.addEventListener('input', () => {
            this.updateSubmitButton();
        });
    }

    render(data?: ContactsFormData): HTMLElement {
        if (data) {
            this.email = data.email;
            this.phone = data.phone;
            if (data.errors) {
                this.errors = data.errors;
            }
            this.updateSubmitButton();
        }
        return this.container;
    }

    private updateSubmitButton(): void {
        const errors = this.getValidationErrors();
        this.showErrors(errors);
        this.submitButton.disabled = Object.keys(errors).length > 0;
    }

    private getValidationErrors(): { email?: string; phone?: string } {
        const errors: { email?: string; phone?: string } = {};
        
        if (!this.emailInput.value.trim()) {
            errors.email = 'Введите email';
        }
        
        if (!this.phoneInput.value.trim()) {
            errors.phone = 'Введите телефон';
        }
        
        return errors;
    }

    protected validate(): boolean {
        const errors = this.getValidationErrors();
        this.showErrors(errors);
        return Object.keys(errors).length === 0;
    }

    protected handleSubmit(): void {
        const data: ContactsFormData = {
            email: this.emailInput.value.trim(),
            phone: this.phoneInput.value.trim()
        };
        this.events.emit('contacts:submit', data);
    }

    set email(value: string) {
        this.emailInput.value = value;
        this.updateSubmitButton();
    }

    set phone(value: string) {
        this.phoneInput.value = value;
        this.updateSubmitButton();
    }

    set errors(value: { email?: string; phone?: string }) {
        this.showErrors(value);
        this.submitButton.disabled = Object.keys(value || {}).length > 0;
    }
}