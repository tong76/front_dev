import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import $ from 'jquery';

const GoodsList = () => {

    const {sno} = useParams();
    const [append_GoodsList, setAppend_GoodsList] = useState([]);

    useEffect(() => {
        callGoodsListApi();
    }, []);

    const callGoodsListApi = () => {
        axios.get(`http://localhost:8080/goods/goodslist/${sno}`, {
        }).then(response => {
            try {
                setAppend_GoodsList(GoodsList_Append(response.data));
            } catch (error) {
                alert("작업중 오류가 발생하였습니다.");
            }
        }).catch(error => { alert("작업중 오류가 발생하였습니다."); });
    }

    const GoodsList_Append = (Goods) => {
        let result = []
        let GoodsList = Goods.goodslist

        for (let i = 0; i < GoodsList.length; i++) {
            let data = GoodsList[i]
            let price = data.pprice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

            result.push(
                <div class="mcol-md-3" key={i}>
                    <div class="mcard-box-b">
                        <div class="mimg-box-b">
                            <a href={`/goods/goodsdetail/${data.sno}/${data.pno}`}>
                                <img src={require(`../../../resources/assets/img/${data.pimg}.jpg`)} alt="" />
                            </a>
                        </div>
                        <div class="mcard-overlay">
                            <div class="mcard-header-b">
                                <div class="mcard-category-b">
                                    <span class="mcategory-b">best</span>
                                </div>
                                <div class="mcard-title-b">
                                    <h2 class="title-2">
                                        <a href={`/goods/goodsdetail/${data.sno}/${data.pno}`}>
                                            {data.pname}
                                        </a>
                                    </h2>
                                </div>
                                <div class="mcard-date">
                                    <span class="date-b">{price}원</span>
                                </div>
                                <div class="mcard-date">
                                    <span class="date-b">{data.pdate}</span>
                                </div>
                                <div class="mcard-date">
                                    <span class="date-b">남은 수량: [{data.pquan}]</span>
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
                                <h1 class="title-single">굿즈</h1>
                            </div>
                        </div>
                        <div class="col-md-12 col-lg-4">
                            <nav aria-label="breadcrumb" class="breadcrumb-box d-flex justify-content-lg-end">
                                <ol class="breadcrumb">
                                    <li class="breadcrumb-item">
                                        <a href="/">메인으로</a>
                                    </li>
                                    <li class="breadcrumb-item active" aria-current="page">
                                        굿즈스토어
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </section>

            <section class="news-grid grid">
                <div class="container">
                    <div class="row">
                        {append_GoodsList}
                    </div>
                </div>
            </section>

        </main>
    );
}
export default GoodsList;