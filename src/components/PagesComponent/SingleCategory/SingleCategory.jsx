'use client'
// import TopAd from "@/components/Advertisements/TopAd"
import BreadcrumbComponent from "@/components/Breadcrumb/BreadcrumbComponent"
import ProdcutHorizontalCard from "@/components/Cards/ProdcutHorizontalCard"
import ProductCard from "@/components/Cards/ProductCard"
import FilterCard from "@/components/ProductPageUI/FilterCard"
import { useEffect, useState } from "react"
import { IoCloseCircle, IoGrid } from "react-icons/io5"
import ViewStreamIcon from '@mui/icons-material/ViewStream';
import { CgArrowsExchangeAltV } from "react-icons/cg";
import { Select, MenuItem } from '@mui/material';
import { allItemApi } from "@/utils/api"
import ProductHorizontalCardSkeleton from "@/components/Skeleton/ProductHorizontalCardSkeleton"
import ProductCardSkeleton from "@/components/Skeleton/ProductCardSkeleton"
import NoData from "@/components/NoDataFound/NoDataFound"
import { t } from "@/utils"
import { useDispatch, useSelector } from "react-redux"
import { BreadcrumbPathData } from "@/redux/reuducer/breadCrumbSlice"
import { SearchData } from "@/redux/reuducer/searchSlice"
import Link from "next/link"
import { userSignUpData } from "@/redux/reuducer/authSlice"
import { CatItems, SingleCurrentPage, SingleLastPage, ViewCategory, setCategoryView, setSingleCatCurrentPage, setSingleCatItem, setSingleCatLastPage } from "@/redux/reuducer/categorySlice"


