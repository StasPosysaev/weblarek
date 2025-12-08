import { Component } from '../base/Component';

export abstract class Card<T> extends Component<T> {
    protected constructor(container: HTMLElement) {
        super(container);
    }

    protected formatPrice(price: number | null): string {
        return price === null ? 'Бесценно' : `${price} синапсов`;
    }

    set price(value: number | null) {
        const element = this.container.querySelector('.card__price');
        if (element) {
            element.textContent = this.formatPrice(value);
        }
    }
    
    set title(value: string) {
        const element = this.container.querySelector('.card__title');
        if (element) {
            element.textContent = value;
        }
    }

    // protected setImage(element: HTMLImageElement, src: string, alt: string = ''): void {
    //     if (element) {
    //         element.src = src;
    //         if (alt) {
    //             element.alt = alt;
    //         }
    //     }
    // }
}