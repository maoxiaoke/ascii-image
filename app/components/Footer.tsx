import Link from 'next/link';
import { Twitter, Github, Globe } from 'lucide-react';
import { Dock, DockIcon } from './ui/dock';

export default function Footer() {
  return (
    <footer className="py-4 text-center text-sm text-gray-600">
      <Dock>
          <DockIcon>
        <Link href="https://x.com/xiaokedada">

            <Twitter className="w-8 h-8 text-blue-400" />
        </Link>

          </DockIcon>
          <DockIcon>
        <Link href="https://github.com/maoxiaoke/ascii-image">

            <Github className="w-8 h-8 text-gray-800" />
            </Link>
          </DockIcon>
          <DockIcon>
        <Link href="https://nazha.co">
            <Globe className="w-8 h-8 text-green-500" />
            </Link>
          </DockIcon>
       
      </Dock>
      <div className="mt-4">
        © {new Date().getFullYear()} nazha.co. All rights reserved.
      </div>
    </footer>
  );
}
