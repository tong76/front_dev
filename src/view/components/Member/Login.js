import React, { } from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import axios from 'axios';
import cookie from 'react-cookies';
import Swal from 'sweetalert2';

//import '../../../resources/assets/css/style.css';
//import '../../../resources/bootstrap/css/bootstrap.min.css';
import '../../../resources/dist/css/AdminLTE.min.css';

const Login = () => {

    const submitClick = () => {

        const mid_val = $('#userid').val();
        const mpw_val = $('#password').val();

        if (mid_val === '' || mpw_val === '') {
            sweetalert('이메일과 비밀번호를 확인해주세요.', '', 'error', '닫기');
        } else {
            axios.post('http://localhost:8080/member/login', {
                mid: mid_val,
                mpw: mpw_val
            })
                .then(response => {
                    var userid = response.data.login[0].mid
                    var username = response.data.login[0].mname
                    var upw = response.data.login[0].mpw

                    if (userid !== null && userid !== '') {
                        const expires = new Date()
                        expires.setMinutes(expires.getMinutes() + 60)

                        axios.post('http://localhost:8080/member/jwt', {
                            mid: userid,
                            mname: username
                        })
                            .then(response => {
                                cookie.save('userid', response.data.token1
                                    , { path: '/', expires })
                                cookie.save('username', response.data.token2
                                    , { path: '/', expires })
                                cookie.save('userpassword', upw
                                    , { path: '/', expires })

                                window.location.href = "/";
                            })
                            .catch(error => {
                                alert('작업중 오류가 발생하였습니다.');
                            });
                    } else {
                        sweetalert('이메일과 비밀번호를 확인해주세요.', '', 'error', '닫기');
                    }
                })
                .catch(error => { sweetalert('이메일과 비밀번호를 확인해주세요.', '', 'error', '닫기'); });
        }
    }

    const enterKey = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            submitClick();
        }
    };

    const sweetalert = (title, contents, icon, confirmButtonText) => {
        Swal.fire({
            title,
            text: contents,
            icon,
            confirmButtonText
        });
    };

    return (
        <>
            <div class="login-box">
                <div class="login-logo">
                    <a href="/" style={{ fontWeight: "600" }}><b>Pop<span class="color-b">Pin</span></b></a>
                </div>
                <div class="login-box-body">
                    <p class="login-box-msg"><b>로그인하여 시작하세요.</b></p>

                    <div style={{ marginBottom: "3%" }} class="form-group has-feedback">
                        <input id="userid" type="text" name="mid" class="form-control"
                            placeholder="ID" onKeyDown={enterKey} />
                    </div>
                    <div style={{ marginBottom: "3%" }} class="form-group has-feedback">
                        <input id="password" type="password" name="mpw" class="form-control"
                            placeholder="PASSWORD" onKeyDown={enterKey} />
                    </div>

                    <div class="row" style={{ textAlign: "center"}}>
                        <div class="col-xs-12">
                            <div id="logchkBtn" style={{ backgroundColor: "#2eca6a", borderColor: "#2eca6a" }} class="btn btn-primary btn-block btn-flat" onClick={() => submitClick()}>로그인</div>
                        </div>
                    </div>

                    <p class="ptag">처음 이용하시면 회원가입을 해주세요.</p>
                    <Link to={"/join"} class="atag" style={{ textDecoration: "none" }}>회원가입</Link>

                </div>

            </div >
        </>
    );

}

export default Login;