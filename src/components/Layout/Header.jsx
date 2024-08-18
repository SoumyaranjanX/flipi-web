'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { IoIosAddCircleOutline, IoIosMore } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";
import dynamic from 'next/dynamic';
import { Drawer, Select } from 'antd'
import { GrLocation } from "react-icons/gr";
import { FaSearch } from 'react-icons/fa';
import Link from 'next/link';
import 'swiper/css';
import { getSlug, placeholderImage, t, truncate } from '@/utils';
import { BiPlanet } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import CategoryDrawer from '../Drawer/CategoryDrawer';
import { MdClose } from 'react-icons/md';
import { logoutSuccess, userSignUpData } from '@/redux/reuducer/authSlice';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import FirebaseData from '@/utils/Firebase';
import { settingsData } from '@/redux/reuducer/settingSlice';
import { getLanguageApi, getLimitsApi } from '@/utils/api';
import { CurrentLanguageData, setCurrentLanguage } from '@/redux/reuducer/languageSlice';
import LanguageDropdown from '../HeaderDropdowns/LanguageDropdown';
import LocationModal from '../LandingPage/LocationModal';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { setSearch } from "@/redux/reuducer/searchSlice"
import { isLogin } from '@/utils';
import { CategoryData, CurrentPage, LastPage, setCatCurrentPage, setCatLastPage, setCateData } from '@/redux/reuducer/categorySlice'
import { categoryApi } from '@/utils/api'
import { Collapse } from 'antd';
import FilterTree from '../Category/FilterTree';
import { DownOutlined } from '@ant-design/icons';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa6';

const ProfileDropdown = dynamic(() => import('../Profile/ProfileDropdown.jsx'))
const MailSentSucessfully = dynamic(() => import('../Auth/MailSentSucessfully.jsx'), { ssr: false })
const LoginModal = dynamic(() => import('../Auth/LoginModal.jsx'), { ssr: false })
const RegisterModal = dynamic(() => import('../Auth/RegisterModal.jsx'), { ssr: false })

const { Panel } = Collapse

