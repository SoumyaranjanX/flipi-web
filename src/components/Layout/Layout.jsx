import React, { useEffect, useState } from 'react';
import MainHeader from './MainHeader';
import Footer from './Footer';
import Loader from '@/components/Loader/Loader';
import { settingsSucess } from '@/redux/reuducer/settingSlice';
import { settingsApi } from '@/utils/api';
import { useDispatch, useSelector } from 'react-redux';
import { usePathname, useRouter } from 'next/navigation';
import dynamic from "next/dynamic";
import { CurrentLanguageData } from '@/redux/reuducer/languageSlice';
const PushNotificationLayout = dynamic(() => import('../firebaseNotification/PushNotificationLayout.jsx'), { ssr: false });
import { store } from '@/redux/store';
import ScrollToTopButton from './ScrollToTopButton';
import { setIsBrowserSupported } from '@/redux/reuducer/locationSlice';
import { protectedRoutes } from '@/app/routes/routes';
import Swal from 'sweetalert2';
import { isLogin, t } from '@/utils';
import Image from 'next/image';
import UnderMaitenance from '../../../public/assets/something_went_wrong.svg'

const Layout = ({ children }) => {

    const pathname = usePathname()
    const dispatch = useDispatch();
    const cityData = useSelector(state => state?.Location?.cityData);
    const settingsData = store.getState().Settings?.data
    const placeApiKey = settingsData?.data?.place_api_key
    const favicon = settingsData?.data?.favicon_icon
    const router = useRouter();
    const [isLoading, setisLoading] = useState(true);
    const lang = useSelector(CurrentLanguageData);

    const requiresAuth = protectedRoutes.some(route => route.test(pathname));

    if (Number(settingsData?.data?.maintenance_mode)) {
        return (
            <div className='underMaitenance'>
                <Image src={UnderMaitenance} height={255} width={255} />
                <p className='maintenance_label'>Our website is currently undergoing maintenance and will be temporarily unavailable.</p>
            </div>
        )
    }


    useEffect(() => {
        handleRouteAccess()
    }, [pathname])

    const handleRouteAccess = () => {
        if (requiresAuth && !isLogin()) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: t("loginFirst"),
                allowOutsideClick: false,
                customClass: {
                    confirmButton: 'Swal-confirm-buttons',
                },

            }).then((result) => {
                if (result.isConfirmed) {
                    router.push("/"); 
                }
            });
        }
    }

    useEffect(() => {
        if (lang && lang.rtl === true) {
            document.documentElement.dir = "rtl";
        } else {
            document.documentElement.dir = "ltr";
        }
    }, [lang]);
    useEffect(() => {
        const getSystemSettings = async () => {
            try {
                const response = await settingsApi.getSettings({
                    type: "" // or remove this line if you don't need to pass the "type" parameter
                });
                const data = response.data;
                dispatch(settingsSucess({ data }));
                setisLoading(false);
                document.documentElement.style.setProperty('--primary-color', data?.data?.web_theme_color);
                requestLocationPermission(); // Request location after settings are loaded
            } catch (error) {
                console.error("Error:", error);
                setisLoading(false);
            }
        };

        getSystemSettings();

    }, [dispatch]);

    const requestLocationPermission = () => {

        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

        if (isSafari) {
            dispatch(setIsBrowserSupported(false));
            return;
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const locationData = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                },
                (error) => {
                    console.error('Location permission denied:', error);
                }
            );
            dispatch(setIsBrowserSupported(true));
        } else {
            console.error('Geolocation is not supported by this browser.');
            dispatch(setIsBrowserSupported(false))
        }
    };


    // useEffect(() => {
    //     if (cityData?.city === "") {
    //         router.push('/home');
    //     }
    // }, [cityData]);

    useEffect(() => {
        const isBlogPage = pathname.startsWith('/blogs/');
        const isProductDetailsPage = pathname.startsWith('/product-details/');

        if (cityData?.city === "" && !isBlogPage && !isProductDetailsPage) {
            router.push('/home');
        }
    }, [cityData, pathname]);

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <head>
                        <link rel="shortcut icon" href={favicon} sizes="32x32" type="image/png" />
                        <meta property="og:image" content={favicon} />
                        <script async defer src={`https://maps.googleapis.com/maps/api/js?key=${placeApiKey}&libraries=places&loading=async`}></script>
                    </head>
                    <PushNotificationLayout>
                        <MainHeader />
                        {children}
                        <Footer />
                    </PushNotificationLayout>
                    <ScrollToTopButton />
                </>
            )}
        </>
    );
};

export default Layout;
