import { Card } from './Card';
import { IProduct } from '../../types';
import { ICardActions } from '../../types';
import { categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';
import { CDN_URL } from '../../utils/constants';

export type TPreviewCard = Pick<IProduct, 'image' | 'category' | 'title' | 'price' | 'description'> & {
    inBasket: boolean;
};

export class PreviewCard extends Card<TPreviewCard> {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;
    protected descriptionElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);

        if (actions?.onClick) {
            this.buttonElement.addEventListener('click', actions.onClick);
        }
    }

    set category(value: string) {
        this.categoryElement.textContent = value;
        
        Object.values(categoryMap).forEach(className => {
            this.categoryElement.classList.remove(className);
        });
        
        const categoryClass = categoryMap[value as keyof typeof categoryMap];
        if (categoryClass) {
            this.categoryElement.classList.add(categoryClass);
        }
    }

    set image(value: string) {
        const titleElement = this.container.querySelector('.card__title');
        const alt = titleElement?.textContent || '';
        this.setImage(this.imageElement, CDN_URL + value, alt);
    }

    set price(value: number | null) {
    const priceElement = this.container.querySelector('.card__price');
    if (priceElement) {
        priceElement.textContent = this.formatPrice(value);
    }
    
    if (value === null) {
        this.buttonElement.textContent = 'Недоступно';
        this.buttonElement.disabled = true;
    } else {
        this.buttonElement.disabled = false;
    }
}

    set description(value: string) {
        this.descriptionElement.textContent = value;
    }

    set inBasket(value: boolean) {
        if (!this.buttonElement.disabled) {
            this.buttonElement.textContent = value ? 'Удалить из корзины' : 'В корзину';
        }
    }
}