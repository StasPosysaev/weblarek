import { Component } from '../base/Component';

export class Modal extends Component<{}> {
    private contentElement: HTMLElement;
    private closeButton: HTMLButtonElement;
    

    constructor(container: HTMLElement) {
        super(container);

        this.contentElement = this.container.querySelector('.modal__content')!;
        this.closeButton = this.container.querySelector('.modal__close')!;

        this.closeButton.addEventListener('click', () => this.close());
        this.container.addEventListener('click', (event) => {
            if (event.target === this.container) {
                this.close();
            }
        });
    }

    open(content?: HTMLElement): void {
        if (content) {
            this.contentElement.replaceChildren(content);
        }
        this.container.classList.add('modal_active');
    }

    close(): void {
        this.container.classList.remove('modal_active');
        this.contentElement.innerHTML = '';
    }
}