import { Html, Head, Main, NextScript } from 'next/document'

// _document is used for applying global metadata
// like description, keywords and the favicon.
const Document = () => {
    return (
        <Html>
            <Head>
                <link rel="shortcut icon" href="/favicon.png" />
                <meta name="description" content="A very small & anonymous chat application" />
                <meta name="keywords" content="chat, anonymous, small, blue, quartz, jkbgl, jakatebel, private, no logs, free, lightweight, memory only ..." />
                <meta name="theme-color" content="#33B9EC" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
};

export default Document;