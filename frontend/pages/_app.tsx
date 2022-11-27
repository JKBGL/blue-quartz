import '../components/style.scss'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

// default required export
export default function MyApp({ Component, pageProps }) {
    return <Component {...pageProps} />
}