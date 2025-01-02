import { Button } from '@/components/ui/button';
import {
    OrganizationSwitcher,
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton
} from '@clerk/nextjs';
import Link from 'next/link';

const Header = () => {
    return (
        <div className='border-b flex items-center justify-between py-4 my-4 gap-4'>
            <div className='flex gap-4 items-center'>
                <Link href='/dashboard'
                    className='font-bold tracking-widest text-gray-700 uppercase'
                >
                    Invoicing App
                </Link>
                <span className='text-gray-500'>/</span>
                <SignedIn>
                    <OrganizationSwitcher />
                </SignedIn>
            </div>

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

export default Header;
