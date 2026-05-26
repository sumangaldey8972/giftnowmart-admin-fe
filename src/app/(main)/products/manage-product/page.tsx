"use client"

import React, { useCallback, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Type, Tag, DollarSign, Truck, FileText,
    Shield, Plus, Trash2, Loader2, ArrowRight,
    CornerDownRight, Save
} from "lucide-react"
import appClient from "@/lib/appClient"
import { toastLoading, toastUpdate } from "@/utils/toast-message/taost-message"
import { useAppSelector } from "@/store/hooks/hooks"
import ImageUploader from "@/components/common/ImageUploader"
import { uploadProductImage } from "@/cloudionary/uploadProductImage"
import { PriceVariantsInterface } from "@/app/interface/product"
import CategorySelect from "@/components/common/multiselect/categorySelect"
import BrandSelect from "@/components/common/multiselect/brandSelect"
import { useRouter } from "next/navigation"
import RichTextEditor from "@/components/common/RichTextEditor"

type NavTab = "core" | "classification" | "pricing" | "delivery" | "content" | "visibility"

const FieldLabel = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
    <label className="text-xs font-semibold text-foreground/70 flex items-center gap-1 mb-1.5 select-none">
        {children} {required && <span className="text-red-500 font-bold">*</span>}
    </label>
)

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    ({ className, ...props }, ref) => (
        <input
            ref={ref}
            {...props}
            className={`w-full text-sm text-foreground bg-muted/20 border border-border rounded-xl px-3 py-2
                focus:outline-none focus:border-primary focus:bg-card transition-all placeholder:text-foreground/30 ${className ?? ""}`}
        />
    )
)
Input.displayName = "Input"

