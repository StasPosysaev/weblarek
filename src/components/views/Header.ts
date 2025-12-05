import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';
import { HeaderData } from '../../types';

export class Header extends Component<HeaderData> {
    private basketButton: HTMLButtonElement;
    private counterElement: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this.basketButton = container.querySelector('.header__basket')!;
        this.counterElement = container.querySelector('.header__basket-counter')!;

        this.basketButton.addEventListener('click', () => {
            this.events.emit('header:basket');
        });
    }

    render(data?: HeaderData): HTMLElement {
        if (data) {
            this.counter = data.counter;
        }
        return this.container;
    }

    set counter(value: number) {
        this.counterElement.textContent = String(value);
    }
}