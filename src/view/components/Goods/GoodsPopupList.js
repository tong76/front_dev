import React, { useEffect, useState } from 'react';
import axios from 'axios';
import $ from 'jquery';

const GoodsPopupList = () => {

    const [append_GoodsPopupList, setAppend_GoodsPopupList] = useState([]);

    useEffect(() => {
        callGoodsPopupListApi();
    }, []);

    const callGoodsPopupListApi = () => {
        axios.get("http://localhost:8080/goods/goodspopuplist", {
        }).then(response => {
            try {
                setAppend_GoodsPopupList(GoodsPopupList_append(response.data));
            } catch (error) {
                alert("작업중 오류가 발생하였습니다.");
            }
        }).catch(error => { alert("작업중 오류가 발생하였습니다."); });
    }

    const GoodsPopupList_append = (GoodsPopup) => {
        let result = []
        let GoodsPopupList = GoodsPopup.goodspopuplist

        for (let i = 0; i < GoodsPopupList.length; i++) {
            let data = GoodsPopupList[i]
            result.push(
                <div class="col-md-4" key={i}>
                    <div class="card-box-a card-shadow">
                        <div class="img-box-a">
                            <img src={require(`../../../resources/assets/img/${data.sgimg}.jpg`)} alt="" class="img-a img-fluid" />
                        </div>
                        <div class="card-overlay">
                            <div class="card-overlay-a-content">
                                <div class="card-header-a">
                                    <h2 class="card-title-a">
                                        <a href={`/goods/goodslist/${data.sno}`}>{data.sname}
                                        </a>
                                    </h2>
                                </div>
                                <div class="card-body-a">
                                    <div class="price-box d-flex"></div>
                                    <a href="#" class="link-a">{data.splc} <span
                                        class="bi bi-chevron-right"></span>
                                    </a>
                                </div>
                                <div class="card-footer-a">
                                    <ul class="card-info d-flex justify-content-around">
                                        <li>
                                            <h4 class="card-info-title">개최날짜: {data.sdate}</h4> <span></span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        return result;
    }

    return (
        <main id="main">
            <section class="intro-single">
                <div class="container">
                    <div class="row">
                        <div class="col-md-12 col-lg-8">
                            <div class="title-single-box">
                                <h1 class="title-single">굿즈스토어</h1>
                                <span class="color-text-a">팝업스토어에서 판매중인 기간 한정 굿즈들을 만나보세요!</span>
                            </div>
                        </div>
                        <div class="col-md-12 col-lg-4">
                            <nav aria-label="breadcrumb"
                                class="breadcrumb-box d-flex justify-content-lg-end">
                                <ol class="breadcrumb">
                                    <li class="breadcrumb-item"><a href="/">메인으로</a></li>
                                    <li class="breadcrumb-item active" aria-current="page">
                                        굿즈스토어</li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </section>
            <section class="news-grid grid">
                <div class="container">
                    <div class="row">
                        {append_GoodsPopupList}
                    </div>
                </div>
            </section>

        </main>

    );

}

export default GoodsPopupList;