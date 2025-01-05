import { AlertCircle } from "lucide-react"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { db } from "@/db";
import { Customers, Invoices } from "@/db/schemas";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, CreditCard } from "lucide-react";
import Link from "next/link";
import { createPayment, updateStatusWithoutRevalidating } from "@/app/actions";
import Stripe from "stripe";

interface InvoicePaymentProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ status: string, sessionId: string }>
}

const InvoicePaymentPage = async ({ params, searchParams }: InvoicePaymentProps) => {
    const stripe = new Stripe(String(process.env.STRIPE_SECRET_KEY));
    const { id: invoiceId } = await params;
    const sessionId = (await searchParams).sessionId;
    const isSuccess = (await searchParams).status == 'success';
    const isCancel = (await searchParams).status == 'cancel';
    let isError;

    if (isNaN(parseInt(invoiceId))) {
        throw new Error('Invalid Invoice Id');
    }

    if (isSuccess) {
        if (!sessionId) {
            isError = true;
        } else {
            const { payment_status } = await stripe.checkout.sessions.retrieve(sessionId);
            if (payment_status !== 'paid') isError = true;
        }

        if (!isError) {
            const formData = new FormData();
            formData.append('invoiceId', invoiceId);
            formData.append('status', 'paid');
            await updateStatusWithoutRevalidating(formData);
        }
    }

    // [...] -> get the first element of an array
    const [result] = await db.select({
        id: Invoices.id,
        value: Invoices.value,
        description: Invoices.description,
        status: Invoices.status,
        name: Customers.name,
        createTs: Invoices.createTs
    }).from(Invoices)
        .where(eq(Invoices.id, parseInt(invoiceId)))
        .innerJoin(Customers, eq(Invoices.customerId, Customers.id))

    if (!result) notFound();

    const invoice = {
        ...result,
        customer: {
            name: result.name
        }
    };

    return (
        <>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <Link href="/dashboard">Dashboard</Link>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <Link href={`/invoices/${invoice.id}`}>Invoice #{invoice.id}</Link>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Invoice Payment</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="mt-10">
                {
                    isCancel &&
                    <div className="bg-yellow-100 flex items-center gap-4 p-4 rounded-lg text-yellow-500">
                        <AlertCircle />
                        <p>Your payment was canceled. Please try again.</p>
                    </div>
                }
                {
                    isError &&
                    <div className="bg-red-100 flex items-center gap-4 p-4 rounded-lg text-red-500">
                        <AlertCircle />
                        <p>Something went wrong. Please try again.</p>
                    </div>
                }
            </div>
            <main className="mt-4 grid grid-cols-2">
                <div>
                    <div className="flex justify-between mb-8" >
                        <div className="flex items-center gap-4 text-3xl font-semibold">
                            Invoice #{invoice.id}
                            <Badge
                                className={cn(
                                    "rounded-full capitalize",
                                    invoice.status === "open" && "bg-blue-500",
                                    invoice.status === "paid" && "bg-green-600",
                                    invoice.status === "void" && "bg-zinc-700",
                                    invoice.status === "uncollectible" && "bg-red-600",
                                )}
                            >
                                {invoice.status}
                            </Badge>
                        </div>
                    </div>

                    <p className="text-3xl mb-3">${(invoice.value / 100).toFixed(2)}</p>

                    <p className="text-lg mb-8">{invoice.description}</p>

                    <h2 className="font-bold text-lg mb-4">Billing Details</h2>

                    <ul className="grid gap-2">
                        <li className="flex gap-4">
                            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
                                Invoice ID
                            </strong>
                            <span>{invoice.id}</span>
                        </li>
                        <li className="flex gap-4">
                            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
                                Invoice Date
                            </strong>
                            <span>{new Date(invoice.createTs).toISOString()}</span>
                        </li>
                        <li className="flex gap-4">
                            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
                                Billing Name
                            </strong>
                            <span>{invoice.customer.name}</span>
                        </li>
                    </ul>
                </div>
                <div>
                    <p className="font-medium mb-2 text-lg">Manage Invoice</p>
                    {invoice.status == 'open' &&
                        <form action={createPayment}>
                            <input name='id' value={invoice.id} type='hidden' />
                            <Button type="submit" className="bg-green-500 hover:bg-green-600">
                                <CreditCard />
                                Pay invoice
                            </Button>
                        </form>
                    }
                    {
                        invoice.status == 'paid' &&
                        <p className="font-medium flex items-center gap-2 text-lg">
                            <Check className="bg-green-500 text-white rounded-full p-1" /> Invoice paid
                        </p>
                    }
                </div>
            </main>
        </>
    )
}

export default InvoicePaymentPage;

