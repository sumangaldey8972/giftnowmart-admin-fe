export interface Category {
    _id: string,
    catId: string
    name: string
    slug: string
    productCount: number
    isActive: boolean
    createdAt: string,
    createdBy: {
        email: string
    }
}
