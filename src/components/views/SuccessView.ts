import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';
import { SuccessData } from '../../types';

export class SuccessView extends Component<SuccessData> {
    private descriptionElement: HTMLElement;
    private closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this.descriptionElement = container.querySelector('.order-success__description')!;
        this.closeButton = container.querySelector('.order-success__close')!;

        this.closeButton.addEventListener('click', () => {
            this.events.emit('success:close');
        });
    }

    render(data?: SuccessData): HTMLElement {
        if (data) {
            this.total = data.total;
        }
        return this.container;
    }

    set total(value: number) {
        this.descriptionElement.textContent = `Списано ${value} синапсов`;
    }
}