import { AuthProvider } from '../context/AuthContext';
import { JobsProvider } from '../context/JobsContext';
import type { AppProps } from 'next/app';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <JobsProvider>
        <Component {...pageProps} />
      </JobsProvider>
    </AuthProvider>
  );
}

export default MyApp;