import * as React from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import { ThemeProvider } from "@saleor/macaw-ui";
import { IntlProvider } from "react-intl";
import { useFormattedMessages } from "@/frontend/hooks/useFormattedMessages";
import AppContainer from "@/frontend/components/elements/AppContainer";
import AppProvider from "@/frontend/components/elements/AppProvider";
import ClientProvider from "@/frontend/components/elements/ClientProvider";

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  console.log("App");

  const { locale, messages } = useFormattedMessages();

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, user-scalable=no"
        />
      </Head>
      <AppProvider>
        <ClientProvider>
          <IntlProvider
            locale={locale}
            messages={messages}
            onError={() => null} // Hide missing translation warnings
          >
            <ThemeProvider ssr={true}>
              <AppContainer>
                <Component {...pageProps} />
              </AppContainer>
            </ThemeProvider>
          </IntlProvider>
        </ClientProvider>
      </AppProvider>
    </>
  );
}
