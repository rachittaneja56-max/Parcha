import { NextResponse } from "next/server";

export async function POST() {
  const isProd = process.env.NODE_ENV === "production";
  const secure = isProd ? "Secure; " : "";

  const response = NextResponse.json({ success: true });
  response.headers.set(
    "Set-Cookie",
    `parcha_session=; HttpOnly; ${secure}Path=/; Max-Age=0; SameSite=Lax`
  );
  return response;
}
