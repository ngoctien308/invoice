'use client';
import { deleteInvoice, updateStatus } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AVAILABLE_STATUSES } from "@/data/invoices";
import { Customers, Invoices } from "@/db/schemas";
import { cn } from "@/lib/utils";
import { CreditCard, Ellipsis, Trash } from "lucide-react";
import Link from "next/link";
import { useOptimistic } from "react";

interface InvoiceProps {
    invoice: typeof Invoices.$inferSelect & { customer: typeof Customers.$inferSelect }
}

const Invoice = ({ invoice }: InvoiceProps) => {
    const [currentStatus, setCurrentStatus] = useOptimistic(
        invoice.status,
        (currentState, optimisticValue) => String(optimisticValue));

    const handleUpdateStatus = async (formData: FormData) => {
        const originalStatus = currentStatus;
        setCurrentStatus(formData.get('status'));
        try {
            await updateStatus(formData);
        } catch (error) {
            setCurrentStatus(originalStatus);
        }
    };

    return (
        <main className="mt-10">
            <div className="flex justify-between mb-8" >
                <div className="flex items-center gap-4 text-3xl font-semibold">
                    Invoice #{invoice.id}
                    <Badge
                        className={cn(
                            "rounded-full capitalize",
                            currentStatus === "open" && "bg-blue-500",
                            currentStatus === "paid" && "bg-green-600",
                            currentStatus === "void" && "bg-zinc-700",
                            currentStatus === "uncollectible" && "bg-red-600",
                        )}
                    >
                        {currentStatus}
                    </Badge>
                </div>
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">Change Status</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {AVAILABLE_STATUSES.map((el) =>
                                <DropdownMenuCheckboxItem
                                    checked={invoice.status == el.id}
                                    key={el.id}>
                                    <form action={handleUpdateStatus}>
                                        <input type='hidden' name='invoiceId' value={invoice.id} />
                                        <input type="hidden" name='status' value={el.id} />
                                        <button type="submit">{el.label}</button>
                                    </form>
                                </DropdownMenuCheckboxItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Dialog>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline"><Ellipsis /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DialogTrigger asChild>
                                    <DropdownMenuItem>
                                        <Trash /><button>Delete invoice</button>
                                    </DropdownMenuItem>
                                </DialogTrigger>
                                <DropdownMenuItem>
                                    <Link className="flex items-center gap-2" href={`/invoices/${invoice.id}/payment`}>
                                        <CreditCard className="w-4" />Payment
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <DialogContent>
                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                            <DialogDescription>
                                This action cannot be undone. This will permanently delete your invoice and remove your data from our server.
                            </DialogDescription>
                            <DialogFooter>
                                <form action={deleteInvoice}>
                                    <input type="hidden" name='invoiceId' value={invoice.id} />
                                    <Button variant='destructive' type='submit'>Delete</Button>
                                </form>
                                <DialogClose asChild>
                                    <Button type="button" variant='ghost'>
                                        Close
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
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
                <li className="flex gap-4">
                    <strong className="block w-28 flex-shrink-0 font-medium text-sm">
                        Billing Email
                    </strong>
                    <span>{invoice.customer.email}</span>
                </li>
            </ul>
        </main>
    )
}

export default Invoice
