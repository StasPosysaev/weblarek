import { IApi, IProduct, IOrder, OrderResult, ProductListResponse } from "../../types";

export class WebLarekAPI {
  constructor(private baseApi: IApi) {}

  async getProductList(): Promise<IProduct[]> {
    const response = await this.baseApi.get<ProductListResponse>('/product');
    return response.items;
  }

  async createOrder(order: IOrder): Promise<OrderResult> {
    return await this.baseApi.post<OrderResult>('/order', order);
  }
}