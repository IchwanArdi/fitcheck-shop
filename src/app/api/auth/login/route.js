import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST /api/auth/login
// Body: { email, password }
export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Cari user di database berdasarkan email yang dikirim Postman/Form
    const user = await prisma.user.findUnique({
      where: { email: email }
    });

    // Jika user tidak ditemukan, atau password-nya salah
    if (!user || user.password !== password) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Pastikan perannya adalah admin agar sesuai dengan kebutuhan halaman admin
    if (user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized access: Admin only" },
        { status: 403 }
      );
    }

    // Jika sukses, siapkan response JSON yang cocok dengan Postman
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        email: user.email,
        name: user.name || "Admin FITCHECK", // Mengambil nama dari DB, jika kosong pakai fallback
        role: user.role
      }
    });

    // Set session cookie untuk dibaca oleh proxy Next.js Anda
    // Catatan: Untuk keamanan produksi, disarankan mengubah httpOnly menjadi true
    response.cookies.set("admin_session", "authenticated", {
      path: "/",
      maxAge: 86400,
      sameSite: "strict",
      httpOnly: false
    });

    return response;

  } catch (error) {
    console.error("Error in login API:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}