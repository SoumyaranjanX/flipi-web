// import Products from "@/components/PagesComponent/Products/Products"
import Products from "@/components/PagesComponent/Products/Products"
import SEO from "@/components/SEO/SEO.jsx"


export const metadata = {
    title: process.env.NEXT_PUBLIC_META_TITLE,
    description: process.env.NEXT_PUBLIC_META_DESCRIPTION,
    keywords: process.env.NEXT_PUBLIC_META_kEYWORDS,
    openGraph: {
        title: process.env.NEXT_PUBLIC_META_TITLE,
        description: process.env.NEXT_PUBLIC_META_DESCRIPTION,
        keywords: process.env.NEXT_PUBLIC_META_kEYWORDS,
      },
}
const ProductsPage = () => {

    return (
        <>
        {/* <SEO /> */}
        <Products />
        </>
    )
}

export default ProductsPage