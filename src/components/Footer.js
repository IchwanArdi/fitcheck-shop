import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black/20 backdrop-blur-md text-white py-12 px-4 md:px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg tracking-tighter">FITCHECK</span>
          </div>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Fitcheck, Inc. All rights reserved.
          </p>
        </div>
        
        <div className="flex gap-8 text-sm text-gray-400">
          <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>
        </div>
      </div>
    </footer>
  );
}
