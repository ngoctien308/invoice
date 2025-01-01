import { Button } from '@/components/ui/button';
import {
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton
} from '@clerk/nextjs';
import Link from 'next/link';

const Header = () => {
    return (
        <div className='border-b flex items-center justify-between py-4 my-4 gap-4'>
            <Link href='/dashboard' className='font-bold tracking-widest text-gray-700 uppercase'>Invoicing App</Link>
            <SignedOut>
                <Button asChild>
                    <SignInButton />
                </Button>
            </SignedOut>
            <SignedIn>
                <UserButton />
            </SignedIn>
        </div>
    )
}

export default Header
