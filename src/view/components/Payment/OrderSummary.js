import { useEffect, useState } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import $ from 'jquery';

const OrderSummary = () => {
    const [mno, setMno] = useState('');
    const [append_OrderList, setAppend_OrderList] = useState([]);
    const [menuVisible, setMenuVisible] = useState([]); // 날짜별 메뉴 표시 여부 상태 배열

    useEffect(() => {
        if (cookie.load("userid") !== undefined) {
            $("#main").show();
            callMemberInfoApi();
        } else {
            $("#main").hide();
        }
    }, [mno, menuVisible]);

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
                callOrderListApi();
            }).catch(error => { console.log("작업중 오류가 발생하였습니다."); });
        }).catch(error => { console.log("작업중 오류가 발생하였습니다."); });
    };

    const callOrderListApi = () => {
        try {
            axios.post("http://localhost:8080/payment/ordersummary", {
                bucketEntity: {
                    mno: mno
                }
            }).then(response => {
                setAppend_OrderList(OrderList_Append(response.data));
            }).catch(error => { alert("작업중 오류가 발생하였습니다."); });
        } catch (error) {
            alert("작업중 오류가 발생하였습니다.");
        }
    };

    const handleMenuClick = (paymentKey) => {
        console.log('paymentKey:', paymentKey); // 클릭된 paymentKey 출력
        setMenuVisible(prevState => {
            const newState = { ...prevState };
            newState[paymentKey] = !newState[paymentKey]; // 클릭된 paymentKey의 메뉴 상태만 토글
            return newState;
        });
    };

    const deleteOrderSummary = (data) => {
        console.log(data[0].paymentKey);
        axios.post("http://localhost:8080/payment/deleteordersummary", {
            bucketEntity: {
                mno: mno
            },
            paymentKey: data[0].paymentKey
        }).then(response => {
            if (response.data === "succ") {
                callOrderListApi();
            } else {
                alert("작업중 오류가 발생하였습니다.");
            }
        }).catch(error => { alert("작업중 오류가 발생하였습니다.") })
    }

    const gotoOrderDetail = (paymentKey) => {
        window.location.href = `/payment/orderdetail?paymentKey=${paymentKey}`;
    }

    const OrderList_Append = (data) => {
        let groupedByDate = {};  // 날짜별로 그룹화된 상품을 저장할 객체

        let orderList = data.orderlist;

        // 상품을 날짜별로 그룹화
        for (let i = 0; i < orderList.length; i++) {
            let order = orderList[i];
            let podate = order.podate; // 결제 날짜

            if (!groupedByDate[podate]) {
                groupedByDate[podate] = [];
            }
            groupedByDate[podate].push(order);
        }

        const sortedDesc = Object.keys(groupedByDate).sort((a, b) => {
            return b.localeCompare(a);  // 'YYYY-MM-DD' 형식의 문자열을 알파벳 순으로 비교
        });

        // 결제 날짜별로 상품들을 렌더링
        let result = [];
        for (let i = 0; i < sortedDesc.length; i++) {
            const date = sortedDesc[i];
            let dateOrders = groupedByDate[date];

            // 메뉴 상태 배열에 새로운 날짜 상태 추가
            if (menuVisible.length === 0) {
                setMenuVisible(new Array(sortedDesc.length).fill(false)); // 상태 배열을 최초로 설정
            }

            // 날짜별로 주문을 결제 번호(paymentKey) 기준으로 다시 그룹화
            let groupedByPaymentKey = {};

            for (let j = 0; j < dateOrders.length; j++) {
                let order = dateOrders[j];
                let paymentKey = order.paymentKey; // 결제 번호

                if (!groupedByPaymentKey[paymentKey]) {
                    groupedByPaymentKey[paymentKey] = [];
                }
                groupedByPaymentKey[paymentKey].push(order);
            }

            // 결제 번호별로 주문을 렌더링
            let dateResult = [];

            for (let paymentKey in groupedByPaymentKey) {
                let paymentOrders = groupedByPaymentKey[paymentKey];

                dateResult.push(
                    <div key={paymentKey} style={{
                        marginBottom: '20px', border: '1px solid #ddd',
                        borderRadius: '12px', padding: '20px 20px 0px 20px', marginBottom: '20px',
                        backgroundColor: '#f9f9f9', position: 'relative'
                    }}>

                        <div style={{ position: 'absolute', top: '20px', right: '20px', cursor: 'pointer', zIndex: 1000 }} onClick={() => handleMenuClick(paymentKey)}>
                            <div style={{
                                width: '5px', height: '5px', backgroundColor: 'grey', borderRadius: '50%', margin: '3px auto'
                            }} />
                            <div style={{
                                width: '5px', height: '5px', backgroundColor: 'grey', borderRadius: '50%', margin: '3px auto'
                            }} />
                            <div style={{
                                width: '5px', height: '5px', backgroundColor: 'grey', borderRadius: '50%', margin: '3px auto'
                            }} />
                        </div>

                        {/* 메뉴 드롭다운 */}
                        {menuVisible[paymentKey] && (
                            <div style={{
                                position: 'absolute', top: '30px', right: '10px', backgroundColor: '#fff',
                                border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
                                padding: '10px', width: '150px', zIndex: 1000
                            }}>
                                <ul style={{ padding: 0, margin: 0, listStyleType: 'none' }}>
                                    <li style={{ padding: '5px', cursor: 'pointer', color: "darkblue" }} onClick={() => gotoOrderDetail(paymentKey)}>주문 상세보기</li>
                                    <li style={{ padding: '5px', cursor: 'pointer', color: "red" }} onClick={() => deleteOrderSummary(paymentOrders)}>주문내역 삭제</li>
                                    <li style={{ padding: '5px', cursor: 'pointer', color: "grey" }} onClick={() => handleMenuClick(paymentKey)}>닫기</li>
                                </ul>
                            </div>
                        )}

                        <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                            {paymentOrders.map((data, i) => {
                                let formattedPrice = (data.poprc * data.poq).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                                return (
                                    <li key={i} style={{
                                        listStyleType: "none",
                                        display: 'flex',
                                        alignItems: 'center',
                                        position: 'relative',
                                        marginBottom: '10px'
                                    }}>
                                        <a href={`/goods/goodsdetail/${data.sno}/${data.pno}`}>
                                            <img
                                                src={require(`../../../resources/assets/img/${data.pimg}.jpg`)}
                                                alt="상품 이미지"
                                                style={{
                                                    maxWidth: '100px',
                                                    borderRadius: '8px',  // 이미지도 약간 둥글게
                                                    marginRight: '15px'
                                                }}
                                            />
                                        </a>
                                        <div style={{ flex: 1 }}>
                                            <h4><a style={{ color: "black" }} href={`/goods/goodsdetail/${data.sno}/${data.pno}`}>{data.pname}</a></h4>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <strong>{formattedPrice}원</strong>
                                                <span style={{ margin: '0 5px' }}>·</span>
                                                <strong>{data.poq}개</strong>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                );
            }

            result.push(
                <div key={date} style={{ marginBottom: '40px' }}>
                    <h2>{date}</h2> {/* 날짜 헤더 추가 */}
                    {dateResult}
                </div>);
        }

        return result;
    };


    return (
        <div id="main" style={{ display: "none" }}>
            <div style={{ marginTop: "10%", textAlign: "center" }}>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    margin: "0 auto",
                    width: "50%"
                }}>
                    <h2>주문목록</h2>
                    <hr style={{ width: "100%", border: "1px solid #2eca6a", margin: "10px 0" }} />
                </div>
            </div>

            <div style={{ width: '40%', margin: '0 auto' }}> {/* Center the container */}
                {append_OrderList}
            </div>
        </div>
    );
}

export default OrderSummary;