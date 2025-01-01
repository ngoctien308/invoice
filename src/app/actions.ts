'use server';

import { db } from "@/db";
import { Invoices } from "@/db/schemas";
import { redirect } from "next/navigation";

export const createInvoice = async(formData: FormData) => {
    // ví dụ người dùng nhập 1234,5678 -> sẽ lưu vào db dưới dạng 123456,
    // khi sử dụng sẽ chia lại cho 100 thành 1234,56
    const value = Math.floor(parseFloat(String(formData.get('value'))) * 100);
    const description = String(formData.get('description'));

    const results = await db.insert(Invoices).values({
        value, description, status: 'open'
    }).returning({ id: Invoices.id });

    redirect(`/invoices/${results[0].id}`);
}