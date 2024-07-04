import { BrandObj } from "./Brand"
import { CategoryObj } from "./Category"

export interface ProductsObj {
    productId: number,
      productName:string,
      description: string,
      price: number,
      status: number,
      image: string,
      category: CategoryObj,
      brand:BrandObj,
      quantityProduct: number
    }
