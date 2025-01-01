const Footer = () => {
    return (
        <footer className="font-light text-center my-8 text-sm flex justify-between">
            <p>Invoicing App: &copy; {new Date().getFullYear()}</p>
            <p>Created by Pham Ngoc Tien with Next.js, Xata, Clerk, Drizzle</p>
        </footer>
    )
}

export default Footer
