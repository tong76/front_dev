import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function FindPassword() {

    const navigate = useNavigate();

    const submitClick = async (e) => {
        e.preventDefault();

        const inputId = document.getElementById("userid").value;
        const inputEmail = document.getElementById("email").value;

        try {
            // 단일 API 요청으로 아이디와 이메일 검증 및 인증 코드 전송
            const response = await axios.post("http://localhost:8080/api/verify-and-send-email", {
                mid: inputId,
                memail: inputEmail
            });

            if (response.status === 200) {
                alert("인증 메일이 발송되었습니다. 이메일을 확인하세요.");
                navigate("/verify-code", { state: { email: inputEmail } });
            }
        } catch (error) {
            alert(error.response ? error.response.data : "오류가 발생했습니다.");
        }
    };


    return (

        <>
            <div class="login-box">
                <div class="login-logo">
                    <a href="/" style={{ fontWeight: "600" }}><b>Pop<span class="color-b">Pin</span></b></a>
                </div>
                <div class="login-box-body">
                    <p class="login-box-msg"><b>비밀번호 찾기</b>
                    </p>
                    <form onSubmit={submitClick}>
                        <div style={{ marginBottom: "3%" }} class="form-group has-feedback">
                            <input id="userid" type="text" name="mid" class="form-control"
                                placeholder="ID" required />
                        </div>
                        <div style={{ marginBottom: "3%" }} class="form-group has-feedback">
                            <input id="email" type="text" name="memail" class="form-control"
                                placeholder="E-Mail" required />
                        </div>
                    </form>
                    <div class="row" style={{ textAlign: "center" }}>
                        <p style={{ fontSize: "" }}>*회원가입 시 저장한 이메일을 입력하세요.</p>
                        <div class="col-xs-12">
                            <button id="logchkBtn" type="submit" style={{ backgroundColor: "#2eca6a", borderColor: "#2eca6a", margin: "20px 0px 20px 0px" }} class="btn btn-primary btn-flat btn-findpw">인증메일 전송</button>
                        </div>
                    </div>
                </div>

            </div >
        </>

    );

}