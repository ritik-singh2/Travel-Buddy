// pages/_app.js
import store from '@/redux/store';
import { ChakraProvider } from '@chakra-ui/react'
import { Provider } from "react-redux";
// import io from 'socket.io-client';

// const socket = io.connect("http://localhost:5001")
// const socket = io.connect("http://localhost:5000")

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
    </Provider>
  )
}

export default MyApp;