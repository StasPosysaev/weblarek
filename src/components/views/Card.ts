import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';
import { categoryMap } from '../../utils/constants';

export abstract class Card<T> extends Component<T> {
    protected events: EventEmitter;
    
    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this.events = events;
    }

    protected formatPrice(price: number | null): string {
        return price === null ? 'Бесценно' : `${price} синапсов`;
    }

    protected setPrice(value: number | null, element: HTMLElement): void {
        element.textContent = this.formatPrice(value);
    }

    protected setTitle(value: string, element: HTMLElement): void {
        element.textContent = value;
    }

    protected setCategory(element: HTMLElement, category: string): void {
        element.textContent = category;
        const categoryClass = categoryMap[category as keyof typeof categoryMap];
        element.className = `card__category ${categoryClass || ''}`;
    }

    protected setImage(element: HTMLImageElement, src: string, alt: string): void {
        element.src = src;
        element.alt = alt || '';
    }

    protected setButtonState(button: HTMLButtonElement, price: number | null): void {
        if (price === null) {
            button.textContent = 'Недоступно';
            button.disabled = true;
        }
    }
}