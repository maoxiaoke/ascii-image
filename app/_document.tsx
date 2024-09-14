import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
        {/* Cloudflare Web Analytics */}
        <script
          defer
          src='https://static.cloudflareinsights.com/beacon.min.js'
          data-cf-beacon='{"token": "4013e57b5e5745d0b0b0507ef5a98a33"}'
        />
        {/* End Cloudflare Web Analytics */}
      </body>
    </Html>
  )
}
