import { Card } from './Card';
import { PreviewCardData } from '../../types';
import { CDN_URL } from '../../utils/constants';
import { EventEmitter } from '../base/Events';

export class PreviewCard extends Card<PreviewCardData> {
    private descriptionElement: HTMLElement;
    private buttonElement: HTMLButtonElement;
    private priceElement: HTMLElement;
    private categoryElement: HTMLElement;
    private titleElement: HTMLElement;
    private imageElement: HTMLImageElement;
    private currentId: string = '';

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container, events);

        this.descriptionElement = container.querySelector('.card__text')!;
        this.buttonElement = container.querySelector('.card__button')!;
        this.priceElement = container.querySelector('.card__price')!;
        this.categoryElement = container.querySelector('.card__category')!;
        this.titleElement = container.querySelector('.card__title')!;
        this.imageElement = container.querySelector('.card__image')! as HTMLImageElement;

        this.buttonElement.addEventListener('click', () => {
            if (this.currentId) {
                if (this.buttonElement.textContent === 'В корзину') {
                    this.events.emit('card:add', { id: this.currentId });
                } else {
                    this.events.emit('card:remove', { id: this.currentId });
                }
            }
        });
    }

    render(data?: PreviewCardData): HTMLElement {
        if (data) {
            this.currentId = data.id;
            this.category = data.category;
            this.title = data.title;
            this.image = data.image;
            this.description = data.description;
            this.inBasket = data.inBasket;
            this.price = data.price;
        }
        return this.container;
    }

    set description(value: string) {
        this.descriptionElement.textContent = value;
    }

    set inBasket(value: boolean) {
        if (!this.buttonElement.disabled) {
            this.buttonElement.textContent = value ? 'Удалить из корзины' : 'В корзину';
        }
    }

    set price(value: number | null) {
        this.priceElement.textContent = this.formatPrice(value);
        this.setButtonState(this.buttonElement, value);
        
        if (value !== null && !this.buttonElement.disabled) {
            const isDeleteButton = this.buttonElement.textContent === 'Удалить из корзины';
            this.buttonElement.textContent = isDeleteButton ? 'Удалить из корзины' : 'В корзину';
        }
    }

    set category(value: string) {
        this.setCategory(this.categoryElement, value);
    }

    set title(value: string) {
        this.titleElement.textContent = value;
    }

    set image(value: string) {
        this.setImage(this.imageElement, CDN_URL + value, this.title);
    }
}