// Post.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Post = ({ boardData, isAuthor, boardDelete, append_attachList }) => {

    return (
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
            <section className="news-single nav-arrow-b">
                <div className="container">
                    <div className="row">
                        <div className="col-md-10 offset-md-1 col-lg-8 offset-lg-2">
                            <div className="post-content color-text-a">
                                {boardData.bcon}
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
                                                        }}></a>
                                                    </>
                                                ) : (
                                                    <>
                                                        <a href={file.getLink} target="blank" className="mailbox-attachment-name">{file.fileName}</a>
                                                        <a href={file.fullName} onClick={(e) => {
                                                            e.preventDefault();
                                                        }}></a>
                                                    </>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="post-footer">
                                <div className="post-share">
                                    <ul className="list-inline socials">
                                        <li>
                                            <a href="/board/boardlist">
                                                <button className="green-button btn button-text">게시판 목록</button>
                                            </a>
                                            {isAuthor && (
                                                <>
                                                    <a href={`/board/boardmodify?bno=${boardData.bno}`}>
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
                    </div>
                </div>
            </section>
        </section>
    );
};

export default Post;