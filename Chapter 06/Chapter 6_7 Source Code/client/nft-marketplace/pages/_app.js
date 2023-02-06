import '../styles/globals.css'
import Link from 'next/link'

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <nav className="border-b p-6 bg-black">
        <div className="flex items-center flex-shrink-0 text-white mr-6">
          <span className="font-semibold text-xl tracking-tight">NFT Marketplace</span>
          <Link href="/" passHref>
            <button className="h-10 px-6 m-1 font-semibold rounded-full bg-violet-600 text-white inline-block text-sm px-4 py-2">
              Home
            </button>
          </Link>

          <Link href="/create-and-list-nft" passHref>
            <button className="h-10 px-6 m-1 font-semibold rounded-full bg-violet-600 text-white inline-block text-sm px-4 py-2">
              Sell an NFT
            </button>
          </Link>

          <Link href="/my-nfts" passHref>
            <button className="h-10 px-6 m-1 font-semibold rounded-full bg-violet-600 text-white inline-block text-sm px-4 py-2">
              My NFTs
            </button>
          </Link>

          <Link href="/my-listed-nfts" passHref>
            <button className="h-10 px-6 m-1 font-semibold rounded-full bg-violet-600 text-white inline-block text-sm px-4 py-2">
              Mint and List NFT
            </button>
          </Link>

        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
