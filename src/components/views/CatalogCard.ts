import { Card } from './Card';
import { CatalogCardData } from '../../types';
import { CDN_URL } from '../../utils/constants';
import { EventEmitter } from '../base/Events';

export class CatalogCard extends Card<CatalogCardData> {
    private categoryElement: HTMLElement;
    private titleElement: HTMLElement;
    private imageElement: HTMLImageElement;
    private priceElement: HTMLElement;
    private currentId: string = '';

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container, events);

        this.categoryElement = this.container.querySelector('.card__category')!;
        this.titleElement = this.container.querySelector('.card__title')!;
        this.imageElement = this.container.querySelector('.card__image')!;
        this.priceElement = this.container.querySelector('.card__price')!;

        this.container.addEventListener('click', () => {
            if (this.currentId) {
                this.events.emit('card:select', { id: this.currentId });
            }
        });
    }

    render(data?: CatalogCardData): HTMLElement {
        if (data) {
            this.currentId = data.id;
            this.category = data.category;
            this.title = data.title;
            this.image = data.image;
            this.price = data.price;
        }
        return this.container;
    }

    set category(value: string) {
        this.setCategory(this.categoryElement, value);
    }

    set title(value: string) {
        this.titleElement.textContent = value;
    }

    set image(value: string) {
        this.setImage(this.imageElement, CDN_URL + value, this.titleElement.textContent || '');
    }

    set price(value: number | null) {
        this.priceElement.textContent = this.formatPrice(value);
    }
}