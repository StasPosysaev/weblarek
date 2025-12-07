import { EventEmitter } from "../base/Events";
import { IProduct } from "../../types";

export class BasketModel {
  private _items: IProduct[] = [];

  constructor(private events: EventEmitter) {}

  addItem(item: IProduct): void {
    this._items.push(item);
    this.events.emit('basket:changed', { items: this._items });
  }

  removeItem(id: string): void {
    this._items = this._items.filter(item => item.id !== id);
    this.events.emit('basket:changed', { items: this._items });
  }

  getItems(): IProduct[] {
    return this._items;
  }

  getCount(): number {
    return this._items.length;
  }

  getTotal(): number {
    return this._items.reduce((total, item) => total + (item.price || 0), 0);
  }

  contains(id: string): boolean {
    return this._items.some(item => item.id === id);
  }

  clear(): void {
    this._items = [];
    this.events.emit('basket:changed', { items: this._items });
  }
}