import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Select, Button, Checkbox, Row, Col, Input, Spin, message } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import * as dd from 'dingtalk-jsapi';

import './home.css';

const checkboxArrs = [];      //储存选择按钮选中的数据
const newCheckboxArrs = [];   //合并已经储存的按钮选中的数组
const moneyArrs = [];         //价格数组
const newMoneyArr = [];       //合并后的价格数组

let defaultValueArr = [];   // 点击选中按钮，默认选中数组
let num = 0;

// 成本添加
let o = 0;

// 判断是否选中重复
const chongfuArr = [];


function Home() {

  // 储存的一级数据
  const [oneData, setOneData] = useState(null);
  // 储存获取到的二级分类数据
  const [twoData, setTwoData] = useState(null);
  // 储存获取到的三级分类数据
  const [threeData, setThreeData] = useState(null);


  // 储存选中包装盒的id
  const [storageId, setStorageId] = useState(null);
  // 图片
  const [boxImg, setBoxImg] = useState(null);
  // 储存选中包装盒的价格
  const [storageMoney, setStorageMoney] = useState(null);

  // 显示到多选框
  const [twoValue, setTwoValue] = useState(null);
  const [threeValue, setThreeValue] = useState(null);
  // 合并多选框数组
  const [concatArr, setConcatArr] = useState(null);
  // 合并价格数组并保存到state
  const [concatMoneyArr, setConcatMoneyArr] = useState(null);

  // 没有选择规格，却点击选中按钮 判断
  const [clockState, setClockState] = useState(false);

  // 去重id
  const [defaultValueArrs, setDefaultValueArrs] = useState(defaultValueArr);

  // 成本价
  const [costPrice, setCostPrice] = useState(0);
  // 包装方案名state
  const [inputVal, setInputVal] = useState('');


  const { Option } = Select;

  useEffect(()=> {

    // dd.runtime.permission.requestAuthCode({
    //   corpId: "dingd3bd415677f4c851",
    //   onSuccess: function(result) {
    //     console.log(result)
    //   /*{
    //       code: 'hYLK98jkf0m' //string authCode
    //   }*/
    //   },
    //   onFail : function(err) {}
   
    // })

    // 获取主类
    axios.post('/kaopin/bom/getCategory',{
      'wuliao_type': '',
      'cate_type': 1
    })
    .then(function (res) {
      if ( res.data.status ) {
        // 储存获取的主类数据
        setOneData(res.data.data);
        // console.log(res.data.data);

      } else {
        message.warning(res.data.msg);
      }
      // console.log(res.data);
    })
    .catch(function (error) {
      console.log(error);
    });
    
    
  },[])
  

  // 一级分类盒回调函数 次类
  function handleChangeOne(value) {

      console.log(value);
    // 获取次类
    axios.post('/kaopin/bom/getCategory',{
      'wuliao_type': value,
      'cate_type': 1
    })
    .then(function (res) {
      if ( res.data.status ) {
        
        // 储存一级分类获取的二级分类数据
        setTwoData(res.data.data);
        console.log(res.data.data);

      } else {
        message.warning(res.data.msg);
      }
    })
    .catch(function (error) {
      console.log(error);
    });


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
        console.log(twoData[key]);

      }
    }
    console.log(defaultValueArr);

  }

  // 三级分类，规格select
  function handleChangeThree(value) {

    // 储存三级分类选中的value
    setThreeValue(value);
    
    console.log(chongfuArr);

    setClockState(true); //setClockState状态为false 无法选择规格

    for (let j = 0; j < defaultValueArr.length; j++) {
      
      if ( chongfuArr[j] === value ) {

        message.warning('规格重复！');
        setClockState(false); //setClockState状态为false 无法选择规格

      }else {
        console.log('继续');
      }
      
    }

    // 遍历二级类目下的数据，获取三级类目的规格数据
    for (let i = 0; i < threeData.length; i++) {
      if ( threeData[i].规格 + threeData[i].单位 + threeData[i].单价 === value ) {
        console.log(threeData[i].id);
        // 储存规格id
        setStorageId(threeData[i].id);
        // 储存规格价格
        setStorageMoney(threeData[i].单价);

      }
    }

  }
  
  // 选择函数，选择将确定的规格存入数组中，后将遍历到eslect
  function handleOk() {
    // console.log( twoValue + threeValue );
    // console.log("点击了选择按钮" + storageId);

    if ( clockState ) {

      // console.log(threeValue);
      chongfuArr.push(threeValue);
      console.log(chongfuArr);

      // 将选中的数据追加到数组
      checkboxArrs.push(storageId + twoValue + threeValue);
      // 合并数组
      setConcatArr(checkboxArrs.concat(newCheckboxArrs));
      
      // 储存价格到数组中
      moneyArrs.push(storageMoney);
      // 合并价格数组 并保存
      // setConcatMoneyArr(moneyArrs.concat(newMoneyArr));
      console.log(moneyArrs);
      console.log(parseFloat(storageMoney));
      o += parseFloat(storageMoney)
      setCostPrice(o.toFixed(4));

      // 循环截取出包装盒id ，后选中按钮点击默认显示
      defaultValueArr.push(checkboxArrs[num].slice(0,2));
      num++;
      console.log(defaultValueArr);

      setClockState(false); //setClockState状态为false 无法选择规格

    }else {
      message.warning('请选择规格！');
    }
    

  }

  // 多选框
  let sum = 0;
  function onChangea(checkedValues) {

    console.log(concatArr);

    // console.log(defaultValueArr);
    // concatArr = checkedValues;
    defaultValueArr = checkedValues;
    // console.log(checkedValues);
    console.log(defaultValueArr);
    // o = sum;

  }
  function onCheckAllChange(params) {
    
  }

  // 方案名 input回调取值
  function handleInputVal(e) {

    // 储存方案包装名
    setInputVal(e.target.value);
  }

  // 保存按钮
  function handlePreservation() {

    console.log(`方案包装名：${inputVal}`);

    if ( inputVal ) {
      // true 遮罩显示

    } else {

      message.warning('请输入包装名！');
    }
  }message.config({ //更改警告框的位置
  top: '40%',
});


  return(
    <div style={{ height: '100%' }}>
      <Spin spinning={false} tip="Loading...">
        <header className='header'>包装BOM</header>
        <div className='box'>
          {/* 一级分类盒 */}
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
          {/* 三级分类,规格 */}
          <div className="specification">
            <Select className="select_three" defaultValue="规格" style={{ width: 280 }} onChange={handleChangeThree}>
              {
                threeData ?
                  threeData.map((item, index) => {
                    return(
                      <Option key={index} value={item.规格 + item.单位 + item.单价}>{item.规格 + item.单位 + item.单价}</Option>
                    )
                  })
                :
                  ""
              }
            </Select>
            <Button onClick={handleOk} className="select_btn" type="primary" ghost={true}>选择</Button>
          </div>
          {/* 多选框 */}
          <div className="specification_pull_down">
            {/* defaultValue={defaultValueArr} */}
            <Checkbox.Group defaultValue={defaultValueArr} style={{ width: '100%' }} onChange={onChangea}>
              <Row>
                {
                  concatArr ?
                    concatArr.map((item, index) => {
                      console.log(defaultValueArr);
                      console.log(item.slice(0,2));
                      return(
                        <Col key={index}>
                          <Checkbox value={item.slice(0,2)}>{item.slice(2)}</Checkbox>
                        </Col>
                      )
                    })
                  :
                    ""
                }
              </Row>
            </Checkbox.Group>
          </div>
        </div>

        {/* bottom */}
        <footer className="footer">
          <div className='moneys'>
            <ExclamationCircleFilled style={{ color: 'red' }} />
            <div className="e">总成本：{costPrice}</div>
          </div>
          <div className="footer_child2">
            <Input onChange={handleInputVal} style={{ width: 250, marginRight: '17px', borderRadius: '7px' }} placeholder="请输入包装方案名" />
            <Button onClick={handlePreservation} className="select_btn" type="primary">保存选择</Button>
          </div>
        </footer>

      </Spin>
    </div>
  )
}

export default Home;