const Header = () => {

    const pathname = usePathname()
    const router = useRouter()
    const dispatch = useDispatch()
    const UserData = useSelector(userSignUpData)
    const systemSettings = useSelector(settingsData)
    const settings = systemSettings?.data
    const cateData = useSelector(CategoryData)
    const languages = settings && settings?.languages
    const { signOut } = FirebaseData();
    const [IsRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
    const [IsLoginModalOpen, setIsLoginModalOpen] = useState(false)
    const [IsMailSentOpen, setIsMailSentOpen] = useState(false)
    const [activeCategory, setActiveCategory] = useState(null);
    const [activeSubCategory, setActiveSubCategory] = useState(null);
    const [IsBuySellDrawerOpen, setIsBuySellDrawerOpen] = useState(false)
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState(settings?.default_language);
    const [IsLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [catId, setCatId] = useState('')
    const [slug, setSlug] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const cityData = useSelector(state => state?.Location?.cityData);
    const CurrentLanguage = useSelector(CurrentLanguageData)
    const [IsShowCatDrop, setIsShowCatDrop] = useState(false)
    const [MenuData, setMenuData] = useState(null)
    const [IsShowOtherCat, setIsShowOtherCat] = useState(false)
    const headerCatSelected = getSlug(pathname)
    const [position, setPosition] = useState([51.505, -0.09]);

    useEffect(() => {
        console.log("cityData:", cityData)
    },[cityData])

    useEffect(() => {
        if (IsShowCatDrop || IsShowOtherCat) {
            const allCatWrapper = document.querySelector('.allCatWrapper');
            const cateCont = document.querySelector('.cate_cont');
            if (allCatWrapper && cateCont) {
                cateCont.style.height = `${allCatWrapper.offsetHeight}px`;
            }
        }
    }, [MenuData, IsShowCatDrop, IsShowOtherCat]);

    // this api call only in pop cate swiper 
    const getCategoriesData = (async (page) => {

        try {
            const response = await categoryApi.getCategory({ page: `${page}` });
            const { data } = response.data;
            if (data && Array.isArray(data.data)) {
                dispatch(setCateData(data.data));
                dispatch(setCatLastPage(data?.last_page))
                dispatch(setCatCurrentPage(data?.current_page))
            }
        } catch (error) {
            console.error("Error:", error);
        }

    });

    useEffect(() => {
        getCategoriesData(1);
    }, [CurrentLanguage]);

    const getLanguageData = async (lang_code) => {
        try {
            let language_code;

            if (lang_code) {
                language_code = lang_code;
            } else {
                language_code = settings?.default_language
            }
            const res = await getLanguageApi.getLanguage({ language_code, type: 'web' });
            dispatch(setCurrentLanguage(res?.data?.data));
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const defaultLanguage = languages?.find((lang) => lang.code === settings?.default_language)
        setSelectedLanguage(defaultLanguage)
        getLanguageData()
    }, [])


    useEffect(() => {
        const categoryPathRegex = /^\/category(\/|$)/;
        if (pathname != '/products' && !categoryPathRegex.test(pathname)) {
            dispatch(setSearch(''))
            setSearchQuery("")
            setCatId("")
        }
    }, [pathname])



    const closeDrawer = () => {
        if (show) {
            setShow(false)
        }
    }

    const openRegisterModal = () => {
        if (show) {
            setShow(false)
        }
        if (IsLoginModalOpen) {
            setIsLoginModalOpen(false)
        }
        setIsRegisterModalOpen(true)
    }
    const openLoginModal = () => {
        if (show) {
            setShow(false)
        }
        if (IsRegisterModalOpen) {
            setIsRegisterModalOpen(false)
        }
        setIsLoginModalOpen(true)
    }
    const openSentMailModal = () => {
        setIsRegisterModalOpen(false)
        setIsMailSentOpen(true)
    }

    const openLocationEditModal = () => {
        setIsLocationModalOpen(true)
    }

    const handleLogout = () => {
        if (show) {
            setShow(false)
        }
        Swal.fire({
            title: t("areYouSure"),
            text: t("logoutConfirmation"),
            icon: "warning",
            showCancelButton: true,
            customClass: {
                confirmButton: 'Swal-confirm-buttons',
                cancelButton: "Swal-cancel-buttons"
            },
            confirmButtonText: t("yes"),
        }).then((result) => {
            if (result.isConfirmed) {
                // // Clear the recaptchaVerifier by setting it to null
                // window.recaptchaVerifier = null;

                // Perform the logout action
                logoutSuccess();
                signOut()

                toast.success(t('signOutSuccess'));
                router.push("/")
            } else {
                toast.error(t('signOutCancelled'));
            }
        });
    };

    const CloseIcon = <div className="close_icon_cont"><MdClose size={24} color="black" /></div>

    const handleCategoryChange = (value) => {
        if (value?.value === "") {
            setCatId('')
            return
        }
        const category = cateData.find((item) => item?.id === Number(value.key))
        const catId = category?.id
        const slug = category?.slug

        if (catId) {
            setCatId(catId)
        }
        if (slug) {
            setSlug(slug)
        }
    }

    const handleSearch = (e) => {
        setSearchQuery(e.target.value)
    }

    const handleSearchNav = () => {
        if (catId) {
            dispatch(setSearch(searchQuery))
            router.push(`/category/${slug}`)
        } else {
            dispatch(setSearch(searchQuery))
            router.push(`/products`)
        }
    }

    const getLimitsData = async () => {
        try {
            const res = await getLimitsApi.getLimits({ package_type: 'item_listing' })
            if (res?.data?.error === false) {
                router.push('/ad-listing')
            } else {
                toast.error(t('purchasePlan'))
                router.push('/subscription')
            }
        } catch (error) {
            console.log(error)
        }
    }
    const handleCheckLogin = (e) => {
        e.preventDefault()
        if (isLogin()) {
            if (UserData?.name && UserData?.email && UserData?.mobile) {
                getLimitsData()
            } else {
                Swal.fire({
                    title: "Opps!",
                    text: "You need to update your profile first for ad item!",
                    icon: "warning",
                    showCancelButton: false,
                    customClass: {
                        confirmButton: 'Swal-confirm-buttons',
                    },
                    confirmButtonText: "Ok",
                }).then((result) => {
                    if (result.isConfirmed) {
                        router.push('/profile/edit-profile')
                    }
                });
            }
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: t("loginFirst"),
                allowOutsideClick: false,
                customClass: {
                    confirmButton: 'Swal-confirm-buttons',
                },
            })
        }
        handleClose()
    }

    const handleCatClick = (cat) => {
        setIsShowCatDrop(true)
        setMenuData(cat)
        if (IsShowOtherCat) {
            setIsShowOtherCat(false)
        }
    }

    const handleCatLinkClick = () => {
        if (IsShowOtherCat) {
            setIsShowOtherCat(false)
        }
        if (IsShowCatDrop) {
            setIsShowCatDrop(false)
        }
    }

    const handleOtherCat = () => {
        setIsShowOtherCat(true)
        setMenuData({})
        if (IsShowCatDrop) {
            setIsShowCatDrop(false)
        }
    }


    const selectCat = () => {
        setIsShowCatDrop(false)
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg">
                <div className="container">
                    <div className="left_side">
                        <div className="nav_logo">
                            <Link href="/">
                                <Image src={settings?.header_logo} alt='logo' width={0} height={0} className='header_logo' onErrorCapture={placeholderImage} />
                            </Link>
                        </div>

                        <div className='select_search_cont search_lg'>
                            <div className="cat_select_wrapper">
                                <Select
                                    showSearch
                                    style={{ width: "100%" }}
                                    onChange={handleCategoryChange}
                                    labelInValue
                                    placeholder={t('categorySelect')}
                                    filterOption={true} // Disable default filter to use custom filter
                                    defaultValue=''
                                    className='web_ant_select'
                                >
                                    <Option value=''>{t('allCategories')}</Option>
                                    {cateData && cateData?.map((cat, index) => (
                                        <>
                                            <Option key={cat?.id} value={cat.name}>
                                                {cat.name}
                                            </Option>
                                        </>
                                    ))}
                                </Select>
                            </div>
                            <div className='search_cont'>
                                <div className='srchIconinput_cont'>
                                    <BiPlanet size={16} color='#595B6C' className='planet' />
                                    <input type="text" placeholder={t('searchItem')} onChange={(e) => handleSearch(e)} value={searchQuery} />
                                </div>
                                <button onClick={handleSearchNav}><FaSearch size={14} /><span className='srch'>{t('search')}</span></button>
                            </div>
                        </div>

                        <span onClick={handleShow} id="hamburg">
                            <GiHamburgerMenu size={25} />
                        </span>
                    </div>
                    <div className='select_search_cont search_xs_xl'>
                        <div className="cat_select_wrapper">
                            <Select
                                showSearch
                                style={{ width: "100%" }}
                                onChange={handleCategoryChange}
                                labelInValue
                                placeholder={t('categorySelect')}
                                filterOption={true} // Disable default filter to use custom filter
                                defaultValue=''
                                className='web_ant_select'
                            >
                                <Option value=''>{t('allCategories')}</Option>
                                {cateData && cateData?.map((cat, index) => (
                                    <>
                                        <Option key={cat?.id} value={cat.name}>
                                            {cat.name}
                                        </Option>
                                    </>
                                ))}
                            </Select>
                        </div>
                        <div className='search_cont'>
                            <div className='srchIconinput_cont'>
                                <BiPlanet size={16} color='#595B6C' className='planet' />
                                <input type="text" placeholder={t('searchItem')} onChange={(e) => handleSearch(e)} value={searchQuery} />
                            </div>
                            <button onClick={handleSearchNav}><FaSearch size={14} /><span className='srch'>{t('search')}</span></button>
                        </div>
                    </div>
                    {cityData &&
                        <div className='home_header_location' onClick={openLocationEditModal}>
                            <GrLocation size={16} />
                            <p title={`${cityData?.area}${cityData?.area ? "," : ""} ${cityData?.city}${cityData?.city ? "," : ""} ${cityData?.state}${cityData?.state ? "," : ""} ${cityData?.country}`}>
                                {truncate(`${cityData?.area}${cityData?.area ? "," : ""} ${cityData?.city}${cityData?.city ? "," : ""} ${cityData?.state}${cityData?.state ? "," : ""} ${cityData?.country}`, 10)}
                            </p>
                        </div>
                    }

                    <div className="right_side">
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav ml-auto align-items-center">
                                {!isLogin() ? (
                                    <>
                                        <li className="nav-item nav-link lg_in" onClick={openLoginModal} >
                                            {t('login')}
                                        </li>
                                        <span className='vl'></span>
                                        <li className='nav-item nav-link' onClick={openRegisterModal}>
                                            {t('register')}
                                        </li>
                                    </>
                                ) : (
                                    <ProfileDropdown closeDrawer={closeDrawer} settings={settings} handleLogout={handleLogout} isDrawer={false} />
                                )}

                                {
                                    isLogin() &&
                                    <div className="item_add">
                                        <button className='ad_listing' onClick={handleCheckLogin}>
                                            <IoIosAddCircleOutline size={18} className='ad_listing_icon' />
                                            <span className='adlist_btn'>
                                                {t('adListing')}
                                            </span>
                                        </button>
                                    </div>
                                }

                                <li className="nav-item dropdown mx-2 item_add">
                                    <LanguageDropdown setSelectedLanguage={setSelectedLanguage} selectedLanguage={selectedLanguage} getLanguageData={getLanguageData} settings={settings} />
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

            </nav>

            {
                cateData.length > 0 &&
                <div className='shopping_items_cont'>
                    <div className="container">
                        <div className="row">

                            <div className="shopping_items">

                                {
                                    cateData.slice(0, 7).map((cat) => {
                                        return cat.subcategories_count > 0 ? (
                                            <div className={`shopping_cat ${headerCatSelected === cat?.slug && 'brdrShop'}`} onMouseEnter={() => handleCatClick(cat)} key={cat.id} onMouseLeave={() => setIsShowCatDrop(false)}>
                                                {cat?.translated_name} &nbsp;
                                                {
                                                    cat?.translated_name === MenuData?.translated_name && IsShowCatDrop ? <FaAngleUp className='prof_down_arrow' /> : <FaAngleDown className='prof_down_arrow' />
                                                }
                                            </div>
                                        ) : (
                                            <Link href={`/category/${cat?.slug}`} className={`shopping_cat ${headerCatSelected === cat?.slug && 'brdrShop'}`} cat_link key={cat.id} onMouseEnter={handleCatLinkClick}>
                                                {cat?.translated_name}
                                            </Link>
                                        );
                                    })
                                }


                                {
                                    cateData && cateData.slice(7).length > 0 &&
                                    <div className={`shopping_cat ${IsShowOtherCat || headerCatSelected === 'products' && 'brdrShop'}`} onMouseLeave={() => setIsShowOtherCat(false)} onMouseEnter={handleOtherCat}>
                                        {t('other')} &nbsp;
                                        {
                                            IsShowOtherCat ? <FaAngleUp className='prof_down_arrow' /> : <FaAngleDown className='prof_down_arrow' />
                                        }
                                    </div>
                                }

                                {
                                    IsShowCatDrop &&
                                    <div className="cate_cont_wrap">
                                        <div
                                            className='cate_cont'
                                            onMouseEnter={() => setIsShowCatDrop(true)}
                                            onMouseLeave={() => setIsShowCatDrop(false)}
                                        >

                                            <div className='selected_cat'>
                                                <div className='cat_link_cont'>
                                                    <Image src={MenuData?.image ? MenuData?.image : settings?.placeholder_image} width={22} height={22} />
                                                    <span>
                                                        {MenuData?.translated_name}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className='allCatWrapper'>
                                                {
                                                    MenuData?.subcategories_count > 0 && (
                                                        <>
                                                            <Link onClick={selectCat} href={`/category/${MenuData?.slug}`} className='see_all_cat'>{t('seeAllIn')} {MenuData?.translated_name}</Link>
                                                            {
                                                                MenuData?.subcategories.map((sub) => (
                                                                    <div className="cate_item cate_subcate" key={sub?.id}>
                                                                        <Link href={`/category/${sub?.slug}`} className='main_cat' onClick={() => setIsShowCatDrop(false)}>
                                                                            {sub?.translated_name}
                                                                        </Link>
                                                                        {
                                                                            sub?.subcategories_count > 0 &&
                                                                            sub.subcategories.slice(0, 5).map((nestedSub) => (
                                                                                <Link onClick={() => setIsShowCatDrop(false)} href={`/category/${nestedSub?.slug}`} className='subcat' key={nestedSub?.id}>{nestedSub?.translated_name}</Link>
                                                                            ))
                                                                        }
                                                                        {
                                                                            sub?.subcategories_count > 5 &&
                                                                            <Link onClick={() => setIsShowCatDrop(false)} href={`/category/${sub?.slug}`} className='subcat'>{t('viewAll')}</Link>
                                                                        }
                                                                    </div>
                                                                ))
                                                            }
                                                        </>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                }

                                {
                                    IsShowOtherCat &&
                                    <div className="cate_cont_wrap">
                                        <div
                                            className='cate_cont'
                                            onMouseLeave={() => setIsShowOtherCat(false)}
                                            onMouseEnter={() => setIsShowOtherCat(true)}
                                        >
                                            <div className='selected_cat'>
                                                <div className='cat_link_cont'>
                                                    <IoIosMore size={22} />
                                                    <span>
                                                        {t('other')}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className='allCatWrapper'>

                                                <Link onClick={() => setIsShowOtherCat(false)} href='/products' className='see_all_cat'>{t('seeAllIn')} {t('other')}</Link>

                                                {
                                                    cateData && cateData.slice(7).map((sub) => (
                                                        <div className="cate_item cate_subcate" key={sub?.id}>
                                                            <Link onClick={() => setIsShowOtherCat(false)} href={`/category/${sub?.slug}`} className='main_cat'>
                                                                {sub?.translated_name}
                                                            </Link>
                                                            {
                                                                sub?.subcategories_count > 0 &&
                                                                sub?.subcategories.slice(0, 5).map((nestedSub) => (
                                                                    <Link onClick={() => setIsShowOtherCat(false)} href={`/category/${nestedSub?.slug}`} className='subcat' key={nestedSub?.id}>{nestedSub?.translated_name}</Link>
                                                                ))
                                                            }
                                                            {
                                                                sub?.subcategories_count > 5 &&
                                                                <Link onClick={() => setIsShowOtherCat(false)} href={`/category/${sub?.slug}`} className='subcat' key={sub?.id}>{t('viewAll')}</Link>
                                                            }
                                                        </div>
                                                    ))
                                                }

                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            }


            <Drawer className='eclassify_drawer' title={<Image src={settings?.header_logo} width={195} height={92} alt="Close Icon" onErrorCapture={placeholderImage} />} onClose={handleClose} open={show} closeIcon={CloseIcon} >
                <ul className="mobile_nav">
                    {cityData &&
                        <li className='mob_header_location' onClick={openLocationEditModal}>
                            <GrLocation size={16} />
                            <p>
                                {`${cityData?.city}${cityData?.city ? "," : ""} ${cityData?.state}${cityData?.state ? "," : ""} ${cityData?.country}`}
                            </p>
                        </li>
                    }
                    <li className='mobile_nav_tab login_reg_nav_tab'>
                        {!isLogin() ? (
                            <>
                                <li className="nav-item nav-link lg_in" onClick={openLoginModal} >
                                    {t('login')}
                                </li>
                                <span className='vl'></span>
                                <li className='nav-item nav-link' onClick={openRegisterModal}>
                                    {t('register')}
                                </li>
                            </>
                        ) : (
                            <ProfileDropdown closeDrawer={closeDrawer} settings={settings} handleLogout={handleLogout} isDrawer={true} />
                        )}
                    </li>
                    <li className='mobile_nav_tab'>

                        <LanguageDropdown setSelectedLanguage={setSelectedLanguage} selectedLanguage={selectedLanguage} getLanguageData={getLanguageData} settings={settings} />
                    </li>
                    <li className='mobile_nav_tab'>
                        <Link href={"/ad-listing"}>
                            <button className='ad_listing' onClick={handleCheckLogin} >
                                <IoIosAddCircleOutline size={18} />
                                <span>
                                    {t('adListing')}
                                </span>
                            </button>
                        </Link>
                    </li>
                    <div className='card-body'>
                        <Collapse
                            className="all_filters"
                            expandIconPosition="right"
                            expandIcon={({ isActive }) => (
                                <DownOutlined rotate={isActive ? 180 : 0} size={24} />
                            )}
                            defaultActiveKey={['1']}
                        >
                            <Panel header={t("category")} key="1">
                                <FilterTree show={show} setShow={setShow} />
                            </Panel>
                        </Collapse>
                    </div>

                </ul>
            </Drawer>
            <CategoryDrawer IsBuySellDrawerOpen={IsBuySellDrawerOpen} OnHide={() => setIsBuySellDrawerOpen(false)} Category={selectedCategory} />

            <RegisterModal IsRegisterModalOpen={IsRegisterModalOpen} OnHide={() => setIsRegisterModalOpen(false)} setIsLoginModalOpen={setIsLoginModalOpen} openSentMailModal={openSentMailModal} />

            <LoginModal IsLoginModalOpen={IsLoginModalOpen} setIsLoginModalOpen={setIsLoginModalOpen} setIsRegisterModalOpen={openRegisterModal} IsMailSentOpen={IsMailSentOpen} setIsMailSentOpen={setIsMailSentOpen} />

            <MailSentSucessfully IsMailSentOpen={IsMailSentOpen} OnHide={() => setIsMailSentOpen(false)} IsLoginModalOpen={() => setIsLoginModalOpen(true)} />

            <LocationModal position={position} setPosition={setPosition} IsLocationModalOpen={IsLocationModalOpen} OnHide={() => setIsLocationModalOpen(false)} />
        </>
    )
}

export default Header
