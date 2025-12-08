import { Component } from '../base/Component';
import { GalleryViewData } from '../../types';

export class GalleryView extends Component<GalleryViewData> {
    constructor(container: HTMLElement) {
        super(container);
    }

    set items(value: HTMLElement[]) {
        this.container.innerHTML = '';
        value.forEach(item => this.container.appendChild(item));
    }
}