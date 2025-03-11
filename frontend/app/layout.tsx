'use client'; // Esto es necesario para usar el Provider en el cliente

import { Provider } from 'react-redux';
import store from '../store';  // Asegúrate de que la ruta sea correcta para tu store
import Head from 'next/head';  // Importa Head de Next.js para evitar errores de hidratación

// Layout que envuelve tu aplicación con el Provider de Redux
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Mi aplicación</title>
      </Head>
      <html lang="es"> 
        <body>
          <Provider store={store}>
            {children}
          </Provider>
        </body>
      </html>
    </>
  );
}
