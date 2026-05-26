export interface Brand {
    _id: string,
    brandId: string
    name: string
    slug: string
    productCount: number,
    logo: string,
    isFeatured: boolean,
    isActive: boolean,
    createdAt: string,
    createdBy: {
        email: string
    }
}
