import { Button } from "@/components/ui/button"
import { LoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom"

const SubmitButton = () => {
    const { pending } = useFormStatus();

    return (
        <Button>{pending ? <LoaderCircle className="animate-spin" /> : 'Submit'}</Button>
    )
}

export default SubmitButton;