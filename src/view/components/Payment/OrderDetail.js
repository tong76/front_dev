import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import cookie from 'react-cookies';

const OrderDetail = () => {
    const [mno, setMno] = useState('');
    const [searchParams] = useSearchParams();
    const payment_Key = searchParams.get('paymentKey');  // URL에서 paymentKey를 받아옴
    const [orderDetail, setOrderDetail] = useState(null);  // 주문 상세 정보
    const [loading, setLoading] = useState(true);  // 로딩 상태
    const [items, setItems] = useState([]);  // 배송지 정보 저장

    // 로그인한 사용자의 정보를 가져오는 함수
    useEffect(() => {
        if (cookie.load("userid") !== undefined) {
            callMemberInfoApi();
        } else {
            noPermission();
            console.log("사용자가 로그인하지 않았습니다.");
        }
    }, []);  // 최초 한 번만 실행

    const noPermission = (e) => {
        remove_cookie();
        window.location.href = '/login';
    };

    const remove_cookie = (e) => {
        cookie.remove('userid', { path: '/' });
        cookie.remove('username', { path: '/' });
        cookie.remove('userpassword', { path: '/' });
    }

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
            }).catch(error => {
                console.error("jwtLogin 호출 오류:", error);
            });
        }).catch(error => {
            console.error("jwtChk 호출 오류:", error);
        });
    };

    // mno가 설정된 후에 주문 상세 정보 API를 호출합니다.
    useEffect(() => {
        if (mno) {
            callOrderDetailApi();
            callDeliveryInfoApi();
        }
    }, [mno]);  // mno가 변경될 때마다 호출

    const callOrderDetailApi = () => {
        // 주문 상세 정보 API 호출
        axios.post("http://localhost:8080/payment/orderdetail", {
            paymentKey: payment_Key
        })
            .then(response => {
                console.log(response.data);
                setOrderDetail(response.data);
                setLoading(false);  // 로딩 완료
            })
            .catch(error => {
                console.error("주문 상세 정보 불러오기 오류:", error);
                setLoading(false);  // 에러 발생 시에도 로딩 완료
            });
    };

    const callDeliveryInfoApi = () => {
        // 배송지 상세 정보 API 호출
        axios.post("http://localhost:8080/payment/deliveryinfo", {
            paymentKey: payment_Key
        })
            .then(response => {
                console.log(response.data.deliveryinfo);
                setItems(response.data.deliveryinfo);  // 배송지 정보 업데이트
            })
            .catch(error => {
                console.error("배송지 정보 불러오기 오류:", error);
            });
    };

    // 데이터가 로딩 중일 때 로딩 상태 표시
    if (loading) {
        return null;
    }

    // 주문 정보에서 필요한 부분 추출
    const { orderId, orderName, status, requestedAt, approvedAt, paymentKey, method, easyPay } = orderDetail;

    const formattedDate = (data) => {
        const date = new Date(data);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    return (
        <div id="main" style={{ marginTop: "5%", textAlign: "center" }}>
            {/* 제목 섹션 */}
            <div style={{ width: "50%", margin: "0 auto", marginBottom: "20px" }}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%"
                }}>
                    <h2>주문 상세</h2>
                    <strong style={{ cursor: "pointer" }} onClick={() => window.history.back()}>뒤로가기</strong>
                </div>
                <hr style={{ width: "100%", border: "1px solid #2eca6a", margin: "10px 0" }} />
            </div>

            {/* 주문 정보 섹션 */}
            <div style={{ width: "35%", margin: "0 auto", marginBottom: "30px" }}>
                <h3 style={{ textAlign: "left" }}>주문 정보</h3>
                <div style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
                    <p style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                        <strong>주문 ID</strong> <span>{orderId}</span>
                    </p>
                    <p style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                        <strong>주문명</strong> <span>{orderName}</span>
                    </p>
                    <p style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                        <strong>상태</strong> <span>{status === "DONE" ? <>결제완료</> : null} </span>
                    </p>
                    <p style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                        <strong>주문 요청일</strong> <span>{formattedDate(requestedAt)}</span>
                    </p>
                    <p style={{ display: "flex", justifyContent: "space-between", marginBottom: "0px" }}>
                        <strong>승인일</strong> <span>{formattedDate(approvedAt)}</span>
                    </p>
                </div>
            </div>

            {/* 결제 정보 섹션 */}
            <div style={{ width: "35%", margin: "0 auto", marginBottom: "30px" }}>
                <h3 style={{ textAlign: "left" }}>결제 정보</h3>
                <div style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
                    <p style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                        <strong>결제 번호</strong> <span>{paymentKey}</span>
                    </p>
                    <p style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                        <strong>거래 종류</strong> <span>{method}</span>
                    </p>
                    <p style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                        <strong>결제 방법</strong> <span>{easyPay.provider}</span>
                    </p>
                    <p style={{ display: "flex", justifyContent: "space-between", marginBottom: "0px" }}>
                        <strong>총 결제 금액</strong> <span>{easyPay.amount.toLocaleString()}원</span>
                    </p>
                </div>
            </div>

            {/* 배송지 정보 섹션 */}
            <div style={{ width: "35%", margin: "0 auto", marginBottom: "30px" }}>
                <h3 style={{ textAlign: "left" }}>배송지 정보</h3>
                <div style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
                    {items.length > 0 ? (
                        <>
                            {/* 수령자 정보 */}
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", alignItems: "center" }}>
                                <strong>수령자</strong> <span>{items[0].dname}</span>
                            </div>

                            {/* 배송지 정보 - 가로로 배치 */}
                            <div style={{
                                display: "flex",                // 가로로 배치
                                justifyContent: "space-between", // 왼쪽(배송지)와 오른쪽(주소)을 분리
                                marginBottom: "10px",
                                wordWrap: "break-word",          // 긴 텍스트 줄 바꿈 방지
                                maxWidth: "100%",                // 부모 너비를 넘지 않도록 제한
                                alignItems: "center"             // 세로 중앙 정렬
                            }}>
                                <strong>배송지</strong>
                                <span
                                    style={{
                                        overflow: "hidden",        // 텍스트가 넘칠 경우 숨기기
                                        textOverflow: "ellipsis",  // 넘치는 텍스트에 "..."을 표시
                                        whiteSpace: "nowrap",      // 텍스트를 한 줄로 표시
                                        maxWidth: "calc(100% - 70px)", // 텍스트가 너무 길어지지 않도록 제한 (배송지 + label 크기 고려)
                                        display: "inline-block"    // 텍스트를 한 줄로 처리하기 위해 inline-block 설정
                                    }}
                                    title={items[0].dadd}  // 마우스를 올리면 전체 텍스트를 툴팁으로 표시
                                >
                                    {items[0].dadd}
                                </span>
                            </div>

                            {/* 전화번호 정보 */}
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0px", alignItems: "center" }}>
                                <strong>전화번호</strong> <span>{items[0].dcell}</span>
                            </div>
                        </>
                    ) : (
                        <p>배송지 정보가 없습니다.</p>
                    )}
                </div>
            </div>


            {/* 주문 상품 섹션 */}
            <div style={{ width: "35%", margin: "0 auto", marginBottom: "30px" }}>
                <h3 style={{ textAlign: "left" }}>주문 상품</h3>
                <div style={{ padding: "10px 10px 0px 10px", border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
                    {items.length > 0 ? (
                        <ul style={{ listStyle: "none", padding: "0" }}>
                            {items.map((item, index) => (
                                <li key={index} style={{ display: "flex", marginBottom: "15px", alignItems: "center" }}>
                                    <img
                                        src={require(`../../../resources/assets/img/${item.pimg}.jpg`)}
                                        alt={item.name}
                                        style={{ width: "100px", height: "100px", marginRight: "20px" }}
                                    />
                                    <div style={{ flex: 1, display: "flex", flexDirection: "column", textAlign: "right" }}>
                                        <p style={{ marginBottom: "5px" }}><strong>{item.pname}</strong></p>
                                        <p style={{ marginBottom: "5px" }}>수량: {item.poq}</p>
                                        <p style={{ marginBottom: "0px" }}>가격: {(item.poprc * item.poq).toLocaleString()}원</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>주문한 상품이 없습니다.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
