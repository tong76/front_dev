import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from 'axios';
import cookie from 'react-cookies';
import "./Payment.css";

const SuccessPage = () => {
    const [mno, setMno] = useState('');
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [searchParams] = useSearchParams();
    // 결제 관련
    const paymentKey = searchParams.get("paymentKey");
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");
    const sno = searchParams.get('sno');
    const pno = searchParams.get('pno');
    const selects = searchParams.get('selects');
    // 배송 관련
    const address = sessionStorage.getItem("address");
    const name = sessionStorage.getItem('name');
    const cell = sessionStorage.getItem('cell');

    useEffect(() => {
        if (cookie.load("userid") !== undefined) {
            callMemberInfoApi();
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
            }).catch(error => { console.log("작업중 오류가 발생하였습니다."); });
        }).catch(error => { console.log("작업중 오류가 발생하였습니다."); });
    };

    async function confirmPayment() {
        // TODO: API를 호출해서 서버에게 paymentKey, orderId, amount를 넘겨주세요.
        // 서버에선 해당 데이터를 가지고 승인 API를 호출하면 결제가 완료됩니다.
        // https://docs.tosspayments.com/reference#%EA%B2%B0%EC%A0%9C-%EC%8A%B9%EC%9D%B8
        const response = await fetch("http://localhost:8080/payment/confirm", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                paymentKey,
                orderId,
                amount
            })
        });

        if (response.ok) {
            const confirmResponse = await response.json();  // JSON 응답 받기
            console.log(confirmResponse);
            console.log(confirmResponse.status);
            const status = confirmResponse.status;
            if (status === "DONE") {
                try {
                    if (selects !== undefined && selects !== null) {
                        axios.post("http://localhost:8080/payment/paymentprocess", {
                            bucketEntity: {
                                mno: mno,
                                products: selects.split(",").map(Number)
                            },
                            paymentKey: paymentKey,
                            status: status
                        }).then(response => {
                            if (response.data === "succ") {
                                axios.post("http://localhost:8080/payment/deliveryregist", {
                                    paymentKey: paymentKey,
                                    address: address,
                                    name: name,
                                    cell: cell
                                });
                                sessionStorage.removeItem("address");
                                sessionStorage.removeItem("name");
                                sessionStorage.removeItem("cell");
                            } else {
                                alert("작업중 오류가 발생하였습니다.");
                            }
                        })
                    } else {
                        axios.post("http://localhost:8080/payment/paymentprocess", {
                            bucketEntity: {
                                mno: mno,
                                sno: sno,
                                pno: pno
                            },
                            paymentKey: paymentKey,
                            status: status
                        }).then(response => {
                            if (response.data === "succ") {
                                axios.post("http://localhost:8080/payment/deliveryregist", {
                                    paymentKey: paymentKey,
                                    address: address,
                                    name: name,
                                    cell: cell
                                });
                                sessionStorage.removeItem("address");
                                sessionStorage.removeItem("name");
                                sessionStorage.removeItem("cell");
                            } else {
                                alert("작업중 오류가 발생하였습니다1.");
                            }
                        })
                    }
                } catch (error) {
                    alert("작업중 오류가 발생하였습니다.");
                }
            }

            setIsConfirmed(true);
        }
    }

    return (
        <div className="wrapper w-100">
            {isConfirmed ? (
                <div
                    className="flex-column align-center confirm-success w-100 max-w-540"
                    style={{
                        display: "flex"
                    }}
                >
                    <img
                        src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png"
                        width="120"
                        height="120"
                    />
                    <h2 className="title">결제를 완료했어요</h2>
                    <div className="response-section w-100">
                        <div className="flex justify-between">
                            <span className="response-label">결제 금액</span>
                            <span id="amount" className="response-text">
                                {amount.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="response-label">주문번호</span>
                            <span id="orderId" className="response-text">
                                {orderId}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="response-label">paymentKey</span>
                            <span id="paymentKey" className="response-text">
                                {paymentKey}
                            </span>
                        </div>
                    </div>

                    <div className="w-100 button-group">

                        <div className="flex" style={{ gap: "16px" }}>
                            <a
                                className="btn w-100"
                                href="/"
                            >
                                홈으로가기
                            </a>
                            <a
                                className="btn w-100"
                                href="/payment/ordersummary"
                                rel="noopner noreferer"
                            >
                                결제내역보기
                            </a>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-column align-center confirm-loading w-100 max-w-540">
                    <div className="flex-column align-center">
                        <img
                            src="https://static.toss.im/lotties/loading-spot-apng.png"
                            width="120"
                            height="120"
                        />
                        <h2 className="title text-center">결제 요청까지 성공했어요.</h2>
                        <h4 className="text-center description">결제 승인하고 완료해보세요.</h4>
                    </div>
                    <div className="w-100">
                        <button className="btn primary w-100" onClick={confirmPayment}>
                            결제 승인하기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
export default SuccessPage;