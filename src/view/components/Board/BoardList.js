import axios from "axios";
import { useState, useEffect } from "react";
import { Link,useNavigate } from "react-router-dom";
import $ from "jquery";

const BoardList = () => {

    const navigate = useNavigate();

    const [append_NboardList, setAppend_NboardList] = useState([]);
    const [append_SboardList, setAppend_SboardList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState('');
    const [startPage, setStartPage] = useState('');
    const [endPage, setEndPage] = useState('');
    const [keyword, setKeyword] = useState('');
    const [searchtype, setSearchtype] = useState('');
    const [boardState, setBoardState] = useState(0);


    useEffect(() => {
        callNboardListApi(currentPage);
        $("#spaging").hide();
    }, []);

    const callNboardListApi = (page) => {
        axios.get(`http://localhost:8080/board/list/${page}`)
            .then(response => {
                try {
                    setAppend_NboardList(nBoardListAppend(response.data));
                    setTotalPages(response.data.pageMaker.totalPage);
                    setStartPage(response.data.pageMaker.startPage);
                    setEndPage(response.data.pageMaker.endPage);
                } catch (error) {
                    alert('작업중 오류가 발생하였습니다1.');
                }
            })
            .catch(error => { alert('게시글을 불러오는 중 오류가 발생하였습니다.'); return false; });
    };

    const nBoardListAppend = (nBoard) => {
        let result = []
        let nBoardList = nBoard.list

        for (let i = 0; i < nBoardList.length; i++) {
            let data = nBoardList[i]

            result.push(
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
            )
        }
        return result;
    }

    const renderPagination = () => {
        const pagesPerGroup = 5;
        const pageNumbers = [];
        const currentPageGroup = Math.ceil(currentPage / pagesPerGroup);
        let startPage = (currentPageGroup - 1) * pagesPerGroup + 1;
        let endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);

        if (currentPageGroup > 1) {
            startPage = (currentPageGroup - 1) * pagesPerGroup + 1;
            endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);
        }

        for (let i = startPage; i <= endPage; i++) {
            const isCurrentPage = i === currentPage;
            pageNumbers.push(
                <button style={{ margin: 5, backgroundColor: isCurrentPage ? '#a4d1ae' : '' }}
                    className={`sch_bt99 wi_au ${isCurrentPage ? 'current-page' : ''}`} key={i} onClick={() => handlePageClick(i)}>
                    {i}
                </button>
            );
        };

        return (
            <div className="Paging">
                {currentPageGroup > 1 && (
                    <button style={{ margin: 5 }} className="sch_bt99 wi_au" onClick={() => handlePageClick(startPage - 1)}>
                        {'<'}
                    </button>
                )}
                {pageNumbers}
                {endPage < totalPages && (
                    <button style={{ margin: 5 }} className="sch_bt99 wi_au" onClick={() => handlePageClick(endPage + 1)}>
                        {'>'}
                    </button>
                )}
            </div>
        );
    }

    const callSboardListApi = (page) => {

        if (searchtype != '' && keyword != '') {
            axios.get(`http://localhost:8080/board/list/${page}?searchType=${searchtype}&keyword=${keyword}`)
                .then(response => {
                    try {
                        if (response.data.list.length === 0) {
                            alert('검색 결과가 없습니다. 전체 리스트로 돌아갑니다.');
                            setKeyword('');
                            setSearchtype('');
                            setCurrentPage(1);
                            callNboardListApi(1); // 전체 리스트 불러오기
                        } else {
                            setAppend_SboardList(sBoardListAppend(response.data));
                            setTotalPages(response.data.pageMaker.totalPage);
                            setStartPage(response.data.pageMaker.startPage);
                            setEndPage(response.data.pageMaker.endPage);
                            $("#cpaging").hide();
                            $("#spaging").show();
                            setBoardState(1);
                        }
                    } catch (error) {
                        alert('작업중 오류가 발생하였습니다1.');
                    }
                })
                .catch(error => { alert('작업중 오류가 발생하였습니다2.'); return false; });
        } else {
            navigate(-1);
        };
    };

    const sBoardListAppend = (sBoard) => {
        let result = []
        let sBoardList = sBoard.list

        for (let i = 0; i < sBoardList.length; i++) {
            var data = sBoardList[i]
            result.push(
                <tr class="hidden_type" key={data.bno}>
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
            )
        }
        return result;
    }

    const renderSearchPagination = () => {
        const pagesPerGroup = 5;
        const pageNumbers = [];
        const currentPageGroup = Math.ceil(currentPage / pagesPerGroup);
        let startPage = (currentPageGroup - 1) * pagesPerGroup + 1;
        let endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);

        if (currentPageGroup > 1) {
            startPage = (currentPageGroup - 1) * pagesPerGroup + 1;
            endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);
        }

        for (let i = startPage; i <= endPage; i++) {
            const isCurrentPage = i === currentPage;
            pageNumbers.push(
                <button style={{ margin: 5, backgroundColor: isCurrentPage ? '#a4d1ae' : '' }}
                    className={`sch_bt99 wi_au ${isCurrentPage ? 'current-page' : ''}`} key={i} onClick={() => handlePageClick(i)}>
                    {i}
                </button>
            );
        };

        return (
            <div className="Paging">
                {currentPageGroup > 1 && (
                    <button style={{ margin: 5 }} className="sch_bt99 wi_au" onClick={() => handlePageClick(startPage - 1)}>
                        {'<'}
                    </button>
                )}
                {pageNumbers}
                {endPage < totalPages && (
                    <button style={{ margin: 5 }} className="sch_bt99 wi_au" onClick={() => handlePageClick(endPage + 1)}>
                        {'>'}
                    </button>
                )}
            </div>
        );
    };


    const handlePageClick = (page) => {
        if (keyword === '' || searchtype === '') {
            setCurrentPage(page);
            callNboardListApi(page);
        } else {
            setCurrentPage(page);
            callSboardListApi(page);
        }
    };

    const handleSearchValChange = (e) => {
        setKeyword(e.target.value);
    };

    const handleSearchTypeChange = (e) => {
        setSearchtype(e.target.value);
    };

    const handleSearchButtonClick = (e) => {
        e.preventDefault();
        $("#boardListappend").hide();
        setCurrentPage(1);
        callSboardListApi(1);

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
                                            <form onSubmit={(e) => handleSearchButtonClick(e)}>
                                                <select name="searchType" onChange={handleSearchTypeChange}>
                                                    <option value="n">---전체---</option>
                                                    <option value="t">제목</option>
                                                    <option value="w">작성자</option>
                                                    <option value="tw">제목 / 작성자</option>
                                                </select>
                                                <input
                                                    type="text"
                                                    name='keyword'
                                                    value={keyword}
                                                    onChange={handleSearchValChange}
                                                />
                                                <button type="submit" >검색</button>
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
                                            <tbody id="boardListappend" style={{ display:boardState === 0 ? 'table-row-group' : 'none'}}>
                                                {append_NboardList}
                                            </tbody>
                                            <tbody id="sboardListappend" style={{ display:boardState === 1 ? 'table-row-group' : 'none'}}>
                                                {append_SboardList}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div id="cpaging">
                                {renderPagination()}
                            </div>
                            <div id="spaging">
                                {renderSearchPagination()}
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