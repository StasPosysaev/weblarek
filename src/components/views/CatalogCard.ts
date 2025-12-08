import { Card } from './Card';
import { IProduct } from '../../types';
import { ICardActions } from '../../types';
import { categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';
import { CDN_URL } from '../../utils/constants';

export type TCatalogCard = Pick<IProduct, 'image' | 'category' | 'title' | 'price'>;

export class CatalogCard extends Card<TCatalogCard> {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);

        if (actions?.onClick) {
            this.container.addEventListener('click', actions.onClick);
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
        this.setImage(this.imageElement, CDN_URL + value, '');
    }
}