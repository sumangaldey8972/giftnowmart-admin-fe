"use client"

import React, { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import BrandLogo from "@/assets/gift_now_mart_brand_logo.png"
import BrandIcon from "@/app/icon.png"
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
} from "lucide-react"
import { useAppSelector } from "@/store/hooks/hooks"
import { UserInterface } from "@/app/interface/user"
import { getInitials } from "@/utils/helper"

/* ─────────────────── NAV CONFIG ─────────────────── */

type NavItem = {
    name: string
    href: string
    icon: React.ElementType
    badge?: string
    badgeVariant?: "red" | "blue" | "amber"
    subMenu?: { name: string; href: string; icon: React.ElementType }[]
}

type NavGroup = {
    label: string
    items: NavItem[]
}

const navGroups: NavGroup[] = [
    {
        label: "Overview",
        items: [
            { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
            { name: "Notifications", href: "/notifications", icon: Bell, badge: "4", badgeVariant: "red" },
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
                    { name: "All Products", href: "/products/all", icon: Layers },
                    { name: "Add New Gift", href: "/products/new", icon: PlusCircle },
                    { name: "Categories", href: "/products/categories", icon: SlidersHorizontal },
                ],
            },
            { name: "Orders", href: "/orders", icon: ShoppingBag, badge: "12", badgeVariant: "red" },
        ],
    },
    {
        label: "People",
        items: [
            { name: "Customers", href: "/customers", icon: Users },
            { name: "Admins", href: "/admins", icon: UserCog },
        ],
    },
    {
        label: "Growth",
        items: [
            { name: "Promotions", href: "/promotions", icon: Percent, badge: "New", badgeVariant: "blue" },
            { name: "Analytics", href: "/analytics", icon: BarChart3 },
            { name: "Revenue", href: "/revenue", icon: DollarSign },
        ],
    },
    {
        label: "System",
        items: [
            { name: "Settings", href: "/settings", icon: Settings },
        ],
    },
]

// const user = {
//     name: "Alex Mercer",
//     email: "alex.mercer@giftnowmart.com",
//     initials: "AM",
//     role: "Super Admin",
// }

/* ─────────── BADGE ─────────── */

