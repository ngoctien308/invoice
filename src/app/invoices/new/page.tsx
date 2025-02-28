'use client';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { createInvoice } from "@/app/actions"
import SubmitButton from "@/components/SubmitButton"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link";

const CreateInvoicePage = () => {
    return (
        <>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <Link href="/dashboard">Dashboard</Link>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Create invoice</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="mt-10">
                <h1 className='font-medium mb-2 text-2xl '>Create Invoice</h1>
                <form className='max-w-sm'
                    action={createInvoice}
                >
                    <div className="mb-2">
                        <Label htmlFor="name">Billing Name</Label>
                        <Input id='name' name='name' placeholder="Billing name" />
                    </div>
                    <div className="mb-2">
                        <Label htmlFor="email">Billing Email</Label>
                        <Input id='email' type="email" name='email' placeholder="Billing email" />
                    </div>
                    <div className="mb-2">
                        <Label htmlFor="value">Value</Label>
                        <Input id='value' placeholder="Value" name='value' />
                    </div>
                    <div className="mb-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id='description' name='description' placeholder="Description" />
                    </div>
                    <SubmitButton />
                </form>
            </div></>
    )
}

export default CreateInvoicePage
