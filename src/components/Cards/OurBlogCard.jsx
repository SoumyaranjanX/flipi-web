'use client'
import Image from 'next/image'
import Link from 'next/link'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6'
import { placeholderImage, t, useIsRtl } from '@/utils'

const OurBlogCard = ({ data }) => {

    const isRtl = useIsRtl();

    return (

        <div className='ourblog_card'>
            <Image src={data?.image} width={388} height={200} alt={data?.title} className='blog_card_img' onErrorCapture={placeholderImage} />
            <h5 className='ourblog_card_title'>
                {data?.title}
            </h5>
            <div className='ourblog_card_desc' dangerouslySetInnerHTML={{ __html: data?.description }} />
            <Link href={`/blogs/${data?.slug}`} className='read_article' >
                <span>
                    {t('readArticle')}
                </span>
                <span> {isRtl ? (
                    <FaArrowLeft size={20} className='read_icon' />
                ) : (
                    <FaArrowRight size={20} className='read_icon' />
                )}</span>
            </Link>
        </div>

    )
}

export default OurBlogCard