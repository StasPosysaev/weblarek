import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';

export abstract class Form<T> extends Component<T> {
    protected events: EventEmitter;
    protected submitButton: HTMLButtonElement;
    protected errorsElement: HTMLElement;
    
    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this.events = events;
        
        this.submitButton = this.container.querySelector('button[type="submit"]')!;
        this.errorsElement = this.container.querySelector('.form__errors')!;
        
        this.container.addEventListener('submit', (event) => {
            event.preventDefault();
            this.handleSubmit();
        });
    }
    
    protected abstract handleSubmit(): void;
    
    protected showErrors(errors: Record<string, string>): void {
        const errorMessages = Object.values(errors).filter(Boolean);
        this.errorsElement.textContent = errorMessages.join(', ');
        this.submitButton.disabled = errorMessages.length > 0;
    }

    updateErrors(errors: Record<string, string>): void {
        this.showErrors(errors);
    }
    
    set errors(value: Record<string, string>) {
        this.showErrors(value);
    }
}