function NavBadge({ text, variant = "red" }: { text: string; variant?: "red" | "blue" | "amber" }) {
    const styles = {
        red: "bg-secondary/10 text-secondary border border-secondary/15",
        blue: "bg-primary/10 text-primary border border-primary/15",
        amber: "bg-accent/15 text-amber-700 border border-accent/20",
    }
    return (
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${styles[variant]}`}>
            {text}
        </span>
    )
}

/* ─────────── NAV ITEM (shared between desktop + mobile) ─────────── */

function NavGroup({
    group,
    collapsed,
    openSubMenus,
    onToggleSub,
    pathname,
}: {
    group: NavGroup
    collapsed: boolean
    openSubMenus: Record<string, boolean>
    onToggleSub: (name: string) => void
    pathname: string
}) {
    return (
        <div className="mb-1">
            {/* Section label */}
            <AnimatePresence>
                {!collapsed && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="mb-1 px-3 text-[10px] font-bold uppercase tracking-[0.08em] text-foreground/35"
                    >
                        {group.label}
                    </motion.p>
                )}
            </AnimatePresence>

            <div className="space-y-0.5">
                {group.items.map(item => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                    const hasSubMenu = !!item.subMenu
                    const isSubOpen = openSubMenus[item.name]

                    return (
                        <div key={item.name}>
                            {/* Item row */}
                            <Link
                                href={hasSubMenu ? "#" : item.href}
                                onClick={hasSubMenu ? (e) => { e.preventDefault(); onToggleSub(item.name); } : undefined}
                                className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${isActive && !hasSubMenu
                                    ? "bg-primary/10 text-primary"
                                    : "text-foreground/60 hover:bg-muted/60 hover:text-foreground/85"
                                    }`}
                                title={collapsed ? item.name : undefined}
                            >
                                {/* Active indicator bar */}
                                {isActive && !hasSubMenu && (
                                    <motion.div
                                        layoutId="sidebar-active-pill"
                                        className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-full bg-primary"
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}

                                {/* Icon */}
                                <item.icon
                                    className={`h-[18px] w-[18px] flex-shrink-0 transition-colors ${isActive && !hasSubMenu
                                        ? "text-primary"
                                        : "text-foreground/40 group-hover:text-foreground/70"
                                        }`}
                                />

                                {/* Label */}
                                <AnimatePresence>
                                    {!collapsed && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -8 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -8 }}
                                            transition={{ duration: 0.18 }}
                                            className="flex-1 truncate"
                                        >
                                            {item.name}
                                        </motion.span>
                                    )}
                                </AnimatePresence>

                                {/* Right: badge or chevron */}
                                {!collapsed && (
                                    <>
                                        {hasSubMenu && (
                                            <ChevronDown
                                                className={`h-3.5 w-3.5 flex-shrink-0 text-foreground/30 transition-transform duration-200 ${isSubOpen ? "rotate-180" : ""}`}
                                            />
                                        )}
                                        {item.badge && !hasSubMenu && (
                                            <NavBadge text={item.badge} variant={item.badgeVariant} />
                                        )}
                                    </>
                                )}
                            </Link>

                            {/* SubMenu */}
                            <AnimatePresence>
                                {hasSubMenu && isSubOpen && !collapsed && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                                        className="overflow-hidden pl-8"
                                    >
                                        <div className="ml-1 space-y-0.5 border-l border-border py-1 pl-3">
                                            {item.subMenu?.map(sub => {
                                                const isSubActive = pathname === sub.href
                                                return (
                                                    <Link
                                                        key={sub.name}
                                                        href={sub.href}
                                                        className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-all ${isSubActive
                                                            ? "text-primary bg-primary/8"
                                                            : "text-foreground/50 hover:bg-muted/50 hover:text-foreground/80"
                                                            }`}
                                                    >
                                                        <sub.icon className={`h-3.5 w-3.5 flex-shrink-0 ${isSubActive ? "text-primary" : "text-foreground/30"}`} />
                                                        {sub.name}
                                                    </Link>
                                                )
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

/* ─────────── SIDEBAR CONTENT ─────────── */

function SidebarContent({
    collapsed,
    pathname,
    openSubMenus,
    onToggleSub,
    user
}: {
    collapsed: boolean
    pathname: string
    openSubMenus: Record<string, boolean>
    onToggleSub: (name: string) => void,
    user: UserInterface | null
}) {
    return (
        <>
            {/* Search */}
            <div className="px-3 py-3 border-b border-border/60">
                <div className={`flex items-center gap-2.5 rounded-xl border border-border bg-muted/40 px-3 py-2 transition-all ${collapsed ? "justify-center px-2" : ""}`}>
                    <Search className="h-3.5 w-3.5 flex-shrink-0 text-foreground/35" />
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.input
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: "auto" }}
                                exit={{ opacity: 0, width: 0 }}
                                type="text"
                                placeholder="Search… (⌘K)"
                                className="flex-1 bg-transparent text-xs text-foreground placeholder:text-foreground/30 focus:outline-none min-w-0"
                            />
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-3 space-y-3">
                {navGroups.map(group => (
                    <NavGroup
                        key={group.label}
                        group={group}
                        collapsed={collapsed}
                        openSubMenus={openSubMenus}
                        onToggleSub={onToggleSub}
                        pathname={pathname}
                    />
                ))}
            </nav>

            {/* Profile footer */}
            <div className="border-t border-border bg-muted/20 p-3">
                <div className={`flex items-center gap-2.5 rounded-xl px-2.5 py-2.5 hover:bg-muted/50 transition-colors cursor-pointer group ${collapsed ? "justify-center" : ""}`}>
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                            {getInitials(user?.fullName)}
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-emerald-400" />
                    </div>

                    <AnimatePresence>
                        {!collapsed && (
                            <motion.div
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: "auto" }}
                                exit={{ opacity: 0, width: 0 }}
                                className="flex min-w-0 flex-1 flex-col"
                            >
                                <span className="truncate text-xs font-bold text-foreground">{user?.fullName}</span>
                                <div className="mt-0.5 flex items-center gap-1.5">
                                    <span className="flex items-center gap-1 rounded-md bg-violet-50 px-1.5 py-0.5 text-[10px] font-semibold text-violet-700 border border-violet-200">
                                        <ShieldCheck className="h-2.5 w-2.5" />
                                        {user?.role[0].roleName}
                                    </span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {!collapsed && (
                        <button className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-foreground/35 hover:bg-secondary/10 hover:text-secondary transition-all">
                            <LogOut className="h-3.5 w-3.5" />
                        </button>
                    )}
                </div>
            </div>
        </>
    )
}

/* ─────────── MAIN EXPORT ─────────── */

const AdvancedAdminSidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({})
    const pathname = usePathname() ?? "/dashboard"

    const user = useAppSelector((store) => store.auth.user)

    useEffect(() => {
        const onResize = () => { if (window.innerWidth >= 1024) setIsMobileOpen(false) }
        window.addEventListener("resize", onResize)
        return () => window.removeEventListener("resize", onResize)
    }, [])

    // Lock body scroll when mobile open
    useEffect(() => {
        document.body.style.overflow = isMobileOpen ? "hidden" : ""
        return () => { document.body.style.overflow = "" }
    }, [isMobileOpen])

    const toggleSub = (name: string) =>
        setOpenSubMenus(prev => ({ ...prev, [name]: !prev[name] }))

    const DESKTOP_W_OPEN = 272
    const DESKTOP_W_COLLAPSED = 72

    return (
        <>
            {/* ── Mobile top bar ── */}
            <header className="lg:hidden fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-white/95 px-4 backdrop-blur-sm shadow-[0_1px_0_rgba(0,0,0,0.06)]">
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-foreground/60 hover:bg-muted transition-colors"
                    aria-label="Open sidebar"
                >
                    <Menu className="h-4.5 w-4.5" />
                </button>

                <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/50 px-3 py-1.5">
                    <Image src={BrandLogo} alt="GiftNowMart" width={110} height={28} className="object-contain" />
                </div>

                <div className="flex items-center gap-1.5">
                    <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-border text-foreground/60 hover:bg-muted transition-colors">
                        <Bell className="h-4 w-4" />
                        <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-secondary" />
                    </button>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-[11px] font-bold text-primary">
                        {getInitials(user?.fullName)}
                    </div>
                </div>
            </header>

            {/* ── Mobile drawer ── */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
                            onClick={() => setIsMobileOpen(false)}
                        />

                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 28, stiffness: 220 }}
                            className="lg:hidden fixed inset-y-0 left-0 z-[60] flex w-[280px] flex-col border-r border-border bg-white shadow-2xl"
                        >
                            {/* Header */}
                            <div className="flex h-14 items-center justify-between border-b border-border px-4">
                                <div className="flex items-center gap-2.5">
                                    <Image src={BrandLogo} alt="GiftNowMart" width={140} height={68} className="object-contain" />
                                </div>
                                <button
                                    onClick={() => setIsMobileOpen(false)}
                                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-border text-foreground/50 hover:bg-muted transition-colors"
                                    aria-label="Close sidebar"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            <SidebarContent
                                collapsed={false}
                                pathname={pathname}
                                openSubMenus={openSubMenus}
                                onToggleSub={toggleSub}
                                user={user}
                            />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* ── Desktop sidebar ── */}
            <motion.aside
                animate={{ width: isCollapsed ? DESKTOP_W_COLLAPSED : DESKTOP_W_OPEN }}
                transition={{ type: "spring", damping: 24, stiffness: 180 }}
                className="hidden lg:flex fixed inset-y-0 left-0 z-30 flex-col border-r border-border bg-white shadow-[1px_0_0_rgba(0,0,0,0.04)]"
            >
                {/* Brand header */}
                <div className={`relative flex h-16 items-center border-b border-border px-4 ${isCollapsed ? "justify-center" : "justify-between"}`}>
                    <AnimatePresence mode="wait">
                        {isCollapsed ? (
                            <motion.div
                                key="icon"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.18 }}
                                className="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold text-white shadow-[0_2px_8px_rgba(11,46,132,0.3)]"
                            >
                                <div className="flex items-center">
                                    <Image src={BrandIcon} alt="GiftNowMart" width={28} height={28} className="object-contain" />
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="logo"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.18 }}
                                className="flex items-center justify-center"
                            >
                                <div className="flex items-center gap-2">
                                    <Image src={BrandLogo} alt="GiftNowMart" width={140} height={68} className="object-contain" />
                                </div>
                            </motion.div>

                        )}
                    </AnimatePresence>

                    {/* Collapse toggle */}
                    <button
                        onClick={() => setIsCollapsed(c => !c)}
                        className="absolute -right-3.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white text-foreground/50 shadow-[0_1px_6px_rgba(0,0,0,0.08)] hover:border-primary/30 hover:text-primary transition-all"
                        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        <motion.div animate={{ rotate: isCollapsed ? 0 : 180 }} transition={{ duration: 0.25 }}>
                            <ChevronRight className="h-3.5 w-3.5" />
                        </motion.div>
                    </button>
                </div>

                <SidebarContent
                    collapsed={isCollapsed}
                    pathname={pathname}
                    openSubMenus={openSubMenus}
                    onToggleSub={toggleSub}
                    user={user}
                />
            </motion.aside>

            {/* Desktop spacer */}
            <motion.div
                animate={{ width: isCollapsed ? DESKTOP_W_COLLAPSED : DESKTOP_W_OPEN }}
                transition={{ type: "spring", damping: 24, stiffness: 180 }}
                className="hidden flex-shrink-0 lg:block"
            />

            {/* Mobile spacer */}
            <div className="h-14 lg:hidden" />
        </>
    )
}

export default AdvancedAdminSidebar