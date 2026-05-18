import apiClient from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/lib/config/apiConfig";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const refreshToken = (await cookies()).get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: "No refresh token found" },
        { status: 401 }
      );
    }

    const backendRes = await apiClient.post(API_ENDPOINTS.auth.refresh, {
      refreshToken,
    });

    const { accessToken, refreshToken: newRefreshToken } = backendRes.data;

    const res = NextResponse.json({ accessToken });

    // Update accessToken cookie
    res.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 1,
    });

    // Update refreshToken cookie too (if returned)
    if (newRefreshToken) {
      res.cookies.set("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 5,
      });
    }

    return res;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Refresh API Route Error:", err.message);
    } else {
      console.error("Refresh API Route Error:", err);
    }
    return NextResponse.json({ error: "Refresh failed" }, { status: 401 });
  }
}
