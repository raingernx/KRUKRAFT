import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Prisma } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import {
  CreatorServiceError,
  createCreatorResourceDraft,
} from "@/services/creator";

function handleCreatorError(error: unknown, label: string) {
  if (error instanceof CreatorServiceError) {
    return NextResponse.json(error.payload, { status: error.status });
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    console.error(label, error);
    return NextResponse.json(
      { error: "ยังไม่สามารถสร้างฉบับร่างได้ชั่วคราว เพราะระบบฐานข้อมูลเชื่อมต่อไม่ได้" },
      { status: 503 },
    );
  }

  console.error(label, error);
  return NextResponse.json(
    { error: "สร้างฉบับร่างไม่สำเร็จ กรุณาลองใหม่อีกครั้ง" },
    { status: 500 },
  );
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "กรุณาเข้าสู่ระบบก่อนใช้งาน" }, { status: 401 });
    }

    const resource = await createCreatorResourceDraft(session.user.id);
    return NextResponse.json({ id: resource.id }, { status: 201 });
  } catch (error) {
    return handleCreatorError(error, "[CREATOR_RESOURCES_DRAFT_POST]");
  }
}
