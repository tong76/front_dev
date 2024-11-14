import { useEffect, useRef, useState } from "react";
import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import cookie from 'react-cookies';
import "./Payment.css";

const generateRandomString = () => window.btoa(Math.random()).slice(0, 20);
const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";

const CheckoutPage = () => {
    const [mno, setMno] = useState('');
    const [username, setUsername] = useState('');
    const [useremail, setUseremail] = useState('');
    const [searchParams] = useSearchParams();
    const sno = searchParams.get('sno');
    const pno = searchParams.get('pno');
    const bkcnt = searchParams.get('bkcnt');
    const selects = searchParams.get('selects');
    const [ready, setReady] = useState(false);
    const [widgets, setWidgets] = useState(null);
    const [product, setProduct] = useState({});
    const [totalPrice, setTotalPrice] = useState([]);
    const [amount, setAmount] = useState({
        currency: "KRW",
        value: 50_000,
    });

    const calculateSum = () => {
        return totalPrice.reduce((acc, curr) => acc + curr, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); // 체크된 값들의 합
    };

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
                setUsername(response.data.jwtLogin[0].mname);
                setUseremail(response.data.jwtLogin[0].memail);
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
            const prices = [];
            for (let i = 0; i < response.data.bucketlist.length; i++) {
                setProduct({ ...product, [response.data.bucketlist[i].pname]: response.data.bucketlist[i].bkcnt });
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
            const prices = [];
            let products = {};
            for (let i = 0; i < response.data.bucketlist.length; i++) {
                const item = response.data.bucketlist[i];
                products[item.pname] = item.bkcnt;
                prices.push(response.data.bucketlist[i].pprice * response.data.bucketlist[i].bkcnt);
            }
            setProduct(products);
            setTotalPrice(prices);
        })
            .catch(error => { alert("작업중 오류가 발생하였습니다."); });
    };

    useEffect(() => {
        async function fetchPaymentWidgets() {
            const tossPayments = await loadTossPayments(clientKey);
            const widgets = tossPayments.widgets({ customerKey: ANONYMOUS });
            setWidgets(widgets);
        }

        fetchPaymentWidgets();
    }, [clientKey]);

    useEffect(() => {
        if (totalPrice.length > 0) {
            const sum = parseInt(calculateSum().replace(",", ""));
            setAmount({
                currency: "KRW",
                value: sum,  // calculateSum()으로 계산한 값을 넣음
            });
        }
    }, [totalPrice]);

    useEffect(() => {
        async function renderPaymentWidgets() {
            if (widgets == null) {
                return;
            }
            /**
             * 위젯의 결제금액을 결제하려는 금액으로 초기화하세요.
             * renderPaymentMethods, renderAgreement, requestPayment 보다 반드시 선행되어야 합니다.
             * @docs https://docs.tosspayments.com/sdk/v2/js#widgetssetamount
             */
            await widgets.setAmount(amount);

            await Promise.all([
                /**
                 * 결제창을 렌더링합니다.
                 * @docs https://docs.tosspayments.com/sdk/v2/js#widgetsrenderpaymentmethods
                 */
                widgets.renderPaymentMethods({
                    selector: "#payment-method",
                    // 렌더링하고 싶은 결제 UI의 variantKey
                    // 결제 수단 및 스타일이 다른 멀티 UI를 직접 만들고 싶다면 계약이 필요해요.
                    // @docs https://docs.tosspayments.com/guides/v2/payment-widget/admin#새로운-결제-ui-추가하기
                    variantKey: "DEFAULT",
                }),
                /**
                 * 약관을 렌더링합니다.
                 * @docs https://docs.tosspayments.com/reference/widget-sdk#renderagreement선택자-옵션
                 */
                widgets.renderAgreement({
                    selector: "#agreement",
                    variantKey: "AGREEMENT",
                }),
            ]);

            setReady(true);
        }

        renderPaymentWidgets();
    }, [widgets, amount]);

    return (
        <div className="wrapper w-100">
            <div className="max-w-540 w-100">
                <div id="payment-method" className="w-100" />
                <div id="agreement" className="w-100" />
                <div className="btn-wrapper w-100">
                    <button
                        className="btn primary w-100"
                        onClick={async () => {
                            try {
                                let productName = "";
                                if (Object.keys(product).length === 1) {
                                    productName = Object.keys(product)[0];
                                } else {
                                    productName = Object.keys(product)[0] + " 외 " + Object.keys(product).length + "건"
                                }
                                /**
                                 * 결제 요청
                                 * 결제를 요청하기 전에 orderId, amount를 서버에 저장하세요.
                                 * 결제 과정에서 악의적으로 결제 금액이 바뀌는 것을 확인하는 용도입니다.
                                 * @docs https://docs.tosspayments.com/sdk/v2/js#widgetsrequestpayment
                                 */
                                await widgets?.requestPayment({
                                    orderId: generateRandomString(),
                                    orderName: productName,
                                    customerName: username,
                                    customerEmail: useremail,
                                    successUrl: window.location.origin + "/payment/success" + window.location.search,
                                    failUrl: window.location.origin + "/payment/fail" + window.location.search
                                });
                            } catch (error) {
                                // TODO: 에러 처리
                                alert(error);
                            }
                        }}
                    >
                        {calculateSum()}원 결제하기
                    </button>
                </div>
            </div>
        </div>
    );
}
export default CheckoutPage;