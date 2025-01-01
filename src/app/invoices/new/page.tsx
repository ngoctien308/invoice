'use client';
import { createInvoice } from "@/app/actions"
import SubmitButton from "@/components/SubmitButton"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const CreateInvoicePage = () => {
    return (
        <div className="mt-12">
            <h1 className='font-bold text-3xl'>Create Invoice</h1>
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
        </div>
    )
}

export default CreateInvoicePage
