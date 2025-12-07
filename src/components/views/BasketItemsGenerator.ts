import { cloneTemplate } from '../../utils/utils';
import { BasketCard } from '../views/BasketCard';
import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class BasketItemsService {
    constructor(
        private template: HTMLTemplateElement,
        private events: EventEmitter
    ) {}

    generate(items: IProduct[]): HTMLElement[] {
        return items.map((product, index) => {
            const cardElement = cloneTemplate(this.template);
            const card = new BasketCard(cardElement, this.events);
            
            card.id = product.id;
            card.title = product.title;
            card.price = product.price;
            card.index = index + 1;
            
            return cardElement;
        });
    }
}
