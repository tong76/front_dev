import axios from "axios";
import { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import $ from "jquery";

const BoardList = () => {
    const [boardList, setBoardList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [startPage, setStartPage] = useState(0);
    const [endPage, setEndPage] = useState(0);
    const [keyword, setKeyword] = useState('');
    const [searchtype, setSearchtype] = useState('');
    const [isSearchMode, setIsSearchMode] = useState(false);

    useEffect(() => {
        fetchBoardList(currentPage);
        $("#spaging").hide();
    }, []);

    // 게시판 리스트 불러오기
    const fetchBoardList = (page, searchParams = {}) => {
        const { keyword, searchtype } = searchParams;
        let url = `http://localhost:8080/board/list/${page}`;
        
        if (searchtype && keyword) {
            url += `?searchType=${searchtype}&keyword=${keyword}`;
        }

        axios.get(url)
            .then(response => {
                const { list, pageMaker } = response.data;

                if (list.length === 0) {
                    // 검색 결과가 없을 때
                    if (searchParams && searchParams.keyword) {
                        // 검색 모드일 때만 알림을 띄우고, 데이터를 다시 불러오지 않음
                        if (!isSearchMode) {
                            setIsSearchMode(true); // 검색 모드로 설정
                            setBoardList([]); // 리스트 비우기
                            setTotalPages(0); // 총 페이지 0으로 설정
                            setStartPage(0); // 시작 페이지 0으로 설정
                            setEndPage(0); // 끝 페이지 0으로 설정
                        }
                        Swal.fire({
                            title: '검색 결과가 없습니다.',
                            text: '검색어를 수정하여 다시 시도해 보세요.',
                            icon: 'info',
                            confirmButtonText: '확인'
                        });
                    } else {
                        // 전체 리스트가 비어있는 경우
                        setBoardList([]); // 리스트 비우기
                        setTotalPages(0); // 총 페이지 0으로 설정
                        setStartPage(0); // 시작 페이지 0으로 설정
                        setEndPage(0); // 끝 페이지 0으로 설정
                    }
                } else {
                    setBoardList(list); // 정상적으로 데이터가 있다면 설정
                    setTotalPages(pageMaker.totalPage);
                    setStartPage(pageMaker.startPage);
                    setEndPage(pageMaker.endPage);

                    // 검색 모드 여부에 따라 페이지를 숨기고 보여주기
                    if (searchParams) {
                        setIsSearchMode(true);
                        $("#cpaging").hide();
                        $("#spaging").show();
                    } else {
                        setIsSearchMode(false);
                        $("#cpaging").show();
                        $("#spaging").hide();
                    }
                }
            })
            .catch(() => {
                Swal.fire({
                    title: '게시글을 불러오는 중 오류가 발생하였습니다.',
                    icon: 'error',
                    confirmButtonText: '확인'
                });
            });
    };

    const handleSearch = (e) => {
        e.preventDefault();

        if (searchtype === "n") {
            // ---전체--- 선택 시, 검색 없이 전체 게시판 목록을 불러옴
            fetchBoardList(1);
            return;
        }

        if (!searchtype || !keyword) {
            Swal.fire({
                title: '검색어와 검색 타입을 입력해주세요.',
                icon: 'error',
                confirmButtonText: '확인'
            });
            return;
        }

        fetchBoardList(1, { keyword, searchtype });
    };

    const handlePageClick = (page) => {
        setCurrentPage(page);
        if (isSearchMode) {
            fetchBoardList(page, { keyword, searchtype });
        } else {
            fetchBoardList(page);
        }
    };

    const renderPagination = () => {
        const pagesPerGroup = 5;
        const pageNumbers = [];
        const currentPageGroup = Math.ceil(currentPage / pagesPerGroup);
        let startPage = (currentPageGroup - 1) * pagesPerGroup + 1;
        let endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);

        for (let i = startPage; i <= endPage; i++) {
            const isCurrentPage = i === currentPage;
            pageNumbers.push(
                <button
                    key={i}
                    style={{ margin: 5, backgroundColor: isCurrentPage ? '#a4d1ae' : '' }}
                    className={`sch_bt99 wi_au ${isCurrentPage ? 'current-page' : ''}`}
                    onClick={() => handlePageClick(i)}
                >
                    {i}
                </button>
            );
        }

        return (
            <div className="Paging">
                {currentPageGroup > 1 && (
                    <button
                        style={{ margin: 5 }}
                        className="sch_bt99 wi_au"
                        onClick={() => handlePageClick(startPage - 1)}
                    >
                        {'<'}
                    </button>
                )}
                {pageNumbers}
                {endPage < totalPages && (
                    <button
                        style={{ margin: 5 }}
                        className="sch_bt99 wi_au"
                        onClick={() => handlePageClick(endPage + 1)}
                    >
                        {'>'}
                    </button>
                )}
            </div>
        );
    };

    const handleSearchValChange = (e) => {
        setKeyword(e.target.value);
    };

    const handleSearchTypeChange = (e) => {
        setSearchtype(e.target.value);
    };

    return (
        <main id="main">
            <section className="content">
                <div className="row">
                    <section className="intro-single">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-12 col-lg-8">
                                    <div className="title-single-box">
                                        <h1 className="title-single">자유게시판</h1>
                                        <span className="color-text-a">자유롭게 대화해보세요!</span>
                                    </div>
                                </div>
                                <div className="col-md-12 col-lg-4">
                                    <nav aria-label="breadcrumb" className="breadcrumb-box d-flex justify-content-lg-end">
                                        <ol className="breadcrumb">
                                            <li className="breadcrumb-item"><a href="#">홈</a></li>
                                            <li className="breadcrumb-item active" aria-current="page">자유게시판</li>
                                        </ol>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="community-grid grid">
                        <div className="container">
                            <div className="list-box">
                                <div className="box-header with-border">
                                    <div className="row">
                                        <div className="search-box">
                                            <form onSubmit={handleSearch}>
                                                <select name="searchType" value={searchtype} onChange={handleSearchTypeChange}>
                                                    <option value="n">---전체---</option>
                                                    <option value="t">제목</option>
                                                    <option value="w">작성자</option>
                                                    <option value="tw">제목 / 작성자</option>
                                                </select>
                                                <input
                                                    type="text"
                                                    name="keyword"
                                                    value={keyword}
                                                    onChange={handleSearchValChange}
                                                />
                                                <button type="submit">검색</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <div className="box-body">
                                    <div className="board-main">
                                        <table className="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th className="short">글번호</th>
                                                    <th>제목</th>
                                                    <th className="middle">작성자</th>
                                                    <th className="long">작성일</th>
                                                    <th className="short">조회수</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {boardList.length === 0 ? (
                                                    <tr><td colSpan="5" style={{ textAlign: 'center' }}>검색 결과가 없습니다.</td></tr>
                                                ) : (
                                                    boardList.map(data => (
                                                        <tr key={data.bno}>
                                                            <td>{data.bno}</td>
                                                            <td className="title-align">
                                                                <a href={`/board/boardread/${data.bno}`}>
                                                                    {data.btitle} <strong>({data.bccnt})</strong>
                                                                </a>
                                                            </td>
                                                            <td>{data.bwriter}</td>
                                                            <td>{data.bdate}</td>
                                                            <td><strong>{data.bcnt}</strong></td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div id="cpaging">
                                {renderPagination()}
                            </div>
                            <div id="spaging">
                                {renderPagination()}
                            </div>
                            <div className="box-footer">
                                <div className="list-registBtn">
                                    <a href='/board/boardregist'>
                                        <button className="green-button btn button-text" id="list-registBtn">
                                            <strong>작성하기</strong>
                                        </button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </section>
        </main>
    );
};

export default BoardList;