const SingleCategory = ({ slug }) => {

    const dispatch = useDispatch()
    const BreadcrumbPath = useSelector(BreadcrumbPathData)
    const catId = slug[0];
    const userData = useSelector(userSignUpData);
    const SingleCatItem = useSelector(CatItems)
    const currentPage = useSelector(SingleCurrentPage)
    const lastPage = useSelector(SingleLastPage)
    const search = useSelector(SearchData)
    const [sortBy, setSortBy] = useState('new-to-old');
    // const [view, setView] = useState('list');
    const view = useSelector(ViewCategory)
    // const [SingleCatItem, setSingleCatItem] = useState([])
    const [IsLoading, setIsLoading] = useState(false)
    const [selectedLocationKey, setSelectedLocationKey] = useState([])
    const [MinMaxPrice, setMinMaxPrice] = useState({
        min_price: '',
        max_price: '',
    })
    const [Country, setCountry] = useState('')
    const [State, setState] = useState('')
    const [City, setCity] = useState('')
    const [Area, setArea] = useState('')
    const [IsShowBudget, setIsShowBudget] = useState(false)
    const [DatePosted, setDatePosted] = useState('')
    const [IsFetchSingleCatItem, setIsFetchSingleCatItem] = useState(false)
    // const [currentPage, setCurrentPage] = useState(1);
    // const [lastPage, setLastPage] = useState(1);
    const [Title, setTitle] = useState('')
    const getSingleCatItem = async (page) => {
        let data = "";
        try {
            if (search != "") {
                const res = await allItemApi.getItems({ sort_by: sortBy, min_price: MinMaxPrice?.min_price, max_price: MinMaxPrice?.max_price, country: Country, state: State, city: City, area_id:Area?.id, posted_since: DatePosted, page, search, category_slug: catId })
                data = res?.data
            } else {
                setIsLoading(true)
                const res = await allItemApi.getItems({ sort_by: sortBy, min_price: MinMaxPrice?.min_price, max_price: MinMaxPrice?.max_price, country: Country, state: State, city: City,area_id:Area?.id, posted_since: DatePosted, page, category_slug: catId })
                data = res?.data
            }
            if (data.error !== true) {
                if (page > 1) {
                    dispatch(setSingleCatItem([...SingleCatItem, ...data?.data?.data]));
                } else {
                    dispatch(setSingleCatItem(data?.data?.data));
                }
                dispatch(setSingleCatCurrentPage(data?.data?.current_page));
                dispatch(setSingleCatLastPage(data?.data?.last_page));
            } else {
                setIsLoading(false)
            }
        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }
        finally {
            setIsLoading(false);
        }
    }


    useEffect(() => {
        getSingleCatItem()
    }, [slug, sortBy, IsFetchSingleCatItem, search])

    useEffect(() => {
        if (BreadcrumbPath?.length === 2) {
            setTitle(BreadcrumbPath[1]?.name)
        }
        else if (BreadcrumbPath?.length > 2) {
            setTitle(`${BreadcrumbPath[BreadcrumbPath.length - 1]?.name} in ${BreadcrumbPath[BreadcrumbPath.length - 2]?.name}`)
        }
    }, [BreadcrumbPath])


    const handleChange = (event) => {
        setSortBy(event.target.value);
    };

    const handleGridClick = (viewType) => {
        dispatch(setCategoryView(viewType))
    };

    const clearLocation = () => {
        setCountry('')
        setState('')
        setCity('')
        setArea('')
        setSelectedLocationKey([])
        setIsFetchSingleCatItem((prev) => !prev)
    }

    const clearBudget = () => {
        setIsShowBudget(false)
        setMinMaxPrice({
            min_price: '',
            max_price: '',
        })
        setIsFetchSingleCatItem((prev) => !prev)
    }

    const clearDatePosted = () => {
        setDatePosted('');
        setIsFetchSingleCatItem((prev) => !prev)
    }

    const clearAll = () => {
        if (
            selectedLocationKey.length === 0 &&
            Country === '' &&
            State === '' &&
            City === '' &&
            Area === '' &&
            MinMaxPrice.min_price === '' &&
            MinMaxPrice.max_price === '' &&
            sortBy === 'new-to-old' &&
            DatePosted === ''
        ) {
            return;
        }

        setSelectedLocationKey([]);
        setCountry('');
        setState('');
        setCity('');
        setArea('')
        setMinMaxPrice({
            min_price: '',
            max_price: '',
        });
        setIsShowBudget(false);
        setSortBy('new-to-old');
        setDatePosted('');
        setIsFetchSingleCatItem((prev) => !prev);
    };

    const postedSince = DatePosted === 'all-time' ? t('allTime') :
        DatePosted === 'today' ? t('today') :
            DatePosted === 'within-1-week' ? t('within1Week') :
                DatePosted === 'within-2-week' ? t('within2Weeks') :
                    DatePosted === 'within-1-month' ? t('within1Month') :
                        DatePosted === 'within-3-month' ? t('within3Months') : '';

    const isClearAll = selectedLocationKey.length === 0 && !IsShowBudget && DatePosted === '' && sortBy === 'new-to-old'

    const handleLoadMore = () => {
        if (currentPage < lastPage) {
            getSingleCatItem(currentPage + 1);
             // Pass current sorting option
        }
    };

    const handleLike = (id) => {
        const updatedItems = SingleCatItem.map((item) => {
            if (item.id === id) {
                return { ...item, is_liked: !item.is_liked };
            }
            return item;
        });
        dispatch(setSingleCatItem(updatedItems))
    }

    return (
        <>
            <BreadcrumbComponent />
            <section className='all_products_page'>
                <div className="container">
                    {/* <TopAd /> */}

                    <div className="all_products_page_main_content">
                        <div className="heading">
                            <h3>{Title}</h3>
                        </div>
                        <div className="row" id='main_row'>
                            <div className="col-12 col-md-6 col-lg-3" id='filter_sec'>
                                <FilterCard slug={slug[0]} MinMaxPrice={MinMaxPrice} setMinMaxPrice={setMinMaxPrice} setIsFetchSingleCatItem={setIsFetchSingleCatItem} setCountry={setCountry} setState={setState} setCity={setCity} setArea={setArea} selectedLocationKey={selectedLocationKey} setSelectedLocationKey={setSelectedLocationKey} setIsShowBudget={setIsShowBudget} DatePosted={DatePosted} setDatePosted={setDatePosted} IsShowBudget={IsShowBudget} />
                            </div>
                            <div className="col-12 col-md-6 col-lg-9" id='listing_sec'>
                                <div className="sortby_header">
                                    <div className="sortby_dropdown">
                                        <span className="sort_by_label">
                                            <CgArrowsExchangeAltV size={25} />
                                            {t('sortBy')}{' '}
                                        </span>
                                        <Select
                                            value={sortBy}
                                            onChange={handleChange}
                                            variant="outlined"
                                            className="product_filter"
                                        >
                                            <MenuItem value="new-to-old">{t('newestToOldest')}</MenuItem>
                                            <MenuItem value="old-to-new">{t('oldestToNewest')}</MenuItem>
                                            <MenuItem value="price-high-to-low">{t('priceHighToLow')}</MenuItem>
                                            <MenuItem value="price-low-to-high">{t('priceLowToHigh')}</MenuItem>
                                        </Select>
                                    </div>
                                    <div className="gird_buttons">
                                        <button
                                            className={view === 'list' ? 'active' : 'deactive'}
                                            onClick={() => handleGridClick('list')}
                                        >
                                            <ViewStreamIcon size={24} />
                                        </button>
                                        <button
                                            className={view === 'grid' ? 'active' : 'deactive'}
                                            onClick={() => handleGridClick('grid')}
                                        >
                                            <IoGrid size={24} />
                                        </button>
                                    </div>
                                </div>
                                <div className="filter_header">
                                    <div className="filterList">

                                        {
                                            (Country || State || City || Area) &&
                                            <div className="filter_item">
                                                <span>{t('location')}: {Country ? Country : State ? State : City ? City : Area.title}</span>
                                                <button onClick={clearLocation}>
                                                    <IoCloseCircle size={24} />
                                                </button>
                                            </div>
                                        }

                                        {
                                            IsShowBudget && (
                                                <div className="filter_item">
                                                    <span>{t('budget')}: {MinMaxPrice.min_price}-{MinMaxPrice.max_price}</span>
                                                    <button onClick={clearBudget}>
                                                        <IoCloseCircle size={24} />
                                                    </button>
                                                </div>
                                            )
                                        }
                                        {
                                            DatePosted &&
                                            <div className="filter_item">
                                                <span>{postedSince}</span>
                                                <button onClick={clearDatePosted}>
                                                    <IoCloseCircle size={24} />
                                                </button>
                                            </div>
                                        }

                                    </div>

                                    {
                                        !isClearAll &&
                                        <div className="removeAll">
                                            <button onClick={clearAll}>{t('clearAll')}</button>
                                        </div>
                                    }


                                </div>
                                <div className="listing_items">
                                    <div className="row">
                                        {
                                            IsLoading ?
                                                (
                                                    Array.from({ length: 12 })?.map((_, index) => (
                                                        view === "list" ? (
                                                            <div className="col-12" key={index}>
                                                                <ProductHorizontalCardSkeleton />
                                                            </div>
                                                        ) : (
                                                            <div className="col-xxl-3 col-lg-4 col-6" key={index}>
                                                                <ProductCardSkeleton />
                                                            </div>
                                                        )
                                                    ))
                                                ) :
                                                (
                                                    SingleCatItem.length > 0 && SingleCatItem?.map((item, index) => (
                                                        view === "list" ? (
                                                            <div className="col-12" key={index}>
                                                                <Link href={userData?.id == item?.user_id ? `/my-listing/${item?.slug}` : `/product-details/${item.slug}`} prefetch={false}>
                                                                    <ProdcutHorizontalCard data={item} handleLike={handleLike} />
                                                                </Link>
                                                            </div>
                                                        ) : (

                                                            <div className="col-xxl-3 col-lg-4 col-6" key={index}>
                                                                <Link href={userData?.id == item?.user_id ? `/my-listing/${item?.slug}` : `/product-details/${item.slug}`} prefetch={false}>
                                                                    <ProductCard data={item} handleLike={handleLike} />
                                                                </Link>
                                                            </div>
                                                        )
                                                    ))
                                                )
                                        }
                                        {
                                            SingleCatItem && SingleCatItem.length === 0 && !IsLoading && <NoData />
                                        }
                                    </div>
                                    {currentPage < lastPage && SingleCatItem && SingleCatItem.length > 0 && (
                                        <div className="loadMore">
                                            <button onClick={handleLoadMore}> {t('loadMore')} </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default SingleCategory