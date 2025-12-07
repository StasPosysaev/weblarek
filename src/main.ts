import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api';
import { WebLarekAPI } from './components/base/WebLarekAPI';
import { CatalogModel } from './components/Models/CatalogModel';
import { BasketModel } from './components/Models/BasketModel';
import { CustomerModel } from './components/Models/CustomerModel';
import { Header } from './components/views/Header';
import { Modal } from './components/views/Modal';
import { PreviewCard } from './components/views/PreviewCard';
import { BasketView } from './components/views/BasketView';
import { OrderForm } from './components/views/OrderForm';
import { ContactsForm } from './components/views/ContactsForm';
import { SuccessView } from './components/views/SuccessView';
import { API_URL } from './utils/constants';
import { ensureElement, cloneTemplate } from './utils/utils';
import { BasketItemsService } from './components/views/BasketItemsGenerator';
import { GalleryView } from './components/views/GalleryView';

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

const header = new Header(headerElement, events);
const modal = new Modal(modalElement);
const galleryView = new GalleryView(galleryElement, events, cardCatalogTemplate);
const basketView = new BasketView(cloneTemplate(basketTemplate), events);
const orderForm = new OrderForm(cloneTemplate(orderTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), events);
const successView = new SuccessView(cloneTemplate(successTemplate), events);
const basketItemsService = new BasketItemsService(cardBasketTemplate, events);

let currentModalView: string | null = null;

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
    const items = basketItemsService.generate(basketModel.getItems());
    basketView.items = items;
    basketView.total = basketModel.getTotal();
    basketView.isEmpty = items.length === 0;
}

events.on('catalog:changed', () => {
    const products = catalogModel.getItems();
    galleryView.renderProducts(products);
});

events.on('selection:changed', () => {
    const selectedProduct = catalogModel.getSelectedItem();
    if (!selectedProduct) return;
    
    const cardElement = cloneTemplate(cardPreviewTemplate);
    const card = new PreviewCard(cardElement, events);
    
    card.id = selectedProduct.id;
    card.title = selectedProduct.title;
    card.image = selectedProduct.image;
    card.category = selectedProduct.category;
    card.price = selectedProduct.price;
    card.description = selectedProduct.description;
    card.inBasket = basketModel.contains(selectedProduct.id);
    
    currentModalView = 'preview';
    modal.open(cardElement);
});

events.on('basket:changed', () => {
    header.counter = basketModel.getCount();
    
    renderBasket();
    
    if (currentModalView === 'basket') {
        modal.open(basketView.render());
    }
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
    
    orderForm.payment = data.payment; 
    orderForm.address = data.address;
    orderForm.updateErrors(orderErrors);
    
    contactsForm.email = data.email;
    contactsForm.phone = data.phone;
    contactsForm.updateErrors(contactsErrors);
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
        currentModalView = null;
    }
});

events.on('card:remove', (data: { id: string }) => {
    basketModel.removeItem(data.id);
    modal.close();
    currentModalView = null;
});

events.on('basket:remove', (data: { id: string }) => {
    basketModel.removeItem(data.id);
});

events.on('header:basket', () => {
    currentModalView = 'basket';
    modal.open(basketView.render());
});

events.on('basket:order', () => {
    currentModalView = 'order';
    modal.open(orderForm.render());
});

events.on('order.payment:change', (data: { payment: string }) => {
    customerModel.setPayment(data.payment as any);
});

events.on('order.address:change', (data: { address: string }) => {
    customerModel.setAddress(data.address);
});

events.on('order:submit', () => {
    const errors = customerModel.validate();
    
    if (!errors.payment && !errors.address) {
        currentModalView = 'contacts';
        modal.open(contactsForm.render());
    } else {
        const orderErrors: Record<string, string> = {};
        if (errors.payment) orderErrors.payment = errors.payment;
        if (errors.address) orderErrors.address = errors.address;
        orderForm.errors = orderErrors;
    }
});

events.on('contacts.email:change', (data: { email: string }) => {
    customerModel.setEmail(data.email);
});

events.on('contacts.phone:change', (data: { phone: string }) => {
    customerModel.setPhone(data.phone);
});

events.on('contacts:submit', async () => {
    const errors = customerModel.validate();
    
    if (!errors.email && !errors.phone) {
        const order = {
            ...customerModel.getData(),
            total: basketModel.getTotal(),
            items: basketModel.getItems().map(item => item.id)
        };
        
        try {
            const result = await webLarekAPI.createOrder(order);
            successView.total = result.total;
            
            currentModalView = 'success';
            modal.open(successView.render());
            
            basketModel.clear();
            customerModel.clear();
            
        } catch (error) {
            console.error('Ошибка при оформлении заказа:', error);
        }
    } else {
        const contactsErrors: Record<string, string> = {};
        if (errors.email) contactsErrors.email = errors.email;
        if (errors.phone) contactsErrors.phone = errors.phone;
        contactsForm.errors = contactsErrors;
    }
});

events.on('success:close', () => {
    modal.close();
    currentModalView = null;
});

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});