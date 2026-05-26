"use client";

import appClient from "@/lib/appClient";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Loader2, Search, X } from "lucide-react";
import { Category } from "@/app/interface/category";
import { motion, AnimatePresence } from "framer-motion";

interface CategorySelectProps {
    value: string | null;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    limit?: number;
    label?: string;
}

const CategorySelect = ({
    value,
    onChange,
    placeholder = "Select a category",
    disabled = false,
    className = "",
    limit = 10,
    label,
}: CategorySelectProps) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);
            const res = await appClient.get("/api/category/get", { params: { search, page, limit } });
            if (res.data.status) {
                setCategories(res.data.categories.docs || []);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [search, page, limit]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const selectedCategory = useMemo(() => {
        return categories.find(c => c._id === value);
    }, [categories, value]);

    const handleSelect = (cat: Category) => {
        onChange(cat._id);
        setOpen(false);
    };

    return (
        <div ref={dropdownRef} className={`relative w-full ${className}`}>
            {label && (
                <label className="text-xs font-semibold text-foreground/70 flex items-center gap-1 mb-1.5 select-none">
                    {label}
                </label>
            )}

            {/* Solid Trigger Box Container */}
            <div
                onClick={() => !disabled && setOpen(p => !p)}
                className={`
                    group min-h-[44px] w-full flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer select-none
                    border transition-all duration-200 bg-[#121212] bg-card border-border
                    hover:border-primary/60
                    ${open ? "border-primary shadow-[0_0_0_3px_rgba(11,46,132,0.15)]" : ""}
                    ${disabled ? "opacity-40 cursor-not-allowed pointer-events-none" : ""}
                `}
            >
                {selectedCategory ? (
                    <span className="text-sm font-medium text-foreground">
                        {selectedCategory.name}
                    </span>
                ) : (
                    <span className="text-sm text-foreground/40">
                        {placeholder}
                    </span>
                )}

                <ChevronDown
                    size={15}
                    className={`ml-auto text-foreground/40 transition-transform duration-300 ${open ? "rotate-180 text-primary" : ""
                        }`}
                />
            </div>

            {/* Solid Floating Dropdown Menu */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute z-50 mt-2 w-full rounded-xl border border-border
                            bg-[#121212] bg-card shadow-[0_12px_30px_rgba(0,0,0,0.25)] overflow-hidden"
                    >
                        {/* Search Container */}
                        <div className="p-2.5 border-b border-border bg-[#181818] bg-muted/20">
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0a0a0a] bg-background border border-border">
                                <Search size={14} className="text-foreground/30 shrink-0" />
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Search categories..."
                                    value={search}
                                    onChange={e => { setSearch(e.target.value); setPage(1); }}
                                    className="w-full bg-transparent outline-none text-sm text-foreground placeholder:text-foreground/30"
                                />
                                {search && (
                                    <button
                                        type="button"
                                        onClick={() => setSearch("")}
                                        className="text-foreground/30 hover:text-foreground/60 transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Dropdown Options List */}
                        <div className="max-h-60 overflow-y-auto scrollbar-thin">
                            {loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 size={18} className="animate-spin text-primary" />
                                </div>
                            ) : categories.length === 0 ? (
                                <div className="py-8 text-center text-xs text-foreground/40">
                                    No categories available
                                </div>
                            ) : (
                                categories.map((cat, i) => {
                                    const isSelected = value === cat._id;
                                    return (
                                        <motion.button
                                            key={cat._id}
                                            type="button"
                                            initial={{ opacity: 0, x: -4 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.02 }}
                                            onClick={() => handleSelect(cat)}
                                            className={`w-full flex items-center justify-between px-4 py-3 text-left
                                                transition-colors duration-150 border-b border-border/10 last:border-0
                                                ${isSelected ? "bg-primary/10" : "hover:bg-muted/40"}`}
                                        >
                                            <span className={`text-sm font-medium transition-colors ${isSelected ? "text-primary font-semibold" : "text-foreground/80"
                                                }`}>
                                                {cat.name}
                                            </span>

                                            {isSelected && (
                                                <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                                    <Check size={11} className="text-primary stroke-[3]" />
                                                </span>
                                            )}
                                        </motion.button>
                                    );
                                })
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CategorySelect;