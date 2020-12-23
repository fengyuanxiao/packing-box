import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Select, Button, Checkbox, Row, Col, Input, Spin, message, Image, Modal } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';

import '../api/api';
import './home.css';

let allGuigeArrs = [];       //存储选中规格的所有属性到对象，并追加到数组
// 判断是否选中重复
let chongfuArr = [];

let storageIdArrs = [];     //储存选中按钮 选中的规格id
let storageMoneyArrs = [];


function Home(props) {
  // console.log(props);

  // 判断从首页跳转，清空储存规格数组数据
  if ( localStorage.getItem("n") === '11' ) {
  allGuigeArrs = [];       //存储选中规格的所有属性到对象，并追加到数组
  chongfuArr = [];
  // console.log(allGuigeArrs);
  // console.log(chongfuArr);
  localStorage.setItem("n", 2);
  }

  // 一定要输入方案名
  const [changeInputVals, setChangeInputVal] = useState(null);

  // 储存的一级数据
  const [oneData, setOneData] = useState(null);
  // 储存获取到的二级分类数据
  const [twoData, setTwoData] = useState(null);
  // 储存获取到的三级分类数据
  const [threeData, setThreeData] = useState(null);


  // 储存选中包装盒的id
  const [storageId, setStorageId] = useState(null);
  // 储存选中包装盒的价格
  const [storageMoney, setStorageMoney] = useState(null);
  // 储存选中包装盒的物料编号
  const [storageBianhao, setStorageBianhao] = useState(null);
  // 储存选中规格的图片
  const [storageImg, setStorageImg] = useState(null);
  // 储存选中规格单位
  const [storageDanwei, setStorageDanwei] = useState(null);

  // 显示到多选框
  const [twoValue, setTwoValue] = useState(null);
  const [threeValue, setThreeValue] = useState(null);

  const [sallGuigeArrs, setallGuigeArrs] = useState(null);

  // 没有选择规格，却点击选中按钮 判断
  const [clockState, setClockState] = useState(false);

  // 成本价
  const [costPrice, setCostPrice] = useState(0);
  // loading
  const [spinning, setSpinning] = useState(false);


  const { Option } = Select;

  useEffect(()=> {

    // 获取主类
    axios.post(global.constants.website+'/kaopin/bom/getCategory',{
      'wuliao_type': '',
      'cate_type': localStorage.getItem("state"),
    },
    {
      headers: {AppAuthorization: localStorage.getItem("token")}    //post 方法传 token
    })
    .then(function (res) {
      if ( res.data.status ) {

        if ( res.data.msg === "token error" ) {
          props.history.push({ pathname: "/" });
  
        } else {
          
          // 储存获取的主类数据
          setOneData(res.data.data);
          
        }

      } else {
        message.warning(res.data.msg);
      }
      // console.log(res.data);
    })
    .catch(function (error) {
      console.log(error);
    });
    
    
  },[props.history]);

  // 方案名对话框控制状态
  const [isModalVisible, setIsModalVisible] = useState(true);

  // 一定要输入方案名
  function changeInputVal(e) {
    // console.log(e.target.value);
    setChangeInputVal(e.target.value);
  }
  const handleModalOk = () => { //关闭方案名对话框按钮

    if ( changeInputVals ) {

      // 控制方案名显示状态
      setIsModalVisible(false);

    }else {
      message.warning('请输入方案名！');
    }
  };
  

  // 一级分类盒回调函数 次类
  function handleChangeOne(value) {

      // console.log(value);
    // 获取次类
    axios.post(global.constants.website+'/kaopin/bom/getCategory',{
      'wuliao_type': value,
      'cate_type': localStorage.getItem("state"),
    },
    {
      headers: {AppAuthorization: localStorage.getItem("token")}    //post 方法传 token
    })
    .then(function (res) {
      if ( res.data.status ) {

        if ( res.data.msg === "token error" ) {
          props.history.push({ pathname: "/" });
  
        } else {
          
          // 储存一级分类获取的二级分类数据
          setTwoData(res.data.data);
          // console.log(res.data.data);
          
        }

      } else {
        message.warning(res.data.msg);
      }
    })
    .catch(function (error) {
      console.log(error);
    });

    // console.log('******************************')
  }

  // 二级分类，次类
  function handleChangeTwo(value) {
    // console.log(`次类函数：${value}`);
    // 储存二级分类选中的value
    setTwoValue(value);
    // 循环二级分类，得到键 值，判断二级分类函数回调的值是否等于当前值，则保存遍历三级分类
    for (const key in twoData) {
      if ( key === value ) {
        setThreeData(twoData[key]);
        // console.log(twoData[key]);
      }
    }

    // console.log('******************************')
  }

  // 三级分类，规格select
  function handleChangeThree(value) {

    // 储存三级分类选中的value
    for (let s = 0; s < threeData.length; s++) {
      if ( threeData[s].id === value ) {
        setThreeValue(threeData[s].规格);
        // console.log(threeData[s].规格);
      }
      
    }
    
    setClockState(true); //setClockState状态为false 无法选择规格

    for (let j = 0; j < storageIdArrs.length; j++) {
      
      if ( chongfuArr[j] === value ) {

        message.warning('规格重复！');
        setClockState(false); //setClockState状态为false 无法选择规格

      }else {
        // console.log('继续');
      }
      
    }

    // 遍历二级类目下的数据，获取三级类目的规格数据
    for (let i = 0; i < threeData.length; i++) {
      if ( threeData[i].id === value ) {
        // console.log(threeData[i].id);
        // 储存规格id
        setStorageId(threeData[i].id);
        // 储存规格价格
        setStorageMoney(threeData[i].单价);
        // 储存规格编号
        setStorageBianhao(threeData[i].物料编号);
        // 储存规格图片
        setStorageImg(threeData[i].img);
        // 储存规格单位
        setStorageDanwei(threeData[i].单位);

      }
    }
    // console.log('*********************************');

  }
  
  // 选择函数，选择将确定的规格存入数组中，后将遍历到eslect
  let guigeObj = {};
  // 选择添加成本价格
  let money = 0;
  function handleOk() {
    // console.log(allGuigeArrs);

    // console.log("点击了选择按钮" + storageId);

    if ( clockState ) {

      // console.log( twoValue );      //包装名
      // console.log( threeValue );    //规格
      // console.log(storageBianhao);  //编号
      // console.log( storageId );     //id
      // console.log(storageMoney);    //单价
      // console.log(storageDanwei);   //单位
      // 储存规格所有数据到对象中
      guigeObj.twoValue = twoValue;
      guigeObj.threeValue = threeValue;
      guigeObj.storageBianhao = storageBianhao;
      guigeObj.storageId = storageId;
      guigeObj.storageImg = storageImg;
      guigeObj.storageDanwei = storageDanwei;
      guigeObj.storageMoney = parseFloat(storageMoney);
      // console.log(guigeObj);
      // 将添加的多选框数据追加到数组中
      allGuigeArrs.unshift(guigeObj);
      setallGuigeArrs(allGuigeArrs);
      // console.log(allGuigeArrs);

      // 储存id 到数组
      storageIdArrs.push(guigeObj.storageId);
      // console.log(storageIdArrs);
      // setStorageIdArrs(storageIdArrs.concat(newstorageIdArrss));

      // 储存每个单价到数组
      storageMoneyArrs.push(guigeObj.storageMoney);

      // 计算成本价格的循环
      for (let i = 0; i < storageMoneyArrs.length; i++) {
        money += storageMoneyArrs[i];
        
      }
      // 保留四位，储存总价
      setCostPrice(money.toFixed(4));

      // 判断是否重复用
      chongfuArr.push(storageId);

      // console.log(storageMoneyArrs);
      // console.log(money);

      setClockState(false); //setClockState状态为false 无法选择规格

    }else {
      message.warning('请选择规格！');
    }
    

  }

  // 多选框
  let sum = 0;
  let sdr = [];
  function onChangea(checkedValues) {
    // 将多选value 储给 storageIdArrs
    storageIdArrs = checkedValues;

    //多选储存新价格
    for (let j = 0; j < allGuigeArrs.length; j++) {
      for (let k = 0; k < checkedValues.length; k++) {
        if ( allGuigeArrs[j].storageId === checkedValues[k] ) {
          sdr.push(allGuigeArrs[j].storageMoney);
          //多选储存新价格
          sum += allGuigeArrs[j].storageMoney
          
          // storageMoneyArrs.splice(j);
        }
      }
    }
    storageMoneyArrs = sdr;
    // 新的价格总价，替换旧的价格总价
    money = sum;
    // 多选价格更变储存
    setCostPrice(sum.toFixed(4));
    // setStorageIdArrs(allGuigeId.concat(storageIdArrs));

    // console.log(allGuigeArrs);
    // console.log(checkedValues);
    // console.log(`新价格数组${sdr}`);
    // console.log(`旧价格数组${storageMoneyArrs}`);
    // console.log(`旧总价格${money}`);
    // console.log(`新总价格${sum}`);
  }

  // 保存按钮 并调用ajax
  function handlePreservation() {

    // 传入id数组
    // console.log(storageIdArrs);
    // true 遮罩显示
    setSpinning(true);

    axios.post(global.constants.website+'/kaopin/bom/add',{
      'details': storageIdArrs.join(","),           //传入的id
      'plan_name': changeInputVals,                 //计划名称
      'plan_type': localStorage.getItem("state"),   //包装类型
      'total_price': costPrice,                     //总价格
    },
    {
      headers: {AppAuthorization: localStorage.getItem("token")}    //post 方法传 token
    })
    .then(function (res) {
      if ( res.data.status ) {

        if ( res.data.msg === "token error" ) {
          props.history.push({ pathname: "/" });
  
        } else {
          
          message.warning(res.data.msg);
          setSpinning(false);
          // 刷新页面
          window.location.reload();
          
        }

      } else {
        message.warning(res.data.msg);
        // 更改loding状态
        setSpinning(false);
      }
    })
    .catch(function (error) {
      console.log(error);
      // 更改loding状态
      setSpinning(false);
    });

  }message.config({ //更改警告框的位置
  top: '40%',
});


  return(
    <div style={{ height: '100%' }}>
      <Spin spinning={spinning} tip="Loading...">
        <header className='header'>{changeInputVals} —【{localStorage.getItem("state") === '2' ? "后道" : "发货"}】</header>
        <div className='box'>
          <div style ={{ height: '15%' }}>
            {/* 一级分类盒 */}
            <div style={{ display: 'flex' }}>
              <Select className="select_one" defaultValue="主类" style={{ width: 140 }} onChange={handleChangeOne}>
                {
                  oneData ?
                    oneData.map((item, index) =>{
                      return(
                        <Option key={index} value={item}>{item}</Option>
                      )
                    })
                  :
                    ''
                }
              </Select>
              {/* 二级分类,次类 具体商品盒 */}
              <Select defaultValue="次类" style={{ width: 220 }} onChange={handleChangeTwo}>
                {
                  twoData ?
                  Object.keys(twoData).map((key, index) => {
                    return(
                      <Option key={index} value={key}>{key}</Option>
                    )
                  })
                  :
                  ""
                }
              </Select>
            </div>
            {/* 三级分类,规格 */}
            <div className="specification">
              <Select className="select_three" defaultValue="规格" style={{ width: 280 }} onChange={handleChangeThree}>
                {
                  threeData ?
                    threeData.map((item, index) => {
                      return(
                        <Option key={index} value={item.id}>{item.规格 + "￥" + item.单价 + "/" + item.单位}</Option>
                      )
                    })
                  :
                    ""
                }
              </Select>
              <Button onClick={handleOk} className="select_btn" type="primary" ghost={true}>选择</Button>
            </div>
          </div>
          {/* 多选框 */}
          <div className="specification_pull_down">
            {/*  defaultValue={storageIdArrs} */}
            <Checkbox.Group value={storageIdArrs} style={{ width: '100%' }} onChange={onChangea}>
              <Row>
                {
                  sallGuigeArrs ?
                    sallGuigeArrs.map((item, index) => {
                      // console.log(item);
                      return(
                        <Col key={index}>
                        <Image
                          src={item.storageImg}
                          className="homeImg"
                        />
                          <Checkbox style={{ display: 'flex', alignItems: 'center' }} value={item.storageId}>
                            <div className="guige">
                              {/* <img src={item.storageImg} alt="规格图"/> */}
                              <p>{item.twoValue + item.threeValue + '￥' + item.storageMoney + '/' + item.storageDanwei }</p>
                            </div>
                          </Checkbox>
                        </Col>
                      )
                    })
                  :
                    ""
                }
              </Row>
            </Checkbox.Group>

          </div>

          <footer className="footer">
            <div className="footer_child2">
              {/* <Input onChange={handleInputVal} style={{ width: 250, marginRight: '17px', borderRadius: '7px' }} placeholder="请输入包装方案名" /> */}
              <Button onClick={handlePreservation} className="select_btn" type="primary">保存选择</Button>
            </div>
            <div className='moneys'>
              <ExclamationCircleFilled style={{ color: 'red' }} />
              <div className="e">总成本：{costPrice}</div>
            </div>
          </footer>
        </div>
        

      </Spin>
      {/* 弹框输入方案名 */}
          <Modal className="modealInput" title={localStorage.getItem("state") === '2' ? "请输入后道包装名！" : "请输入发货包装名！"} closable={false} visible={isModalVisible} footer={[
            <Button key="back" type="primary" onClick={handleModalOk}>确定</Button>,
          ]}>
        <Input onChange={changeInputVal} placeholder="请输入包装方案名：" />
      </Modal>
    </div>
  )
}

export default Home;