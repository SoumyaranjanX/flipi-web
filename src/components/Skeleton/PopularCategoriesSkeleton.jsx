import React, { useRef, useState } from 'react';
import { RiArrowLeftLine, RiArrowRightLine } from 'react-icons/ri';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Swiper, SwiperSlide } from 'swiper/react';

const PopularCategoriesSkeleton = () => {

    const swiperRef = useRef()
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    const handleNextPage = () => {
        if (swiperRef?.current) swiperRef?.current?.slideNext();
    }

    const handlePrevPage = () => {

        if (swiperRef?.current) swiperRef?.current?.slidePrev();
    }

    const handleSlideChange = (swiper) => {
        setIsEnd(swiper?.isEnd);
        setIsBeginning(swiper?.isBeginning);
    }

    const breakpoints = {
        0: { slidesPerView: 1 },
        320: { slidesPerView: 2 },
        400: { slidesPerView: 3 },
        576: { slidesPerView: 4 },
        768: { slidesPerView: 5 },
        992: { slidesPerView: 7 },
        1200: { slidesPerView: 8 },
        1400: { slidesPerView: 9 }
    };

    return (
        <SkeletonTheme baseColor="lightgray" highlightColor="#e0e0e0">

            <div className="container">
                <div className="row pop_categ_mrg_btm top_space">
                    <div className="col-12">
                        <div className="pop_cat_header">
                            <h4 className="pop_cat_head">
                                <Skeleton width={125} />
                            </h4>
                        </div>
                    </div>
                </div>
                <div className="row pop_categ_mrg_btm">
                    <div className="col-12">
                        <div className="cate_skel">

                            {/* <Swiper
                                spaceBetween={30}
                                slidesPerView={9}
                                onSlideChange={handleSlideChange}
                                onSwiper={(swiper) => {
                                    swiperRef.current = swiper;
                                    setIsEnd(swiper?.isEnd);
                                    setIsBeginning(swiper?.isBeginning);
                                }}
                                breakpoints={breakpoints}
                            >

                            <SwiperSlide key={index}> */}
                            {Array.from({ length: 9 }, (_, index) => (
                                <Skeleton key={index} height={120} width={120} style={{ borderRadius: '100%' }} />
                               
                            ))}
                            {/* </SwiperSlide>
                            </Swiper> */}
                        </div>
                    </div>
                </div>
            </div>
        </SkeletonTheme>
    );
};

export default PopularCategoriesSkeleton;