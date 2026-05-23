"use client"

import React, { useState, useMemo, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    CheckCircle,
    XCircle,
    ChevronLeft,
    ChevronRight,
    SlidersHorizontal,
    AlertTriangle,
    FolderPlus,
    Layers,
    X,
    ChevronDown
} from "lucide-react"
import appClient from "@/lib/appClient"
import { toastLoading, toastUpdate } from "@/utils/toast-message/taost-message"
import { useAppSelector } from "@/store/hooks/hooks"

interface Category {
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


export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([])
    const [search, setSearch] = useState("")
    const [selectedIds, setSelectedIds] = useState<string[]>([])

    // Dynamic Pagination State & Config Options
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10) // Set default to 10 to demonstrate scrolling immediately
    const [isPerPageDropdownOpen, setIsPerPageDropdownOpen] = useState(false)
    const perPageOptions = [5, 10, 20, 50]
    const [totalDocs, setTotalDocs] = useState(0)
    const [totalPages, setTotalPages] = useState(0)

    const [loading, setLoading] = useState(false)
    const [createCategoryLoading, setCreateCategoryLoading] = useState(false)

    const user = useAppSelector((store) => store.auth.user)

    // Form Overlay Management
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [formData, setFormData] = useState({ name: "", isActive: true })


    const handleCategories = useCallback(async () => {
        setLoading(true)
        try {
            const response = await appClient.get("/api/category/get", {
                params: { search, page, limit }
            })
            console.log(response)
            if (response.data.status) {
                setCategories(response.data.categories.docs)
                setTotalDocs(response.data.categories.totalDocs)
                setTotalPages(response.data.categories.totalPages)
            }

        } catch (error) {
            console.log("getting error while category list", error)
        } finally {
            setLoading(false)
        }
    }, [search, page, limit])

    useEffect(() => {
        handleCategories()
    }, [handleCategories])



    // Confirmation Interceptors
    const [confirmAction, setConfirmAction] = useState<{
        type: "delete_single" | "delete_bulk" | "toggle_status"
        targetId?: string
        targetStatus?: boolean
    } | null>(null)

    /* ─── AMENDMENT & MUTATION LOGIC ─── */
    const handlelimitChange = (option: number) => {
        setLimit(option)
        setPage(1) // Snaps view safe layout pointer back to page 1
        setIsPerPageDropdownOpen(false)
    }

    const handleOpenCreate = () => {
        setEditingCategory(null)
        setFormData({ name: "", isActive: true })
        setIsFormOpen(true)
    }

    const handleOpenEdit = (category: Category) => {
        setEditingCategory(category)
        setFormData({ name: category.name, isActive: category.isActive })
        setIsFormOpen(true)
    }

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.name.trim()) return

        setCreateCategoryLoading(true)
        const toastId = toastLoading("Creating Category...", {
            description: "Please wait while we create the Category"
        })

        try {
            if (editingCategory) {
                setCategories(prev => prev.map(cat =>
                    cat.catId === editingCategory._id
                        ? { ...cat, name: formData.name, slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), isActive: formData.isActive }
                        : cat
                ))
                const existingCat = {
                    _id: editingCategory._id,
                    catId: editingCategory.catId,
                    name: formData.name,
                    slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                    isActive: formData.isActive,
                    createdBy: user?._id
                }

                console.log({ existingCat })

                const res = await appClient.post("/api/category/update", existingCat)

                if (res?.data.status) {
                    // toast("success", category ? "Category updated successfully" : "Category created successfully")
                    toastUpdate(toastId, "success", "Category updation Success", {
                        description: res.data.message || "Category updation Success"
                    })
                    handleCategories()
                } else {

                    toastUpdate(toastId, "error", "Category updation failed", {
                        description: res.data.message || "Category updation failed"
                    })
                }

            } else {
                const newCat = {
                    catId: `CAT-${String(totalDocs).padStart(3, '0')}`,
                    name: formData.name,
                    slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                    isActive: formData.isActive,
                    createdBy: user?._id
                }

                const res = await appClient.post("/api/category/create", newCat)


                if (res?.data.status) {
                    // toast("success", category ? "Category updated successfully" : "Category created successfully")
                    toastUpdate(toastId, "success", "Category creation Success", {
                        description: res.data.message || "Category creation Success"
                    })
                    handleCategories()
                } else {

                    toastUpdate(toastId, "error", "Category creation failed", {
                        description: res.data.message || "Category creation failed"
                    })
                }

            }
            setIsFormOpen(false)
        } catch (err: any) {
            console.error("Error creating category:", err);
            toastUpdate(toastId, "error", "category creation Failed", {
                description: err.message || "Failed to publish category"
            });
        }
    }

    const executeConfirmedAction = async () => {
        if (!confirmAction) return

        const { type, targetId, targetStatus } = confirmAction

        const toastId = toastLoading("Deleting category(s)", {
            description: `Removing category(s) from the system`
        })


        if (type === "delete_single" && targetId) {

            let payload = [targetId]

            let res = await appClient.delete("/api/category/delete", {
                params: { ids: JSON.stringify(payload) }
            });

            if (res.data.status) {
                toastUpdate(toastId, "success", "Category Deleted", {
                    description: res.data.message || "Category Deleted from the system"
                })
                handleCategories()
            }



        } else if (type === "delete_bulk") {
            let payload = selectedIds

            console.log({ payload })

            let res = await appClient.delete("/api/category/delete", {
                params: { ids: JSON.stringify(payload) }
            });

            if (res.data.status) {
                toastUpdate(toastId, "success", "Category Deleted", {
                    description: res.data.message || "Category Deleted from the system"
                })
                handleCategories()
                setSelectedIds([])
            }
        } else if (type === "toggle_status" && targetId !== undefined && targetStatus !== undefined) {
            setCategories(prev => prev.map(c => c.catId === targetId ? { ...c, isActive: targetStatus } : c))
        }

        setConfirmAction(null)
    }

    /* ─── CHECKBOX ROW SELECTIONS ─── */
    const handleSelectAll = () => {
        const pageIds = categories.map(c => c._id)
        const allSelected = pageIds.every(id => selectedIds.includes(id))
        if (allSelected) {
            setSelectedIds(prev => prev.filter(id => !pageIds.includes(id)))
        } else {
            setSelectedIds(prev => Array.from(new Set([...prev, ...pageIds])))
        }
    }

    const handleSelectOne = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id])
    }

    return (
        <div className="w-full h-full flex flex-col space-y-6 p-1 text-foreground">

            {/* ─── MAIN WORKSPACE HEADER ─── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5 flex-shrink-0">
                <div>
                    <div className="flex items-center gap-1.5 text-primary/60">
                        <Layers className="h-3.5 w-3.5 text-primary" />
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-foreground/40">Catalog Management</span>
                    </div>
                    <h1 className="text-xl md:text-2xl font-extrabold text-primary tracking-tight mt-1">
                        Products Console
                    </h1>
                </div>

                <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleOpenCreate}
                    className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/95 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-primary/10 transition-colors self-start sm:self-auto"
                >
                    <Plus className="h-4 w-4 stroke-[2.5]" />
                    Add New Product
                </motion.button>
            </div>

            {/* ─── FILTER CONTROL CONTROL PANEL BAR ─── */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-card border border-border p-3.5 rounded-2xl shadow-sm flex-shrink-0">
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground/30" />
                    <input
                        type="text"
                        placeholder="Search categories or ID..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="w-full bg-muted/40 text-xs text-foreground placeholder:text-foreground/30 pl-9 pr-4 py-2.5 rounded-xl border border-border focus:outline-none focus:border-primary/40 focus:bg-background transition-all"
                    />
                </div>

                <div className="flex items-center gap-2.5 w-full md:w-auto justify-end relative">
                    <AnimatePresence>
                        {selectedIds.length > 0 && (
                            <motion.button
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                onClick={() => setConfirmAction({ type: "delete_bulk" })}
                                className="inline-flex items-center gap-1.5 bg-danger/10 border border-danger/20 hover:bg-danger/15 text-danger text-[11px] font-bold px-3 py-2 rounded-xl transition-colors"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                Drop Selected ({selectedIds.length})
                            </motion.button>
                        )}
                    </AnimatePresence>

                    {/* ─── ADVANCED PER-PAGE DRILL FILTER ─── */}
                    <div className="relative">
                        <button
                            onClick={() => setIsPerPageDropdownOpen(!isPerPageDropdownOpen)}
                            className="inline-flex items-center gap-1.5 bg-muted/40 border border-border text-foreground/70 text-[11px] font-bold px-3 py-2.5 rounded-xl hover:bg-muted/70 transition-colors"
                        >
                            <SlidersHorizontal className="h-3.5 w-3.5 text-foreground/40" />
                            <span>Show: {limit} per page</span>
                            <ChevronDown className={`h-3 w-3 text-foreground/40 transition-transform duration-200 ${isPerPageDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {isPerPageDropdownOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsPerPageDropdownOpen(false)} />
                                    <motion.div
                                        initial={{ opacity: 0, y: 6, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 6, scale: 0.98 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 mt-1.5 w-40 bg-card border border-border rounded-xl shadow-xl py-1.5 z-20 overflow-hidden"
                                    >
                                        <div className="px-2.5 py-1 border-b border-border/40 mb-1">
                                            <p className="text-[9px] font-extrabold uppercase tracking-wider text-foreground/35">Row Density</p>
                                        </div>
                                        {perPageOptions.map((option) => (
                                            <button
                                                key={option}
                                                onClick={() => handlelimitChange(option)}
                                                className={`w-full text-left px-3 py-1.5 text-xs font-bold transition-colors flex items-center justify-between ${limit === option
                                                    ? "text-primary bg-primary/5"
                                                    : "text-foreground/60 hover:bg-muted/50 hover:text-foreground"
                                                    }`}
                                            >
                                                <span>{option} Entries</span>
                                                {limit === option && <div className="h-1.5 w-1.5 rounded-full bg-primary" />}
                                            </button>
                                        ))}
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* ─── STICKY WRAPPER DATA COMPILER PANEL ─── */}
            <div className="bg-card border border-border rounded-2xl shadow-[0_4px_20px_-4px_rgba(11,46,132,0.03)] overflow-hidden flex flex-col max-h-[calc(100vh-280px)] relative">

                {/* Scrollable body container wrapper */}
                <div className="overflow-y-auto overflow-x-auto w-full no-scrollbar relative">
                    <table className="w-full text-left border-separate border-spacing-0">
                        <thead>
                            <tr className="text-foreground/40 text-[10px] uppercase font-bold tracking-wider">
                                <th className="sticky top-0 bg-card border-b border-border/60 p-4 w-12 text-center z-10 shadow-[0_1px_0_0_rgba(219,228,255,0.6)]">
                                    <input
                                        type="checkbox"
                                        checked={categories.length > 0 && categories.every(c => selectedIds.includes(c._id))}
                                        onChange={handleSelectAll}
                                        className="rounded border-border text-primary focus:ring-primary/20 accent-primary h-3.5 w-3.5"
                                    />
                                </th>
                                <th className="sticky top-0 bg-card border-b border-border/60 p-4 z-10 shadow-[0_1px_0_0_rgba(219,228,255,0.6)]">Category Identifier</th>
                                <th className="sticky top-0 bg-card border-b border-border/60 p-4 z-10 shadow-[0_1px_0_0_rgba(219,228,255,0.6)]">Structural Segment</th>
                                <th className="sticky top-0 bg-card border-b border-border/60 p-4 z-10 shadow-[0_1px_0_0_rgba(219,228,255,0.6)]">Route Slug</th>
                                <th className="sticky top-0 bg-card border-b border-border/60 p-4 text-center z-10 shadow-[0_1px_0_0_rgba(219,228,255,0.6)]">Products Loaded</th>
                                <th className="sticky top-0 bg-card border-b border-border/60 p-4 z-10 shadow-[0_1px_0_0_rgba(219,228,255,0.6)]">Deployment Status</th>
                                <th className="sticky top-0 bg-card border-b border-border/60 p-4 text-right pr-6 z-10 shadow-[0_1px_0_0_rgba(219,228,255,0.6)]">System Handlers</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40 text-xs font-medium bg-card">
                            {categories.length > 0 ? (
                                categories.map((category) => (
                                    <tr
                                        key={category._id}
                                        className={`hover:bg-muted/20 transition-colors ${selectedIds.includes(category._id) ? "bg-primary/[0.01]" : ""}`}
                                    >
                                        <td className="p-4 border-b border-border/30 text-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(category._id)}
                                                onChange={() => handleSelectOne(category._id)}
                                                className="rounded border-border text-primary focus:ring-primary/20 accent-primary h-3.5 w-3.5"
                                            />
                                        </td>
                                        <td className="p-4 border-b border-border/30 font-mono text-foreground/40 font-bold">{category.catId}</td>
                                        <td className="p-4 border-b border-border/30 font-bold text-foreground/80">{category.name}</td>
                                        <td className="p-4 border-b border-border/30 font-mono text-[11px] text-foreground/50">{category.slug}</td>
                                        <td className="p-4 border-b border-border/30 text-center">
                                            <span className="bg-muted px-2.5 py-1 rounded-md text-[11px] font-bold text-primary">
                                                {category.productCount} items
                                            </span>
                                        </td>
                                        <td className="p-4 border-b border-border/30">
                                            <button
                                                onClick={() => setConfirmAction({
                                                    type: "toggle_status",
                                                    targetId: category._id,
                                                    targetStatus: !category.isActive
                                                })}
                                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border tracking-wider transition-all shadow-sm ${category.isActive
                                                    ? "bg-success/5 text-success border-success/20 hover:bg-success/10"
                                                    : "bg-danger/5 text-danger border-danger/10 hover:bg-danger/10"
                                                    }`}
                                            >
                                                {category.isActive ? (
                                                    <>
                                                        <CheckCircle className="h-3 w-3 stroke-[2.5]" />
                                                        Active
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircle className="h-3 w-3 stroke-[2.5]" />
                                                        Inactive
                                                    </>
                                                )}
                                            </button>
                                        </td>
                                        <td className="p-4 border-b border-border/30 text-right pr-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenEdit(category)}
                                                    className="p-1.5 rounded-lg border border-border/50 text-foreground/50 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all"
                                                    title="Modify Entry"
                                                >
                                                    <Edit2 className="h-3.5 w-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => setConfirmAction({ type: "delete_single", targetId: category._id })}
                                                    className="p-1.5 rounded-lg border border-border/50 text-foreground/50 hover:text-danger hover:border-danger/30 hover:bg-danger/5 transition-all"
                                                    title="Drop Entry"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="p-12 text-center text-foreground/35 font-medium">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <FolderPlus className="h-8 w-8 text-foreground/20 stroke-[1.5]" />
                                            <p>No localized matching categories indexed in database cluster.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ─── PINNED/STICKY FOOTER CONTROLLER ─── */}
                <div className="sticky bottom-0 left-0 right-0 z-10 flex flex-col sm:flex-row items-center justify-between border-t border-border bg-card p-4 gap-3 shadow-[0_-4px_12px_rgba(11,46,132,0.02)] flex-shrink-0">
                    <span className="text-[11px] font-semibold text-foreground/40">
                        Showing <strong className="text-foreground/70 font-bold">{page}</strong> of <strong className="text-foreground/70 font-bold">{totalPages}</strong> catalog records
                    </span>

                    {totalPages > 1 && (
                        <div className="flex items-center gap-1.5">
                            <button
                                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                                disabled={page === 1}
                                className="p-1.5 rounded-lg border border-border text-foreground/40 hover:text-foreground/80 disabled:opacity-30 disabled:pointer-events-none hover:bg-card transition-all"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            {Array.from({ length: totalPages }).map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setPage(idx + 1)}
                                    className={`h-7 w-7 rounded-lg text-xs font-bold transition-all ${page === idx + 1
                                        ? "bg-primary text-white shadow-sm shadow-primary/20"
                                        : "border border-border/60 text-foreground/50 hover:bg-card hover:text-foreground"
                                        }`}
                                >
                                    {idx + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={page === totalPages}
                                className="p-1.5 rounded-lg border border-border text-foreground/40 hover:text-foreground/80 disabled:opacity-30 disabled:pointer-events-none hover:bg-card transition-all"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ─── SLIDE-OVER DRAWER MODAL FORM (ADD/EDIT) ─── */}
            <AnimatePresence>
                {isFormOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsFormOpen(false)}
                            className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-40"
                        />

                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 220 }}
                            className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] bg-card border-l border-border shadow-2xl z-50 p-6 flex flex-col justify-between text-foreground"
                        >
                            <div className="space-y-6">
                                <div className="flex items-center justify-between border-b border-border pb-4">
                                    <div>
                                        <h3 className="text-sm font-extrabold text-primary uppercase tracking-wider">
                                            {editingCategory ? "Modify Category Profile" : "Initialize New Catalog Node"}
                                        </h3>
                                        <p className="text-[11px] text-foreground/40 mt-0.5">Fill out parameters inside global config limits.</p>
                                    </div>
                                    <button
                                        onClick={() => setIsFormOpen(false)}
                                        className="h-7 w-7 rounded-lg flex items-center justify-center border border-border hover:bg-muted text-foreground/40 hover:text-foreground transition-all"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>

                                <form onSubmit={handleFormSubmit} id="category-form" className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-foreground/50">Category Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                            placeholder="e.g. Valentine Premium Wraps"
                                            className="w-full text-xs text-foreground bg-muted/20 border border-border rounded-xl px-3 py-2.5 focus:outline-none focus:border-primary/40 focus:bg-background transition-all"
                                            autoFocus
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-foreground/50">System Target Route URL</label>
                                        <input
                                            type="text"
                                            value={formData.name ? formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") : ""}
                                            disabled
                                            placeholder="Auto-generated canonical-slug"
                                            className="w-full text-xs font-mono bg-muted/60 text-foreground/40 border border-border/80 rounded-xl px-3 py-2.5 cursor-not-allowed"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-3.5 bg-muted/30 border border-border rounded-xl mt-6">
                                        <div className="space-y-0.5">
                                            <p className="text-xs font-bold text-foreground/80">Active Deployment</p>
                                            <p className="text-[10px] text-foreground/40">Visible across public storefront routes instantly</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                                            className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${formData.isActive ? "bg-success" : "bg-foreground/20"
                                                }`}
                                        >
                                            <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formData.isActive ? "translate-x-4" : "translate-x-0"
                                                }`} />
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <div className="border-t border-border pt-4 flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsFormOpen(false)}
                                    className="flex-1 border border-border text-foreground/60 text-xs font-bold py-2.5 rounded-xl hover:bg-muted transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    form="category-form"
                                    className="flex-1 bg-primary hover:bg-primary/95 text-white text-xs font-bold py-2.5 rounded-xl shadow-md transition-colors"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ─── SYSTEM OVERLAY CONFIRMATION POPUP ─── */}
            <AnimatePresence>
                {confirmAction && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setConfirmAction(null)}
                            className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-50"
                        />
                        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                className="bg-card border border-border rounded-2xl w-full max-w-sm p-5 space-y-4 shadow-2xl text-foreground"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="h-9 w-9 rounded-xl bg-warning/10 text-warning border border-warning/20 flex items-center justify-center flex-shrink-0">
                                        <AlertTriangle className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-xs font-extrabold uppercase tracking-wide text-foreground/80">
                                            Confirm System Command
                                        </h4>
                                        <p className="text-xs text-foreground/50 leading-relaxed">
                                            {confirmAction.type === "delete_single" && "Are you certain you want to destroy this catalog category record? This action cannot be reversed within active database logs."}
                                            {confirmAction.type === "delete_bulk" && `Are you certain you want to initiate a cascade deletion across ${selectedIds.length} target records simultaneously?`}
                                            {confirmAction.type === "toggle_status" && "Are you sure you want to alter the public visibility status flag for this system catalog category?"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-2.5 border-t border-border/60 pt-3">
                                    <button
                                        onClick={() => setConfirmAction(null)}
                                        className="text-[11px] font-bold border border-border px-3 py-2 rounded-xl text-foreground/60 hover:bg-muted transition-colors"
                                    >
                                        Cancel Action
                                    </button>
                                    <button
                                        onClick={executeConfirmedAction}
                                        className={`text-[11px] font-bold text-white px-3 py-2 rounded-xl shadow-sm transition-colors ${confirmAction.type.includes("delete") ? "bg-danger hover:bg-danger/95" : "bg-primary hover:bg-primary/95"
                                            }`}
                                    >
                                        Confirm & Execute
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}