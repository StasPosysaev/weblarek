import { Card } from './Card';
import { BasketCardData } from '../../types';
import { EventEmitter } from '../base/Events';

export class BasketCard extends Card<BasketCardData> {
    private indexElement: HTMLElement;
    private titleElement: HTMLElement;
    private priceElement: HTMLElement;
    private deleteButton: HTMLButtonElement;
    private currentId: string = '';

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container, events);

        this.indexElement = container.querySelector('.basket__item-index')!;
        this.titleElement = container.querySelector('.card__title')!;
        this.priceElement = container.querySelector('.card__price')!;
        this.deleteButton = container.querySelector('.basket__item-delete')!;

        this.deleteButton.addEventListener('click', () => {
            if (this.currentId) {
                this.events.emit('basket:remove', { id: this.currentId });
            }
        });
    }

    render(data?: BasketCardData): HTMLElement {
        if (data) {
            this.currentId = data.id;
            this.index = data.index;
            this.title = data.title;
            this.price = data.price;
        }
        return this.container;
    }

    set index(value: number) {
        this.indexElement.textContent = String(value);
    }

    set title(value: string) {
        this.titleElement.textContent = value;
    }

    set price(value: number | null) {
        this.priceElement.textContent = this.formatPrice(value);
    }
}