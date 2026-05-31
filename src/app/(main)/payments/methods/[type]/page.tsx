"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Layers, Save, Upload, X, Edit2, ImageIcon,
    Key, Type, AlignLeft, Hash, ArrowUpDown, Settings2,
    Wallet, CheckCircle2, AlertCircle, Loader2, Globe, FileText
} from "lucide-react";
import { usePathname } from "next/navigation";

// ── Reusable primitives ────────────────────────────────────────────────────────

const FieldLabel = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
    <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-1.5">
        {children}
        {required && <span className="text-danger">*</span>}
    </label>
);

const FieldInput = ({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
        {...props}
        className={`w-full text-sm text-foreground bg-background border border-border rounded-xl px-3.5 py-2.5
            focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all
            placeholder:text-foreground/20 disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
    />
);

const FieldSelect = ({ className = "", children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
    <select
        {...props}
        className={`w-full text-sm text-foreground bg-background border border-border rounded-xl px-3.5 py-2.5
            focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all
            cursor-pointer ${className}`}
    >
        {children}
    </select>
);

const SectionCard = ({
    icon: Icon, title, subtitle, children, span2 = false
}: {
    icon: React.ElementType; title: string; subtitle?: string;
    children: React.ReactNode; span2?: boolean;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-card border border-border/70 rounded-2xl overflow-hidden shadow-sm
            ${span2 ? "xl:col-span-2" : ""}`}
    >
        {/* Card header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border/60 bg-muted/20">
            <div className="w-7 h-7 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center shrink-0">
                <Icon className="w-3.5 h-3.5 text-primary" />
            </div>
            <div>
                <p className="text-xs font-black text-foreground/80 tracking-tight">{title}</p>
                {subtitle && <p className="text-[10px] text-foreground/40 mt-0.5">{subtitle}</p>}
            </div>
        </div>
        <div className="p-5 space-y-4">{children}</div>
    </motion.div>
);

// ── Mini image uploader ────────────────────────────────────────────────────────
const ImageUploader = ({
    label, value, preview, onChange, onRemove, hint
}: {
    label: string; value: string; preview: string;
    onChange: (file: File, preview: string) => void;
    onRemove: () => void; hint?: string;
}) => {
    const fileRef = useRef<HTMLInputElement>(null);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => onChange(file, reader.result as string);
        reader.readAsDataURL(file);
    };

    return (
        <div>
            <FieldLabel>{label}</FieldLabel>
            <AnimatePresence mode="wait">
                {preview ? (
                    <motion.div key="preview"
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                        className="flex items-center gap-3 p-3 bg-background border border-border rounded-xl">
                        <div className="w-14 h-14 rounded-xl bg-muted border border-border overflow-hidden shrink-0 flex items-center justify-center">
                            <img src={preview} alt="preview" className="w-full h-full object-contain p-1" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-foreground/70 truncate">Image selected</p>
                            <p className="text-[10px] text-foreground/35 mt-0.5">Looks good!</p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                            <button type="button" onClick={() => fileRef.current?.click()}
                                className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-bold text-primary bg-primary/8 border border-primary/20 rounded-lg hover:bg-primary/15 transition-all">
                                <Edit2 className="w-3 h-3" /> Change
                            </button>
                            <button type="button" onClick={onRemove}
                                className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-bold text-danger bg-danger/8 border border-danger/20 rounded-lg hover:bg-danger/15 transition-all">
                                <X className="w-3 h-3" /> Remove
                            </button>
                        </div>
                        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
                    </motion.div>
                ) : (
                    <motion.button key="upload" type="button"
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                        onClick={() => fileRef.current?.click()}
                        className="w-full flex flex-col items-center justify-center gap-2 p-5 border-2 border-dashed border-border
                            rounded-xl hover:border-primary/40 hover:bg-primary/[0.02] transition-all group cursor-pointer">
                        <div className="w-9 h-9 rounded-xl bg-muted border border-border flex items-center justify-center group-hover:bg-primary/8 group-hover:border-primary/20 transition-all">
                            <Upload className="w-4 h-4 text-foreground/35 group-hover:text-primary transition-colors" />
                        </div>
                        <div className="text-center">
                            <p className="text-xs font-bold text-foreground/50 group-hover:text-foreground/70 transition-colors">Click to upload {label.toLowerCase()}</p>
                            {hint && <p className="text-[10px] text-foreground/30 mt-0.5">{hint}</p>}
                        </div>
                        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
};

// ── Toggle switch ──────────────────────────────────────────────────────────────
const Toggle = ({ checked, onChange, label, description }: {
    checked: boolean; onChange: () => void; label: string; description: string;
}) => (
    <div className="flex items-center justify-between py-3 px-4 bg-muted/20 border border-border/60 rounded-xl">
        <div>
            <p className="text-xs font-bold text-foreground/80">{label}</p>
            <p className="text-[10px] text-foreground/40 mt-0.5">{description}</p>
        </div>
        <button type="button" onClick={onChange}
            className={`relative w-10 h-[22px] rounded-full transition-colors duration-200 shrink-0 ${checked ? "bg-primary" : "bg-foreground/15"}`}
            style={{ minWidth: "40px" }}>
            <motion.div
                animate={{ x: checked ? 18 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute top-[3px] w-4 h-4 rounded-full bg-white shadow-sm"
            />
        </button>
    </div>
);

// ── Main page ──────────────────────────────────────────────────────────────────
export default function PaymentMethodPage() {
    const pathName = usePathname();
    const mode = pathName.split("/")[3] || "create";
    const isEdit = mode.toLowerCase() !== "create";

    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const [iconFile, setIconFile] = useState<File | null>(null);
    const [iconPreview, setIconPreview] = useState<string>("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");

    const [formData, setFormData] = useState({
        key: "",
        title: "",
        subtitle: "",
        type: "crypto",
        iconEmoji: "",
        enabled: true,
        comingSoon: false,
        processingFee: 0,
        sortOrder: 0,
        supportedCurrencies: [] as string[],
        cryptoConfig: {
            currency: "",
            network: "",
            walletAddress: "",
            qrCode: "",
        },
        instructions: "",
        verificationType: "manual",
    });

    const PAYMENT_TYPES = [{ label: "Crypto", value: "crypto" }, { label: "Wallet", value: "wallet" }, { label: "Bank", value: "bank" }];
    const VERIFICATION_TYPES = [{ label: "Manual Review", value: "manual" }, { label: "Automatic", value: "automatic" }];
    const SUPPORTED_CURRENCIES = ["BTC", "ETH", "USDT", "BNB", "SOL", "XRP", "MATIC"];

    const set = (field: string, value: any) => setFormData(p => ({ ...p, [field]: value }));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        set(e.target.name, e.target.value);
    };

    const handleCryptoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(p => ({ ...p, cryptoConfig: { ...p.cryptoConfig, [e.target.name]: e.target.value } }));
    };

    const handleCurrencyToggle = (c: string) => {
        setFormData(p => ({
            ...p,
            supportedCurrencies: p.supportedCurrencies.includes(c)
                ? p.supportedCurrencies.filter(x => x !== c)
                : [...p.supportedCurrencies, c]
        }));
    };

    const handleSubmit = async () => {
        setSaving(true);
        await new Promise(r => setTimeout(r, 1200)); // simulate API
        console.log("💳 Payment Method Payload:", { ...formData, iconFile, imageFile });
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    return (
        <div className="w-full h-full flex flex-col space-y-6 p-1 text-foreground">

            {/* ── HEADER ── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5 shrink-0">
                <div>
                    <div className="flex items-center gap-1.5">
                        <Layers className="h-3 w-3 text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-foreground/35">
                            Payment Methods
                        </span>
                    </div>
                    <h1 className="text-xl md:text-2xl font-extrabold text-foreground tracking-tight mt-1">
                        {isEdit ? "Edit" : "Add"} Payment Method
                    </h1>
                    <p className="text-xs text-foreground/40 mt-0.5">
                        {isEdit ? "Update the configuration for this payment method." : "Configure a new payment method for your checkout."}
                    </p>
                </div>

                <motion.button
                    type="button"
                    onClick={handleSubmit}
                    whileTap={{ scale: 0.97 }}
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90
                        text-white text-sm font-black transition-all shadow-md shadow-primary/20
                        disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
                >
                    <AnimatePresence mode="wait">
                        {saving ? (
                            <motion.span key="saving" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                            </motion.span>
                        ) : saved ? (
                            <motion.span key="saved" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                                className="flex items-center gap-2 text-emerald-300">
                                <CheckCircle2 className="w-4 h-4" /> Saved!
                            </motion.span>
                        ) : (
                            <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="flex items-center gap-2">
                                <Save className="w-4 h-4" /> Save Method
                            </motion.span>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>

            {/* ── FORM GRID ── */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-5">

                {/* 1. BASIC INFO */}
                <SectionCard icon={Key} title="Basic Information" subtitle="Identity keys and display labels">

                    <div>
                        <FieldLabel required>Unique Key</FieldLabel>
                        <FieldInput name="key" value={formData.key} onChange={handleChange}
                            placeholder="e.g. bitcoin_btc" />
                        <p className="text-[10px] text-foreground/30 mt-1.5 pl-1">Lowercase, no spaces. Used as the identifier in your system.</p>
                    </div>

                    <div>
                        <FieldLabel required>Display Title</FieldLabel>
                        <FieldInput name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Bitcoin" />
                    </div>

                    <div>
                        <FieldLabel>Subtitle / Description</FieldLabel>
                        <FieldInput name="subtitle" value={formData.subtitle} onChange={handleChange} placeholder="e.g. Pay using Bitcoin on any network" />
                    </div>

                    <div>
                        <FieldLabel required>Payment Type</FieldLabel>
                        <FieldSelect name="type" value={formData.type} onChange={handleChange}>
                            {PAYMENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </FieldSelect>
                        <p className="text-[10px] text-foreground/30 mt-1.5 pl-1">Determines how this method is grouped in checkout.</p>
                    </div>

                </SectionCard>

                {/* 2. ICON & IMAGE */}
                <SectionCard icon={ImageIcon} title="Icon & Image" subtitle="Upload an icon and a branded logo image">

                    <ImageUploader
                        label="Icon Image"
                        value={iconFile?.name || ""}
                        preview={iconPreview}
                        onChange={(file, prev) => { setIconFile(file); setIconPreview(prev); }}
                        onRemove={() => { setIconFile(null); setIconPreview(""); }}
                        hint="SVG, PNG, WebP — recommended 64×64px"
                    />

                    <div>
                        <FieldLabel>Emoji / Text Icon (fallback)</FieldLabel>
                        <FieldInput name="iconEmoji" value={formData.iconEmoji} onChange={handleChange}
                            placeholder="₿" className="font-mono text-lg" />
                        <p className="text-[10px] text-foreground/30 mt-1.5 pl-1">Used when no image is uploaded. A single emoji or symbol.</p>
                    </div>

                    <ImageUploader
                        label="Brand / Logo Image"
                        value={imageFile?.name || ""}
                        preview={imagePreview}
                        onChange={(file, prev) => { setImageFile(file); setImagePreview(prev); }}
                        onRemove={() => { setImageFile(null); setImagePreview(""); }}
                        hint="PNG, JPG — recommended 200×80px, transparent bg"
                    />

                </SectionCard>

                {/* 3. PAYMENT SETTINGS */}
                <SectionCard icon={Settings2} title="Payment Settings" subtitle="Fees, ordering, and verification">

                    <div>
                        <FieldLabel>Processing Fee ($)</FieldLabel>
                        <FieldInput type="number" name="processingFee" value={formData.processingFee}
                            onChange={handleChange} placeholder="0.00" min={0} step={0.01} />
                        <p className="text-[10px] text-foreground/30 mt-1.5 pl-1">Extra fee added to the grand total at checkout. Leave 0 for no fee.</p>
                    </div>

                    <div>
                        <FieldLabel>Sort Order</FieldLabel>
                        <FieldInput type="number" name="sortOrder" value={formData.sortOrder}
                            onChange={handleChange} placeholder="0" min={0} />
                        <p className="text-[10px] text-foreground/30 mt-1.5 pl-1">Lower number appears first in the list.</p>
                    </div>

                    <div>
                        <FieldLabel>Verification Type</FieldLabel>
                        <FieldSelect name="verificationType" value={formData.verificationType} onChange={handleChange}>
                            {VERIFICATION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </FieldSelect>
                        <p className="text-[10px] text-foreground/30 mt-1.5 pl-1">How payments are confirmed after a user submits proof.</p>
                    </div>

                    <div className="space-y-2 pt-1">
                        <Toggle
                            checked={formData.enabled}
                            onChange={() => set("enabled", !formData.enabled)}
                            label="Active & Enabled"
                            description="Show this method at checkout for customers"
                        />
                        <Toggle
                            checked={formData.comingSoon}
                            onChange={() => set("comingSoon", !formData.comingSoon)}
                            label="Coming Soon Mode"
                            description="Show as unavailable with a 'Coming Soon' badge"
                        />
                    </div>

                </SectionCard>

                {/* 4. CRYPTO CONFIG */}
                <SectionCard icon={Globe} title="Crypto Configuration" subtitle="Wallet, network, and QR settings">

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <FieldLabel>Currency Symbol</FieldLabel>
                            <FieldInput name="currency" value={formData.cryptoConfig.currency}
                                onChange={handleCryptoChange} placeholder="BTC" className="font-mono uppercase" />
                        </div>
                        <div>
                            <FieldLabel>Network Name</FieldLabel>
                            <FieldInput name="network" value={formData.cryptoConfig.network}
                                onChange={handleCryptoChange} placeholder="BITCOIN" className="font-mono uppercase" />
                        </div>
                    </div>

                    <div>
                        <FieldLabel required>Wallet Address</FieldLabel>
                        <FieldInput name="walletAddress" value={formData.cryptoConfig.walletAddress}
                            onChange={handleCryptoChange} placeholder="bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
                            className="font-mono text-xs" />
                        <p className="text-[10px] text-foreground/30 mt-1.5 pl-1">This address will be shown to customers when they select this method.</p>
                    </div>

                    <div>
                        <FieldLabel>QR Code Image URL</FieldLabel>
                        <FieldInput name="qrCode" value={formData.cryptoConfig.qrCode}
                            onChange={handleCryptoChange} placeholder="https://..." className="font-mono text-xs" />
                        <p className="text-[10px] text-foreground/30 mt-1.5 pl-1">Publicly accessible URL to a QR code image for the wallet address.</p>
                    </div>

                </SectionCard>

                {/* 5. SUPPORTED CURRENCIES */}
                <SectionCard icon={Wallet} title="Supported Currencies" subtitle="Toggle which tokens are accepted" span2>
                    <p className="text-xs text-foreground/45 -mt-1">Click to toggle currencies this payment method supports.</p>
                    <div className="flex flex-wrap gap-2">
                        {SUPPORTED_CURRENCIES.map((c) => {
                            const sel = formData.supportedCurrencies.includes(c);
                            return (
                                <motion.button key={c} type="button" onClick={() => handleCurrencyToggle(c)}
                                    whileTap={{ scale: 0.94 }}
                                    className={`relative px-4 py-2 rounded-xl border text-xs font-black transition-all
                                        ${sel
                                            ? "bg-primary/10 border-primary/50 text-primary shadow-[0_0_0_3px_hsl(var(--primary)/0.1)]"
                                            : "border-border bg-background text-foreground/55 hover:border-primary/25 hover:text-foreground/75"
                                        }`}>
                                    {sel && (
                                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                                            className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                                            <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                                        </motion.span>
                                    )}
                                    {c}
                                </motion.button>
                            );
                        })}
                    </div>
                    {formData.supportedCurrencies.length > 0 && (
                        <p className="text-[10px] text-foreground/40">
                            {formData.supportedCurrencies.length} selected: {formData.supportedCurrencies.join(", ")}
                        </p>
                    )}
                </SectionCard>

                {/* 6. INSTRUCTIONS */}
                <SectionCard icon={FileText} title="Customer Instructions" subtitle="Shown to the user at checkout when this method is selected" span2>
                    <div>
                        <FieldLabel>Payment Instructions</FieldLabel>
                        <textarea
                            rows={4}
                            name="instructions"
                            value={formData.instructions}
                            onChange={handleChange}
                            placeholder="e.g. Send the exact amount to the wallet address above. After sending, upload your transaction screenshot below. Processing takes 10–30 minutes."
                            className="w-full text-sm text-foreground bg-background border border-border rounded-xl px-3.5 py-2.5
                                focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all
                                placeholder:text-foreground/20 resize-y"
                        />
                        <p className="text-[10px] text-foreground/30 mt-1.5 pl-1">Markdown is supported. Keep it clear and concise — users read this during checkout.</p>
                    </div>
                </SectionCard>

            </div>

            {/* ── FOOTER ACTION ── */}
            <div className="border-t border-border pt-5 flex items-center justify-between gap-4 shrink-0 pb-5">
                <div className="flex items-center gap-2 text-[11px] text-foreground/35">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>All changes are saved to your database immediately.</span>
                </div>
                <div className="flex items-center gap-3">
                    <button type="button"
                        className="px-4 py-2.5 text-xs font-bold text-foreground/55 border border-border rounded-xl hover:bg-muted transition-all">
                        Discard
                    </button>
                    <motion.button type="button" onClick={handleSubmit} whileTap={{ scale: 0.97 }} disabled={saving}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90
                            text-white text-sm font-black transition-all shadow-md shadow-primary/20 disabled:opacity-50">
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {saving ? "Saving..." : "Save Payment Method"}
                    </motion.button>
                </div>
            </div>

        </div>
    );
}