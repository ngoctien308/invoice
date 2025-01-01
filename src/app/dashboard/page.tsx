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
import { Invoices } from "@/db/schemas";
import { cn } from "@/lib/utils";
import { CirclePlus } from "lucide-react";
import Link from "next/link";

const DashboardPage = async () => {
    const invoices = await db.select().from(Invoices);
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
                        total += invoice.value / 100;

                        return <TableRow key={invoice.id}>
                            <TableCell className="py-4"><Link href={`/invoices/${invoice.id}`} className="font-medium py-4"> {invoice.createTs.toLocaleDateString()}</Link></TableCell>
                            <TableCell className="py-4"><Link href={`/invoices/${invoice.id}`} className="font-medium py-4">Pham Ngoc Tien</Link></TableCell>
                            <TableCell className="py-4"><Link href={`/invoices/${invoice.id}`} className="font-medium py-4">ngoctien30804@gmail.com</Link></TableCell>
                            <TableCell className="py-4">
                                <Link href={`/invoices/${invoice.id}`}>
                                    <Badge className={cn(
                                        'capitalize',
                                        invoice.status == 'open' && 'bg-blue-500',
                                        invoice.status == 'paid' && 'bg-green-600',
                                        invoice.status == 'void' && 'bg-zinc-700',
                                        invoice.status == 'uncollectible' && 'bg-red-600',
                                    )}>{invoice.status}</Badge>
                                </Link>
                            </TableCell>
                            <TableCell className="text-right"><Link href={`/invoices/${invoice.id}`} className="font-medium py-4">{(invoice.value / 100).toFixed(2)}</Link></TableCell>
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
