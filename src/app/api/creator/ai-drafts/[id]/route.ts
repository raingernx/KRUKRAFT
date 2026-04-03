import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Prisma } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { CreatorServiceError } from "@/services/creator";
import { updateCreatorResourceAIDraft } from "@/services/creator";

type Params = {
  params: Promise<{ id: string }>;
};

function handleCreatorError(error: unknown, label: string) {
  if (error instanceof CreatorServiceError) {
    return NextResponse.json(error.payload, { status: error.status });
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    console.error(label, error);
    return NextResponse.json(
      { error: "ยังไม่สามารถบันทึก AI draft ได้ชั่วคราว เพราะระบบฐานข้อมูลเชื่อมต่อไม่ได้" },
      { status: 503 },
    );
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    console.error(label, error);

    if (error.code === "P2021" || error.code === "P2022") {
      return NextResponse.json(
        {
          error:
            "ยังไม่สามารถบันทึก AI draft ได้ เพราะโครงสร้างฐานข้อมูลของฟีเจอร์นี้ยังไม่พร้อม",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { error: "บันทึก AI draft ไม่สำเร็จ เนื่องจากเกิดข้อผิดพลาดกับฐานข้อมูล" },
      { status: 500 },
    );
  }

  if (
    error instanceof Prisma.PrismaClientUnknownRequestError ||
    error instanceof Prisma.PrismaClientValidationError
  ) {
    console.error(label, error);
    return NextResponse.json(
      { error: "บันทึก AI draft ไม่สำเร็จ เนื่องจากเกิดข้อผิดพลาดกับฐานข้อมูล" },
      { status: 500 },
    );
  }

  console.error(label, error);
  return NextResponse.json(
    { error: "บันทึก AI draft ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง" },
    { status: 500 },
  );
}

export async function PATCH(req: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "กรุณาเข้าสู่ระบบก่อนใช้งาน" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const payload = await updateCreatorResourceAIDraft(session.user.id, {
      ...body,
      resourceId: id,
    });

    return NextResponse.json({ data: payload });
  } catch (error) {
    return handleCreatorError(error, "[CREATOR_AI_DRAFTS_PATCH]");
  }
}
