import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';
import { BasketViewData, BasketCardData } from '../../types';
import { BasketCard } from './BasketCard';

export class BasketView extends Component<BasketViewData> {
    private listElement: HTMLElement;
    private totalElement: HTMLElement;
    private orderButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this.listElement = container.querySelector('.basket__list')!;
        this.totalElement = container.querySelector('.basket__price')!;
        this.orderButton = container.querySelector('.basket__button')!;

        this.orderButton.addEventListener('click', () => {
            this.events.emit('basket:order');
        });
    }

    render(data?: BasketViewData): HTMLElement {
        if (data) {
            this.items = data.items;
            this.total = data.total;
            this.isEmpty = data.isEmpty;
        }
        return this.container;
    }

    set items(value: BasketCardData[]) {
        this.listElement.innerHTML = '';
        
        if (value.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'basket__empty';
            emptyMessage.textContent = 'Корзина пуста';
            this.listElement.appendChild(emptyMessage);
        } else {
            value.forEach((itemData, index) => {
                const template = document.querySelector('#card-basket') as HTMLTemplateElement;
                const cardElement = template.content.cloneNode(true) as HTMLElement;
                const cardContainer = cardElement.firstElementChild as HTMLElement;
                
                const card = new BasketCard(cardContainer, this.events);
                card.render({ ...itemData, index: index + 1 });
                this.listElement.appendChild(cardContainer);
            });
        }
    }

    set total(value: number) {
        this.totalElement.textContent = `${value} синапсов`;
    }

    set isEmpty(value: boolean) {
        this.orderButton.disabled = value;
    }
}