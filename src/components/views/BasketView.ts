import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';
import { BasketViewData } from '../../types';

export class BasketView extends Component<BasketViewData> {
    private listElement: HTMLElement;
    private totalElement: HTMLElement;
    private orderButton: HTMLButtonElement;

    constructor(protected events: EventEmitter, container: HTMLElement) {
        super(container);

        this.listElement = this.container.querySelector('.basket__list')!;
        this.totalElement = this.container.querySelector('.basket__price')!;
        this.orderButton = this.container.querySelector('.basket__button')!;

        this.orderButton.addEventListener('click', () => {
            this.events.emit('basket:order');
        });
    }

    set items(value: HTMLElement[]) {
        this.listElement.innerHTML = '';
        
        if (value.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'basket__empty';
            emptyMessage.textContent = 'Корзина пуста';
            this.listElement.appendChild(emptyMessage);
        } else {
            value.forEach(item => this.listElement.appendChild(item));
        }
    }

    set total(value: number) {
        this.totalElement.textContent = `${value} синапсов`;
    }

    set isEmpty(value: boolean) {
        this.orderButton.disabled = value;
    }
}