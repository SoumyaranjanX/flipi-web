'use client'
import React, { useEffect, useState } from 'react'
import OfferSlider from './OfferSlider'
import PopularCategories from './PopularCategories'
import FreshRecommendations from './FeaturedSections'
import { FeaturedSectionApi, sliderApi } from '@/utils/api'
import { useDispatch, useSelector } from 'react-redux'
import { SliderData, setSlider } from '@/redux/reuducer/sliderSlice'
import { CurrentLanguageData } from '@/redux/reuducer/languageSlice'
import { getFavData } from '@/redux/reuducer/favouriteSlice'
import { settingsData } from '@/redux/reuducer/settingSlice'

const HomePage = () => {
    
    const dispatch = useDispatch()
    const slider = useSelector(SliderData);
    const CurrentLanguage = useSelector(CurrentLanguageData)
    const [isLoading, setIsLoading] = useState(true);
    const [featuredData, setFeaturedData] = useState([])
    const systemSettingsData = useSelector(settingsData)
    const settings = systemSettingsData?.data
    const isDemoMode = settings?.demo_mode

    const isLikeddata = useSelector(getFavData)
    const isLiked = isLikeddata?.data?.isLiked

    const cityData = useSelector(state => state?.Location?.cityData);

    useEffect(() => {
        const fetchSliderData = async () => {
            try {
                const response = await sliderApi.getSlider();
                const data = response.data;
                dispatch(setSlider(data.data))
                setIsLoading(false)
            } catch (error) {
                console.error('Error:', error);
                setIsLoading(false);
            }
        };
        fetchSliderData();
    }, []);

    useEffect(() => {
        const fetchFeaturedSectionData = async () => {
            try {
                if (isDemoMode) {
                    const response = await FeaturedSectionApi.getFeaturedSections({});
                    const { data } = response.data;
                    setFeaturedData(data)
                    setIsLoading(false);

                } else {
                    const response = await FeaturedSectionApi.getFeaturedSections({ city: cityData?.city, state: cityData?.state, country: cityData?.country });
                    const { data } = response.data;
                    setFeaturedData(data)
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Error:', error);
                setIsLoading(false);
            }
        };
        fetchFeaturedSectionData();
    }, [cityData, CurrentLanguage, isLiked]);

    return (
        <>
            <OfferSlider sliderData={slider} isLoading={isLoading} />
            <PopularCategories/>
            <FreshRecommendations featuredData={featuredData} isLoading={isLoading} setFeaturedData={setFeaturedData} cityData={cityData} />
        </>
    )
}

export default HomePage
