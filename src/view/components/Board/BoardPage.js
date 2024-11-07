import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate,useParams, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import cookie from 'react-cookies';
import $ from 'jquery';

const BoardPage = () => {
    const navigate = useNavigate();
    const { bno } = useParams(); // useParams를 통해 URL 파라미터를 가져옵니다.
    //게시글 json데이터
    const [boardData, setBoardData] = useState({
        btitle: '',
        bcon: '',
        bwriter: '',
        bdate: '',
        bcnt: '',
        bccnt: ''
    });

    //게시글 작성자와 로그인한 회원의 아이디가 같은지 비교
    const [isAuthor, setIsAuthor] = useState(false);

    //댓글
    const [append_reply, setAppend_reply] = useState([]);
    const [content ,setContent] = useState('');
    const [userId, setUserId] = useState('');

    //댓글 수정을 위한 현재 cno와 ccon의 상태 변수
    const [editingCno, setEditingCno] = useState(null);
    const [modifyCon, setModifyCon] = useState('');

    //사용자 아이디 가져오는 코드
    const callSessionInfoApi = () => {
        axios.post('http://localhost:8080/member/jwtChk', {
          token1: cookie.load('userid'),
          token2: cookie.load('username')
        })
        .then(response => {
          setUserId(response.data.token1);
        })
        .catch(error => {
          console.log('작업중 오류가 발생하였습니다.');
        });
    };

    useEffect(() => {
        callSessionInfoApi();
        
    }, []);

    //게시글 페이지
    useEffect(() => {
        const fetchBoardData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/board/boardPage/${bno}`);
                console.log("bno="+bno);
                const data = response.data.boardPage[0];
                setBoardData({
                    btitle: data.btitle,
                    bcon: data.bcon,
                    bwriter: data.bwriter,
                    bdate: data.bdate,
                    bcnt: data.bcnt,
                    bccnt: data.bccnt
                });
                if (data.bwriter === userId) {
                    setIsAuthor(data.bwriter === userId);
                }
                console.log("bwriter = "+data.bwriter);
                console.log("mid = " +userId);
            } catch (error) {
                alert("axios 에러");
            }
        };
        //게시글 페이지 함수 호출
        fetchBoardData();
        //댓글 함수 호출
        callReplyListApi();
        
    }, [bno, userId, boardData.bccnt]); // bno, userId가 변경될 때마다 이 useEffect가 호출됩니다.

    //게시글 삭제
    const boardDelete = async () => {
        try{
            const res = await axios.post('http://localhost:8080/board/boardDelete',{bno});
            if (res.data === "succ") {
                sweetalert('삭제가 완료되었습니다.', '', 'success', '확인');
                setTimeout(() => {
                    navigate('/board/boardlist');
                }, 1500);
            }
        }catch(error){
            alert("게시글 삭제하는 중 에러 발생");
        }
        
    }

    const sweetalert = (title, contents, icon, confirmButtonText) => {
        Swal.fire({
            title: title,
            text: contents,
            icon: icon,
            confirmButtonText: confirmButtonText
        });
    };

    //댓글 관련 코드
    const callReplyListApi = () => {
        axios.get(`http://localhost:8080/replyList/${bno}`, {
        }).then(response => {
            try {
                setAppend_reply(replyList_append(response.data));
                // 댓글 수 업데이트
                const newBCCnt = response.data.replyList.length; // 서버에서 받은 댓글 목록의 길이
                setBoardData(prev => ({
                    ...prev,
                    bccnt: newBCCnt // 댓글 수 업데이트
                }));
            } catch {
                alert("작업중 오류가 발생하였습니다.");
            }
        }).catch(error => { alert("작업중 오류가 발생하였습니다.") });
    }

    //댓글 작성
    const submitClick = async () =>{
        
        const fnvalidate = () =>{
            if(content === ""){
                sweetalert('내용을 입력해주세요.', '', 'error', '닫기');
                return false;
            }
            return true;
        }
        if(fnvalidate()){
            const replyData = {
                bno: bno,
                ccon: content,
                cwriter: userId

            };
            try{
                const res = await axios.post(`http://localhost:8080/replyRegist/${bno}`, replyData);
                if (res.data === "succ") {
                    sweetalert('등록되었습니다.', '', 'success', '확인');
                    setContent('');
                    setEditingCno(null);
                    callReplyListApi();
                }
            }catch(error){
                alert("게시글 등록 중 오류 발생");
            }
        }
    }
    
    //댓글 수정
    //수정 누르면 파라미터로 데이터를 받아서 수정할 cno, ccon 상태 저장
    const replyModifyClick = (data) =>{
        setEditingCno(data.cno);
        setModifyCon(data.ccon);
    };

    const editingReplySubmit = async (cno) =>{
        const ccon_check = $("#modifyCcon").val();

        const checkData = () =>{
            if(ccon_check === ''){
                sweetalert('내용을 입력해주세요.', '', 'error', '닫기');
                return false;
            }
            return true;
        }
        if(checkData()){
            const modifyData = {
                cno: cno,
                ccon: modifyCon
            }
            try{
                const res = await axios.post('http://localhost:8080/replyModify', modifyData);
                if (res.data === "succ") {
                    sweetalert('수정되었습니다.', '', 'success', '확인');
                    callReplyListApi();
            }
            }catch(error){
                alert("댓글 수정중 오류 발생");
            }
        }
    }

    //댓글 삭제
    const replyDelete = async (cno) =>{
        try{
            const res = await axios.get(`http://localhost:8080/replyDelete/${cno}`);
            if(res.data === "succ"){
                sweetalert('삭제가 완료되었습니다.', '', 'success', '확인');
                callReplyListApi();
            }
        }catch(error){
            alert("댓글 삭제중 오류 발생");
        }
    }


    const replyList_append = (reply) => {
        const replyList = reply.replyList;

        return replyList.map(data => (
            <li style={{ listStyleType: "none" }} key={data.cno}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", margin: "0 auto", width: "50%" }}>
                    <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
                        <h4>{data.cwriter}</h4>
                        {data.cwriter === userId && (
                            <div style={{ marginLeft: "auto", display: "flex", gap: "10px" }}>
                                <p onClick={() => replyModifyClick(data)}>수정</p>
                                <p onClick={() => replyDelete(data.cno)}>삭제</p>
                            </div>
                        )}
                    </div>
                    {editingCno === data.cno ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', marginBottom: '20px', width: '50%' }}>
                            <textarea
                                id="modifyCcon"
                                name="ccon"
                                rows="4"
                                value={modifyCon}
                                onChange={(e) => setModifyCon(e.target.value)}
                                style={{ borderRadius: '5px', padding: '10px', marginBottom: '10px' }}
                            />
                            <div style={{ backgroundColor: "#2eca6a", padding: "10px", textAlign: "center", width: '100%' }}
                                className="btn btn-primary btn-block btn-flat"
                                onClick={() => editingReplySubmit(editingCno)}>댓글수정</div>
                        </div>
                    ) : (
                        <>
                            <strong style={{ marginBottom: "10px" }}>{data.ccon}</strong>
                            <span>{data.cdate}</span>
                        </>
                    )}
                    <hr style={{ width: "100%", border: "1px solid #2eca6a", margin: "10px 0" }} />
                </div>
            </li>
        ));
    };

    
    

    return (
        <main id="main">
            <section className="intro-single">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 col-lg-8">
                            <div className="title-single-box">
                                <h1 className="title-single">{boardData.btitle}</h1>
                                <span className="color-text-a">작성자: {boardData.bwriter}</span>
                            </div>
                        </div>
                        <div className="col-md-12 col-lg-4">
                            <nav aria-label="breadcrumb" className="breadcrumb-box d-flex justify-content-lg-end">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">조회수: {boardData.bcnt}</li>
                                    <li className="breadcrumb-item active" aria-current="page">{boardData.bdate}</li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </section>
            <section className="news-single nav-arrow-b">
                <div className="container">
                    <div className="row">
                        <div className="col-md-10 offset-md-1 col-lg-8 offset-lg-2">
                            <div className="post-content color-text-a">
                                {boardData.bcon}
                            </div>
                            <div className="box-footer">
                                <ul className="mailbox-attachments clearfix uploadedList">
                                    {/* 첨부 파일 목록이 여기에 표시될 수 있습니다 */}
                                </ul>
                            </div>
                            <div className="post-footer">
                                <div className="post-share">
                                    <ul className="list-inline socials">
                                        <li>
                                            <Link to="/board/boardlist">
                                                <button className="green-button btn button-text">게시판 목록</button>
                                            </Link>
                                            {isAuthor && (
                                                <> <a href="/board/boardmodify" state={{bno}}>
                                                <button className="green-button btn button-text">게시글 수정</button>
                                                </a>
                                                <button className="green-button2 btn button-text" onClick={boardDelete}>게시글 삭제</button>
                                                </>
                                            )}
                                            
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-10 offset-md-1 col-lg-10 offset-lg-1">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="box box-success">
                                        <div className="title-box-d">
                                            <h3 className="title-d">댓글</h3>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', marginBottom: '20px', width: '100%' }}>
                                            <textarea
                                                id="ccon"
                                                name="ccon"
                                                placeholder="댓글을 작성하세요..."
                                                rows="4"
                                                value={content} onChange={(e) => setContent(e.target.value)}
                                                style={{ borderRadius: '5px', padding: '10px', marginBottom: '10px' }}
                                            />
                                            <div style={{ backgroundColor: "#2eca6a", borderColor: "#2eca6a", padding: "10px", textAlign: "center", width: '100%' }} className="btn btn-primary btn-block btn-flat" onClick={() => submitClick()} >댓글작성</div>
                                        </div>
                                        <ul className="timeline">
                                            <li className="time-label">
                                                <strong>댓글목록</strong>
                                                <small>댓글 수: {boardData.bccnt}</small>
                                            </li>
                                        </ul>
                                        <div class="review-list">
                                            <ul>
                                                {append_reply}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Modal component can be included here, but it is not used in this example */}
        </main>
    );
};

export default BoardPage;