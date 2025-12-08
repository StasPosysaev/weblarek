import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api';
import { WebLarekAPI } from './components/base/WebLarekAPI';
import { CatalogModel } from './components/Models/CatalogModel';
import { BasketModel } from './components/Models/BasketModel';
import { CustomerModel } from './components/Models/CustomerModel';
import { Header } from './components/views/Header';
import { Modal } from './components/views/Modal';
import { CatalogCard } from './components/views/CatalogCard';
import { PreviewCard } from './components/views/PreviewCard';
import { BasketCard } from './components/views/BasketCard';
import { BasketView } from './components/views/BasketView';
import { OrderForm } from './components/views/OrderForm';
import { ContactsForm } from './components/views/ContactsForm';
import { SuccessView } from './components/views/SuccessView';
import { GalleryView } from './components/views/GalleryView';
import { API_URL } from './utils/constants';
import { ensureElement, cloneTemplate } from './utils/utils';
import { ICardActions } from './types';

const events = new EventEmitter();

const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);
const customerModel = new CustomerModel(events);

const headerElement = ensureElement<HTMLElement>('.header');
const modalElement = ensureElement<HTMLElement>('#modal-container');
const galleryElement = ensureElement<HTMLElement>('.gallery');

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const header = new Header(events, headerElement);
const modal = new Modal(modalElement);
const galleryView = new GalleryView(galleryElement);
const basketView = new BasketView(events, cloneTemplate(basketTemplate));
const orderForm = new OrderForm(events, cloneTemplate(orderTemplate));
const contactsForm = new ContactsForm(events, cloneTemplate(contactsTemplate));
const successView = new SuccessView(events, cloneTemplate(successTemplate));


const api = new Api(API_URL);
const webLarekAPI = new WebLarekAPI(api);

async function loadProducts(): Promise<void> {
    try {
        const products = await webLarekAPI.getProductList();
        catalogModel.setItems(products);
    } catch (error) {
        console.error('Не удалось загрузить товары:', error);
    }
}

function renderBasket(): void {
    const items = basketModel.getItems().map((product, index) => {
        const cardActions: ICardActions = {
            onClick: () => events.emit('basket:remove', { id: product.id })
        };
        
        const card = new BasketCard(cloneTemplate(cardBasketTemplate), cardActions);
        
        return card.render({
            title: product.title,
            price: product.price,
            index: index + 1
        });
    });

    basketView.render({
        items: items,
        total: basketModel.getTotal(),
        isEmpty: items.length === 0
    });
}


events.on('catalog:changed', () => {
    const products = catalogModel.getItems();
    const itemCards = products.map((product) => {
        const cardActions: ICardActions = {
            onClick: () => events.emit('card:select', { id: product.id })
        };
        
        const card = new CatalogCard(cloneTemplate(cardCatalogTemplate), cardActions);
        
        return card.render({
            title: product.title,
            price: product.price,
            category: product.category,
            image: product.image
        });
    });
    
    galleryView.render({ items: itemCards });
});

events.on('selection:changed', () => {
    const selectedProduct = catalogModel.getSelectedItem();
    if (!selectedProduct) return;
    
    const cardActions: ICardActions = {
        onClick: () => {
            if (basketModel.contains(selectedProduct.id)) {
                events.emit('card:remove', { id: selectedProduct.id });
            } else {
                events.emit('card:add', { id: selectedProduct.id });
            }
        }
    };
    
    const card = new PreviewCard(cloneTemplate(cardPreviewTemplate), cardActions);
    
    const cardElement = card.render({
        title: selectedProduct.title,
        price: selectedProduct.price,
        category: selectedProduct.category,
        image: selectedProduct.image,
        description: selectedProduct.description,
        inBasket: basketModel.contains(selectedProduct.id)
    });
    
    modal.open(cardElement);
});

events.on('basket:changed', () => {
    header.counter = basketModel.getCount();
    
    renderBasket();
});

events.on('customer:changed', () => {
    const data = customerModel.getData();
    const errors = customerModel.validate();
    
    const orderErrors: Record<string, string> = {};
    const contactsErrors: Record<string, string> = {};
    
    if (errors.payment) orderErrors.payment = errors.payment;
    if (errors.address) orderErrors.address = errors.address;
    if (errors.email) contactsErrors.email = errors.email;
    if (errors.phone) contactsErrors.phone = errors.phone;
    
    orderForm.render({
        payment: data.payment,
        address: data.address,
        errors: orderErrors
    });
    
    contactsForm.render({
        email: data.email,
        phone: data.phone,
        errors: contactsErrors
    });
});

events.on('card:select', (data: { id: string }) => {
    const product = catalogModel.getItem(data.id);
    if (product) {
        catalogModel.setSelectedItem(product);
    }
});

events.on('card:add', (data: { id: string }) => {
    const product = catalogModel.getItem(data.id);
    if (product) {
        basketModel.addItem(product);
        modal.close();
    }
});

events.on('card:remove', (data: { id: string }) => {
    basketModel.removeItem(data.id);
    modal.close();
});

events.on('basket:remove', (data: { id: string }) => {
    basketModel.removeItem(data.id);
});

events.on('header:basket', () => {
    const basketElement = basketView.render(); 
    modal.open(basketElement);
});

events.on('basket:order', () => {
    const orderElement = orderForm.render();
    modal.open(orderElement);
});

events.on('order.payment:change', (data: { payment: string }) => {
    customerModel.setPayment(data.payment as any);
});

events.on('order.address:change', (data: { address: string }) => {
    customerModel.setAddress(data.address);
});

events.on('order:submit', () => {
    const contactsElement = contactsForm.render();
    modal.open(contactsElement);
});

events.on('contacts.email:change', (data: { email: string }) => {
    customerModel.setEmail(data.email);
});

events.on('contacts.phone:change', (data: { phone: string }) => {
    customerModel.setPhone(data.phone);
});

events.on('contacts:submit', async () => {
    const order = {
        ...customerModel.getData(),
        total: basketModel.getTotal(),
        items: basketModel.getItems().map(item => item.id)
    };
    
    try {
        const result = await webLarekAPI.createOrder(order);
        successView.total = result.total;
        
        const successElement = successView.render();
        modal.open(successElement);
        
        basketModel.clear();
        customerModel.clear();
        
    } catch (error) {
        console.error('Ошибка при оформлении заказа:', error);
    }
});

events.on('success:close', () => {
    modal.close();
});

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});