import { Brand } from "./brand"
import { Category } from "./category"
import { UserInterface } from "./user"

export interface ProductInterface {
    _id: string,
    productId: string,
    title: string,
    slug: string,
    shortDescription: string,
    description: string,
    logo: string,
    categoryId: Category,
    brandId: Brand,
    priceVariants: PriceVariantsInterface[],
    currency: string,
    deliveryType: string,
    redeemSteps: string,
    validity: string,
    termAndConditions: string,
    isFeatured: boolean,
    isActive: boolean,
    createdBy: UserInterface,
}


export interface PriceVariantsInterface {
    name: string,
    cardValue: number,
    discountPercentage: string,
    sellingPrice: number,
    isActive: boolean
}