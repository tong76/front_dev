import React, { useEffect, useState } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';

const BucketList = () => {
    const [mno, setMno] = useState('');
    const [append_BucketList, setAppend_BucketList] = useState([]);
    const [isChecked, setIsChecked] = useState(true);
    const [checkedValues, setCheckedValues] = useState([]);
    const [totalPrice, setTotalPrice] = useState([]);

    const increase = (i, pno, bkcnt, pquan) => {

        if (bkcnt >= pquan) {
            alert("수량을 확인해주세요.");
            return false;
        }

        try {
            axios.post("http://localhost:8080/bucket/increasequan", {
                mno: mno,
                pno: pno
            }).then(response => {
                const body = response.data;
                if (body === "succ") {
                    callBucketListApi(mno, i);
                } else {
                    alert('작업중 오류가 발생하였습니다.');
                }
            })
        } catch (error) {
            alert('작업중 오류가 발생하였습니다.');
        }
    };

    const decrease = (i, pno, bkcnt) => {

        if (bkcnt === 1) {
            alert("최소 1개입니다.");
            return false;
        }

        try {
            axios.post("http://localhost:8080/bucket/decreasequan", {
                mno: mno,
                pno: pno
            }).then(response => {
                const body = response.data;
                if (body === "succ") {
                    callBucketListApi(mno, i);
                } else {
                    alert('작업중 오류가 발생하였습니다.');
                }
            })
        } catch (error) {
            alert('작업중 오류가 발생하였습니다.');
        }

    };

    const deleteClick = (i, pno) => {

        try {
            axios.post("http://localhost:8080/bucket/deletebucket", {
                mno: mno,
                pno: pno
            }).then(response => {
                const body = response.data;
                if (body === "succ") {
                    setCheckedValues(prevCheckedValues =>
                        prevCheckedValues.filter((_, index) => index !== i)
                    );
                    callBucketListApi(mno);
                } else {
                    alert('작업중 오류가 발생하였습니다.');
                }
            })
        } catch (error) {
            alert('작업중 오류가 발생하였습니다.');
        }

    }

    const selectDeleteBucket = () => {

        if (!checkedValues.some(value => value === true)) {
            alert("상품을 선택해 주세요.");
            return false;
        }

        const isConfirm = window.confirm("선택한 상품을 삭제하시겠습니까?");

        if (isConfirm) {
            // 체크가 된 상품들의 인덱스를 반환
            const products = checkedValues.map((value, index) => value === true ? index : -1).filter(index => index !== -1);

            try {
                axios.post("http://localhost:8080/bucket/deletebuckets", {
                    mno: mno,
                    products: products
                }).then(response => {
                    const body = response.data;
                    if (body === "succ") {
                        setCheckedValues(prevCheckedValues =>
                            prevCheckedValues.filter((_, index) => !products.includes(index))
                        );
                        callBucketListApi(mno);
                    } else {
                        alert('작업중 오류가 발생하였습니다.');
                    }
                })
            } catch (error) {
                alert('작업중 오류가 발생하였습니다.');
            }
        }


    }

    const allBucketSelect = () => {

        // 전부 체크(하나라도 체크 되어있으면)
        if (checkedValues.some(value => value === false)) {
            setIsChecked(true);
            const updatedCheckedValues = checkedValues.map(value => true);
            setCheckedValues(updatedCheckedValues);
        }
        // 전부 체크 안함
        else {
            setIsChecked(!isChecked);
            const updatedCheckedValues = checkedValues.map(value => false);
            setCheckedValues(updatedCheckedValues);
            const updatedTotalPrice = totalPrice.map(value => 0);
            setTotalPrice(updatedTotalPrice);
        }

    }

    const handleCheckboxChange = (i, price) => {

        if (isChecked === false) {
            setIsChecked(!isChecked);
        }
        const updatedCheckedValues = checkedValues.map((value, index) => {
            return index === i ? !value : value; // 해당 인덱스만 반전
        });

        setCheckedValues(updatedCheckedValues);

        setTotalPrice((prev) => {
            const updatedTotalPrice = [...prev]; // 이전 배열을 복사
            if (checkedValues[i]) {
                // 체크가 해제된 경우: 해당 인덱스를 0으로 변경
                updatedTotalPrice[i] = 0;
            } else {
                // 체크된 경우: 해당 인덱스에 price를 추가
                updatedTotalPrice[i] = price;
            }

            return updatedTotalPrice; // 수정된 배열 반환
        });

    };

    const calculateSum = () => {
        return totalPrice.reduce((acc, curr) => acc + curr, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); // 체크된 값들의 합
    };

    const gotoPayment = () => {
        const selectChk = checkedValues.every(value => value === false);
        if (selectChk) {
            alert("상품을 선택해주세요.");
            return false;
        } else {
            const findChecked = checkedValues.map((value, index) => value === true ? index : -1).filter(index => index !== -1);
            window.location.href = `/payment/paymentwindow?selects=${findChecked.join(',')}`
        }
    }

    useEffect(() => {
        if (cookie.load("userid") !== undefined) {
            callMemberInfoApi();
        }
    }, [mno, isChecked, checkedValues]);

    const callMemberInfoApi = () => {
        axios.post("http://localhost:8080/member/jwtChk", {
            token1: cookie.load('userid'),
            token2: cookie.load('username')
        }).then(response => {
            axios.post("http://localhost:8080/member/jwtLogin", {
                mid: response.data.token1,
                mpw: cookie.load("userpassword")
            }).then(response => {
                const newMno = response.data.jwtLogin[0].mno;
                setMno(newMno);
                callBucketListApi(newMno);
            }).catch(error => { console.log("작업중 오류가 발생하였습니다."); });
        }).catch(error => { console.log("작업중 오류가 발생하였습니다."); });
    };

    const callBucketListApi = (mno, i) => {
        axios.post(`http://localhost:8080/bucket/bucketlist`, {
            mno: mno
        }).then(response => {
            setAppend_BucketList(BucketList_Append(response.data));

            // 장바구니에 담긴 개수에 따라 checkedValues 한번만 초기화
            if (checkedValues.length < response.data.bucketlist.length) {
                setCheckedValues(Array(response.data.bucketlist.length).fill(true));
            }

            // 다 선택 되어있으면 실행
            if (checkedValues.every(value => value === true)) {
                const prices = [];
                for (let i = 0; i < response.data.bucketlist.length; i++) {
                    prices.push(response.data.bucketlist[i].pprice * response.data.bucketlist[i].bkcnt);
                }
                setTotalPrice(prices);
            }
            // 다 선택 안되어있으면 실행
            else if (checkedValues.every(value => value === false)) {
                setTotalPrice(Array(response.data.bucketlist.length).fill(0));
            }
            // n개 선택 했을 때 실행
            else if (checkedValues.some(value => value === true)) {
                const prices = [];
                const findChecked = checkedValues.map((value, index) => value === true ? index : -1).filter(index => index !== -1);
                for (let i = 0; i < response.data.bucketlist.length; i++) {
                    findChecked.includes(i) ? prices.push(response.data.bucketlist[i].pprice * response.data.bucketlist[i].bkcnt)
                        : prices.push(0);
                }
                setTotalPrice(prices);
            }
        })
            .catch(error => { alert("작업중 오류가 발생하였습니다."); });
    };

    const BucketList_Append = (bucket) => {
        let result = [];
        let bucketlist = bucket.bucketlist;

        for (let i = 0; i < bucketlist.length; i++) {
            let data = bucketlist[i];
            let price = (data.pprice * data.bkcnt).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

            result.push(
                <li key={i} style={{ listStyleType: "none", display: 'flex', alignItems: 'flex-start', marginBottom: '20px', position: 'relative' }}>
                    <input
                        type="checkbox"
                        className="custom-checkbox"
                        id={`customCheckbox + ${i}`}
                        checked={checkedValues[i] && isChecked}
                        onChange={() => handleCheckboxChange(i, data.pprice * data.bkcnt)}
                    /><label htmlFor={`customCheckbox + ${i}`} style={{ marginRight: "10px" }}></label>
                    <a href={`/goods/goodsdetail/${data.sno}/${data.pno}`}>
                        <img
                            src={require(`../../../resources/assets/img/${data.pimg}.jpg`)}
                            alt="상품 이미지"
                            style={{ maxWidth: '100px', borderRadius: '8px', marginRight: '15px' }}
                        />
                    </a>
                    <div style={{ flex: 1 }}>
                        <h4><a style={{ color: "black" }} href={`/goods/goodsdetail/${data.sno}/${data.pno}`}>{data.pname}</a></h4>
                        <strong style={{ marginBottom: "10px", display: "block" }}>{data.pdate}</strong>
                        <span style={{ marginBottom: "10px", display: "block" }}>남은 수량: {data.pquan}</span>
                        <strong style={{ marginBottom: "10px", display: "block" }}>{price}원</strong>
                        <button type="button" onClick={() => decrease(i, data.pno, data.bkcnt)} style={{ marginRight: "5px" }}>-</button>
                        <input
                            type="text"
                            name="quantity"
                            value={data.bkcnt}
                            readOnly
                            style={{ width: "50px", textAlign: "center", margin: "0" }}
                        />
                        <button type="button" onClick={() => increase(i, data.pno, data.bkcnt, data.pquan)} style={{ marginLeft: "5px" }}>+</button>
                        <hr style={{ width: "100%", border: "1px solid #2eca6a", margin: "10px 0" }} />
                    </div>
                    <button
                        onClick={() => deleteClick(i, data.pno)}
                        style={{
                            position: 'absolute',
                            right: '10px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        X
                    </button>
                </li>
            );
        }
        return result;
    };

    return (
        <>

            <div style={{ marginTop: "10%", textAlign: "center" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", margin: "0 auto", width: "50%" }}>
                    <h2>장바구니</h2>
                    <hr style={{ width: "100%", border: "1px solid #2eca6a", margin: "10px 0" }} />
                </div>
            </div>

            <div style={{ width: '40%', margin: '0 auto' }}> {/* Center the container */}
                {append_BucketList.length > 0 ?
                    <div style={{ margin: "4% 0 4% 0", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <input
                                type="checkbox"
                                className="custom-checkbox"
                                id="customCheckbox"
                                checked={isChecked && checkedValues.every(value => value === true)}
                                onChange={allBucketSelect}
                            /><label htmlFor="customCheckbox" style={{ marginRight: "10px" }}></label>
                            <strong style={{ cursor: "pointer" }} onClick={allBucketSelect}>전체 선택</strong>
                        </div>
                        <strong style={{ cursor: "pointer" }} onClick={selectDeleteBucket}>선택 삭제</strong>
                    </div> : null}

                {append_BucketList.length > 0 ?
                    <div className="review-list" style={{ paddingLeft: 0 }}>
                        <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                            {append_BucketList}
                        </ul>
                    </div>
                    :
                    <div className="review-list" style={{ paddingLeft: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                        <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                            <strong style={{ textAlign: "center" }}>장바구니에 담은 상품이 없습니다.</strong>
                        </ul>
                    </div>}

                <div className="row" style={{ display: "flex", flexDirection: "column", marginTop: "20px", width: '100%', alignItems: 'center' }}>
                    <div id="buyBtn" style={{ backgroundColor: "#2eca6a", borderColor: "#2eca6a", padding: "10px", textAlign: "center", width: '100%' }} className="btn btn-primary btn-block btn-flat">
                        {append_BucketList.length > 0 ? <a onClick={() => gotoPayment()} style={{ color: "#ffffff" }}>{calculateSum() === 0 ? null : calculateSum() + "원"} 구매하기 ({totalPrice.filter(value => value !== 0).length})</a> : <a style={{ color: "#ffffff" }} href="/goods/goodspopuplist">상품보러가기</a>}
                    </div>
                </div>
            </div>


        </>
    );
};

export default BucketList;