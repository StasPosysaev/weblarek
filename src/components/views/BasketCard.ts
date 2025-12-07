import { Card } from './Card';
import { EventEmitter } from '../base/Events';
import { BasketCardData } from '../../types';

export class BasketCard extends Card<BasketCardData> {
    private indexElement: HTMLElement;
    private titleElement: HTMLElement;
    private priceElement: HTMLElement;
    private deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container, events);

        this.indexElement = this.container.querySelector('.basket__item-index')!;
        this.titleElement = this.container.querySelector('.card__title')!;
        this.priceElement = this.container.querySelector('.card__price')!;
        this.deleteButton = this.container.querySelector('.basket__item-delete')!;

        this.deleteButton.addEventListener('click', () => {
            const id = this.container.dataset.id;
            if (id) {
                this.events.emit('basket:remove', { id });
            }
        });
    }

    set index(value: number) {
        this.indexElement.textContent = String(value);
    }

    set title(value: string) {
        this.setTitle(value, this.titleElement);
    }

    set price(value: number | null) {
        this.setPrice(value, this.priceElement);
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }
}