import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import cookie from 'react-cookies';
import $ from 'jquery';

const PaymentWindow = () => {

    const [mno, setMno] = useState('');
    const [searchParams] = useSearchParams();
    const sno = searchParams.get('sno');
    const pno = searchParams.get('pno');
    const bkcnt = searchParams.get('bkcnt');
    const selects = searchParams.get('selects');
    const [append_BucketList, setAppend_BucketList] = useState([]);
    const [totalPrice, setTotalPrice] = useState([]);

    const [recipient, setRecipient] = useState('');  // 수령자
    const [phone, setPhone] = useState('');          // 전화번호
    const [address, setAddress] = useState('');      // 배송지
    const [searchedAddress, setSearchedAddress] = useState([]);  // 검색된 주소
    const [definedAddress, setdefinedAddress] = useState(''); // 정의된 주소
    const [detailAddress, setDetailAddress] = useState(''); // 응답받은 상세주소
    const [dongho, setDongho] = useState(''); // 동/호수

    const calculateSum = () => {
        return totalPrice.reduce((acc, curr) => acc + curr, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); // 체크된 값들의 합
    };

    useEffect(() => {
        if (cookie.load("userid") !== undefined) {
            $("#main").show();
            callMemberInfoApi();
        } else {
            $("#main").hide();
        }
    }, [mno])

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
                setRecipient(response.data.jwtLogin[0].mname);
                setPhone(response.data.jwtLogin[0].mcell);
                if (sno !== null && pno !== null && bkcnt !== null) {
                    callPaymentListApiFromDetail(newMno);
                } else {
                    callPaymentListApiFromBucket(newMno);
                }
            }).catch(error => { console.log("작업중 오류가 발생하였습니다."); });
        }).catch(error => { console.log("작업중 오류가 발생하였습니다."); });
    };

    const callPaymentListApiFromDetail = (mno, i) => {
        axios.post(`http://localhost:8080/bucket/bucketlist`, {
            mno: mno,
            sno: sno,
            pno: pno
        }).then(response => {
            setAppend_BucketList(BucketList_Append(response.data));
            const prices = [];
            for (let i = 0; i < response.data.bucketlist.length; i++) {
                prices.push(response.data.bucketlist[i].pprice * response.data.bucketlist[i].bkcnt);
            }
            setTotalPrice(prices);
        })
            .catch(error => { alert("작업중 오류가 발생하였습니다."); });
    };

    const callPaymentListApiFromBucket = (mno) => {

        const selected = selects.split(',').map(Number);

        axios.post(`http://localhost:8080/bucket/bucketlist`, {
            mno: mno,
            selects: selected
        },).then(response => {
            setAppend_BucketList(BucketList_Append(response.data));
            const prices = [];
            for (let i = 0; i < response.data.bucketlist.length; i++) {
                prices.push(response.data.bucketlist[i].pprice * response.data.bucketlist[i].bkcnt);
            }
            setTotalPrice(prices);
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
                        <span style={{ marginBottom: "10px", display: "block" }}>{data.bkcnt}개</span>
                        <strong style={{ marginBottom: "10px", display: "block" }}>{price}원</strong>
                        <hr style={{ width: "100%", border: "1px solid #2eca6a", margin: "10px 0" }} />
                    </div>
                </li>
            );
        }
        return result;
    };

    const searchAddress = async (address) => {
        const kakaoApiKey = process.env.REACT_APP_KAKAO_REST_API_KEY;  // 카카오에서 발급받은 REST API 키
        const url = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`;

        try {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `KakaoAK ${kakaoApiKey}`,
                },
            });

            const data = response.data;

            if (data.documents.length > 0) {
                // 주소가 존재하는 경우
                console.log(data.documents[0]);
                setdefinedAddress(true);
                let address = [];
                address.push(data.documents[0].address.address_name);
                address.push(data.documents[0].road_address.address_name);
                setSearchedAddress(address);
                setDetailAddress(data.documents[0].road_address.building_name);
            } else {
                setdefinedAddress(false);
                setSearchedAddress(null);
            }
        } catch (error) {
            setdefinedAddress(false);
            setSearchedAddress(null);
        }
    };

    const gotoCheckout = () => {

        const orderInfoChk = () => {
            const recipient = $("#recipient").val();
            const phone = $("#phone").val();
            const address = $("#address").val();
            const detailaddress = $("#detailaddress").val();
            const dongho = $("#dongho").val();

            console.log(recipient, phone, address, detailaddress, dongho)

            // 각 값이 빈 값 또는 null 또는 undefined 인지 확인
            if (recipient === undefined || recipient === null || recipient === ''
                || phone === undefined || phone === null || phone === ''
                || address === undefined || address === null || address === ''
                || detailaddress === undefined || detailaddress === null || detailaddress === ''
                || dongho === undefined || dongho === null || dongho === ''
            ) {
                alert("주문자 정보를 입력해주세요.");
                return false;
            } else {

                const fullAddress = searchedAddress.join(" (도로명)") + "\n" + detailaddress + " " + dongho;

                sessionStorage.setItem("name", recipient);
                sessionStorage.setItem("cell", phone);
                sessionStorage.setItem("address", fullAddress);

                return true;
            }

        }

        if (orderInfoChk()) {

            if (selects !== undefined && selects !== null) {
                // 장바구니에서 값을 받아 이동
                window.location.href = `/payment/checkoutpage?selects=${selects.split(',').map(Number)}`;
            } else {
                // 상품상세에서 값을 받아 이동
                window.location.href = `/payment/checkoutpage?sno=${sno}&pno=${pno}&bkcnt=${bkcnt}`;
            }
        }

    }

    return (
        <div id="main" style={{ display: "none" }}>

            <div style={{ marginTop: "10%", textAlign: "center" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", margin: "0 auto", width: "50%" }}>
                    <h2>결제 / 주문</h2>
                    <hr style={{ width: "100%", border: "1px solid #2eca6a", margin: "10px 0" }} />
                </div>
            </div>

            <div style={{ width: '40%', margin: '0 auto', marginBottom: '20px' }}>
                <h4>주문자 정보</h4>
                <hr style={{ width: "100%", border: "1px solid #2eca6a", margin: "10px 0" }} />
                <form>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                        <label htmlFor="recipient" style={{ display: 'inline-block', marginRight: '10px', width: '100px' }}>수령자</label>
                        <input
                            type="text"
                            id="recipient"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            style={{ flex: 1, padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                        <label htmlFor="phone" style={{ display: 'inline-block', marginRight: '10px', width: '100px' }}>전화번호</label>
                        <input
                            type="text"
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            style={{ flex: 1, padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '15px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <label htmlFor="address" style={{ display: 'inline-block', marginRight: '10px', width: '100px' }}>배송지</label>
                            <input
                                type="text"
                                id="address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                style={{ flex: 1, padding: '8px', borderRadius: '5px', border: searchedAddress !== null ? '1px solid #ccc' : '1px solid red' }}
                            />
                            <button
                                type="button"
                                onClick={() => searchAddress(address)}
                                style={{
                                    marginLeft: '10px', padding: '8px 12px', backgroundColor: '#2eca6a', border: 'none', borderRadius: '5px', color: 'white'
                                }}
                            >
                                검색
                            </button>
                        </div>

                        {definedAddress === false && (
                            <span style={{ color: 'red', marginTop: '5px', fontSize: '15px' }}>입력하신 주소는 없는 주소입니다. 다시 입력해주세요.</span>
                        )}
                    </div>
                </form>

                {searchedAddress && definedAddress && (
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                        <label htmlFor="detailaddress" style={{ display: 'inline-block', marginRight: '10px', width: '100px' }}>상세주소</label>
                        <input
                            type="text"
                            id="detailaddress"
                            value={detailAddress}
                            readOnly
                            style={{ flex: 1, padding: '8px', borderRadius: '5px', border: '1px solid #ccc', marginRight: '10px', backgroundColor: "#D3D3D3" }}
                        />
                        <label htmlFor="dongho" style={{ display: 'inline-block', width: '80px' }}>동 / 호수</label>
                        <input
                            type="text"
                            id="dongho"
                            value={dongho}
                            onChange={(e) => setDongho(e.target.value)}
                            style={{ flex: 1, padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
                        />
                    </div>
                )}

                <hr style={{ width: "100%", border: "1px solid #2eca6a", margin: "10px 0" }} />
            </div>


            <div style={{ width: '40%', margin: '0 auto' }}> {/* Center the container */}
                <h4>상품 정보</h4>
                <hr style={{ width: "100%", border: "1px solid #2eca6a", margin: "10px 0" }} />
                {append_BucketList}
                <div className="row" style={{ display: "flex", flexDirection: "column", marginTop: "20px", width: '100%', alignItems: 'center' }}>
                    <div id="buyBtn" onClick={gotoCheckout} style={{ backgroundColor: "#2eca6a", borderColor: "#2eca6a", padding: "10px", textAlign: "center", width: '100%' }} className="btn btn-primary btn-block btn-flat">
                        {calculateSum()}원 구매하기
                    </div>
                </div>
            </div>

        </div>
    );
}
export default PaymentWindow