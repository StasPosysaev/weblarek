import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api';
import { WebLarekAPI } from './components/base/WebLarekAPI';
import { CatalogModel } from './components/base/Models/CatalogModel';
import { BasketModel } from './components/base/Models/BasketModel';
import { CustomerModel } from './components/base/Models/CustomerModel';
import { Header } from './components/views/Header';
import { Modal } from './components/views/Modal';
import { CatalogCard } from './components/views/CatalogCard';
import { PreviewCard } from './components/views/PreviewCard';
import { BasketView } from './components/views/BasketView';
import { OrderForm } from './components/views/OrderForm';
import { ContactsForm } from './components/views/ContactsForm';
import { SuccessView } from './components/views/SuccessView';
import { API_URL, CDN_URL } from './utils/constants';

const events = new EventEmitter();

const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);
const customerModel = new CustomerModel(events);

const headerElement = document.querySelector('.header');
const modalElement = document.getElementById('modal-container');

if (!headerElement || !modalElement) {
    throw new Error('Не найдены необходимые DOM элементы');
}

const header = new Header(headerElement as HTMLElement, events);
const modal = new Modal(modalElement as HTMLElement);

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

events.on('catalog:changed', () => {
    const products = catalogModel.getItems();
    const gallery = document.querySelector('.gallery');
    
    if (gallery) {
        gallery.innerHTML = '';
        
        products.forEach(product => {
            const template = document.querySelector('#card-catalog') as HTMLTemplateElement;
            if (!template) return;
            
            const cardElement = template.content.cloneNode(true) as HTMLElement;
            const cardContainer = cardElement.firstElementChild as HTMLElement;
            
            const card = new CatalogCard(cardContainer, events);
            card.render({
                id: product.id,
                title: product.title,
                image: product.image,
                category: product.category,
                price: product.price
            });
            
            gallery.appendChild(cardContainer);
        });
    }
});

events.on('selection:changed', () => {
    const selectedProduct = catalogModel.getSelectedItem();
    if (!selectedProduct) return;
    
    const template = document.querySelector('#card-preview') as HTMLTemplateElement;
    if (!template) return;
    
    const cardElement = template.content.cloneNode(true) as HTMLElement;
    const cardContainer = cardElement.firstElementChild as HTMLElement;
    
    const inBasket = basketModel.contains(selectedProduct.id);
    const card = new PreviewCard(cardContainer, events);
    
    card.render({
        id: selectedProduct.id,
        title: selectedProduct.title,
        image: selectedProduct.image,
        category: selectedProduct.category,
        price: selectedProduct.price,
        description: selectedProduct.description,
        inBasket: inBasket
    });
    
    modal.open(cardContainer);
});

events.on('basket:changed', () => {
    const count = basketModel.getCount();
    header.render({ counter: count });
});

events.on('customer:changed', () => {

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
    const template = document.querySelector('#basket') as HTMLTemplateElement;
    if (!template) return;
    
    const basketElement = template.content.cloneNode(true) as HTMLElement;
    const basketContainer = basketElement.firstElementChild as HTMLElement;
    
    const basketView = new BasketView(basketContainer, events);
    const items = basketModel.getItems().map((product, index) => ({
        id: product.id,
        title: product.title,
        price: product.price,
        index: index + 1
    }));
    
    basketView.render({
        items: items,
        total: basketModel.getTotal(),
        isEmpty: items.length === 0
    });
    
    modal.open(basketContainer);
});

events.on('basket:order', () => {
    const template = document.querySelector('#order') as HTMLTemplateElement;
    if (!template) return;
    
    const formElement = template.content.cloneNode(true) as HTMLElement;
    const formContainer = formElement.firstElementChild as HTMLElement;
    
    const orderForm = new OrderForm(formContainer, events);
    const customerData = customerModel.getData();
    
    orderForm.render({
        payment: customerData.payment,
        address: customerData.address
    });
    
    modal.open(formContainer);
});

events.on('order:submit', (data: { payment: string; address: string }) => {
    customerModel.setPayment(data.payment as any);
    customerModel.setAddress(data.address);
    
    const template = document.querySelector('#contacts') as HTMLTemplateElement;
    if (!template) return;
    
    const formElement = template.content.cloneNode(true) as HTMLElement;
    const formContainer = formElement.firstElementChild as HTMLElement;
    
    const contactsForm = new ContactsForm(formContainer, events);
    const customerData = customerModel.getData();
    
    contactsForm.render({
        email: customerData.email,
        phone: customerData.phone
    });
    
    modal.open(formContainer);
});

events.on('contacts:submit', async (data: { email: string; phone: string }) => {
    customerModel.setEmail(data.email);
    customerModel.setPhone(data.phone);
    
    const order = {
        ...customerModel.getData(),
        total: basketModel.getTotal(),
        items: basketModel.getItems().map(item => item.id)
    };
    
    try {
        const result = await webLarekAPI.createOrder(order);
        
        const template = document.querySelector('#success') as HTMLTemplateElement;
        if (!template) return;
        
        const successElement = template.content.cloneNode(true) as HTMLElement;
        const successContainer = successElement.firstElementChild as HTMLElement;
        
        const successView = new SuccessView(successContainer, events);
        successView.render({ total: result.total });
        
        modal.open(successContainer);
        
        basketModel.clear();
        customerModel.clear();
        
    } catch (error) {
        console.error('Ошибка при оформлении заказа:', error);
    }
});

events.on('success:close', () => {
    modal.close();
});

events.on('form:input', () => {

});

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});