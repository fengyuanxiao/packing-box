import React, { useEffect, useState } from 'react';
import { Button, Divider, List, message, Input, Select, Spin, Modal } from 'antd';
import axios from 'axios';
import * as dd from 'dingtalk-jsapi';

import '../api/api';
import './lists.css';

// 列表数据
const data = [
  {
    title: '暂无数据',
  }
];


function Lists(props) {
  localStorage.setItem("ns", 1);
  localStorage.removeItem("n");

  const { Option } = Select;

  // 储存获取的列表数据
  const [listData, setListData] = useState([]);
  // 储存方案名
  const [schemName, setSchemeName] = useState(false);
  // 储存功能名
  const [functionName, setFunctionName] = useState(false);
  // loading
  const [spinning, setSpinning] = useState(true);
  // 详情对话框弹出状态，默认为false
  const [isModalVisible, setIsModalVisible] = useState(false);
  // 储存获取的列表详情
  const [details, setDetails] = useState(null);

  // 生命周期
  useEffect(() => {

    // 钉钉判断
    if ( dd.env.platform !== 'notInDingTalk' ) {  //是否在钉钉环境中

      dd.ready(function() {

        dd.runtime.permission.requestAuthCode({
          corpId: "dingd3db415677f4c851",
          onSuccess: function(info) {
            // code = info.code // 通过该免登授权码可以获取用户身份
  
            // 调用获取token
            axios.post(global.constants.website+'/kaopin/bom/getUser',{
              'code': info.code,  // 通过该免登授权码可以获取用户身份
            })
            .then(function (res) {
              let tokens = res.data.data;
              // 获取 存储token
              localStorage.setItem("token", res.data.data);
              
              if ( res.status === 200 ) {
  
                // token 获取成功调用获取列表 ajax
                axios.post(global.constants.website+'/kaopin/bom/index',{
                  'page': 1,
                },
                {
                  headers: {AppAuthorization: tokens}    //post 方法传 token
                })
                .then(function (res) {
                  // console.log(res);
                  if ( res.data.status ) {
                    if ( res.data.msg === "token error" ) {
                      props.history.push({ pathname: "/" });
  
                    } else {
                      setSpinning(false);
                      // 储存获取list数据
                      setListData(res.data.data.result);
                      
                    }
  
                  } else {
                    props.history.push({ pathname: "/" });
                    message.warning(res.data.msg);
                  }
                  // console.log(res.data);
                })
                .catch(function (error) {
                  // props.history.push({ pathname: "/" });
                  message.warning(error);
                  // setSpinning(false);
                });
        
              } else {
                message.warning(res.data.msg);
              }
              // console.log(res.data);
            })
            .catch(function (error) {
              console.log(error);
            });
          },
          onFail : function(err) {
            alert(err);
          }
      
        });

        dd.error(function(error){
          /**
           {
              errorMessage:"错误信息",// errorMessage 信息会展示出钉钉服务端生成签名使用的参数，请和您生成签名的参数作对比，找出错误的参数
              errorCode: "错误码"
           }
          **/
          alert('dd error: ' + JSON.stringify(error));
        });

      });

    } else {
      message.warning('请在手机上打开操作！');
    }

    // // token 获取成功调用获取列表 ajax      测试用
    // axios.post(global.constants.website+'/kaopin/bom/index',{
    //   'page': 1,
    // },
    // {
    //   headers: {AppAuthorization: localStorage.getItem("token")}    //post 方法传 token
    // })
    // .then(function (res) {
    //   // console.log(res);
    //   if ( res.data.status ) {
    //     if ( res.data.msg === "token error" ) {
    //       props.history.push({ pathname: "/" });

    //     } else {
    //       setSpinning(false);
    //       // 储存获取list数据
    //       setListData(res.data.data.result);
          
    //     }

    //   } else {
    //     props.history.push({ pathname: "/" });
    //     message.warning(res.data.msg);
    //   }
    //   // console.log(res.data);
    // })
    // .catch(function (error) {
    //   // props.history.push({ pathname: "/" });
    //   message.warning(error);
    //   // setSpinning(false);
    // });
    
    

  },[props.history]);

// 后道按钮
function handleHoudao() {
  // console.log('添加后道包装2');

  localStorage.setItem("n", localStorage.getItem("ns") + 1);
  props.history.push({ pathname: "/home", state: 2 });
  
  // 添加厚道包装储存状态码
  localStorage.setItem("state", 2);
  // 标题头
  document.title = "后道包装";
  // console.log(document.title);
}
// 发货按钮
function handleFahuo() {
  // console.log("添加发货包装1");

  localStorage.setItem("n", localStorage.getItem("ns") + 1);
  props.history.push({ pathname: "/home", state: 1 });

  // 添加厚道包装储存状态码
  localStorage.setItem("state", 1);
  // 标题头
  document.title = "发货包装";
  // console.log(document.title);
  
}

// input 方案名 value
function nameChange(e) {
  // 储存方案名
  setSchemeName(e.target.value);

  // 方案名input 删除为空的时候，重新获取列表数据
  if ( !e.target.value ) {
    
    setSpinning(true);
    // 获取列表
    axios.post(global.constants.website+'/kaopin/bom/index',{
      'page': 1,
    },
    {
      headers: {AppAuthorization: localStorage.getItem("token")}    //post 方法传 token
    })
    .then(function (res) {
      if ( res.data.status ) {
        
        if ( res.data.msg === "token error" ) {
          props.history.push({ pathname: "/" });

        } else {
          setSpinning(false);
          // console.log(res.data.data.result);
          // console.log(res.data.data);
          // 储存获取list数据
          setListData(res.data.data.result);
          
        }

      } else {
        message.warning(res.data.msg);
      }
      // console.log(res.data);
    })
    .catch(function (error) {
      console.log(error);
      setSpinning(false);
    });

  }
  // console.log(e.target.value);
}
// select，选择后道或者发货
function handleChange(value) {
  // 储存功能值
  setFunctionName(value);
  // console.log(`selected ${value}`);
}
// 搜索按钮
function handleSearch() {

  if ( schemName === false && functionName === false ) {

    message.warning('请输入方案名或功用！');
  
  }else if ( schemName && functionName ) {
    // console.log('上面名字加功用');

    setSpinning(true);
    // 获取方案名指定列表列表
    axios.post(global.constants.website+'/kaopin/bom/index',{
      'page': 1,
      'plan_name': schemName,
      'plan_type': functionName,
    },
    {
      headers: {AppAuthorization: localStorage.getItem("token")}    //post 方法传 token
    })
    .then(function (res) {
      if ( res.data.status ) {

        if ( res.data.data.result.length ) {

          if ( res.data.msg === "token error" ) {
            props.history.push({ pathname: "/" });
  
          } else {

            setSpinning(false);
            // console.log(res.data.data.result);
            // 储存获取list数据
            setListData(res.data.data.result);
            
          }
          

        }else {
          
          setSpinning(false);
          message.warning('暂无该数据！');
        }

      } else {
        message.warning(res.data.msg);
      }
      // console.log(res.data);
    })
    .catch(function (error) {
      console.log(error);
      setSpinning(false);
    });

  }else if ( schemName === false || functionName ) {

    setSpinning(true);
    // 获取发货列表
    axios.post(global.constants.website+'/kaopin/bom/index',{
      'page': 1,
      'plan_name': '',
      'plan_type': functionName,
    },
    {
      headers: {AppAuthorization: localStorage.getItem("token")}    //post 方法传 token
    })
    .then(function (res) {
      if ( res.data.status ) {

        if ( res.data.data.result.length ) {

          // console.log(res.data.data);

          if ( res.data.msg === "token error" ) {
            props.history.push({ pathname: "/" });
  
          } else {

            setSpinning(false);
            // console.log(res.data.data.result);
            // 储存获取list数据
            setListData(res.data.data.result);
            
          }
          

        }else {
          
          setSpinning(false);
          message.warning('暂无该数据！');
        }

      } else {
        message.warning(res.data.msg);
      }
      // console.log(res.data);
    })
    .catch(function (error) {
      console.log(error);
      setSpinning(false);
    });

  }else {

    setSpinning(true);
    // 获取发货列表
    axios.post(global.constants.website+'/kaopin/bom/index',{
      'page': 1,
      'plan_name': schemName,
      'plan_type': '',
    },
    {
      headers: {AppAuthorization: localStorage.getItem("token")}    //post 方法传 token
    })
    .then(function (res) {
      if ( res.data.status ) {

        if ( res.data.data.result.length ) {

          // console.log(res.data.data);

          if ( res.data.msg === "token error" ) {
            props.history.push({ pathname: "/" });
  
          } else {

            setSpinning(false);
            // console.log(res.data.data.result);
            // 储存获取list数据
            setListData(res.data.data.result);
            
          }
          

        }else {
          
          setSpinning(false);
          message.warning('暂无该数据！');
        }

      } else {
        message.warning(res.data.msg);
      }
      // console.log(res.data);
    })
    .catch(function (error) {
      console.log(error);
      setSpinning(false);
    });

  }
  
  // schemName
  // functionName
}

// 点击当前list 获取当前列表详情
function delItem(id) {
  
  // 点击列表获取对应详情是，加载logding
  setSpinning(true);
  // console.log(id);
  axios.post(global.constants.website+'/kaopin/bom/details',{
    'id': id,
  },
  {
    headers: {AppAuthorization: localStorage.getItem("token")}    //post 方法传 token
  })
  .then(function (res) {

    if ( res.data.status ) {

      if ( res.data.msg === "token error" ) {
        props.history.push({ pathname: "/" });

      } else {
        
        // 更改详情对话框状态，true 为显示
        setIsModalVisible(true);
        // 详情获取成功lognding也将改成false
        setSpinning(false);
        // console.log(res.data.data);
        // 储存列表详情数据
        setDetails(res.data.data);
        
      }

    } else {
      message.warning(res.data.msg);
    }
    // console.log(res.data);
  })
  .catch(function (error) {
    console.log(error);
  });
}

// 对话框 确定按钮，和取消按钮
const handleOk = () => {

  setIsModalVisible(false);
  
};
const handleCancel = () => {
  setIsModalVisible(false);
};

message.config({ //更改警告框的位置
  top: '40%',
});
  
  return(
    <div style={{ height: '100%' }}>
      <div className='box' style={{ height: '100%' }}>
        <div style={{ height:'16.5%' }}>
          <div className="list_Header">
            <Button onClick={handleHoudao} className="select_btn" type="primary" ghost={true} >添加后道包装</Button>

            <Button onClick={handleFahuo} className="select_btn" type="primary" ghost={true} >添加发货包装</Button>
          </div>
          
          <Divider />
          {/* 搜索框 */}
          <div className="sousuo">
            <Input style={{ width:'160px' }} placeholder="请输入方案名" onChange={nameChange} />
            <Select defaultValue="选择功用" style={{ width: 110, marginRight:'5px', marginLeft:'5px' }} onChange={handleChange}>
              <Option value="2">后道</Option>
              <Option value="1">发货</Option>
            </Select>
            <Button onClick={handleSearch}>搜索</Button>
          </div>
        </div>
        {/* 列表 */}
        <div className="lists" style={{ height: '80%' }}>
          <Spin spinning={spinning} tip="列表加载中...">
            {
              listData !== null ?
              <List style={{ height: '100%' }}
                locale={{emptyText: "暂无该数据"}}
                pagination={{
                  onChange: page => {
                      // console.log(page);
                    },
                    pageSize: 8,
                }}
                itemLayout="horizontal"
                dataSource={listData}
                renderItem={item => (
                  <List.Item onClick={() => delItem(item.id) } style={{ padding: '10px 0' }}>
                    <List.Item.Meta
                      title={item.plan_name}
                      description={item.plan_type + "　" + "￥" + item.total_price}
                    />
                  </List.Item>
                )}
              />
              :
              <List
                itemLayout="horizontal"
                dataSource={data}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      // avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                      title={<a href="https://ant.design">{item.plan_name}</a>}
                    />
                  </List.Item>
                )}
              />
            }
          </Spin>
        </div>
      </div>
      
        {
          details !== null ?
            <Modal title={details.plan_name} footer={[
              <Button key="back" type="primary" onClick={handleOk}>确定</Button>,
            ]} onCancel={handleCancel} visible={isModalVisible}>
              {
                details.details.map((item, index) => {
                  return(
                    <div className="details" key={index}>
                      <div style={{ maxWidth: '60px', marginRight: '15px' }}>
                        <img src={item.img} alt="详情图"/>
                      </div>
                      <p>
                        {item.物料名称 + item.规格 + "￥" + item.单价 + "/" + item.单位}
                      </p>
                    </div>
                  )
                })
              }
            </Modal>
          :
          ""
        }
    </div>
  )

}

export default Lists;