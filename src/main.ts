import './scss/styles.scss';

import { apiProducts } from './utils/data';
import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api';
import { WebLarekAPI } from './components/base/WebLarekAPI';
import { CatalogModel } from './components/base/Models/CatalogModel';
import { BasketModel } from './components/base/Models/BasketModel';
import { CustomerModel } from './components/base/Models/CustomerModel';
import { API_URL } from './utils/constants';

const events = new EventEmitter();
const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);
const customerModel = new CustomerModel(events);

const api = new Api(API_URL);
const webLarekAPI = new WebLarekAPI(api);

async function testServerCommunication() {
    console.log('=== ТЕСТ СВЯЗИ С СЕРВЕРОМ ===');

    try {
        console.log('1. Получаем товары с сервера...');
        const products = await webLarekAPI.getProductList();

        console.log('2. Сохраняем в CatalogModel...');
        catalogModel.setItems(products);

        console.log('3. Проверяем данные в модели:');
        console.log('Количество товаров:', catalogModel.getItems().length);
        console.log('Первый товар:', catalogModel.getItems()[0]);
    } catch(error) {
        console.error('Ошибка при работе с сервером:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    testModels();
    testServerCommunication();
});

//тестирование без API с сервера.
function testModels() {
    console.log('=== ТЕСТ CATALOG MODEL ===');
    catalogModel.setItems(apiProducts.items);
    console.log('Массив товаров из каталога:', catalogModel.getItems());

    console.log('=== ТЕСТ BASKET MODEL ===');
    if (catalogModel.getItems().length > 0) {
        basketModel.addItem(catalogModel.getItems()[0]);
        console.log('Товары в корзине:', basketModel.getItems());
        console.log('Количество товаров:', basketModel.getCount());
        console.log('Общая стоимость:', basketModel.getTotal());
}

    console.log('=== ТЕСТ CUSTOMER MODEL ===');
    customerModel.setPayment('card');
    customerModel.setEmail('test@example.com');
    console.log('Данные покупателя:', customerModel.getData());
    console.log('Валидация:', customerModel.validate());
}