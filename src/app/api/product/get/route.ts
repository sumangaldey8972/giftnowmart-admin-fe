import apiClient from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/lib/config/apiConfig";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") ?? "1";
    const limit = searchParams.get("limit") ?? "10";
    const search = searchParams.get("search") ?? "";


    try {
        const backendRes = await apiClient.get(API_ENDPOINTS.product.getProductList(page, limit, search));

        if (!backendRes?.data?.data) {
            return NextResponse.json(backendRes.data);
        }

        return NextResponse.json(backendRes.data, {
            status: backendRes.data.statusCode,
        });
    } catch (error) {
        console.log("error while fetching product list list", error)
        return NextResponse.json(
            { error: "product list list fetching failed." },
            { status: 500 }
        );
    }
}
