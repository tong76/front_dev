import React, { } from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import axios from "axios";
import Swal from 'sweetalert2';

const Join = () => {

	const duplicateIdchk = async () => {

		const mid_chk = $("#mid").val();

		const fnValidate = () => {
			if (mid_chk === '') {
				return false;
			}
			return true;
		}

		if (fnValidate()) {

			const mid_val = $("#mid").val();

			axios.post('http://localhost:8080/member/idcheck', {
				mid: mid_val
			})
				.then(response => {
					try {
						const result = response.data.idcheck[0].count;
						console.log(result);
						if (result > 0) {
							sweetalert('이미 존재하는 아이디입니다.', '', 'error', '닫기');
							$('#mid').addClass('border_validate_err');
						}
						else {
							sweetalert('사용 가능한 아이디입니다.', '', 'success', '닫기');
							$('#mid').removeClass('border_validate_err');
						}
					} catch (error) {
						alert("error : " + error);
					}
				})
		}
	}

	const submitClick = async () => {

		const mid_chk = $("#mid").val();
		const memail1_chk = $('#memail1').val();
		const memail2_chk = $('#memail2').val();
		const mpw_chk = $('#mpw').val();
		const confirmPassword_chk = $('#confirmPassword').val();
		const mname_chk = $('#mname').val();
		const mcell1_chk = $('#mcell1').val();
		const mcell2_chk = $('#mcell2').val();
		const mcell3_chk = $('#mcell3').val();

		const fnValidate = () => {
			var pattern1 = /[0-9]/;
			var pattern2 = /[a-zA-Z]/;
			var pattern3 = /[~!@#$%^&*()_+|<>?:{}]/;

			if (mid_chk === '') {
				$('#mid').addClass('border_validate_err');
				sweetalert('아이디를 다시 확인해주세요.', '', 'error', '닫기');
				return false;
			}

			if (mname_chk === '') {
				$('#mname').addClass('border_validate_err');
				sweetalert('성명을 입력해주세요.', '', 'error', '닫기');
				return false;
			}
			if (mname_chk.search(/\s/) !== -1) {
				$('#mname').addClass('border_validate_err');
				sweetalert('성명에 공백을 제거해 주세요.', '', 'error', '닫기');
				return false;
			}
			$('#mname').removeClass('border_validate_err');


			if (mpw_chk === '') {
				$('#mpw').addClass('border_validate_err');
				sweetalert('비밀번호를 입력해주세요.', '', 'error', '닫기');
				return false;
			}
			if (mpw_chk !== '') {
				const str = mpw_chk;
				if (str.search(/\s/) !== -1) {
					$('#mpw').addClass('border_validate_err');
					sweetalert('비밀번호 공백을 제거해 주세요.', '', 'error', '닫기');
					return false;
				}
				if (!pattern1.test(str) || !pattern2.test(str) || !pattern3.test(str)
					|| str.length < 8 || str.length > 16) {
					$('#mpw').addClass('border_validate_err');
					sweetalert('8~16자 영문 대 소문자\n숫자, 특수문자를 사용하세요.', '', 'error', '닫기');
					return false;
				}
			}
			$('#mpw').removeClass('border_validate_err');

			if (confirmPassword_chk === '') {
				$('#confirmPassword').addClass('border_validate_err');
				sweetalert('비밀번호 확인을 입력해주세요.', '', 'error', '닫기');
				return false;
			}
			if (mpw_chk !== confirmPassword_chk) {
				$('#pwd_val').addClass('border_validate_err');
				$('#confirmPassword').addClass('border_validate_err');
				sweetalert('비밀번호가 일치하지 않습니다.', '', 'error', '닫기');
				return false;
			}
			$('#confirmPassword').removeClass('border_validate_err');

			if (mcell1_chk === '' || mcell2_chk === ''
				|| mcell3_chk === '') {
				$('#mcell1').addClass('border_validate_err');
				$('#mcell2').addClass('border_validate_err');
				$('#mcell3').addClass('border_validate_err');
				sweetalert('휴대전화 번호를 입력해주세요.', '', 'error', '닫기');
				return false;
			}
			$('#mcell1').removeClass('border_validate_err');
			$('#mcell2').removeClass('border_validate_err');
			$('#mcell3').removeClass('border_validate_err');

			if (memail1_chk === '') {
				$('#memail1').addClass('border_validate_err');
				sweetalert('이메일 주소를 다시 확인해주세요.', '', 'error', '닫기');
				return false;
			}


			if (memail1_chk.search(/\s/) !== -1) {
				$('#memail1').addClass('border_validate_err');
				sweetalert('이메일 공백을 제거해 주세요.', '', 'error', '닫기');
				return false;
			}
			$('#email_val').removeClass('border_validate_err');

			if (memail2_chk === '') {
				$('#memail2').addClass('border_validate_err');
				sweetalert('이메일 주소를 다시 확인해주세요.', '', 'error', '닫기');
				return false;
			}
			$('#memail2').removeClass('border_validate_err');

			return true;
		}

		if (fnValidate()) {
			axios.post('http://localhost:8080/member/emailCheck', {
				memail: memail1_chk + '@' + memail2_chk
			})
				.then(response => {
					try {
						const dupli_count = response.data.eamilCheck[0].count;
						if (dupli_count !== 0) {
							$('#memail1').addClass('border_validate_err');
							$('#memail2').addClass('border_validate_err');
							sweetalert('이미 존재하는 이메일입니다.', '', 'error', '닫기');
						} else {
							$('#memail1').removeClass('border_validate_err');
							$('#memail2').removeClass('border_validate_err');
							fnSignInsert();
						}
					} catch (error) {
						alert('작업중 오류가 발생하였습니다.')
					}
				})
				.catch(response => { return false; });
		}

	};

	const fnSignInsert = async () => {
		var jsonstr = $("form[name='frm']").serialize();
		jsonstr = decodeURIComponent(jsonstr);
		var Json_form = JSON.stringify(jsonstr).replace(/\"/gi, '')
		Json_form = "{\"" + Json_form.replace(/\&/g, '\",\"').replace(/=/gi, '\":"') + "\"}";

		try {
			const response = await fetch('http://localhost:8080/member/join', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: Json_form,
			});
			const body = await response.text();
			if (body === "succ") {
				await sweetalert('회원가입이 완료되었습니다.', '', 'success', '닫기');
				window.location.href = "/login";
			} else {
				alert('작업중 오류가 발생하였습니다.');
			}
		} catch (error) {
			alert('작업중 오류가 발생하였습니다.');
		}
	};

	const emailKeyDown = (id) => {
		$('#memail1').removeClass('border_validate_err');
		if (id === "memail2") {
			$('#memail2').removeClass('border_validate_err');
		}
	};

	const pwdKeyDown = () => {
		$('#mpw').removeClass('border_validate_err');
	};

	const pwdCnfKeyDown = () => {
		$('#confirmPassword').removeClass('border_validate_err');
	};

	const nameKeyDown = () => {
		$('#mname').removeClass('border_validate_err');
	};

	const cellKeyDown = (id) => {
		$("#" + id).removeClass('border_validate_err');
	}

	const mustNumber = (id) => {
		$("#" + id).removeClass('border_validate_err');
		var pattern1 = /[0-9]/;
		var str = $('#' + id).val();
		if (!pattern1.test(str.substr(str.length - 1, 1))) {
			$('#' + id).val(str.substr(0, str.length - 1));
		}
	}

	const sweetalert = (title, contents, icon, confirmButtonText) => {
		return Swal.fire({
			title,
			text: contents,
			icon,
			confirmButtonText
		});
	};

	return (

		<section>
			<div class="register-box">
				<div class="register-logo">
					<a href="/" style={{ fontWeight: "600" }}>Pop<span class="color-b">Pin</span></a>
				</div>

				<div class="register-box-body">
					<p class="login-box-msg"><b>회원가입하여 시작하세요.</b></p>

					<form method="post" name="frm">
						<div style={{ marginBottom: "3%" }} class="form-group has-feedback">
							<input id="mid" type="text" class="form-control" name="mid" placeholder="아이디" onBlur={duplicateIdchk} />
						</div>

						<div style={{ marginBottom: "3%" }} class="form-group has-feedback">
							<input id="mname" type="text" class="form-control" name="mname" placeholder="이름" onKeyDown={nameKeyDown} />
						</div>

						<div style={{ marginBottom: "3%" }} class="form-group has-feedback">
							<input id="mpw" type="password" class="form-control" name="mpw" placeholder="비밀번호" onKeyDown={pwdKeyDown} />
						</div>

						<div style={{ marginBottom: "3%" }} class="form-group has-feedback">
							<input id="confirmPassword" type="password" class="form-control" name="confirmPassword" placeholder="비밀번호확인" onKeyDown={pwdCnfKeyDown} />
						</div>

						<div style={{ marginBottom: "3%" }} class="form-group has-feedback">
							<select id="mcell1" name="mcell1" class="form-control" style={{ width: "20%", display: "inline" }} onChange={() => cellKeyDown("mcell1")}>
								<option value="">선택</option>
								<option value="010">010</option>
								<option value="011">011</option>
								<option value="016">016</option>
								<option value="017">017</option>
								<option value="018">018</option>
								<option value="019">019</option>
							</select>
							<span style={{ margin: "3%", fontSize: "20px" }}>-</span>
							<input style={{ width: "31.3%", display: "inline" }} id="mcell2" name="mcell2" max="9999"
								maxlength="4" onChange={() => mustNumber("mcell2")} class="form-control" />
							<span style={{ margin: "3%", fontSize: "20px" }}>-</span>
							<input style={{ width: "31.3%", display: "inline" }} id="mcell3" name="mcell3" max="9999"
								maxlength="4" onChange={() => mustNumber("mcell3")} class="form-control" />
						</div>

						<div style={{ marginBottom: "3%" }} class="form-group has-feedback">
							<input style={{ width: "50%", display: "inline" }} id="memail1" type="text" class="form-control"
								name="memail1" placeholder="이메일" onKeyDown={emailKeyDown} />
							<span style={{ margin: "3%", fontSize: "20px" }}>@</span>
							<select style={{ height: "38px", width: "37.3%", display: "inline" }} id="memail2" name="memail2" class="form-control" onChange={() => emailKeyDown("memail2")}>
								<option value="">선택하세요</option>
								<option value='naver.com'>naver.com</option>
								<option value='hanmail.net'>hanmail.net</option>
								<option value='nate.com'>nate.com</option>
								<option value='hotmail.com'>hotmail.com</option>
								<option value='gmail.com'>gmail.com</option>
								<option value='yahoo.co.kr'>yahoo.co.kr</option>
								<option value='yahoo.com'>yahoo.com</option>
							</select>
						</div>

						<div class="row" style={{ textAlign: "center" }}>
							<div class="col-xs-12">
								<div style={{ backgroundColor: "#2eca6a", borderColor: "#2eca6a" }}
									class="btn btn-primary btn-block btn-flat" onClick={() => submitClick()}>회원가입</div>
							</div>
						</div>
					</form>

					<Link to={"/login"} class="atag">이미 아이디가 존재해요.</Link>
				</div>

			</div>
		</section>

	);
};

export default Join;