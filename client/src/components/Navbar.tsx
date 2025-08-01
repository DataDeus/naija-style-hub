import { Link } from "wouter";

export default function Navbar() {
  return (
    <nav className="bg-primary text-primary-foreground py-4 px-6">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Razor Sharp Fashion
        </Link>
        <div className="flex space-x-4">
          <Link href="/" className="hover:underline">
            Home
          </Link>
        </div>
      </div>
    </nav>
  );
}