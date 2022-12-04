import '../components/style.scss';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

// We use _app here to add stylesheets
// and apply configs for the entire app.
export default function MyApp({ Component, pageProps }) {
    return <Component {...pageProps} />;
}