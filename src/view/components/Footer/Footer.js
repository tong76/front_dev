import { useEffect } from "react";
import $ from 'jquery';
import axios from 'axios';
import cookie from 'react-cookies';
//js


const Footer = (props) => {

    useEffect(() => {

        checkUserPermission();

        if (props.isVisible) {
            $("#footer").show()
        }

    }, []);

    const checkUserPermission = () => {

        if (
            window.location.pathname === '/member/memberinfo' ||
            window.location.pathname === '/board/boardregist' ||
            window.location.pathname === '/board/boardmodify' ||
            window.location.pathname === '/payment/paymentwindow' ||
            window.location.pathname === '/payment/ordersummary') {

            axios.post('http://localhost:8080/member/jwtChk', {
                token1: cookie.load('userid'),
                token2: cookie.load('username')
            })
                .then(response => {
                    let userid = response.data.token1
                    let password = cookie.load('userpassword')
                    if (password !== undefined) {
                        axios.post('http://localhost:8080/member/jwtLogin', {
                            mid: userid,
                            mpw: password
                        })
                            .then(response => {
                                if (response.data.jwtLogin[0].mid === undefined) {
                                    noPermission()
                                } else {
                                    $("#footer").show()
                                }
                            })
                            .catch(error => {
                                noPermission()
                            });
                    } else {
                        noPermission()
                    }
                })
                .catch(response => noPermission());
        }
    }

    const noPermission = (e) => {
        remove_cookie();
        window.location.href = '/login';
    };

    const remove_cookie = (e) => {
        cookie.remove('userid', { path: '/' });
        cookie.remove('username', { path: '/' });
        cookie.remove('userpassword', { path: '/' });
    }

    return (
        <div id="footer" style={{ display: "none" , textAlign:"center"}}>
            <section class="section-footer">
                <div class="container">
                    <div class="row">
                        <div class="col-sm-12 col-md-4">
                            <div class="widget-a">
                                <div class="w-header-a">
                                    <h3 class="w-title-a text-brand">PopPin</h3>
                                </div>
                                <div class="w-body-a">
                                    <p class="w-text-a color-text-a">
                                        국내 최대 규모의 전국 팝업스토어 정보 플레이스 리스트
                                    </p>
                                </div>
                                <div class="w-footer-a">
                                    <ul class="list-unstyled">
                                        <li class="color-a">
                                            <span class="color-text-a">Phone .</span> (02)111-2222
                                        </li>
                                        <li class="color-a">
                                            <span class="color-text-a">Email .</span> poppin@example.com
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-4 section-md-t3">
                            <div class="widget-a">
                                <div class="w-header-a">
                                    <h3 class="w-title-a text-brand">The Company</h3>
                                </div>
                                <div class="w-body-a">
                                    <div class="w-body-a">
                                        <ul class="list-unstyled">
                                            <li class="item-list-a">
                                                <i class="bi bi-chevron-right"></i> <a href="#">서비스 이용약관</a>
                                            </li>
                                            <li class="item-list-a">
                                                <i class="bi bi-chevron-right"></i> <a href="#">개인정보 처리방침</a>
                                            </li>
                                            <li class="item-list-a">
                                                <i class="bi bi-chevron-right"></i> <a href="#">마케팅 수신동의</a>
                                            </li>
                                            <li class="item-list-a">
                                                <i class="bi bi-chevron-right"></i> <a href="#">고객센터</a>
                                            </li>
                                            <li class="item-list-a">
                                                <i class="bi bi-chevron-right"></i> <a href="#">비즈니스</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-4 section-md-t3">
                            <div class="widget-a">
                                <div class="w-header-a">
                                    <h3 class="w-title-a text-brand">Language</h3>
                                </div>
                                <div class="w-body-a">
                                    <ul class="list-unstyled">
                                        <li class="item-list-a">
                                            <i class="bi bi-chevron-right"></i> <a href="#">한국어</a>
                                        </li>
                                        <li class="item-list-a">
                                            <i class="bi bi-chevron-right"></i> <a href="#">English</a>
                                        </li>
                                        <li class="item-list-a">
                                            <i class="bi bi-chevron-right"></i> <a href="#">日本語</a>
                                        </li>
                                        <li class="item-list-a">
                                            <i class="bi bi-chevron-right"></i> <a href="#">Chinese</a>
                                        </li>

                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section><footer>
                <div class="container">
                    <div class="row">
                        <div class="col-md-12">
                            <nav class="nav-footer">
                                <ul class="list-inline">
                                    <li class="list-inline-item">
                                        <a href="#">홈</a>
                                    </li>
                                    <li class="list-inline-item">
                                        <a href="#">상품</a>
                                    </li>
                                    <li class="list-inline-item">
                                        <a href="#">팝업스토어</a>
                                    </li>
                                    <li class="list-inline-item">
                                        <a href="#">게시판</a>
                                    </li>
                                    <li class="list-inline-item">
                                        <a href="#">로그인</a>
                                    </li>
                                </ul>
                            </nav>
                            <div class="socials-a">
                                <ul class="list-inline">
                                    <li class="list-inline-item">
                                        <a href="#">
                                            <i class="bi bi-facebook" aria-hidden="true"></i>
                                        </a>
                                    </li>
                                    <li class="list-inline-item">
                                        <a href="#">
                                            <i class="bi bi-twitter" aria-hidden="true"></i>
                                        </a>
                                    </li>
                                    <li class="list-inline-item">
                                        <a href="#">
                                            <i class="bi bi-instagram" aria-hidden="true"></i>
                                        </a>
                                    </li>
                                    <li class="list-inline-item">
                                        <a href="#">
                                            <i class="bi bi-linkedin" aria-hidden="true"></i>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div class="copyright-footer">
                                <p class="copyright color-text-a">
                                    &copy; Copyright
                                    <span class="color-a">PopPin</span> All Rights Reserved.
                                </p>
                            </div>
                            <div class="credits">

                                Designed by <a href="https://bootstrapmade.com/">BootstrapMade</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default Footer;