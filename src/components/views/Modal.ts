import { Component } from '../base/Component';

export class Modal extends Component<{}> {
    private contentElement: HTMLElement;
    private closeButton: HTMLButtonElement;

    constructor(container: HTMLElement) {
        super(container);

        this.contentElement = container.querySelector('.modal__content')!;
        this.closeButton = container.querySelector('.modal__close')!;

        this.closeButton.addEventListener('click', () => this.close());
        this.container.addEventListener('click', (event) => {
            if (event.target === this.container) {
                this.close();
            }
        });

        // Блокируем скролл на модальном окне
        this.container.addEventListener('wheel', (event) => {
            if (this.container.classList.contains('modal_active')) {
                event.preventDefault();
            }
        }, { passive: false });

        // Блокируем скролл на touch-устройствах
        this.container.addEventListener('touchmove', (event) => {
            if (this.container.classList.contains('modal_active')) {
                event.preventDefault();
            }
        }, { passive: false });
    }

    open(content?: HTMLElement): void {
        if (content) {
            this.contentElement.replaceChildren(content);
        }
        this.container.classList.add('modal_active');
        document.body.style.overflow = 'hidden';
    }

    close(): void {
        this.container.classList.remove('modal_active');
        this.contentElement.innerHTML = '';
        document.body.style.overflow = '';
    }

    render(): HTMLElement {
        return this.container;
    }
}