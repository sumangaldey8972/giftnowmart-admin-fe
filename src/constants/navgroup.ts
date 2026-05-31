import {
    LayoutDashboard,
    Gift,
    ShoppingBag,
    Users,
    Percent,
    Settings,
    ChevronLeft,
    ChevronDown,
    ChevronRight,
    Menu,
    X,
    LogOut,
    Bell,
    Search,
    User,
    Shield,
    Sliders,
    Layers,
    PlusCircle,
    BarChart3,
    DollarSign,
    UserCog,
    LayoutGrid,
    ShieldCheck,
    SlidersHorizontal,
    Store,
    Wallet,
    CreditCard,
    Receipt,
} from "lucide-react"
/* ─────────────────── NAV CONFIG ─────────────────── */

type NavItem = {
    name: string
    href: string
    icon: React.ElementType
    badge?: string
    badgeVariant?: "red" | "blue" | "amber"
    subMenu?: { name: string; href: string; icon: React.ElementType }[]
}


export type NavGroup_ = {
    label: string
    items: NavItem[]
}

export const navGroups: NavGroup_[] = [
    {
        label: "Overview",
        items: [
            {
                name: "Dashboard",
                href: "/dashboard",
                icon: LayoutDashboard,
            },
            {
                name: "Notifications",
                href: "/notifications",
                icon: Bell,
                badge: "4",
                badgeVariant: "red",
            },
        ],
    },

    {
        label: "Catalog",
        items: [
            {
                name: "Gifts & Products",
                href: "/products",
                icon: Gift,

                subMenu: [
                    {
                        name: "All Products",
                        href: "/products/all",
                        icon: Layers,
                    },
                    {
                        name: "Add New Gift",
                        href: "/products/manage-product",
                        icon: PlusCircle,
                    },
                    {
                        name: "Categories",
                        href: "/products/categories",
                        icon: SlidersHorizontal,
                    },
                    {
                        name: "Brands",
                        href: "/products/brands",
                        icon: Store,
                    },
                ],
            },
        ],
    },

    {
        label: "Commerce",
        items: [
            {
                name: "Orders",
                href: "/orders",
                icon: ShoppingBag,
                badge: "12",
                badgeVariant: "red",
            },

            {
                name: "Payments",
                href: "/payments",
                icon: Wallet,

                subMenu: [
                    {
                        name: "Payment Methods",
                        href: "/payments/methods",
                        icon: CreditCard,
                    },
                    {
                        name: "Transactions",
                        href: "/payments/transactions",
                        icon: Receipt,
                    },
                    {
                        name: "Verifications",
                        href: "/payments/verifications",
                        icon: ShieldCheck,
                    },
                ],
            },
        ],
    },

    {
        label: "People",
        items: [
            {
                name: "Customers",
                href: "/customers",
                icon: Users,
            },
            {
                name: "Admins",
                href: "/admins",
                icon: UserCog,
            },
        ],
    },

    {
        label: "Growth",
        items: [
            {
                name: "Promotions",
                href: "/promotions",
                icon: Percent,
                badge: "New",
                badgeVariant: "blue",
            },
            {
                name: "Analytics",
                href: "/analytics",
                icon: BarChart3,
            },
            {
                name: "Revenue",
                href: "/revenue",
                icon: DollarSign,
            },
        ],
    },

    {
        label: "System",
        items: [
            {
                name: "Settings",
                href: "/settings",
                icon: Settings,
            },
        ],
    },
];