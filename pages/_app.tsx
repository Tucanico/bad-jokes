import "bootstrap/dist/css/bootstrap.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import "../styles/global.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/Media/icon.PNG" sizes="any" />
        <title>Very Bad Jokes</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
