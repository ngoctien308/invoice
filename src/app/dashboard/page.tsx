import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { db } from "@/db";
import { Customers, Invoices } from "@/db/schemas";
import { cn } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { CirclePlus } from "lucide-react";
import Link from "next/link";

const DashboardPage = async () => {
    const { userId } = await auth();
    if (!userId) return;
    const invoices = await db
        .select()
        .from(Invoices)
        .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
        .where(eq(Invoices.userId, userId));
    let total = 0;

    return (
        <main className="mt-12">
            <div className="flex justify-between items-center mb-4">
                <p className="text-3xl font-bold">Invoices</p>
                <Link href='/invoices/new'>
                    <Button variant='ghost'>
                        <CirclePlus /> Create new invoice
                    </Button>
                </Link>
            </div>
            <Table>
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Value</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {invoices.map(invoice => {
                        total += invoice.invoices.value / 100;

                        return <TableRow key={invoice.invoices.id}>
                            <TableCell className="py-4"><Link href={`/invoices/${invoice.invoices.id}`} className="font-medium py-4"> {invoice.invoices.createTs.toLocaleDateString()}</Link></TableCell>
                            <TableCell className="py-4"><Link href={`/invoices/${invoice.invoices.id}`} className="font-medium py-4">{invoice.customers.name}</Link></TableCell>
                            <TableCell className="py-4"><Link href={`/invoices/${invoice.invoices.id}`} className="font-medium py-4">{invoice.customers.email}</Link></TableCell>
                            <TableCell className="py-4">
                                <Link href={`/invoices/${invoice.invoices.id}`}>
                                    <Badge className={cn(
                                        'capitalize',
                                        invoice.invoices.status == 'open' && 'bg-blue-500',
                                        invoice.invoices.status == 'paid' && 'bg-green-600',
                                        invoice.invoices.status == 'void' && 'bg-zinc-700',
                                        invoice.invoices.status == 'uncollectible' && 'bg-red-600',
                                    )}>{invoice.invoices.status}</Badge>
                                </Link>
                            </TableCell>
                            <TableCell className="text-right"><Link href={`/invoices/${invoice.invoices.id}`} className="font-medium py-4">{(invoice.invoices.value / 100).toFixed(2)}</Link></TableCell>
                        </TableRow>
                    })}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell className="font-bold uppercase py-4" colSpan={4}>Total</TableCell>
                        <TableCell className="text-right font-bold py-4">${total.toFixed(2)}</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </main>
    )
}

export default DashboardPage;
