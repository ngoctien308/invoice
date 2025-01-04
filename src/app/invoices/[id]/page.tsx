import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Invoice from "@/components/Invoice";
import { db } from "@/db";
import { Customers, Invoices } from "@/db/schemas";
import { auth } from "@clerk/nextjs/server";
import { and, eq, isNull } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";

const InvoicePage = async ({ params }: { params: { id: string } }) => {
    const { id: invoiceId } = await params;
    const { userId, orgId } = await auth();

    if (!userId) return;

    if (isNaN(parseInt(invoiceId))) {
        throw new Error('Invalid Invoice Id');
    }
    let result;

    if (orgId) {
        // [...] -> get the first element of an array
        [result] = await db.select().from(Invoices).where(and(
            eq(Invoices.id, parseInt(invoiceId)),
            eq(Invoices.organizationId, orgId)
        )).innerJoin(Customers, eq(Invoices.customerId, Customers.id))

    } else {
        // [...] -> get the first element of an array
        [result] = await db.select().from(Invoices).where(and(
            eq(Invoices.id, parseInt(invoiceId)),
            eq(Invoices.userId, userId),
            isNull(Invoices.organizationId)
        )).innerJoin(Customers, eq(Invoices.customerId, Customers.id))
    }

    if (!result) notFound();

    const invoice = {
        ...result.invoices,
        customer: result.customers
    }

    return (
        <>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <Link href="/dashboard">Dashboard</Link>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Invoice #{invoiceId}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <Invoice invoice={invoice} />
        </>
    )
}

export default InvoicePage;
