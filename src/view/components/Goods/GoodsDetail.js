import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import cookie from 'react-cookies';
import $ from 'jquery';
import Swal from 'sweetalert2';

const GoodsDetail = () => {

    const { sno, pno } = useParams();
    const [mno, setMno] = useState('');
    const [currentMno, setCurrentMno] = useState('');
    const [append_GoodsDetail, setAppend_GoodsDetail] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [append_review, setAppend_review] = useState([]);
    const [modifyRno, setModifyRno] = useState();
    const [modifyRcon, setModifyRcon] = useState('');
    const [grade, setGrade] = useState(0);
    const [grade_list, setGrade_list] = useState('');
    const [modifygrade, setModifyGrade] = useState(0);
    const [modifygrade_list, setModifyGrade_list] = useState('');

    const increase = () => {
        setQuantity(quantity => quantity + 1);
    };

    const decrease = () => {
        if (quantity > 1) {
            setQuantity(quantity => quantity - 1);
        }
    };

    const grade_select = () => {

        let result = [];

        for (let i = 0; i < 5; i++) {
            if (i < grade) {
                result.push(
                    <span onClick={() => setGrade(i + 1)} style={{ cursor: "pointer" }}>★</span>
                )
            } else {
                result.push(
                    <span onClick={() => setGrade(i + 1)} style={{ cursor: "pointer" }}>☆</span>
                )
            }
        }

        return setGrade_list(result);
    }

    const modifygrade_select = () => {

        let result = [];

        for (let i = 0; i < 5; i++) {
            if (i < modifygrade) {
                result.push(
                    <span onClick={() => setModifyGrade(i + 1)} style={{ cursor: "pointer" }}>★</span>
                )
            } else {
                result.push(
                    <span onClick={() => setModifyGrade(i + 1)} style={{ cursor: "pointer" }}>☆</span>
                )
            }
        }

        return setModifyGrade_list(result);
    }

    useEffect(() => {
        if(cookie.load("userid") !== undefined){
            callMemberInfoApi();
        }
        callGoodsDetailApi();
        callReviewListApi();
    }, [quantity, grade, currentMno, modifyRno, modifygrade, modifygrade_list]);

    useEffect(() => {
        if (modifyRno !== null) {
            const review = append_review[modifyRno];
            if (review) {
                setModifyRcon(review.rcon); // 선택된 리뷰의 내용을 set
            }
        }
    }, [modifyRno, append_review]); // modifyRno나 reviews가 변경될 때만 실행

    const callMemberInfoApi = () => {

        if (currentMno !== mno || currentMno === "") {
            axios.post("http://localhost:8080/member/jwtChk", {
                token1: cookie.load('userid'),
                token2: cookie.load('username')
            }).then(response => {
                axios.post("http://localhost:8080/member/jwtLogin", {
                    mid: response.data.token1,
                    mpw: cookie.load("userpassword")
                }).then(response => {
                    try {
                        setMno(response.data.jwtLogin[0].mno);
                        setCurrentMno(mno)
                    } catch (error) {
                        console.log("작업중 오류가 발생하였습니다.");
                    }
                }).catch(error => { console.log("작업중 오류가 발생하였습니다.") });
            }).catch(error => { console.log("작업중 오류가 발생하였습니다.") });
        }

    }

    const callGoodsDetailApi = () => {
        axios.get(`http://localhost:8080/goods/goodsdetail/${sno}/${pno}`, {
        }).then(response => {
            try {
                setAppend_GoodsDetail(GoodsDetail_Append(response.data));
            } catch (error) {
                alert("작업중 오류가 발생하였습니다.");
            }
        }).catch(error => { alert("작업중 오류가 발생하였습니다.") });
    }

    const GoodsDetail_Append = (Detail) => {

        grade_select();

        let result = []
        let GoodsDetail = Detail.goodsdetail

        for (let i = 0; i < GoodsDetail.length; i++) {
            let data = GoodsDetail[i]

            result.push(

                <div className="login-box" style={{ width: "100%", maxWidth: "500px", marginTop: "10%" }}>
                    <div className="login-box-body" style={{ padding: "20px" }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
                            <div className="product-card" style={{ width: '100%', padding: '10px', display: 'flex', justifyContent: 'center' }}>
                                <img
                                    src={require(`../../../resources/assets/img/${data.pimg}.jpg`)}
                                    alt="상품 이미지"
                                    style={{ maxWidth: '100%', borderRadius: '8px' }}
                                />
                            </div>

                            <div className="product-detail" style={{ textAlign: 'center', padding: '10px' }}>
                                <h2>{data.pname}</h2>
                                <p>가격: <strong>{data.pprice}원</strong></p>
                                <p>상품 설명: <br />{data.pcon}</p>
                            </div>
                        </div>

                        <div className="purchase-info" style={{ padding: "20px", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <label htmlFor="quantity">수량:</label>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" }}>
                                <button type="button" onClick={decrease} style={{ marginRight: "5px" }}>-</button>
                                <input
                                    type="text"
                                    name="quantity"
                                    min="1"
                                    value={quantity}
                                    readOnly
                                    style={{ width: "50px", textAlign: "center", margin: "0" }}
                                />
                                <button type="button" onClick={increase} style={{ marginLeft: "5px" }}>+</button>
                            </div>

                            <div className="row" style={{ display: "flex", flexDirection: "column", marginTop: "20px", width: '100%', alignItems: 'center' }}>
                                <div id="bukketBtn" style={{ backgroundColor: "#ffffff", borderColor: "#2eca6a", color: "#2eca6a", padding: "10px", textAlign: "center", marginBottom: "10px", width: '100%' }} className="btn btn-primary btn-block btn-flat">장바구니 담기</div>
                                <div id="buyBtn" style={{ backgroundColor: "#2eca6a", borderColor: "#2eca6a", padding: "10px", textAlign: "center", width: '100%' }} className="btn btn-primary btn-block btn-flat">구매하기</div>
                            </div>
                        </div>
                    </div>
                </div>

            )

        }
        return result;
    }

    const callReviewListApi = () => {
        axios.get(`http://localhost:8080/goods/reviewlist/${pno}`, {
        }).then(response => {
            try {
                setAppend_review(reviewList_append(response.data));
            } catch {
                alert("작업중 오류가 발생하였습니다.");
            }
        }).catch(error => { alert("작업중 오류가 발생하였습니다.") });
    }

    const reviewList_append = (review) => {

        modifygrade_select();

        let result = [];
        let reviewList = review.reviewlist

        const thisMno = currentMno

        for (let i = 0; i < reviewList.length; i++) {
            let data = reviewList[i];
            const formattedDate = formatDate(data.rdate);
            const formattedGrade = formatGrade(data.rgrade);

            const writer_chk = thisMno === data.mno;

            if (i === modifyRno) {
                result.push(
                    <li style={{ listStyleType: "none" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", margin: "0 auto", width: "50%", position: "relative" }}>
                            <h4>{data.mid}</h4>
                            <form method="" name="frm">
                                <input type="hidden" name="rgrade" value={modifygrade}></input>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', marginBottom: '20px', width: '700px' }}>
                                    <textarea
                                        id="writeReview"
                                        name="rcon"
                                        value={modifyRcon}
                                        onChange={modifyRconChange}
                                        placeholder="리뷰를 작성하세요..."
                                        rows="4"
                                        style={{ borderRadius: '5px', padding: '10px', marginBottom: '10px' }}
                                    />
                                    <span style={{ marginBottom: "10px" }}>평점: {modifygrade_list}</span>
                                    <div style={{ backgroundColor: "#2eca6a", borderColor: "#2eca6a", padding: "10px", textAlign: "center", width: '100%' }} className="btn btn-primary btn-block btn-flat" onClick={() => modifyReviewSubmit(data.rno)}>수정</div>
                                </div>
                            </form>

                            <div style={{ position: 'absolute', top: 0, right: 0, display: 'flex', gap: '10px' }}>
                                <div onClick={() => modifyCancel()} style={{ cursor: "pointer" }}>취소</div>
                            </div>

                            <hr style={{ width: "100%", border: "1px solid #2eca6a", margin: "10px 0" }} />
                        </div>
                    </li>
                )
            } else {
                result.push(
                    <li style={{ listStyleType: "none" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", margin: "0 auto", width: "50%", position: "relative" }}>
                            <h4>{data.mid}</h4>
                            <strong style={{ marginBottom: "10px" }}>{data.rcon}</strong>
                            <span style={{ marginBottom: "10px" }}>{formattedGrade}</span>
                            <span>{formattedDate}</span>

                            {writer_chk && (
                                <div style={{ position: 'absolute', top: 0, right: 0, display: 'flex', gap: '10px' }}>
                                    <div onClick={() => modifyReview(i, data.rcon, data.rgrade)} style={{ cursor: "pointer" }}>수정</div>
                                    <div onClick={() => deleteReview(data.rno)} style={{ cursor: "pointer" }}>삭제</div>
                                </div>
                            )}

                            <hr style={{ width: "100%", border: "1px solid #2eca6a", margin: "10px 0" }} />
                        </div>
                    </li>
                )
            }
        }
        return result;
    }

    const formatDate = (rdate) => {
        const date = new Date(rdate);
        return date.toLocaleString('sv-SE', { // 'sv-SE'는 YYYY-MM-DD 형식
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false // 24시간 형식
        }).replace(' ', 'T').replace('T', ' ').slice(0, 16); // 'T'를 공백으로 변경
    };

    const formatGrade = (rgrade) => {

        const starGrade = "★★★★★";

        return starGrade.slice(0, rgrade) + "☆☆☆☆☆".slice(0, 5 - rgrade);

    }

    const modifyReview = (index, rcon, rgrade) => {
        setModifyRno(index);
        setModifyRcon(rcon);
        setModifyGrade(rgrade);
    }

    const modifyRconChange = (e) => {
        setModifyRcon(e.target.value);
    }

    const modifyCancel = () => {
        setModifyRno('');
        setModifyRcon('');
        setModifyGrade('');
    }

    const modifyReviewSubmit = async (rno) => {

        var jsonstr = $("form[name='frm']").serialize();
        jsonstr = decodeURIComponent(jsonstr);
        var Json_form = JSON.stringify(jsonstr).replace(/\"/gi, '')
        Json_form = "{\"" + Json_form.replace(/\&/g, '\",\"').replace(/=/gi, '\":"') + "\"}";

        try {
            const response = await fetch(`http://localhost:8080/goods/modifyreview/${rno}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: Json_form,
            });
            const body = await response.text();
            if (body === "succ") {
                await sweetalert('리뷰가 변경되었습니다.', '', 'success', '닫기');
                setModifyRno('');
                setModifyRcon('');
                setModifyGrade('');
            } else {
                alert('작업중 오류가 발생하였습니다.');
            }
        } catch (error) {
            alert('작업중 오류가 발생하였습니다.');
        }
    }

    const deleteReview = async (rno) => {
        const confirm = await Swal.fire({
            title: '정말로 삭제하시겠습니까?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '삭제',
            cancelButtonText: '취소'
        });

        if (confirm.isConfirmed) {
            try {
                const response = await fetch(`http://localhost:8080/goods/deletereview/${rno}`, {
                    method: 'POST'
                });
                const body = await response.text();
                if (body === "succ") {
                    await sweetalert('리뷰가 삭제되었습니다.', '', 'success', '닫기');
                    callReviewListApi();
                } else {
                    alert('작업중 오류가 발생하였습니다.');
                }
            } catch (error) {
                alert('작업중 오류가 발생하였습니다.');
            }
        }
    }

    const submitClick = async () => {
        const writeReview_chk = $("#writeReview").val();

        const fnvalidate = () => {

            if (mno === "") {
                window.location.href = "/login";
                return false;
            }

            if (writeReview_chk === "") {
                sweetalert('리뷰를 작성해주세요.', '', 'error', '닫기');
                return false;
            }

            return true;
        }

        if (fnvalidate()) {
            var jsonstr = $("form[name='frm']").serialize();
            jsonstr = decodeURIComponent(jsonstr);
            var Json_form = JSON.stringify(jsonstr).replace(/\"/gi, '')
            Json_form = "{\"" + Json_form.replace(/\&/g, '\",\"').replace(/=/gi, '\":"') + "\"}";

            try {
                const response = await fetch('http://localhost:8080/goods/writereview', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: Json_form,
                });
                const body = await response.text();
                if (body === "succ") {
                    await sweetalert('리뷰가 작성되었습니다.', '', 'success', '닫기');
                    $("#writeReview").val("");
                    setGrade(0);
                    callReviewListApi();
                } else {
                    alert('작업중 오류가 발생하였습니다.');
                }
            } catch (error) {
                alert('작업중 오류가 발생하였습니다.');
            }

        }

    }

    const sweetalert = (title, contents, icon, confirmButtonText) => {
		return Swal.fire({
			title,
			text: contents,
			icon,
			confirmButtonText
		});
	};

    return (
        <>
            <main id="main">
                {append_GoodsDetail}
            </main>

            <div style={{ textAlign: "center" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", margin: "0 auto", width: "50%" }}>
                    <h2>상품평</h2>
                    <hr style={{ width: "100%", border: "1px solid #2eca6a", margin: "10px 0" }} />
                </div>
            </div>

            <div className="review" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div className="review-write" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <h4>리뷰작성</h4>
                    <form method="post" name="frm">
                        <input type="hidden" name="pno" value={pno}></input>
                        <input type="hidden" name="mno" value={mno}></input>
                        <input type="hidden" name="rgrade" value={grade}></input>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', marginBottom: '20px', width: '700px' }}>
                            <textarea
                                id="writeReview"
                                name="rcon"
                                placeholder="리뷰를 작성하세요..."
                                rows="4"
                                style={{ borderRadius: '5px', padding: '10px', marginBottom: '10px' }}
                            />
                            <span style={{ marginBottom: "10px" }} >평점: {grade_list}</span>
                            <div style={{ backgroundColor: "#2eca6a", borderColor: "#2eca6a", padding: "10px", textAlign: "center", width: '100%' }} className="btn btn-primary btn-block btn-flat" onClick={() => submitClick()}>리뷰작성</div>
                        </div>
                    </form>
                </div>
            </div>

            <div style={{ textAlign: "center" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", margin: "0 auto", width: "50%" }}>
                    <hr style={{ width: "100%", border: "1px solid #2eca6a", margin: "10px 0" }} />
                </div>
            </div>

            <div class="review-list">
                <ul>
                    {append_review}
                </ul>
            </div>


        </>
    );

}
export default GoodsDetail;