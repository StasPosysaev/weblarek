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

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container, events);

        this.descriptionElement = this.container.querySelector('.card__text')!;
        this.buttonElement = this.container.querySelector('.card__button')!;
        this.priceElement = this.container.querySelector('.card__price')!;
        this.categoryElement = this.container.querySelector('.card__category')!;
        this.titleElement = this.container.querySelector('.card__title')!;
        this.imageElement = this.container.querySelector('.card__image')! as HTMLImageElement;

        this.buttonElement.addEventListener('click', () => {
            const id = this.container.dataset.id;
            if (id) {
                if (this.buttonElement.textContent === 'В корзину') {
                    this.events.emit('card:add', { id });
                } else {
                    this.events.emit('card:remove', { id });
                }
            }
        });
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
        this.setPrice(value, this.priceElement);
        this.setButtonState(this.buttonElement, value);
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

    set id(value: string) {
        this.container.dataset.id = value;
    }
}