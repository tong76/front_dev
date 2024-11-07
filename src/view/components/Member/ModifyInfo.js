import React, { useState, useEffect } from "react";
import axios from "axios";
import cookie from 'react-cookies';
import $ from 'jquery';

export default function ModifyInfo() {
    const [mno, setMno] = useState('');
    const [currentMno, setCurrentMno] = useState('');
    const [member, setMember] = useState({
        mid: '',
        mname: '',
        mpw: '',
        mcell: '',
        memail: ''
    }); // 전체 회원 목록 저장

    // 쿠키에서 회원정보 전달받기
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
                        const jwtLoginData = response.data.jwtLogin;
                        console.log(jwtLoginData);

                        if (jwtLoginData && jwtLoginData.length > 0) {
                            setMember(jwtLoginData[0]);

                            const mnoFromResponse = response.data.jwtLogin[0].mno;
                            setMno(mnoFromResponse);
                            setCurrentMno(mnoFromResponse);
                        } else {
                            console.log("회원정보가 없습니다.");
                        }
                    } catch (error) {
                        console.log("회원정보 저장 중 오류가 발생하였습니다.");
                    }
                }).catch(error => {
                    console.log("회원정보 요청 중 오류가 발생하였습니다.");
                });
            }).catch(error => {
                console.log("JWT 검증 중 오류가 발생하였습니다.");
            });
        }
    }

    useEffect(() => {
        callMemberInfoApi();
    }, [currentMno]);

    // member의 회원정보를 입력받은 값으로 변경
    const handleChange = (e) => {
        const { name, value } = e.target;
        setMember(prevMember => ({
            ...prevMember,
            [name]: value,
        }));
    }

    // 수정완료버튼 클릭 시
    const handleSubmit = async (event) => {
        event.preventDefault();

        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        const intMno = parseInt(mno, 10); // mno를 숫자로 변환하여 전달

        try {
            // 현재 비밀번호 검증
            const passwordCheckResponse = await axios.post("http://localhost:8080/api/passwordcheck", {
                mpw: currentPassword,
                mno: intMno
            }, {
                headers: {
                    'Content-Type': 'application/json'  // JSON 형식임을 명시적으로 설정
                }
            });

            // 비밀번호 검증 성공 시
            if (passwordCheckResponse.status === 200) {
                // 새 비밀번호와 확인 비밀번호가 일치하는지 확인
                if (newPassword !== confirmPassword) {
                    alert("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
                    return;
                }

                // 이메일 중복 체크
                const emailCheckResponse = await axios.post("http://localhost:8080/api/infoemailcheck", {
                    memail: member.memail,
                    mno: intMno
                });

                const dupli_count = emailCheckResponse.data.emailCheck[0].count;
                if (dupli_count !== 0) {
                    $('#memail').addClass('border_validate_err');
                    alert('이미 존재하는 이메일입니다.');
                    return;
                }

                // 회원정보 수정 요청
                const modifyResponse = await axios.post("http://localhost:8080/api/modifyinfo", {
                    ...member,  //수정된 회원정보
                    mpw: newPassword, // 새 비밀번호 설정
                    mno: intMno
                });

                // 수정 성공 여부에 따른 처리
                if (modifyResponse.status === 200) {
                    alert("회원정보가 성공적으로 수정되었습니다.");
                    window.location.href = "/member/memberinfo";
                }
            }


        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {               
                    alert("비밀번호가 일치하지 않습니다.");
                } else {
                    console.error("오류 발생:", error.response.status);
                    alert("오류가 발생했습니다. 상태 코드: " + error.response.status);
                }
            } else {
                console.error("네트워크 오류 또는 서버에서 응답을 받지 못했습니다.");
                alert("네트워크 오류가 발생했습니다.");
            }
        }
    }

    return (
        <div>
            <section className="intro-single">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 col-lg-8">
                            <div className="title-single-box">
                                <h1 className="title-single">회원정보</h1>
                                <span className="color-text-a">{member.mname || ''} 회원님, 안녕하세요!</span>
                            </div>
                        </div>

                        <div className="col-md-12 col-lg-4">
                            <nav aria-label="breadcrumb" className="breadcrumb-box d-flex justify-content-lg-end">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><a href="#">홈</a></li>
                                    <li className="breadcrumb-item active" aria-current="page">회원정보</li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </section>

            <main id="main-info">
                <section className="content">
                    <div className="container">
                        <form onSubmit={handleSubmit} method="post">
                            <div className="subindex_greenbox">
                                <div className="row-Flex">
                                    <ul className="subindex_row">
                                        <li className="row_item">
                                            <div className="item_text">
                                                <span className="item_text">아이디</span>
                                            </div>
                                        </li>
                                        <li className="row_item">
                                            <div className="item_text">
                                                <span className="item_text">현재 비밀번호</span>
                                            </div>
                                        </li>
                                        <li className="row_item">
                                            <div className="item_text">
                                                <span className="item_text">새 비밀번호</span>
                                            </div>
                                        </li>
                                        <li className="row_item">
                                            <div className="item_text">
                                                <span className="item_text">새 비밀번호 확인</span>
                                            </div>
                                        </li>
                                        <li className="row_item">
                                            <div className="item_text">
                                                <span className="item_text">이름</span>
                                            </div>
                                        </li>
                                        <li className="row_item">
                                            <div className="item_text">
                                                <span className="item_text">휴대폰번호</span>
                                            </div>
                                        </li>
                                        <li className="row_item">
                                            <div className="item_text">
                                                <span className="item_text">이메일</span>
                                            </div>
                                        </li>
                                    </ul>

                                    <div className="left-line">
                                        <ul className="subindex_row">
                                            <li className="row_modi memberId">
                                                <div className="item_text">
                                                    <span className="item_text">{member.mid}</span>
                                                </div>
                                            </li>
                                            <li className="row_modi memberPwd">
                                                <div className="item_text">
                                                    <input type="password" id="currentPassword" className="item_text input-green" name="currentPassword" required />
                                                </div>
                                            </li>
                                            <li className="row_modi memberPwd">
                                                <div className="item_text">
                                                    <input type="password" id="newPassword" className="item_text input-green" name="newPassword" required />
                                                </div>
                                            </li>
                                            <li className="row_modi memberPwdChk">
                                                <div className="item_text">
                                                    <input type="password" id="confirmPassword" className="item_text input-green" name="confirmPassword" required />
                                                </div>
                                            </li>
                                            <li className="row_modi memberName">
                                                <div className="item_text">
                                                    <input className="item_text input-green" name="mname" value={member.mname || ''} onChange={handleChange} required />
                                                </div>
                                            </li>
                                            <li className="row_modi phone">
                                                <div className="item_text">
                                                    <input className="item_text input-green" name="mcell" value={member.mcell || ''} onChange={handleChange} required />
                                                </div>
                                            </li>
                                            <li className="row_modi email">
                                                <div className="item_text">
                                                    <input className="item_text input-green" name="memail" value={member.memail || ''} onChange={handleChange} required />
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="modInfo-footer">
                                <div className="memberInfoBtn">
                                    <button type="submit" className="green-button btn button-text">수정완료</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </section>
            </main>
        </div>
    );
}
