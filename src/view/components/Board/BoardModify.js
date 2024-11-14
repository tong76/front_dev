import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import cookie from 'react-cookies';
import Swal from 'sweetalert2';

const BoardModify = () => {
    const location = useLocation();
    const navigate = useNavigate(); // useNavigate 사용
    const queryParams = new URLSearchParams(location.search);
    const bno = queryParams.get('bno');

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [userId, setUserId] = useState('');
    const [mid, setMid] = useState('');
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [append_attachList, setAppend_attachList] = useState([]);
    // 백업용 상태저장(뒤로가기, 작성취소 시 파일을 삭제했을 수 있기 때문에);
    const [defaultAttachList, setDefaultAttachList] = useState([]);

    // 사용자 아이디 가져오는 코드
    const callSessionInfoApi = async () => {
        try {
            const response = await axios.post('http://localhost:8080/member/jwtChk', {
                token1: cookie.load('userid'),
                token2: cookie.load('username')
            });
            setUserId(response.data.token1);
        } catch (error) {
            console.log('작업중 오류가 발생하였습니다.');
        }
    };

    // 게시글 첨부파일 가져오는 코드
    const callAttachListApi = () => {
        axios.get(`http://localhost:8080/board/getAttach/${bno}`)
            .then(response => {
                for (let i = 0; i < response.data.getAttach.length; i++) {
                    const fileInfo = getFileInfo(response.data.getAttach[i]);
                    setAppend_attachList(prev => [...prev, fileInfo]);
                }
                // 백업용 첨부파일 리스트
                if (defaultAttachList.length === 0) {
                    for (let i = 0; i < response.data.getAttach.length; i++) {
                        const fileInfo = getFileInfo(response.data.getAttach[i]);
                        setDefaultAttachList(prev => [...prev, fileInfo]);
                    }
                }
            })
            .catch(error => {
                console.error('Error uploading file:', error);
            });
    };

    // 파일 포맷 코드
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

    // 이미지면 원본 이미지, 기타 파일이면 기본 아이콘으로 변경
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

    // 게시글 정보 가져오기
    useEffect(() => {
        const callBoardInfoApi = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/board/boardPage/${bno}`);
                const data = res.data.boardPage[0];
                setTitle(data.btitle);
                setContent(data.bcon);
                setMid(data.bwriter);
            } catch (error) {
                alert("게시글을 못 받아왔습니다.");
            }
        };
        callBoardInfoApi();
        callAttachListApi();
    }, [bno]);

    useEffect(() => {
        callSessionInfoApi();
    }, []);

    useEffect(() => {
        if (userId && mid && userId !== mid) {
            navigate('/board/boardlist'); // 권한이 없으면 이동
        } else if (userId && mid) {
            setIsAuthorized(true);
        }
    }, [userId, mid, navigate]);

    const submitClick = async (e) => {
        e.preventDefault();

        const fnValidate = () => {
            if (title === '') {
                sweetalert('제목을 입력해주세요.', '', 'error', '닫기');
                return false;
            }
            if (content === '') {
                sweetalert('내용을 입력해주세요.', '', 'error', '닫기');
                return false;
            }
            return true;
        };

        if (fnValidate()) {

            const files = append_attachList.map(file => (file.fullName));

            const jsonData = {
                bno: bno,
                btitle: title,
                bcon: content,
                files: files
            };

            try {
                const response = await axios.post('http://localhost:8080/board/boardModify', jsonData);
                if (response.data === "succ") {
                    sweetalert('수정이 완료되었습니다.', '', 'success', '확인');
                    // 백업 데이터에 없는 값을 지우는 작업(디렉토리에 쓸데없는 공간 차지 방지)
                    const deletefile = defaultAttachList
                        .filter(file => !files.includes(file.fullName))
                        .map(file => file.fullName);
                    try {
                        axios.post("http://localhost:8080/deleteAllFiles", {
                            files: deletefile
                        }).then(response => {
                            if (response.data !== "deleted") {
                                alert("작업 중 오류가 발생하였습니다.");
                            }
                        })
                    } catch (error) {
                        alert("작업 중 오류가 발생하였습니다.");
                    }
                    setTimeout(() => {
                        navigate('/board/boardlist'); // 수정 후 이동
                    }, 1500);
                }
            } catch (error) {
                alert('작업 중 오류가 발생하였습니다.');
            }
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

    if (!isAuthorized) {
        return null; // 권한이 없을 경우 렌더링하지 않음
    }

    const handleDrop = (event) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            const formData = new FormData();
            formData.append("file", file);

            axios.post('http://localhost:8080/uploadAjax', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then(response => {
                    const fileInfo = getFileInfo(response.data);
                    setAppend_attachList(prev => [...prev, fileInfo]); // 배열에 추가                    
                })
                .catch(error => {
                    console.error('Error uploading file:', error);
                });
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDelete = (fullName) => {
        setAppend_attachList(prev => prev.filter(file => file.fullName !== fullName)); // 배열에서 삭제
    };

    /* const handleDeleteAll = () => {
        const files = append_attachList.map(file => (file.fullName));
        axios.post(`http://localhost:8080/deleteAllFiles`, {
            files: files
        })
            .then(result => {
                if (result.data === 'deleted') {
                    window.location.href = "boardlist";
                }
            })
            .catch(error => {
                console.error('Error deleting file:', error);
            });
    }; */

    return (
        <main id="main">

            <style>
                {`
                .fileDrop {
                    width: 80%;
                    height: 100px;
                    border: 1px dotted gray;
                    background-color: lightslategrey;
                    margin: auto;
                }
                `}
            </style>

            <section className="contact">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12 section-t8">
                            <form name="frm" id="frm" role="form" onSubmit={submitClick}>
                                <input type="hidden" id="bno" name="bno" value={bno} />
                                <div className="row">
                                    <div className="col-md-12 mb-3 d-flex justify-content-between align-items-center">
                                        <h2>자유게시판</h2>
                                        <a href={`/board/boardread/${bno}`}>수정취소</a>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <input type="text" id="btitle" name="btitle" className="form-control form-control-lg form-control-a"
                                                placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="col-md-12" style={{ marginTop: '1%' }}>
                                        <div className="form-group">
                                            <textarea id="bcon" name="bcon" className="form-control" cols="45" rows="8" placeholder="Content"
                                                value={content} onChange={(e) => setContent(e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        File DROP Here
                                        <div className="fileDrop"
                                            onDrop={handleDrop}
                                            onDragOver={handleDragOver}>
                                        </div>
                                    </div>

                                    <div className="attach-footer">
                                        <ul className="mailbox-attachments clearfix uploadedList">
                                            {append_attachList.map((file, index) => (
                                                <li key={index}>
                                                    <span className="mailbox-attachment-icon has-img">
                                                        {file.icon ? (
                                                            /* 이미지 파일이 아닌경우 */
                                                            <a href={file.Link}>
                                                                <img src={file.icon} alt="Attachment Icon" style={{ width: "100px", height: "100px" }} />
                                                            </a>
                                                        ) : (
                                                            <a href={file.getLink} target="blank">
                                                                <img src={file.imgSrc} alt="Attachment" />
                                                            </a>
                                                        )}
                                                    </span>
                                                    <div className="mailbox-attachment-info">
                                                        {file.icon ? (
                                                            <>
                                                                {/* 이미지 파일이 아닌경우 */}
                                                                <a href={file.Link} className="mailbox-attachment-name">{file.fileName}</a>
                                                                <a href={file.fullName} onClick={(e) => {
                                                                    e.preventDefault();
                                                                    handleDelete(file.fullName);
                                                                }} className="btn btn-default btn-xs pull-right delbtn">
                                                                    <i className="fa fa-fw fa-remove"><span>X</span></i>
                                                                </a>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <a href={file.getLink} target="blank" className="mailbox-attachment-name">{file.fileName}</a>
                                                                <a href={file.fullName} onClick={(e) => {
                                                                    e.preventDefault();
                                                                    handleDelete(file.fullName);
                                                                }} className="btn btn-default btn-xs pull-right delbtn">
                                                                    <i className="fa fa-fw fa-remove"><span>X</span></i>
                                                                </a>
                                                            </>
                                                        )}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="col-md-12 text-center">
                                        <button type="submit" className="btn btn-a">게시글 수정하기</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default BoardModify;