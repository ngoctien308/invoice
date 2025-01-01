'use server';

import { db } from "@/db";
import { Invoices, Status } from "@/db/schemas";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const createInvoice = async(formData: FormData) => {
    // ví dụ người dùng nhập 1234,5678 -> sẽ lưu vào db dưới dạng 123456,
    // khi sử dụng sẽ chia lại cho 100 thành 1234,56
    const value = Math.floor(parseFloat(String(formData.get('value'))) * 100);
    const description = String(formData.get('description'));  
    const { userId } = await auth();

    if(!userId) return;
    
    const results = await db.insert(Invoices).values({
        value, description, userId, status: 'open'
    }).returning({ id: Invoices.id });

    redirect(`/invoices/${results[0].id}`);
}

export const updateStatus = async(formData: FormData) => {
    const { userId } = await auth();
    if(!userId) return;

    const invoiceId = formData.get('invoiceId') as string;
    const status = formData.get('status') as Status;
    await db.update(Invoices).set({status}).where(and(eq(Invoices.userId, userId), eq(Invoices.id, parseInt(invoiceId)) ))

    revalidatePath(`/invoices/${invoiceId}`, 'page');
}