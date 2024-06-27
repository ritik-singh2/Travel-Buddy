import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import { ToastContainer } from 'react-toastify';
import NavB from './auth/components/navB';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from 'next/navigation';
// import io from 'socket.io-client';

// const socket = io.connect("http://localhost:5001")
// const socket = io.connect("http://localhost:5000")
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Travel Buddy',
  description: 'Connect with nearby S.P.I.T students, share rides, and cut costs for eco-friendly commuting'
}


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <NavB />
          <ToastContainer />
          {children}
        </Providers>
      </body>
    </html>
  )
}
