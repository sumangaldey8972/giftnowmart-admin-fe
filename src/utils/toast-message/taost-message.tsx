"use client";

import { toast } from "sonner";
import {
    CircleX,
    Loader,
    BadgeCheck,
    BadgeX,
    BadgeAlert,
    BadgeInfo,
    BadgeQuestionMark,
} from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info" | "loading";
type ToastPosition =
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";

interface ToastOptions {
    position?: ToastPosition;
    duration?: number;
    description?: string;
}

const ToastIcon = ({ type }: { type: ToastType }) => {
    const iconProps = { className: "w-5 h-5" };

    switch (type) {
        case "success":
            return <BadgeCheck {...iconProps} />;
        case "error":
            return <BadgeX {...iconProps} />;
        case "warning":
            return <BadgeAlert {...iconProps} />;
        case "info":
            return <BadgeInfo {...iconProps} />;
        case "loading":
            return (
                <Loader
                    {...iconProps}
                    className={`${iconProps.className} animate-spin`}
                />
            );
        default:
            return <BadgeQuestionMark {...iconProps} />;
    }
};

const DEFAULT_DURATION = 4000;
const DEFAULT_POSITION: ToastPosition = "top-center";

const toastColors = {
    success: {
        bg: "bg-[#000000]",
        border: "border-[#89F034]",
        text: "text-[#c7c7c7]",
        icon: "text-[#89F034]",
    },
    error: {
        bg: "bg-[#000000]",
        border: "border-[#ff0000]",
        text: "text-[#c7c7c7]",
        icon: "text-[#ff0000]",
    },
    warning: {
        bg: "bg-[#000000]",
        border: "border-[#fff000]",
        text: "text-[#c7c7c7]",
        icon: "text-[#fff000]",
    },
    info: {
        bg: "bg-[#000000]",
        border: "border-[#000fff]",
        text: "text-[#c7c7c7]",
        icon: "text-[#000fff]",
    },
    loading: {
        bg: "bg-[#000000]",
        border: "border-gray-500",
        text: "text-[#c7c7c7]",
        icon: "text-gray-600",
    },
};

export const showToast = (
    type: ToastType,
    message: string,
    options?: ToastOptions
): string | number => {
    const { bg, border, text, icon } = toastColors[type];

    return toast.custom(
        (t) => (
            <div
                className={`${bg} ${border} w-full max-w-[300px] mx-auto border-l-[5px] rounded-lg shadow-md p-2`}
            >
                <div className={`flex items-start gap-2 w-full ${text}`}>
                    <span className={`mt-[1px] ${icon}`}>
                        <ToastIcon type={type} />
                    </span>
                    <div className="flex-1">
                        <p className="font-medium text-body4 font-jost">{message}</p>
                        {options?.description && (
                            <p className="text-sm mt-1 opacity-80 text-body5 font-jost">
                                {options.description}
                            </p>
                        )}
                    </div>
                    {options?.position !== "bottom-left" &&
                        options?.position !== "bottom-right" && (
                            <button
                                onClick={() => toast.dismiss(t)}
                                className="text-gray-400 hover:text-gray-600 mt-0.5 cursor-pointer"
                            >
                                <CircleX size={18} />
                            </button>
                        )}
                </div>
            </div>
        ),
        {
            duration: options?.duration || DEFAULT_DURATION,
            position: options?.position || DEFAULT_POSITION,
            style: { width: "100%" },
        }
    );
};

export const dismissToast = (id: string | number) => {
    toast.dismiss(id);
};

// Convenience methods
export const toastSuccess = (message: string, options?: ToastOptions) =>
    showToast("success", message, options);

export const toastError = (message: string, options?: ToastOptions) =>
    showToast("error", message, options);

export const toastWarning = (message: string, options?: ToastOptions) =>
    showToast("warning", message, options);

export const toastInfo = (message: string, options?: ToastOptions) =>
    showToast("info", message, options);

export const toastLoading = (message: string, options?: ToastOptions) =>
    showToast("loading", message, options);

export const toastUpdate = (
    id: string | number,
    type: Exclude<ToastType, "loading">,
    message: string,
    options?: ToastOptions
) => {
    dismissToast(id);
    return showToast(type, message, options);
};
