import React, { } from "react";
import slide_1 from "../../resources/assets/img/slide-1.jpg";
import slide_2 from "../../resources/assets/img/slide-2.jpg";
import slide_3 from "../../resources/assets/img/slide-3.jpg";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules'; // 필요한 모듈 import

const MainView = () => {

    /* 넘기는 버튼 스타일 */
    const buttonStyle = {
        color: 'darkgreen', // 버튼 텍스트 색상
        width: '60px', // 버튼 너비
        height: '120px', // 버튼 높이
    };

    return (

        <>

            <Swiper
                style={{ height: '800px' }} // Swiper의 높이 설정
                modules={[Navigation, Pagination, Autoplay]} // 사용할 모듈 추가
                spaceBetween={10} // 슬라이드 간격
                slidesPerView={1} // 보이는 슬라이드 수
                navigation={{
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                }} // 내비게이션 버튼 활성화
                pagination={{ clickable: true }} // 페이지네이션
                autoplay={{ delay: 2500, disableOnInteraction: false }} // 자동 재생 설정
                loop={true} // 루프 설정
            >

                {/* 밑에 버튼 스타일 지정 및 타이틀 색변환 */}
                <style>
                    {`
                    .swiper-pagination-bullet {
                        background: green !important; /* 기본 색상 */
                    }
                    .swiper-pagination-bullet-active {
                        background: darkgreen !important; /* 활성 상태 색상 */
                    }
                    .intro-title {
                        color: white;
                    }
                    .overlay {
                        pointer-events: none;
                    }
                `}
                </style>

                <SwiperSlide style={{ backgroundImage: `url(${slide_1}` }} >
                    <div class="overlay overlay-a"></div>
                    <div class="intro-content display-table">
                        <div class="table-cell">
                            <div class="container">
                                <div class="row">
                                    <div class="col-lg-8">
                                        <div class="intro-body">
                                            <h1 class="intro-title mb-4 ">
                                                <span>망그러진 곰 </span>
                                                <br /> 비밀의 다락방
                                            </h1>
                                            <p class="intro-subtitle intro-price">
                                                <a href="#"><span class="price-a">2024년 7월 25일(목) ~ 8월 7일(수)</span></a>
                                            </p>                                                                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>

                <SwiperSlide style={{ backgroundImage: `url(${slide_2}` }} >
                    <div class="overlay overlay-a"></div>
                    <div class="intro-content display-table">
                        <div class="table-cell">
                            <div class="container">
                                <div class="row">
                                    <div class="col-lg-8">
                                        <div class="intro-body">
                                            <h1 class="intro-title mb-4">
                                                <span>데드풀 </span>
                                                <br /> <span>울버린 </span>
                                            </h1>
                                            <p class="intro-subtitle intro-price">
                                                <a href="#"><span class="price-a">2024년 7월 10일(수) ~ 8월 7일(수)</span></a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide style={{ backgroundImage: `url(${slide_3}` }} >
                    <div class="overlay overlay-a"></div>
                    <div class="intro-content display-table">
                        <div class="table-cell">
                            <div class="container">
                                <div class="row">
                                    <div class="col-lg-8">
                                        <div class="intro-body">
                                            <h1 class="intro-title mb-4">
                                                <span>이토준지</span>
                                                <br /> 호러하우스
                                            </h1>
                                            <p class="intro-subtitle intro-price">
                                                <a href="#"><span class="price-a">2024년 6월 15일(토) ~ 9월 8일(일)</span></a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide style={{ backgroundImage: `url(${slide_2}` }} >
                    <div class="overlay overlay-a"></div>
                    <div class="intro-content display-table">
                        <div class="table-cell">
                            <div class="container">
                                <div class="row">
                                    <div class="col-lg-8">
                                        <div class="intro-body">
                                            <h1 class="intro-title mb-4">
                                                <span> FC세븐일레븐</span>
                                                <br /> K리그x산리오
                                            </h1>
                                            <p class="intro-subtitle intro-price">
                                                <a href="#"><span class="price-a">2024년 7월 19일(금) ~ 8월 11일(일)</span></a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
                <div className="swiper-button-next" style={buttonStyle}></div>
                <div className="swiper-button-prev" style={buttonStyle}></div>
            </Swiper>

            <main id="main">

                <section class="section-property section-t8">
                    <div class="container">
                        <div class="row">
                            <div class="col-md-12">
                                <div class="title-wrap d-flex justify-content-between">
                                    <div class="title-box">
                                        <h2 class="title-a">최신 팝업스토어</h2>
                                    </div>
                                    <div class="title-link">
                                        <a href="#">전체 팝업스토어
                                            <span class="bi bi-chevron-right"></span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="property-carousel" class="swiper">
                            <div class="swiper-wrapper">

                                <div class="carousel-item-b swiper-slide">
                                    <div class="card-box-a card-shadow">
                                        <div class="img-box-a">
                                            <img src="/resources/assets/img/property-6.jpg" alt="" class="img-a img-fluid" />
                                        </div>
                                        <div class="card-overlay">
                                            <div class="card-overlay-a-content">
                                                <div class="card-header-a">
                                                    <h2 class="card-title-a">
                                                        <a href="#">망그러진 곰
                                                            <br /> 비밀의 다락방</a>
                                                    </h2>
                                                </div>
                                                <div class="card-body-a">
                                                    <div class="price-box d-flex">
                                                        <span class="price-a">서울특별시 영등포구</span>
                                                    </div>
                                                    <a href="#" class="link-a">자세히 보기
                                                        <span class="bi bi-chevron-right"></span>
                                                    </a>
                                                </div>
                                                <div class="card-footer-a">
                                                    <ul class="card-info d-flex justify-content-around">
                                                        <li>
                                                            <h4 class="card-info-title">사전예약</h4>
                                                            <span>✔</span>
                                                        </li>
                                                        <li>
                                                            <h4 class="card-info-title">주차</h4>
                                                            <span>✔</span>
                                                        </li>
                                                        <li>
                                                            <h4 class="card-info-title">휴무</h4>
                                                            <span>✘</span>
                                                        </li>
                                                        <li>
                                                            <h4 class="card-info-title">온라인스토어</h4>
                                                            <span>✔</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="carousel-item-b swiper-slide">
                                    <div class="card-box-a card-shadow">
                                        <div class="img-box-a">
                                            <img src="/resources/assets/img/property-3.jpg" alt="" class="img-a img-fluid" />
                                        </div>
                                        <div class="card-overlay">
                                            <div class="card-overlay-a-content">
                                                <div class="card-header-a">
                                                    <h2 class="card-title-a">
                                                        <a href="#">데드풀
                                                            <br /> 울버린</a>
                                                    </h2>
                                                </div>
                                                <div class="card-body-a">
                                                    <div class="price-box d-flex">
                                                        <span class="price-a">서울특별시 서대문구</span>
                                                    </div>
                                                    <a href="#" class="link-a">자세히 보기
                                                        <span class="bi bi-chevron-right"></span>
                                                    </a>
                                                </div>
                                                <div class="card-footer-a">
                                                    <ul class="card-info d-flex justify-content-around">
                                                        <li>
                                                            <h4 class="card-info-title">사전예약</h4>
                                                            <span>✘</span>
                                                        </li>
                                                        <li>
                                                            <h4 class="card-info-title">주차</h4>
                                                            <span>✔</span>
                                                        </li>
                                                        <li>
                                                            <h4 class="card-info-title">휴무</h4>
                                                            <span>✘</span>
                                                        </li>
                                                        <li>
                                                            <h4 class="card-info-title">온라인스토어</h4>
                                                            <span>✔</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="carousel-item-b swiper-slide">
                                    <div class="card-box-a card-shadow">
                                        <div class="img-box-a">
                                            <img src="/resources/assets/img/property-7.jpg" alt="" class="img-a img-fluid" />
                                        </div>
                                        <div class="card-overlay">
                                            <div class="card-overlay-a-content">
                                                <div class="card-header-a">
                                                    <h2 class="card-title-a">
                                                        <a href="#">이토준지
                                                            <br /> 호러하우스</a>
                                                    </h2>
                                                </div>
                                                <div class="card-body-a">
                                                    <div class="price-box d-flex">
                                                        <span class="price-a">서울특별시 마포구</span>
                                                    </div>
                                                    <a href="#" class="link-a">자세히 보기
                                                        <span class="bi bi-chevron-right"></span>
                                                    </a>
                                                </div>
                                                <div class="card-footer-a">
                                                    <ul class="card-info d-flex justify-content-around">
                                                        <li>
                                                            <h4 class="card-info-title">사전예약</h4>
                                                            <span>✘</span>
                                                        </li>
                                                        <li>
                                                            <h4 class="card-info-title">주차</h4>
                                                            <span>✔</span>
                                                        </li>
                                                        <li>
                                                            <h4 class="card-info-title">휴무</h4>
                                                            <span>✘</span>
                                                        </li>
                                                        <li>
                                                            <h4 class="card-info-title">온라인판매</h4>
                                                            <span>✔</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="carousel-item-b swiper-slide">
                                    <div class="card-box-a card-shadow">
                                        <div class="img-box-a">
                                            <img src="/resources/assets/img/property-10.jpg" alt="" class="img-a img-fluid" />
                                        </div>
                                        <div class="card-overlay">
                                            <div class="card-overlay-a-content">
                                                <div class="card-header-a">
                                                    <h2 class="card-title-a">
                                                        <a href="#">FC 세븐일레븐
                                                            <br /> K리그x산리오</a>
                                                    </h2>
                                                </div>
                                                <div class="card-body-a">
                                                    <div class="price-box d-flex">
                                                        <span class="price-a">서울특별시 송파구</span>
                                                    </div>
                                                    <a href="#" class="link-a">자세히 보기
                                                        <span class="bi bi-chevron-right"></span>
                                                    </a>
                                                </div>
                                                <div class="card-footer-a">
                                                    <ul class="card-info d-flex justify-content-around">
                                                        <li>
                                                            <h4 class="card-info-title">사전예약</h4>
                                                            <span>✘</span>
                                                        </li>
                                                        <li>
                                                            <h4 class="card-info-title">주차</h4>
                                                            <span>✔</span>
                                                        </li>
                                                        <li>
                                                            <h4 class="card-info-title">휴무</h4>
                                                            <span>✘</span>
                                                        </li>
                                                        <li>
                                                            <h4 class="card-info-title">온라인스토어</h4>
                                                            <span>✔</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="propery-carousel-pagination carousel-pagination"></div>

                    </div>
                </section>

                <section class="section-news section-t8">
                    <div class="container">
                        <div class="row">
                            <div class="col-md-12">
                                <div class="title-wrap d-flex justify-content-between">
                                    <div class="title-box">
                                        <h2 class="title-a">상품</h2>
                                    </div>
                                    <div class="title-link">
                                        <a href="#">전체 상품
                                            <span class="bi bi-chevron-right"></span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="news-carousel" class="swiper">
                            <div class="swiper-wrapper">

                                <div class="carousel-item-c swiper-slide">
                                    <div class="card-box-b card-shadow news-box">
                                        <div class="img-box-b">
                                            <img src="/resources/assets/img/post-2.jpg" alt="" class="img-b img-fluid" />
                                        </div>
                                        <div class="card-overlay">
                                            <div class="card-header-b">
                                                <div class="card-category-b">
                                                    <a href="#" class="category-b">Best</a>
                                                </div>
                                                <div class="card-title-b">
                                                    <h2 class="title-2">
                                                        <a href="#">뱃살망곰 키링
                                                            <br /> <span style={{ fontSize: "16px" }}> 괜찮아 ! 망그러진 곰 KeyRing</span></a>
                                                    </h2>
                                                </div>
                                                <div class="card-date">
                                                    <span class="date-b">7,500원</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="carousel-item-c swiper-slide">
                                    <div class="card-box-b card-shadow news-box">
                                        <div class="img-box-b">
                                            <img src="/resources/assets/img/post-5.jpg" alt="" class="img-b img-fluid" />
                                        </div>
                                        <div class="card-overlay">
                                            <div class="card-header-b">
                                                <div class="card-category-b">
                                                    <a href="#" class="category-b">Best</a>
                                                </div>
                                                <div class="card-title-b">
                                                    <h2 class="title-2">
                                                        <a href="#">데드풀&울버린 목걸이
                                                            <br /> <span style={{ fontSize: "16px" }}>친구와의 우정을 나눠보세요 !</span></a>
                                                    </h2>
                                                </div>
                                                <div class="card-date">
                                                    <span class="date-b">15,000원</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="carousel-item-c swiper-slide">
                                    <div class="card-box-b card-shadow news-box">
                                        <div class="img-box-b">
                                            <img src="/resources/assets/img/post-7.jpg" alt="" class="img-b img-fluid" />
                                        </div>
                                        <div class="card-overlay">
                                            <div class="card-header-b">
                                                <div class="card-category-b">
                                                    <a href="#" class="category-b">Best</a>
                                                </div>
                                                <div class="card-title-b">
                                                    <h2 class="title-2">
                                                        <a href="#"> 이토준지 토미에 반팔
                                                            <br /> <span style={{ fontSize: "16px" }}>잘생쁨 토미에 반팔티로 유니크하게 !</span></a>
                                                    </h2>
                                                </div>
                                                <div class="card-date">
                                                    <span class="date-b">31,000원</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="carousel-item-c swiper-slide">
                                    <div class="card-box-b card-shadow news-box">
                                        <div class="img-box-b">
                                            <img src="/resources/assets/img/post-3.jpg" alt="" class="img-b img-fluid" />
                                        </div>
                                        <div class="card-overlay">
                                            <div class="card-header-b">
                                                <div class="card-category-b">
                                                    <a href="#" class="category-b">Best</a>
                                                </div>
                                                <div class="card-title-b">
                                                    <h2 class="title-2">
                                                        <a href="#">K리그x산리오 교통카드
                                                            <br /><span style={{ fontSize: "16px" }}>오프라인 인기상품 교통카드</span></a>
                                                    </h2>
                                                </div>
                                                <div class="card-date">
                                                    <span class="date-b">8,600원</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div class="news-carousel-pagination carousel-pagination"></div>
                    </div>
                </section>

            </main>

        </>

    );
}
export default MainView;