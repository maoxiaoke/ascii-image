import { AsciiArtGenerator } from './components/ascii-art-generator';
import Footer from './components/Footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="mt-48">
        <AsciiArtGenerator />
      </main>
      <Footer />
    </div>
  );
}