const TextArea = ({ ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea
        {...props}
        className={`w-full text-sm text-foreground bg-muted/20 border border-border rounded-xl px-3 py-2
            focus:outline-none focus:border-primary focus:bg-card transition-all placeholder:text-foreground/30 resize-y ${props.className ?? ""}`}
    />
)

export default function ProductPage() {
    const selectedProduct = useAppSelector((store) => store.manageProduct.product)
    const user = useAppSelector((store) => store.auth.user)
    const router = useRouter()

    const [activeTab, setActiveTab] = useState<NavTab>("core")
    const [logo, setLogo] = useState<File | null>(null)
    const [logoPreview, setLogoPreview] = useState<string>(selectedProduct?.logo || "")
    const [currentLogoUrl] = useState<string>(selectedProduct?.logo || "")
    const [submitting, setSubmitting] = useState(false)
    const [totalProduct, setTotalProduct] = useState(0)
    const [totalProductLoading, setTotalProductLoading] = useState(false)

    const initialFormState = {
        title: "",
        shortDescription: "",
        description: "",
        categoryId: "",
        brandId: "",
        priceVariants: [{ name: "", cardValue: 0, discountPercentage: "", sellingPrice: 0, isActive: true }],
        currency: "USD",
        deliveryType: "virtual",
        redeemSteps: "",
        validity: "",
        termAndConditions: "",
        isActive: true,
        isFeatured: false,
    }

    const [formData, setFormData] = useState(selectedProduct ? {
        title: selectedProduct.title || "",
        shortDescription: selectedProduct.shortDescription || "",
        description: selectedProduct.description || "",
        categoryId: selectedProduct.categoryId?._id || "",
        brandId: selectedProduct.brandId?._id || "",
        priceVariants: (selectedProduct.priceVariants as PriceVariantsInterface[]) || [{ name: "", cardValue: 0, discountPercentage: "", sellingPrice: 0, isActive: true }],
        currency: selectedProduct.currency || "USD",
        deliveryType: selectedProduct.deliveryType || "virtual",
        redeemSteps: selectedProduct.redeemSteps || "",
        validity: selectedProduct.validity || "",
        termAndConditions: selectedProduct.termAndConditions || "",
        isActive: selectedProduct.isActive ?? true,
        isFeatured: selectedProduct.isFeatured || false,
    } : initialFormState)

    const resetForm = () => {
        setFormData(initialFormState)
        setLogo(null)
        setLogoPreview("")
        setActiveTab("core")
    }

    const set = (field: string, value: any) => setFormData(p => ({ ...p, [field]: value }))
    const slug = formData.title ? formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") : ""
    const isEdit = !!selectedProduct

    const fetchBrands = useCallback(async () => {
        try {
            setTotalProductLoading(true)
            const res = await appClient.get("/api/product/getProductCount")
            if (res.data.status) {
                setTotalProduct(res.data.productCount || 0)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setTotalProductLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchBrands()
    }, [fetchBrands])

    const isCurrentVariantFilled = () => {
        if (formData.priceVariants.length === 0) return true
        const lastVariant = formData.priceVariants[formData.priceVariants.length - 1]
        return (
            lastVariant.name.trim() !== "" &&
            lastVariant.cardValue > 0 &&
            String(lastVariant.discountPercentage).trim() !== "" &&
            lastVariant.sellingPrice > 0
        )
    }

    const addPriceVariant = () => {
        if (!isCurrentVariantFilled()) return
        set("priceVariants", [...formData.priceVariants, { name: "", cardValue: 0, discountPercentage: "", sellingPrice: 0, isActive: true }])
    }

    const removePriceVariant = (i: number) => {
        set("priceVariants", formData.priceVariants.filter((_, idx) => idx !== i))
    }

    const updatePriceVariant = (i: number, field: keyof PriceVariantsInterface, val: any) => {
        const next = [...formData.priceVariants]
        next[i] = { ...next[i], [field]: val }
        set("priceVariants", next)
    }

    const handleFinalFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.title.trim()) return
        setSubmitting(true)

        const toastId = toastLoading(selectedProduct ? "Saving changes..." : "Creating new item...", {
            description: "Updating the product catalog database."
        })

        const productId = selectedProduct?.productId || `PRDCT-${String(totalProduct).padStart(3, '0')}`

        try {
            let logoUrl = currentLogoUrl
            if (logo) logoUrl = await uploadProductImage(logo, productId, "product_images")

            const payload = {
                ...(selectedProduct ? { _id: selectedProduct._id } : {}),
                productId: productId,
                title: formData.title,
                slug,
                shortDescription: formData.shortDescription,
                description: formData.description,
                categoryId: formData.categoryId,
                brandId: formData.brandId,
                priceVariants: formData.priceVariants,
                currency: formData.currency,
                deliveryType: formData.deliveryType,
                redeemSteps: formData.redeemSteps,
                validity: formData.validity,
                termAndCondition: formData.termAndConditions,
                logo: logoUrl,
                isActive: formData.isActive,
                isFeatured: formData.isFeatured,
                createdBy: user?._id,
            }

            const url = selectedProduct ? "/api/product/update" : "/api/product/create"
            const res = await appClient.post(url, payload)

            if (res?.data.status) {
                toastUpdate(toastId, "success", "Success", { description: res.data.message })
                resetForm()
            } else {
                toastUpdate(toastId, "error", "Error", { description: res.data.message })
            }
        } catch (err: any) {
            toastUpdate(toastId, "error", "System connection error", { description: err.message })
        } finally {
            setSubmitting(false)
        }
    }

    const navItems: { id: NavTab; label: string; icon: any }[] = [
        { id: "core", label: "Basic Info", icon: Type },
        { id: "classification", label: "Categories & Brands", icon: Tag },
        { id: "pricing", label: "Price Options", icon: DollarSign },
        { id: "delivery", label: "Delivery", icon: Truck },
        { id: "content", label: "How to Redeem", icon: FileText },
        { id: "visibility", label: "Store Visibility", icon: Shield },
    ]

    return (
        <div className="w-full min-h-screen bg-background text-foreground p-4 lg:p-8 flex flex-col space-y-6 antialiased relative">

            {/* FULL PAGE BLUR OVERLAY FOR LOAD COUNTS */}
            <AnimatePresence>
                {totalProductLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-background/40 backdrop-blur-sm z-50 flex flex-col items-center justify-center space-y-3"
                    >
                        <div className="bg-card border border-border p-5 rounded-2xl shadow-xl flex items-center space-x-3">
                            <Loader2 className="w-5 h-5 animate-spin text-primary" />
                            <span className="text-sm font-medium">Loading store setup details...</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* TOP HEADER */}
            <div className="bg-card border border-border p-5 rounded-2xl shadow-sm">
                <h1 className="text-xl font-bold tracking-tight">
                    {isEdit ? "Edit Product Details" : "Add New Item"}
                </h1>
                <p className="text-xs text-foreground/50">
                    {isEdit ? `Updating information for product ID: ${selectedProduct.productId}` : "Fill out the fields below to add a new item to your online shop."}
                </p>
            </div>

            {/* HORIZONTAL LEFT-TO-RIGHT TAB BAR */}
            <div className="w-full bg-card border border-border p-2 rounded-xl flex items-center overflow-x-auto gap-1 scrollbar-none">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isCurrent = activeTab === item.id
                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => setActiveTab(item.id)}
                            className={`px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all whitespace-nowrap text-xs font-semibold relative ${isCurrent ? "bg-primary text-white shadow" : "hover:bg-muted/60 text-foreground/60"
                                }`}
                        >
                            <Icon className="w-4 h-4 shrink-0" />
                            <span>{item.label}</span>
                            {isCurrent && (
                                <motion.div layoutId="activeHorizontalTab" className="absolute bottom-0 left-2 right-2 h-0.5 bg-white rounded-full" />
                            )}
                        </button>
                    )
                })}
            </div>

            {/* CENTRAL INTERACTIVE AREA */}
            <div className="bg-card border border-border rounded-2xl p-5 lg:p-6 shadow-sm min-h-[450px] flex flex-col justify-between">
                <div className="flex-1">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.15 }}
                            className="space-y-4"
                        >
                            {/* STEP 1: CORE DATA */}
                            {activeTab === "core" && (
                                <div className="space-y-4">
                                    <div className="border-b border-border pb-2">
                                        <h3 className="text-sm font-bold">Product Information</h3>
                                        <p className="text-xs text-foreground/50">Enter the name and full description for public display.</p>
                                    </div>
                                    <div className="space-y-1">
                                        <FieldLabel required>Product Title</FieldLabel>
                                        <Input placeholder="Enter product name" value={formData.title} onChange={e => set("title", e.target.value)} required />
                                    </div>
                                    <div className="space-y-1">
                                        <RichTextEditor
                                            label="Short Summary"
                                            placeholder="A short description shown on item cards"
                                            value={formData.shortDescription}
                                            onChange={val => set("shortDescription", val)}
                                            minHeight="140px"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <RichTextEditor
                                            label="Full Description"
                                            placeholder="A detailed description about features and terms"
                                            value={formData.description}
                                            onChange={val => set("description", val)}
                                            minHeight="220px"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* STEP 2: CLASSIFICATION (SPLIT GRID LAYOUT) */}
                            {activeTab === "classification" && (
                                <div className="space-y-4">
                                    <div className="border-b border-border pb-2">
                                        <h3 className="text-sm font-bold">Categories & Brands</h3>
                                        <p className="text-xs text-foreground/50">Organize where this product appears and manage its display photo side by side.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                                        {/* LEFT COLUMN: FIELDS FROM TOP TO BOTTOM */}
                                        <div className="space-y-4">
                                            <CategorySelect
                                                label="Select Category"
                                                placeholder="Search and select category..."
                                                value={formData.categoryId || null}
                                                onChange={(id) => set("categoryId", id)}
                                            />

                                            <BrandSelect
                                                label="Select Brand"
                                                placeholder="Search and select brand..."
                                                value={formData.brandId || null}
                                                onChange={(id) => set("brandId", id)}
                                            />

                                            <div className="space-y-1 bg-muted/20 p-3 rounded-xl border border-border/40">
                                                <FieldLabel>Web Link Preview (URL Slug)</FieldLabel>
                                                <div className="flex items-center gap-1.5 font-mono text-xs text-foreground/60">
                                                    <CornerDownRight className="w-4 h-4 text-primary shrink-0" />
                                                    <span className="opacity-50">/products/</span>
                                                    <span className="text-primary font-bold">{slug || "waiting for title..."}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* RIGHT COLUMN: COMPACT IMAGE UPLOADER */}
                                        <div className="p-4 bg-muted/10 border border-border rounded-xl flex flex-col items-center">
                                            <div className="w-full text-left">
                                                <FieldLabel>Product Image</FieldLabel>
                                            </div>
                                            {/* Compact fixed size block container */}
                                            <div className="mt-2 bg-card rounded-xl border p-2 w-full max-w-sm max-h-[320px] overflow-hidden flex items-center justify-center">
                                                <ImageUploader image={logo} imagePreview={logoPreview} setImage={setLogo} setImagePreview={setLogoPreview} currentBrandLogo={currentLogoUrl} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 3: PRICING WITH DYNAMIC FILL-UP VALIDATION */}
                            {activeTab === "pricing" && (
                                <div className="space-y-4">
                                    <div className="border-b border-border pb-2">
                                        <h3 className="text-sm font-bold">Pricing Options</h3>
                                        <p className="text-xs text-foreground/50">Add pricing setups. You must complete the current row to unlock the add row button.</p>
                                    </div>

                                    <div className="space-y-3">
                                        {formData.priceVariants.map((v, i) => (
                                            <div key={i} className="bg-muted/20 border border-border rounded-xl p-4 relative space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">Option #{i + 1}</span>
                                                    {formData.priceVariants.length > 1 && (
                                                        <button type="button" onClick={() => removePriceVariant(i)} className="text-foreground/40 hover:text-red-500 transition-colors">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                                    <div>
                                                        <FieldLabel>Title</FieldLabel>
                                                        <Input placeholder="Standard" value={v.name} onChange={e => updatePriceVariant(i, "name", e.target.value)} />
                                                    </div>
                                                    <div>
                                                        <FieldLabel>Value ($)</FieldLabel>
                                                        <Input type="number" placeholder="0.00" value={v.cardValue || ""} onChange={e => updatePriceVariant(i, "cardValue", Number(e.target.value))} />
                                                    </div>
                                                    <div>
                                                        <FieldLabel>Discount %</FieldLabel>
                                                        <Input type="number" placeholder="0" value={v.discountPercentage || ""} onChange={e => updatePriceVariant(i, "discountPercentage", e.target.value)} />
                                                    </div>
                                                    <div>
                                                        <FieldLabel>Sale Price ($)</FieldLabel>
                                                        <Input type="number" placeholder="0.00" value={v.sellingPrice || ""} onChange={e => updatePriceVariant(i, "sellingPrice", Number(e.target.value))} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        <button
                                            type="button"
                                            onClick={addPriceVariant}
                                            disabled={!isCurrentVariantFilled()}
                                            className={`w-full py-2.5 border border-dashed rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all
                                                ${isCurrentVariantFilled()
                                                    ? "border-primary/40 hover:bg-primary/5 text-primary cursor-pointer"
                                                    : "border-border text-foreground/30 bg-muted/10 cursor-not-allowed opacity-50"}`}
                                        >
                                            <Plus className="w-4 h-4" /> Add New Price Row
                                        </button>
                                        {!isCurrentVariantFilled() && (
                                            <p className="text-[11px] text-amber-600 font-medium">
                                                * Complete all values in the active row to unlock adding another option.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* STEP 4: DELIVERY */}
                            {activeTab === "delivery" && (
                                <div className="space-y-4">
                                    <div className="border-b border-border pb-2">
                                        <h3 className="text-sm font-bold">Delivery Setup</h3>
                                        <p className="text-xs text-foreground/50">Choose how this item is sent or fulfilled for customers.</p>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {(["virtual", "physical"] as const).map(t => (
                                            <button key={t} type="button" onClick={() => set("deliveryType", t)}
                                                className={`p-4 rounded-xl border text-left text-xs space-y-1 transition-all
                                                    ${formData.deliveryType === t ? "border-primary bg-primary/5 text-primary font-bold" : "border-border text-foreground/60 hover:bg-muted/30"}`}>
                                                <div className="capitalize font-bold text-sm">{t === "virtual" ? "⚡ Digital Code" : "📦 Mail Shipping"}</div>
                                                <p className="text-xs font-normal opacity-70">
                                                    {t === "virtual" ? "Sent instantly via electronic delivery code rules." : "Packaged and sent using standard package logistics."}
                                                </p>
                                            </button>
                                        ))}
                                    </div>
                                    <div className="space-y-1">
                                        <FieldLabel>Validity Period</FieldLabel>
                                        <Input placeholder="Example: Valid for 1 year from activation" value={formData.validity} onChange={e => set("validity", e.target.value)} />
                                    </div>
                                </div>
                            )}

                            {/* STEP 5: MANUAL PROCEDURAL GUIDES */}
                            {activeTab === "content" && (
                                <div className="space-y-4">
                                    <div className="border-b border-border pb-2">
                                        <h3 className="text-sm font-bold">Redemption & Guide Steps</h3>
                                        <p className="text-xs text-foreground/50">Provide instructions and terms for the buyers.</p>
                                    </div>
                                    <div className="space-y-1">
                                        <RichTextEditor
                                            label="How to Redeem Steps"
                                            placeholder="Step 1: Go to the account wallet page..."
                                            value={formData.redeemSteps}
                                            onChange={val => set("redeemSteps", val)}
                                            minHeight="140px"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <RichTextEditor
                                            label="Terms and Conditions"
                                            placeholder="This voucher code cannot be traded or refunded for cash values..."
                                            value={formData.termAndConditions}
                                            onChange={val => set("termAndConditions", val)}
                                            minHeight="140px"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* STEP 6: STORE SETTINGS AND API SUBMISSION BLOCK */}
                            {activeTab === "visibility" && (
                                <form onSubmit={handleFinalFormSubmit} className="space-y-4">
                                    <div className="border-b border-border pb-2">
                                        <h3 className="text-sm font-bold">Store Visibility Settings</h3>
                                        <p className="text-xs text-foreground/50">Set status visibility options and save the complete form details to the database.</p>
                                    </div>

                                    <div className="space-y-3 max-w-xl">
                                        <div className="flex items-center justify-between p-4 bg-muted/10 border border-border rounded-xl">
                                            <div>
                                                <p className="text-sm font-bold">Publish Instantly</p>
                                                <p className="text-xs text-foreground/50">Make this item visible on the shop front right away.</p>
                                            </div>
                                            <input type="checkbox" checked={formData.isActive} onChange={e => set("isActive", e.target.checked)} className="w-4 h-4 accent-primary" />
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-muted/10 border border-border rounded-xl">
                                            <div>
                                                <p className="text-sm font-bold">Feature on Main Banner</p>
                                                <p className="text-xs text-foreground/50">Display this product on home promotional carousels.</p>
                                            </div>
                                            <input type="checkbox" checked={formData.isFeatured} onChange={e => set("isFeatured", e.target.checked)} className="w-4 h-4 accent-primary" />
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-border mt-4 flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={submitting || !formData.title.trim()}
                                            className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow transition-all disabled:opacity-40 mt-4"
                                        >
                                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            {isEdit ? "Save Changes" : "Create Product Setup"}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* BOTTOM NAVIGATION ROW SHORTCUTS */}
                {activeTab !== "visibility" && (
                    <div className="border-t border-border pt-4 mt-6 flex items-center justify-between">
                        <button
                            type="button"
                            disabled={activeTab === "core"}
                            onClick={() => {
                                const prevIdx = navItems.findIndex(n => n.id === activeTab) - 1
                                if (prevIdx >= 0) setActiveTab(navItems[prevIdx].id)
                            }}
                            className="px-4 py-2 border border-border rounded-xl text-xs font-semibold text-foreground/60 hover:bg-muted/50 disabled:opacity-30 transition-all"
                        >
                            Back
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                const nextIdx = navItems.findIndex(n => n.id === activeTab) + 1
                                if (nextIdx < navItems.length) setActiveTab(navItems[nextIdx].id)
                            }}
                            className="px-4 py-2 bg-primary/10 hover:bg-primary/15 border border-primary/20 text-primary rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
                        >
                            Continue <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}