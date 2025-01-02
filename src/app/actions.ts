'use server';

import { db } from "@/db";
import { Customers, Invoices, Status } from "@/db/schemas";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const createInvoice = async(formData: FormData) => {
    const { userId } = await auth();
    if(!userId) return;
    
    // ví dụ người dùng nhập 1234,5678 -> sẽ lưu vào db dưới dạng 123456,
    // khi sử dụng sẽ chia lại cho 100 thành 1234,56
    const value = Math.floor(parseFloat(String(formData.get('value'))) * 100);
    const description = String(formData.get('description'));  
    const name = String(formData.get('name'));  
    const email = String(formData.get('email'));  

    const [customer] = await db.insert(Customers).values({
        email,name,userId
    }).returning({ id: Customers.id })

    const results = await db.insert(Invoices).values({
        value, description, userId, customerId: customer.id
    }).returning({ id: Invoices.id });

    redirect(`/invoices/${results[0].id}`);
}

export const updateStatus = async(formData: FormData) => {
    const { userId } = await auth();
    if(!userId) return;

    const invoiceId = formData.get('invoiceId') as string;
    const status = formData.get('status') as Status;
    await db.update(Invoices).set({status}).where(and(
        eq(Invoices.userId, userId), 
        eq(Invoices.id, parseInt(invoiceId))
    ))

    revalidatePath(`/invoices/${invoiceId}`, 'page');
}

export const deleteInvoice = async (formData: FormData) => {
    const { userId } = await auth();
    if(!userId) return;

    const invoiceId = formData.get('invoiceId') as string;
    await db.delete(Invoices).where(and(
        eq(Invoices.userId, userId),
        eq(Invoices.id, parseInt(invoiceId))
    ))

    redirect('/dashboard');
}