import { UserInterface } from "@/app/interface/user"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface UserSate {
    user: UserInterface | null
}

const initialState: UserSate = {
    user: null
}

const manageUserSlice = createSlice({
    name: "manageUser",
    initialState,
    reducers: {
        editUser(
            state,
            action: PayloadAction<UserInterface | null>
        ) {
            state.user = action.payload
        }
    }
})

export const { editUser } = manageUserSlice.actions
export default manageUserSlice.reducer
