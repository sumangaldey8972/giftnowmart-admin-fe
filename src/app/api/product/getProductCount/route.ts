import apiClient from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/lib/config/apiConfig";
import { NextResponse } from "next/server";

export async function GET() {

    try {
        const backendRes = await apiClient.get(API_ENDPOINTS.product.getProductCount);

        if (!backendRes?.data?.data) {
            return NextResponse.json(backendRes.data);
        }

        return NextResponse.json(backendRes.data, {
            status: backendRes.data.statusCode,
        });
    } catch (error) {
        console.log("error while fetching product count", error)
        return NextResponse.json(
            { error: "product count fetching failed." },
            { status: 500 }
        );
    }
}
