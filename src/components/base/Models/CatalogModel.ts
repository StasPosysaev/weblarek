import { EventEmitter } from "../Events";
import { IProduct } from "../../../types";

export class CatalogModel {
  private _items: IProduct[] = [];
  private _selectedItem: IProduct | null = null;

  constructor(private events: EventEmitter) {}

  setItems(items: IProduct[]): void {
    this._items = items;
    this.events.emit('catalog:changed', { items: this._items });
  }

  getItems(): IProduct[] {
    return this._items;
  }

  setSelectedItem(item: IProduct): void {
    this._selectedItem = item;
    this.events.emit('selection:changed', { selected: this._selectedItem });
  }

  getSelectedItem(): IProduct | null {
    return this._selectedItem;
  }

  getItem(id: string): IProduct | undefined {
    return this._items.find(item => item.id === id);
}
}