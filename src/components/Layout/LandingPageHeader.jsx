'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { GiHamburgerMenu } from "react-icons/gi";
import { Drawer } from 'antd';
import Link from 'next/link';
import { placeholderImage, t } from '@/utils';
import { getLanguageApi } from '@/utils/api';
import { useDispatch, useSelector } from 'react-redux';
import { settingsData } from '@/redux/reuducer/settingSlice';
import { setCurrentLanguage } from '@/redux/reuducer/languageSlice';
import LanguageDropdown from '../HeaderDropdowns/LanguageDropdown';

import { MdClose } from 'react-icons/md';

const LandingPageHeader = () => {

    const dispatch = useDispatch();

    const systemSettingsData = useSelector(settingsData)
    const settings = systemSettingsData?.data
    const languages = settings && settings?.languages
    const [selectedLanguage, setSelectedLanguage] = useState(languages && languages[0]);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // Sample language data with images (you can replace with your own)

    const getLanguageData = async (language_code = settings?.default_language) => {
        try {
            const res = await getLanguageApi.getLanguage({ language_code, type: 'web' });
            dispatch(setCurrentLanguage(res?.data?.data))
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const defaultLanguage = languages && languages.find((lang) => lang.code === settings?.default_language)
        setSelectedLanguage(defaultLanguage)
        getLanguageData()
    }, [])

    const scrollToSection = (id) => {
        const section = document.getElementById(id);
        if (section) {
            if (show) {
                handleClose()
            }
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg">
                <div className="container">
                    <div className="left_side">
                        <div className="nav_logo">
                            <Link href="/home">
                                <Image src={settings?.header_logo} alt='logo' width={0} height={0} className='header_logo' onErrorCapture={placeholderImage} />
                            </Link>
                        </div>
                        <span onClick={handleShow} id="hamburg">
                            <GiHamburgerMenu size={25} />
                        </span>
                    </div>
                    <div className="nav_items_div">
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item nav-link active">
                                    {t('home')}
                                </li>
                                <li className="nav-item nav-link" onClick={() => scrollToSection('work_process')}>
                                    {t('whyChooseUs')}
                                </li>
                        
                                <li className="nav-item nav-link" onClick={() => scrollToSection('faq')}>
                                    {t('faqs')}
                                </li>
                                <li className="nav-item nav-link" onClick={() => scrollToSection('ourBlogs')}>
                                    {t('blog')}
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="right_side">
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav ml-auto">
                        

                                <li className="nav-item dropdown mx-2">
                                    <LanguageDropdown setSelectedLanguage={setSelectedLanguage} selectedLanguage={selectedLanguage} getLanguageData={getLanguageData} settings={settings} />
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>

            <Drawer className='eclassify_drawer' title={<Image src={settings?.header_logo} width={195} height={92} alt="Close Icon" onErrorCapture={placeholderImage} />} onClose={handleClose} open={show} closeIcon={<div className="close_icon_cont"><MdClose size={24} color="black" /></div>} >
                <ul className="mobile_nav">
                    <li className='mobile_nav_tab mob_nav_tab_active' >{t('home')}</li>
                    <li className='mobile_nav_tab' onClick={() => scrollToSection('work_process')}>{t('whyChooseUs')}</li>         
                    <li className="mobile_nav_tab" onClick={() => scrollToSection('faq')}>{t('faqs')}</li>
                    <li className='mobile_nav_tab' onClick={() => scrollToSection('ourBlogs')}>{t('blog')}</li>
                    <li className='mobile_nav_tab'>

                        <LanguageDropdown setSelectedLanguage={setSelectedLanguage} selectedLanguage={selectedLanguage} getLanguageData={getLanguageData} settings={settings} />
                    </li>
                </ul>
            </Drawer>

           
        </>
    )
}

export default LandingPageHeader
