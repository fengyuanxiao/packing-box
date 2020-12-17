import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Select, Button, Checkbox, Row, Col, Input, Spin, message } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import * as dd from 'dingtalk-jsapi';

import './home.css';

let s = 0;  // 点击选择按钮，成本价格叠加值  
// 储存select选中的值
const arrs = [];
const imgArrs = [];
// state数据是不可变值，每次修改都应该返回一个新值，将其合并成一个新数组传给  setVal()
const newArrs = [];
const newImgArrs = [];
// 选中按钮点击后 规格默认选中
let a = [];

function Home() {


  // 主类
  const [mainClass, setMainclass] = useState(null);
  // 次类
  // 包装盒名
  const [titleArrs, setTitles] = useState(null);
  // 包装盒详情
  const [boxs, setBoxs] = useState(null);
  const [titleName, setTitleName] = useState(null);
  const [guiges, setGuiges] = useState(null);
  const [boxImg, setBoxImg] = useState(null);

  const [subclass, setSubclass] = useState(null);
  const [ifVals, setIfVals] = useState(null);

  const [guige, setGuige] = useState(null);
  const [copys, setCopys] = useState(null);

  // 储存select值
  const [vals, setVals] = useState(null);
  const [imgArr, setImgArr] = useState(null);
  // 判断 如果值是null 那么就不操作
  const [news, setNews] = useState(null);
  // 规格 点击选择按钮后默认选中
  const [checkedList, setCheckedList] = useState(a);

  const [onchangea, setOnchangea] = useState(false);

  // 成本价
  const [costPrice, setCostPrice] = useState(0);

  // 包装方案名state
  const [inputVal, setInputVal] = useState('');

  // 点击保存选择按钮 获取多选数据
  const [checkedValue, setCheckedValues] = useState(null);
  // 遮罩显示状态，默认为 false
  const [isModalVisible, setIsModalVisible] = useState(false);


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
        // 获取主类数据
        setMainclass(res.data.data);

      } else {
        message.warning(res.data.msg);
      }
      // console.log(res.data);
    })
    .catch(function (error) {
      console.log(error);
    });
    
    
  },[])
  

  // 分类盒 次类
  function handleChangeOne(value) {

      // 包装盒名字
      let titlesArr = [];
      // 包装盒详情
      let boxArr = [];

      console.log(value);
    // 获取次类
    axios.post('/kaopin/bom/getCategory',{
      'wuliao_type': value,
      'cate_type': 1
    })
    .then(function (res) {
      if ( res.data.status ) {
        let datas = res.data.data;
        // 获取次类数据
        console.log(datas);
        // 将其保存，渲染次类 select
        setSubclass(Object.keys(datas));

        setIfVals(datas);
        
        // 循环最外层包装名称
        for (const key in datas) {
          let o = {};
          
          // console.log(key);
          titlesArr.push(key);
          o[key] = datas[key];
          boxArr.push(o);
        }
        // 储存包装盒名字
        setTitles(titlesArr);
        // 储存包装盒详情
        setBoxs(boxArr);
        console.log(boxArr);

      } else {
        message.warning(res.data.msg);
      }
    })
    .catch(function (error) {
      console.log(error);
    });


    console.log('操作了第一个select');

  }

  // 具体商品盒
  function handleChangeTwo(value) {
    // console.log(value);

    for (let i = 0; i < titleArrs.length; i++) {
      if ( titleArrs[i] === value ) {
        let aa = boxs[i];
        // console.log(aa);
        for (const key in aa) {

          let aBoxs = aa[key];
          // console.log(aBoxs);
          for (let j = 0; j < aBoxs.length; j++) {

            a.push(`${value + aBoxs[j].规格 + "每" + aBoxs[j].单位 + aBoxs[j].单价}`);
            // 包装盒图片
            setBoxImg(aBoxs[j].img);
            
          }
          // console.log(aBoxs[0].img);


          // 包装盒名
          setTitleName(value);
          // 包装详情规格
          setGuiges(aBoxs);
        }
      } else {
        
      }
      
    }
    // console.log(titleArrs);

    
    // 第二个select选中的value
    // console.log(value);


    // 固定规格选中后面 显示名称
    setGuige(value);
    // setGuigeImg()
    // console.log(ifValsArr);
    // console.log(ifValsObj);

    console.log('操作了第二个select');

  }

  // 规格select
  function handleChangeThree(value) {
    // console.log(value);

    // 触发第三个select函数 将value值储存到news中
    setNews(value);
     // 规格select成功调用后才能触发选择按钮
    setOnchangea(true);
    console.log(arrs);
    console.log(copys);
    
    for (let j = 0; j < arrs.length; j++) {

      if ( arrs[j] === copys ) {

        message.warning('规格重复！');
        // 规格select成功调用后才能触发选择按钮,如果有重复数据便禁止按钮
        setOnchangea(false);

      } else {

        
      }
      
    }
    console.log('操作了第三个select');

  }
  // 选择函数，选择将确定的规格存入数组中，后将遍历到eslect
  function handleOk() {


    if ( onchangea ) {

      // guigeArrs.push(news);
      console.log(titleName + news);
      // 判断重复
      setCopys(titleName + news);

      // 图片数组
      imgArrs.push(boxImg)
      // 将包装名拼接到规格 再添加到数组中
      arrs.push(titleName + news);
  
        // 合并新数组 arrs.concat(newArrs)///  并且去重
        // setVal(Array.from(new Set(arrs.concat(newArrs))));
        setVals(arrs.concat(newArrs));
        setImgArr(imgArrs.concat(newImgArrs))
        // console.log('操作了');

        // 选择按钮 叠加成本价格
        s += parseFloat(news.substring(news.length - 6));
        // console.log(parseFloat(news.substring(news.length - 6)));
        // console.log(s)
        
        // 显示成本价格
        setCostPrice(s.toFixed(4));

        // 最终需要循环出来的规格数据
        // console.log(newObj);
        // console.log(objs);
        // console.log(arrs);
        // console.log(s);
  
        // 更改点击状态
        setOnchangea(false);
      
    } else {

      message.warning('请选择规格！');
      
    }

    console.log('点击按钮了');
  }

  // 多选框
  let cheSum = 0;
  function onChangea(checkedValues) {

    // setAaState(true);

    console.log('checked = ', checkedValues);
    for (let i = 0; i < checkedValues.length; i++) {
      
      // console.log(checkedValues[i].substring(checkedValues[i].length - 6));
      cheSum += parseFloat(checkedValues[i].substring(checkedValues[i].length - 6))
      
    }
    setCostPrice(cheSum.toFixed(4));

    //必要代码***** 更改为勾选中后的 成本总额
    s = cheSum;

    setCheckedValues(checkedValues);

  }

  // 方案名 input回调取值
  function handleInputVal(e) {

    // 储存方案包装名
    setInputVal(e.target.value);
  }

  // 保存按钮
  function handlePreservation() {

    console.log(checkedValue)
    console.log(`方案包装名：${inputVal}`);

    if ( inputVal ) {
      // true 遮罩显示
      setIsModalVisible(true);

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
          {/* 分类盒 */}
          <Select className="select_one" defaultValue="主类" style={{ width: 140 }} onChange={handleChangeOne}>
            {
              mainClass ?
                mainClass.map((tiem, index) => {
                  return(
                    <Option key={index} value={tiem}>{tiem}</Option>
                  )
                })
              :
                ''
            }
          </Select>
          {/* 次类 具体商品盒 */}
          <Select defaultValue="次类" style={{ width: 220 }} onChange={handleChangeTwo}>
            {
              titleArrs ?
                titleArrs.map((tiem, index) => {
                  return(
                    <Option key={index} value={tiem}>{tiem}</Option>
                  )
                })
              :
              ""
            }
            {/* <Option value="孕妇内裤小飞机盒">孕妇内裤小飞机盒</Option> */}
          </Select>
          {/* 规格 */}
          <div className="specification">
            <Select className="select_three" defaultValue="规格" style={{ width: 280 }} onChange={handleChangeThree}>
              {
                guiges ?
                  guiges.map((item, index) => {
                    return(
                      <Option key={index} value={item.规格 + "每" + item.单位 + item.单价}>{item.规格 + "每" + item.单位 + item.单价}</Option>
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
            <Checkbox.Group defaultValue={checkedList} style={{ width: '100%' }} onChange={onChangea}>
              <Row>
                {
                  vals ?
                    vals.map((item, index) => {
                      // 截取得到图片链接
                      // let httpImg = item.substring(item.search(/http/));
                      // 去除图片链接
                      // let a = item.split(httpImg);
                        return(
                          <Col data-a={index} key={index}>
                              <Checkbox value={item} style={{ display: 'flex', alignItems: 'center' }}>
                                <div className="guige">
                                  <img src={imgArr[index]} alt="规格图"/>
                                  <p>{item}</p>
                                </div>
                              </Checkbox>
                          </Col>
                        )
                      })
                      :
                      ''
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