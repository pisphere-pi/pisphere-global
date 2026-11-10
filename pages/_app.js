import '../styles/globals.css';
import { useEffect } from 'react';
import { initPiNetwork } from '../lib/piConfig';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    initPiNetwork();
  }, []);

  return <Component {...pageProps} />;
}
