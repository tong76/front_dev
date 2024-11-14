import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import MapComponent from './MapComponent';

const PopupRead = () => {
    const { sno } = useParams(); // useParams를 통해 URL 파라미터를 가져옵니다.
    
    const [popupData, setPopupData] = useState({
        sname: '',
        scon: '',
        splc: '',
        simg: '',
        smedia: '',
        smap: ''
    });

    useEffect(() => {
        const fetchPopupData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/popup/popupRead/${sno}`);
                const data = response.data.popupRead[0];
                setPopupData({
                    sname: data.sname,
                    scon: data.scon,
                    splc: data.splc,
                    simg: data.simg,
                    smedia: data.smedia,
                    smap: data.smap
                });
            } catch (error) {
                console.error(error);
                alert('axios 에러');
            }
        };
        fetchPopupData();
    }, [sno]); // sno가 변경될 때마다 이 useEffect가 호출됩니다.
    

    return (
        <main id="main">
            <section className="intro-single">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 col-lg-8">
                            <div className="title-single-box">
                                <h1 className="title-single">{popupData.sname}</h1>
                            </div>
                        </div>
                        <div className="col-md-12 col-lg-4">
                            <nav aria-label="breadcrumb" className="breadcrumb-box d-flex justify-content-lg-end">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><a href="index.html">홈</a></li>
                                    <li className="breadcrumb-item"><a href="property-grid.html">팝업스토어</a></li>
                                    <li className="breadcrumb-item active" aria-current="page">
                                        {popupData.sname}
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </section>

            <section className="property-single nav-arrow-b">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div id="property-single-carousel" className="swiper">
                                <div className="swiper-wrapper">
                                    <div className="carousel-item-b swiper-slide">
                                        <img src={popupData.simg} alt="Popup" />
                                    </div>
                                    <div className="carousel-item-b swiper-slide">
                                        <img src="/resources/assets/img/junji-4.jpg" alt="Placeholder" />
                                    </div>
                                </div>
                            </div>
                            <div className="property-single-carousel-pagination carousel-pagination"></div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-12">
                            <div className="row justify-content-between">
                                <div className="col-md-5 col-lg-4">
                                    <div className="property-price d-flex justify-content-center foo">
                                        <div className="card-header-c d-flex">
                                            <div className="card-title-c align-self-center"></div>
                                        </div>
                                        <div className="property-summary">
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <div className="title-box-d section-t4">
                                                        <h3 className="title-d">운영시간</h3>
                                                        <p><strong>{popupData.splc}</strong></p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="summary-list">
                                                <ul className="list">
                                                    <li className="d-flex justify-content-between"><strong>월:</strong><span>11:00 ~ 19:00</span></li>
                                                    <li className="d-flex justify-content-between"><strong>화:</strong><span>11:00 ~ 19:00</span></li>
                                                    <li className="d-flex justify-content-between"><strong>수:</strong><span>11:00 ~ 19:00</span></li>
                                                    <li className="d-flex justify-content-between"><strong>목:</strong><span>11:00 ~ 19:00</span></li>
                                                    <li className="d-flex justify-content-between"><strong>금:</strong><span>11:00 ~ 21:00</span></li>
                                                    <li className="d-flex justify-content-between"><strong>토:</strong><span>11:00 ~ 21:00</span></li>
                                                    <li className="d-flex justify-content-between"><strong>일:</strong><span>11:00 ~ 19:00</span></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-7 col-lg-7 section-md-t3">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <div className="title-box-d">
                                                <h3 className="title-d">상세내용</h3>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="property-description">
                                        <p className="description color-text-a"><strong>{popupData.scon}</strong></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-10 offset-md-1">
                            <ul className="nav nav-pills-a nav-pills mb-3 section-t3" id="pills-tab" role="tablist">
                                <li className="nav-item">
                                    <a className="nav-link active" id="pills-video-tab" data-bs-toggle="pill" href="#pills-video" role="tab" aria-controls="pills-video" aria-selected="true">비디오</a>
                                </li>
                            </ul>
                            <div className="tab-content" id="pills-tabContent">
                                <iframe
                                    src={popupData.smedia}
                                    width="100%" height="460" frameBorder="0" webkitAllowFullScreen
                                    mozAllowFullScreen allowFullScreen
                                ></iframe>
                            </div>
                            <div className="col-md-10 offset-md-1">
                                <ul className="nav nav-pills-a nav-pills mb-3 section-t3" id="pills-tab" role="tablist">
                                    <li className="nav-item">
                                        <a className="nav-link active" id="pills-map-tab" data-bs-toggle="pill" href="#pills-map" role="tab" aria-controls="pills-map" aria-selected="true">지도</a>
                                    </li>
                                </ul>
                                <div className="tab-content" id="pills-tabContent">
                                    {/* <iframe
                                        src={popupData.smap}
                                        width="100%" height="450" style={{border: "0"}} allowFullScreen=""
                                        loading="lazy" referrerPolicy="no-referrer-when-downgrade">
                                    </iframe> */}
                                    <MapComponent location={popupData.splc} />
                                </div>
                            </div>
                        </div>
                        {/*
                        <div>
                             예약하기 구현 할것 
                            <Link><button>예약하기</button></Link>
                            
                        </div>
                        */}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default PopupRead;
   