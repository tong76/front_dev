// BoardPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import cookie from 'react-cookies';
import Post from './Post'; // Post 컴포넌트
import Comments from './Comments'; // Comments 컴포넌트
import Swal from 'sweetalert2';

const BoardRead = () => {
    const navigate = useNavigate();
    const { bno } = useParams();
    const [boardData, setBoardData] = useState({
        btitle: '',
        bcon: '',
        bwriter: '',
        bdate: '',
        bcnt: '',
        bccnt: ''
    });
    const [isAuthor, setIsAuthor] = useState(false);
    const [userId, setUserId] = useState('');
    const [append_reply, setAppend_reply] = useState([]);

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

    useEffect(() => {
        const fetchBoardData = async () => {
            console.log("돌았음");
            try {
                const response = await axios.get(`http://localhost:8080/board/boardPage/${bno}`);
                const data = response.data.boardPage[0];
                setBoardData(data);
                if (data.bwriter === userId) {
                    setIsAuthor(true);
                }
                callReplyListApi();
            } catch (error) {
                alert("axios 에러");
            }
        };
        fetchBoardData();
    }, [bno, userId]);

    const boardDelete = async () => {
        try {
            const res = await axios.post('http://localhost:8080/board/boardDelete', { bno });
            if (res.data === "succ") {
                Swal.fire('삭제가 완료되었습니다.', '', 'success').then(() => {
                    navigate('/board/boardlist');
                });
            }
        } catch (error) {
            alert("게시글 삭제하는 중 에러 발생");
        }
    };

    const callReplyListApi = () => {
        axios.get(`http://localhost:8080/replyList/${bno}`)
        .then(response => {
            setAppend_reply(response.data.replyList);
            setBoardData(prev => ({ ...prev, bccnt: response.data.replyList.length }));
        })
        .catch(error => {
            alert("작업중 오류가 발생하였습니다.");
        });
    };

    return (
        <main id="main">
            <Post boardData={boardData} isAuthor={isAuthor} boardDelete={boardDelete} />
            <Comments bno={bno} userId={userId} callReplyListApi={callReplyListApi} replies={append_reply} />
        </main>
    );
};

export default BoardRead;
