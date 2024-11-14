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
    const [append_attachList, setAppend_attachList] = useState([]);

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
        callAttachListApi();
    }, []);

    useEffect(() => {
        const fetchBoardData = async () => {
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
                const files = append_attachList.map(file => (file.fullName));
                axios.post(`http://localhost:8080/deleteAllFiles`, {
                    files: files
                })
                    .then(result => {
                        if (result.data !== 'deleted') {
                            console.error('이미 삭제된 파일입니다.');
                        }
                    })
                    .catch(error => {
                        console.error('Error deleting file:', error);
                    });
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

    const callAttachListApi = () => {
        axios.get(`http://localhost:8080/board/getAttach/${bno}`)
            .then(response => {
                for (let i = 0; i < response.data.getAttach.length; i++) {
                    const fileInfo = getFileInfo(response.data.getAttach[i]);
                    setAppend_attachList(prev => [...prev, fileInfo]);
                }
            })
            .catch(error => {
                console.error('Error uploading file:', error);
            });
    }

    const getFileInfo = (data) => {
        // data가 문자열이라 가정하고, 필요한 정보를 추출
        const filePath = data; // 서버에서 받은 파일 경로
        let fileName;
        const fileType = filePath.split('.').pop().toLowerCase(); // 파일 유형 검사
        if (fileType === "jpg" ||
            fileType === "jpeg" ||
            fileType === "png" ||
            fileType === "gif"
        ) {
            fileName = filePath.substring(filePath.lastIndexOf('_') + 1);
        } else {
            fileName = filePath.substring(filePath.indexOf('_') + 1);
        }
        const imgSrc = `http://localhost:8080/displayFile?fileName=${filePath}`; // 이미지 URL 생성 함수 호출
        const icon = getFileIcon(fileName); // 보여지는 이미지 검사
        const Link = `http://localhost:8080/displayFile?fileName=${filePath}`; // 파일 다운로드 링크
        const getLink = Link.replace(Link.substring(Link.lastIndexOf('/') + 1, Link.indexOf('_') + 1), "");
        const fullName = filePath; // 전체 경로

        console.log(fileName);
        console.log(imgSrc);
        console.log(icon);
        console.log(Link);
        console.log(getLink);
        console.log(fullName);

        return {
            fileName,
            imgSrc,
            icon,
            Link,
            getLink,
            fullName,
        };
    };

    const getFileIcon = (fileName) => {
        const extension = fileName.split('.').pop().toLowerCase();

        switch (extension) {
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return null; // 이미지는 따로 처리
            default:
                return '/default-icon.png'; // 기타 파일 아이콘 경로
        }

    };

    return (
        <main id="main">
            <Post boardData={boardData} isAuthor={isAuthor} boardDelete={boardDelete} append_attachList={append_attachList} />
            <Comments bno={bno} userId={userId} callReplyListApi={callReplyListApi} replies={append_reply} />
        </main>
    );
};

export default BoardRead;
