import apiClient from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/lib/config/apiConfig";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    try {
        const payload = await req.json();

        const backendRes = await apiClient.post(API_ENDPOINTS.product.update, payload);

        if (!backendRes?.data) {
            return NextResponse.json(backendRes.data);
        }

        return NextResponse.json(backendRes.data, {
            status: backendRes.data.statusCode,
        });
    } catch (error) {
        return NextResponse.json(
            { error: "product updation failed." },
            { status: 500 }
        );
    }
}
