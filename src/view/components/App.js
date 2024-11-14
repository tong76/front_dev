import '../../App.css'
/* import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; */
import { Route, Routes } from 'react-router-dom';
import React, { Component } from 'react';

//header
import HeaderAdmin from './Header/Header';

//footer
import Footer from './Footer/Footer';

//팝업  스토어
import PopupList from './Popup/PopupList';
import PopupRead from './Popup/PopupRead';

//main 

import MainView from './MainView';


//게시판 
import BoardList from './Board/BoardList';
import BoardRegist from './Board/BoardRegist';
import BoardModify from './Board/BoardModify';
import BoardRead from './Board/BoardRead';

//회원기능
import Join from './Member/Join';
import Login from './Member/Login';

//굿즈
import GoodsPopupList from './Goods/GoodsPopupList';
import GoodsList from './Goods/GoodsList';
import GoodsDetail from './Goods/GoodsDetail';

//장바구니 및 구매
import BucketList from './Bucket/BucketList';
import PaymentWindow from './Payment/PaymentWindow';
import CheckoutPage from './Payment/CheckoutPage';
import SuccessPage from './Payment/SuccessPage';
import FailPage from './Payment/FailPage';
import OrderSummary from './Payment/OrderSummary';
import OrderDetail from './Payment/OrderDetail';

//지도
import Map from './Popup/MapComponent';

//css
import '../../resources/assets/img/favicon.png';
import '../../resources/assets/img/apple-touch-icon.png';
import '../../resources/assets/vendor/animate.css/animate.min.css';
import '../../resources/assets/vendor/bootstrap/css/bootstrap.min.css';
import '../../resources/assets/vendor/bootstrap-icons/bootstrap-icons.css';
import '../../resources/assets/vendor/swiper/swiper-bundle.min.css';
import '../../resources/assets/css/style.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false
    }
  }


  static getDerivedStateFromProps(props, state) {

    // 헤더, 푸터 보이게 할 페이지 경로설정
    if (
      window.location.pathname === "/" ||
      window.location.pathname === "/goods/goodspopuplist" ||
      window.location.pathname.includes("/goods/goodslist") ||
      window.location.pathname.includes("/goods/goodsdetail") ||
      window.location.pathname === ("/bucket/bucketlist") ||
      window.location.pathname === "/popup/popuplist" ||
      window.location.pathname === "/board/boardlist" ||
      window.location.pathname.includes("/board/boardread") ||
      window.location.pathname.includes("/popup/popupread")
    ) {
      return {
        isVisible: true
      };
    }
  }

  render() {
    return (
      <div className="App">

        <HeaderAdmin isVisible={this.state.isVisible} />
        <Routes>
          <Route exact path='/' Component={MainView} />
          <Route path='/popup/popuplist' Component={PopupList} />
          <Route path='/popup/popupread/:sno' Component={PopupRead} />
          <Route path='/board/boardlist' Component={BoardList} />
          <Route path='/board/boardread/:bno' Component={BoardRead} />
          <Route path='/board/boardregist' Component={BoardRegist} />
          <Route path='/board/boardmodify' Component={BoardModify} />
          <Route path='/goods/goodspopuplist' Component={GoodsPopupList} />
          <Route path='/goods/goodslist/:sno' Component={GoodsList} />
          <Route path='/goods/goodsdetail/:sno/:pno' Component={GoodsDetail} />
          <Route path='/bucket/bucketlist' Component={BucketList} />
          <Route path='/payment/paymentwindow' Component={PaymentWindow} />
          <Route path='/payment/checkoutpage' Component={CheckoutPage} />
          <Route path='/payment/success' Component={SuccessPage} />
          <Route path='/payment/fail' Component={FailPage} />
          <Route path='/payment/ordersummary' Component={OrderSummary} />
          <Route path='/payment/orderdetail' Component={OrderDetail} />
          <Route path="/login" Component={Login} />
          <Route path="/join" Component={Join} />
          <Route path="/popup/map" Component={Map} />
        </Routes>
        <Footer isVisible={this.state.isVisible} />
      </div>
    );
  }
}

export default App;
