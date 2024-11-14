import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';

const PopupList = () => {
    const [responseFPList, setResponseFPList] = useState(null);
    const [appendFPList, setAppendFPList] = useState([]);

    useEffect(() => {
        const fetchPopupList = async () => {
            try {
                const response = await axios.get('http://localhost:8080/popup/popupList');
                setResponseFPList(response.data);
            } catch (error) {
                alert(`Error fetching data: ${error.message}`);
            }
        };
        fetchPopupList();
    }, []);

    useEffect(() => {
        if (responseFPList && responseFPList.popupList) {
            const updatedFPList = responseFPList.popupList.map((pop) => (
                <div className="col-md-4" key={pop.sno}>
                    <div className="card-box-a card-shadow">
                        <div className="hiddenClass">
                            <div className="img-box-a">
                                <img src={pop.simg} alt="" className="img-a img-fluid" />
                            </div>
                            <div className="card-overlay">
                                <div className="card-overlay-a-content">
                                    <div className="card-header-a">
                                        <h2 className="card-title-a">
                                            <Link to={`/popup/popupread/${pop.sno}`}>{pop.sname}</Link>
                                        </h2>
                                    </div>
                                    <div className="card-body-a">
                                        <div className="price-box d-flex"></div>
                                        <a href="#" className="link-a">
                                            {pop.sname} <span className="bi bi-chevron-right"></span>
                                        </a>
                                    </div>
                                    <div className="card-footer-a">
                                        <ul className="card-info d-flex justify-content-around">
                                            <li>
                                                <h4 className="card-info-title">{pop.sdate}</h4>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ));
            setAppendFPList(updatedFPList);
        }
    }, [responseFPList]);

    return (
        <main id="main">
            <section className="intro-single">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 col-lg-8">
                            <div className="title-single-box">
                                <h1 className="title-single">진행중인 팝업스토어</h1>
                                <span className="color-text-a">골라골라</span>
                            </div>
                        </div>
                        <div className="col-md-12 col-lg-4">
                            <nav aria-label="breadcrumb" className="breadcrumb-box d-flex justify-content-lg-end">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><a href="#">홈</a></li>
                                    <li className="breadcrumb-item active" aria-current="page">팝업스토어</li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </section>
            <section className="property-grid grid">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="grid-option">
                                <form>
                                    <select className="custom-select">
                                        <option value="">All</option>
                                        <option value="1">New to Old</option>
                                        <option value="2">For Rent</option>
                                        <option value="3">For Sale</option>
                                    </select>
                                </form>
                            </div>
                        </div>
                        {appendFPList}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default PopupList;
