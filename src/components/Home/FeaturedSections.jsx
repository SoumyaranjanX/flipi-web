'use client';
import ProductCard from "../Cards/ProductCard";
import { t } from "@/utils";
import FeaturedSectionsSkeleton from "../Skeleton/FeaturedSectionsSkeleton";
import Link from "next/link";
import { userSignUpData } from "@/redux/reuducer/authSlice";
import { useSelector } from "react-redux";
import NoData from "../NoDataFound/NoDataFound";
import { allItemApi } from "@/utils/api";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { settingsData } from "@/redux/reuducer/settingSlice";

const FeaturedSections = ({ isLoading, featuredData, setFeaturedData, cityData }) => {
    const userData = useSelector(userSignUpData);
    const [AllItemData, setAllItemData] = useState([])
    const [allItemLoading, setAllItemLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const systemSettingsData = useSelector(settingsData)
    const settings = systemSettingsData?.data
    const isDemoMode = settings?.demo_mode

    // Check if all section_data arrays are empty
    const allEmpty = featuredData?.every(ele => ele?.section_data.length === 0);

    const getAllItemData = async () => {
        try {
            setAllItemLoading(true);

            const response = await allItemApi.getItems({
                page,
                city: !isDemoMode ? cityData?.city : '',
                state: !isDemoMode ? cityData?.state : '',
                country: !isDemoMode ? cityData?.country : ''
            });
            if (response?.data?.data?.data.length > 0) {
                const data = response?.data?.data?.data;
                const currentPage = response?.data?.data?.current_page;
                const lastPage = response?.data?.data?.last_page;
                setAllItemData(prevData => [...prevData, ...data]);
                setHasMore(currentPage < lastPage);
            }
            else{
                setAllItemData([])
            }

        } catch (error) {
            console.error("Error:", error);
        } finally {
            setAllItemLoading(false);
        }
    };

    useEffect(() => {
        getAllItemData()
    }, [page, cityData])


    const handleLike = (id) => {
        const updatedData = featuredData.map(section => {
            const updatedSectionData = section.section_data.map(item => {
                if (item.id === id) {
                    return { ...item, is_liked: !item.is_liked };
                }
                return item;
            });
            return { ...section, section_data: updatedSectionData };
        });
        setFeaturedData(updatedData);
    };

    const handleLikeAllData = (id) => {
        const updatedItems = AllItemData.map((item) => {
            if (item.id === id) {
                return { ...item, is_liked: !item.is_liked };
            }
            return item;
        });
        setAllItemData(updatedItems);
    }

    const fetchMoreData = () => {
        setPage(prevPage => prevPage + 1);
    };

    const AllItemLoader = () => {
        return <div className="loader"></div>
    }

    return (
        isLoading ? (

            <FeaturedSectionsSkeleton />

        ) : (
            <div className="container">
                <div className="row product_card_card_gap">
                    <div className="col-12 p-0">

                        <div className="all_sections">
                            {featuredData && !allEmpty ? (
                                featuredData.map((ele, index) => (
                                    ele?.section_data.length > 0 && (
                                        <div className="main_featured_sec" key={index}>
                                            <div className="pop_categ_mrg_btm w-100">
                                                <h4 className="pop_cat_head">{ele?.title}</h4>
                                                {ele?.section_data.length > 4 &&
                                                    <Link href={`/featured-sections/${ele?.slug}`} className="view_all_link" prefetch={false}>
                                                        <span className="view_all">{t('viewAll')}</span>
                                                    </Link>
                                                }
                                            </div>
                                            <div className="row product_card_card_gap">
                                                {ele?.section_data.slice(0, 4).map((data, index) => (
                                                    <div className="col-xxl-3 col-lg-4 col-6 card_col_gap" key={index}>
                                                        <Link href={userData?.id == data?.user_id ? `/my-listing/${data?.slug}` : `/product-details/${data.slug}`} prefetch={false}>
                                                            <ProductCard data={data} handleLike={handleLike} />
                                                        </Link>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                ))
                            ) : (
                                allItemLoading ? (

                                    <FeaturedSectionsSkeleton />

                                ) : (
                                    !allItemLoading && AllItemData.length === 0 && <NoData />
                                )
                            )}
                        </div>
                    </div>

                </div>
                {AllItemData.length > 0 && (
                    <InfiniteScroll
                        dataLength={AllItemData.length}
                        next={fetchMoreData}
                        hasMore={hasMore}
                        loader={<AllItemLoader />}
                    >
                        <div className={`row product_card_card_gap ${!allEmpty && 'top_spacing'}`}>
                            {AllItemData.map((data, index) => (
                                <div className="col-xxl-3 col-lg-4 col-md-6 col-6 card_col_gap" key={index}>
                                    <Link href={userData?.id === data?.user_id ? `/my-listing/${data?.slug}` : `/product-details/${data.slug}`} prefetch={false}>
                                        <ProductCard data={data} handleLike={handleLikeAllData} />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </InfiniteScroll>
                )}
            </div>
        )
    );
};

export default FeaturedSections;
