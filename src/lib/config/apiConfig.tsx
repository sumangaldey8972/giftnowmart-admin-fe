type ApiEndPoints = {
    auth: {
        signin: string,
        refresh: string,
        logout: string,
        createUser: string,
        getUser: (search: string, page: string, limit: string, status: string | boolean, roleId: string[]) => string,
        update: string,
        delete: (ids: string[]) => string,
        resetPassword: string
    }
}

export const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL;

export const API_ENDPOINTS: ApiEndPoints = {
    auth: {
        signin: "/auth/sign-in",
        refresh: "/auth/refresh",
        logout: "/auth/logout",
        createUser: "/auth/create-user",
        getUser: (search, page, limit, status, roleId) => `/auth/get-user?search=${search}&page=${page}&limit=${limit}&isUserActive=${status === "all" ? "all" : status === "active" ? true : false}&roles=${encodeURIComponent(JSON.stringify(roleId))}`,
        update: "/auth/update",
        delete: (ids) => `/auth/delete-users?ids=${encodeURIComponent(JSON.stringify(ids))}`,
        resetPassword: "/auth/reset-password-by-admin"
    }
} 
