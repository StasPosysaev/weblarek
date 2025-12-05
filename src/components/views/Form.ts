import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';

export abstract class Form<T> extends Component<T> {
    protected events: EventEmitter;
    protected submitButton: HTMLButtonElement;
    protected errorsElement: HTMLElement;
    
    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this.events = events;
        
        this.submitButton = container.querySelector('button[type="submit"]')!;
        this.errorsElement = container.querySelector('.form__errors')!;
        
        container.addEventListener('submit', (event) => {
            event.preventDefault();
            if (this.validate()) {
                this.handleSubmit();
            }
        });
        
        container.addEventListener('input', () => {
            this.events.emit('form:input');
        });
    }
    
    protected abstract validate(): boolean;
    protected abstract handleSubmit(): void;
    
    protected showErrors(errors: Record<string, string>): void {
        const errorMessages = Object.values(errors).filter(Boolean);
        this.errorsElement.textContent = errorMessages.join(', ');
        this.submitButton.disabled = errorMessages.length > 0;
    }
    
    render(): HTMLElement {
        return this.container;
    }
}