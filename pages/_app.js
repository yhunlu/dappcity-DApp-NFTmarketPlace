import Link from 'next/link';
import Navbar from '../components/Navbar';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <div className="min-h-screen">
      <div className="border-b p-0">
        <Navbar />
      </div>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
