import Link from 'next/link';
import { Twitter, Github, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-4 text-center text-sm text-gray-600">
      <div className="flex justify-center space-x-4">
        <Link href="https://x.com/xiaokedada" className="hover:text-gray-900 flex items-center">
          <Twitter className="w-4 h-4 mr-1" />
          <span>Twitter</span>
        </Link>
        <Link href="https://github.com/maoxiaoke/ascii-image" className="hover:text-gray-900 flex items-center">
          <Github className="w-4 h-4 mr-1" />
          <span>Source Code</span>
        </Link>
        <Link href="https://nazha.co" className="hover:text-gray-900 flex items-center">
          <Globe className="w-4 h-4 mr-1" />
          <span>Blog</span>
        </Link>
      </div>
      <div className="mt-2">
        © {new Date().getFullYear()} nazha.co. All rights reserved.
      </div>
    </footer>
  );
}
