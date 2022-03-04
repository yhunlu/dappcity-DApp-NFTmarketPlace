import { ToastContainer } from 'react-toastify';
import Navbar from '../components/Navbar';
import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <ToastContainer />
      <div className="min-h-screen">
        <div className="border-b p-0">
          <Navbar />
        </div>
        <Component {...pageProps} />
      </div>
    </>
  );
}

export default MyApp;
