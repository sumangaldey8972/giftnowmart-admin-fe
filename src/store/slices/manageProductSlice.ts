import { ProductInterface } from "@/app/interface/product"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface ProductState {
    product: ProductInterface | null
}

const initialState: ProductState = {
    product: null
}

const manageProductSlice = createSlice({
    name: "manageProduct",
    initialState,
    reducers: {
        editProduct(
            state,
            action: PayloadAction<ProductInterface | null>
        ) {
            state.product = action.payload
        }
    }
})

export const { editProduct } = manageProductSlice.actions
export default manageProductSlice.reducer
