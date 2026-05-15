"use client"

import React, { useState } from "react"
import Image from "next/image"
import BrandLogo from "@/assets/gift_now_mart_brand_logo.png"
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react"

const SignInPage = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Logic for API call will go here
        console.log("Authenticating Admin:", formData)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
            <div className="w-full max-w-md">
                {/* Logo Section */}
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-background p-4 rounded-2xl mb-6">
                        <Image
                            src={BrandLogo}
                            alt="GiftNowMart Logo"
                            width={220}
                            height={60}
                            priority
                            className="object-contain"
                        />
                    </div>
                    <h1 className="text-3xl font-bold text-primary tracking-tight">Admin Portal</h1>
                    <p className="text-sm text-foreground/60 mt-2">Manage your gift mart with confidence</p>
                </div>

                {/* Login Card */}
                <div className="bg-card rounded-3xl shadow-2xl border border-border overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-primary via-secondary to-accent" />

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div className="space-y-4">
                            {/* Email Field */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-primary ml-1">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-foreground/40 group-focus-within:text-primary transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        className="w-full bg-muted/50 border border-border text-foreground text-base rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        placeholder="admin@giftnowmart.com"
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-sm font-semibold text-primary">Password</label>
                                    <button type="button" className="text-xs text-secondary hover:underline font-medium">Forgot Password?</button>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-foreground/40 group-focus-within:text-primary transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="w-full bg-muted/50 border border-border text-foreground text-base rounded-xl py-3 pl-10 pr-12 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        placeholder="••••••••"
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-foreground/40 hover:text-primary"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center space-x-2 px-1">
                            <input
                                type="checkbox"
                                id="remember"
                                className="w-4 h-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                                onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                            />
                            <label htmlFor="remember" className="text-sm text-foreground/70 cursor-pointer select-none">
                                Keep me logged in
                            </label>
                        </div>

                        {/* Sign In Button */}
                        <button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transform transition-all active:scale-[0.98] flex items-center justify-center space-x-2"
                        >
                            <ShieldCheck size={20} />
                            <span className="text-lg">Secure Login</span>
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="bg-muted/50 p-6 border-t border-border text-center">
                        <p className="text-xs text-foreground/50 uppercase tracking-widest font-semibold">
                            Gift More • Save More • Celebrate More
                        </p>
                    </div>
                </div>

                <p className="text-center mt-8 text-foreground/40 text-sm">
                    &copy; 2026 GiftNowMart Admin Dashboard. All rights reserved.
                </p>
            </div>
        </div>
    )
}

export default SignInPage