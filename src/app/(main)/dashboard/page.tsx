"use client"

import React from "react"
import { motion } from "framer-motion"
import {
    DollarSign,
    Gift,
    Clock,
    TrendingUp,
    ArrowUpRight,
    Calendar,
    Sparkles
} from "lucide-react"

// Metric layout definitions
const metricsConfig = [
    {
        title: "Revenue Today",
        value: "$12,480",
        change: "+14.2%",
        isPositive: true,
        icon: DollarSign,
        colorClass: "text-emerald-600 bg-emerald-50 border-emerald-100/60",
    },
    {
        title: "Cards Sold",
        value: "847",
        change: "+8.4%",
        isPositive: true,
        icon: Gift,
        colorClass: "text-amber-600 bg-amber-50 border-amber-100/60",
    },
    {
        title: "Pending Orders",
        value: "12",
        change: "-2.1%",
        isPositive: false,
        icon: Clock,
        colorClass: "text-secondary bg-secondary/5 border-secondary/10",
    },
]

// Container staggered animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
        },
    },
}

const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 25 } },
}

const Dashboard = () => {
    // Dynamic greeting based on current hours
    const currentHour = new Date().getHours()
    const greetingText = currentHour < 12 ? "Good Morning!" : currentHour < 18 ? "Good Afternoon!" : "Good Evening!"

    return (
        <div className="w-full space-y-8 p-1">
            {/* ─── PREMIUM HEADER SECTION ─── */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border/50 pb-6">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="flex items-center justify-center h-5 w-5 rounded-md bg-accent/10 text-accent">
                            <Sparkles className="h-3 w-3 fill-accent" />
                        </span>
                        <span className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-foreground/40">
                            Management Overview
                        </span>
                    </div>
                    <h1 className="text-primary text-2xl md:text-3xl font-extrabold tracking-tight leading-none mt-1.5">
                        {greetingText} <span className="text-foreground/90 font-medium">GiftNowMart</span>
                    </h1>
                    <p className="text-xs text-foreground/50 mt-1 font-medium">
                        Here is an analytical breakdown of today's commercial activities.
                    </p>
                </div>

                {/* Live Tracking Status Badge */}
                <div className="flex items-center gap-2 self-start md:self-auto bg-muted/50 border border-border/80 rounded-xl px-3 py-2 shadow-sm">
                    <Calendar className="h-3.5 w-3.5 text-foreground/40" />
                    <span className="text-xs font-semibold text-foreground/70">
                        {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse ml-1" />
                    <span className="text-[10px] font-bold text-success uppercase tracking-wider">Live</span>
                </div>
            </div>

            {/* ─── ANALYTICS INSIGHTS GRID ─── */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
                {metricsConfig.map((metric, idx) => {
                    const IconComponent = metric.icon

                    return (
                        <motion.div
                            key={idx}

                            whileHover={{ y: -3, transition: { duration: 0.15 } }}
                            className="relative overflow-hidden bg-card border border-border/70 rounded-2xl p-5 shadow-[0_2px_12px_-3px_rgba(11,46,132,0.04)] hover:shadow-[0_8px_24px_-6px_rgba(11,46,132,0.08)] hover:border-primary/20 transition-all duration-200 group"
                        >
                            {/* Accent Top Decorative Light Layer */}
                            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-foreground/40 tracking-wide uppercase">
                                        {metric.title}
                                    </p>
                                    <h3 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                                        {metric.value}
                                    </h3>
                                </div>

                                {/* Component Context Icon Badge */}
                                <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${metric.colorClass} shadow-sm transition-transform group-hover:scale-105`}>
                                    <IconComponent className="h-5 w-5" />
                                </div>
                            </div>

                            {/* Micro-Trend Meta Data Footer */}
                            <div className="mt-5 flex items-center justify-between border-t border-border/30 pt-3">
                                <div className="flex items-center gap-1.5">
                                    <span className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-bold ${metric.isPositive
                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50"
                                        : "bg-rose-50 text-rose-700 border border-rose-200/50"
                                        }`}>
                                        <TrendingUp className={`h-2.5 w-2.5 ${!metric.isPositive && "rotate-180"}`} />
                                        {metric.change}
                                    </span>
                                    <span className="text-[10px] font-medium text-foreground/35">
                                        vs. yesterday
                                    </span>
                                </div>

                                <button className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 text-[10px] font-bold text-primary hover:text-primary-blue transition-all duration-150 transform translate-x-1 group-hover:translate-x-0">
                                    View details
                                    <ArrowUpRight className="h-3 w-3" />
                                </button>
                            </div>
                        </motion.div>
                    )
                })}
            </motion.div>
        </div>
    )
}

export default Dashboard