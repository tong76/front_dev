// Comments.js
import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import $ from 'jquery';

const Comments = ({ bno, userId, callReplyListApi, replies }) => {
    const [content, setContent] = useState('');
    const [editingCno, setEditingCno] = useState(null);
    const [modifyCon, setModifyCon] = useState('');

    const sweetalert = (title, contents, icon, confirmButtonText) => {
        Swal.fire({ title, text: contents, icon, confirmButtonText });
    };

    const submitClick = async () => {
        if (content === "") {
            sweetalert('내용을 입력해주세요.', '', 'error', '닫기');
            return;
        }

        const replyData = { bno, ccon: content, cwriter: userId };
        try {
            const res = await axios.post(`http://localhost:8080/replyRegist/${bno}`, replyData);
            if (res.data === "succ") {
                sweetalert('등록되었습니다.', '', 'success', '확인');
                setContent('');
                callReplyListApi();
            }
        } catch (error) {
            alert("댓글 등록 중 오류 발생");
        }
    };

    const replyModifyClick = (data) => {
        setEditingCno(data.cno);
        setModifyCon(data.ccon);
    };

    const editingReplySubmit = async (cno) => {
        if (modifyCon === '') {
            sweetalert('내용을 입력해주세요.', '', 'error', '닫기');
            return;
        }

        const modifyData = { cno, ccon: modifyCon };
        try {
            const res = await axios.post('http://localhost:8080/replyModify', modifyData);
            if (res.data === "succ") {
                sweetalert('수정되었습니다.', '', 'success', '확인');
                setEditingCno(null);
                setModifyCon('');
                callReplyListApi();
            }
        } catch (error) {
            alert("댓글 수정중 오류 발생");
        }
    };

    const replyDelete = async (cno) => {
        try {
            const res = await axios.get(`http://localhost:8080/replyDelete/${cno}`);
            if (res.data === "succ") {
                sweetalert('삭제가 완료되었습니다.', '', 'success', '확인');
                callReplyListApi();
            }
        } catch (error) {
            alert("댓글 삭제중 오류 발생");
        }
    };

    const replyListAppend = replies.map(data => (
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
                            rows="4"
                            value={modifyCon}
                            onChange={(e) => setModifyCon(e.target.value)}
                            style={{ borderRadius: '5px', padding: '10px', marginBottom: '10px' }}
                        />
                        <div style={{ backgroundColor: "#2eca6a", padding: "10px", textAlign: "center", width: '100%' }}
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

    return (
        <div className="comments-section">
            <textarea
                placeholder="댓글을 작성하세요..."
                rows="4"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                style={{ borderRadius: '5px', padding: '10px', marginBottom: '10px', width: '100%' }}
            />
            <div style={{ backgroundColor: "#2eca6a", padding: "10px", textAlign: "center", cursor: 'pointer' }} onClick={submitClick}>
                댓글작성
            </div>
            <ul className="timeline">
                <li className="time-label">
                    <strong>댓글목록</strong>
                    <small>댓글 수: {replies.length}</small>
                </li>
            </ul>
            <ul>
                {replyListAppend}
            </ul>
        </div>
    );
};

export default Comments;