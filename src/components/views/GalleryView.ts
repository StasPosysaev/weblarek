import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';
import { CatalogCard } from './CatalogCard';
import { cloneTemplate } from '../../utils/utils';
import { IProduct } from '../../types';

export class GalleryView extends Component<{}> {
    constructor(
        container: HTMLElement,
        private events: EventEmitter,
        private cardTemplate: HTMLTemplateElement
    ) {
        super(container);
    }

    renderProducts(products: IProduct[]): void {
        this.container.innerHTML = '';
        
        products.forEach(product => {
            const cardElement = cloneTemplate(this.cardTemplate);
            const card = new CatalogCard(cardElement, this.events);
            
            card.id = product.id;
            card.title = product.title;
            card.image = product.image;
            card.category = product.category;
            card.price = product.price;
            
            this.container.appendChild(cardElement);
        });
    }
}