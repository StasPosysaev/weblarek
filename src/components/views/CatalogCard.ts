import { Card } from './Card';
import { CatalogCardData } from '../../types';
import { CDN_URL } from '../../utils/constants';
import { EventEmitter } from '../base/Events';

export class CatalogCard extends Card<CatalogCardData> {
    private categoryElement: HTMLElement;
    private titleElement: HTMLElement;
    private imageElement: HTMLImageElement;
    private priceElement: HTMLElement;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container, events);

        this.categoryElement = this.container.querySelector('.card__category')!;
        this.titleElement = this.container.querySelector('.card__title')!;
        this.imageElement = this.container.querySelector('.card__image')!;
        this.priceElement = this.container.querySelector('.card__price')!;

        this.container.addEventListener('click', () => {
            const id = this.container.dataset.id;
            if (id) {
                this.events.emit('card:select', { id });
            }
        });
    }

    set category(value: string) {
        this.setCategory(this.categoryElement, value);
    }

    set title(value: string) {
        this.setTitle(value, this.titleElement);
    }

    set image(value: string) {
        this.setImage(this.imageElement, CDN_URL + value, this.titleElement.textContent || '');
    }

    set price(value: number | null) {
        this.setPrice(value, this.priceElement);
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }
}