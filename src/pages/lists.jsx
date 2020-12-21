import React, { useEffect, useState } from 'react';
import { Button, Divider, List, message, Pagination, Input, Select } from 'antd';
import axios from 'axios';

import './lists.css';

// 列表数据
const data = [
  {
    title: '暂无数据',
  }
];

function Lists(props) {

  const { Option } = Select;

  const [listData, setListData] = useState([]);

  useEffect(() => {
    
    // 获取列表
    axios.post('/kaopin/bom/index',{
      'page': 1,
    })
    .then(function (res) {
      if ( res.data.status ) {
        console.log(res.data.data.result);
        console.log(res.data.data);
        // 储存获取list数据
        setListData(res.data.data.result);

      } else {
        message.warning(res.data.msg);
      }
      // console.log(res.data);
    })
    .catch(function (error) {
      console.log(error);
    });

  },[])

function handleHoudao() {
  console.log('添加后道包装');
  props.history.push({ pathname: "/home", state: 2 });
}

function handleFahuo() {
  console.log("添加发货包装");
  props.history.push({ pathname: "/home", state: 1 });
  
}


function handleChange(value) {
  console.log(`selected ${value}`);
}

function handleChangePage(page, pageSize) {
  console.log(page);
  console.log(pageSize);
}

  
  return(
    <div style={{ height: '100%' }}>
      <header className='header'>包装BOM</header>
      <div className='box'>
        <div className="list_Header">
          <Button onClick={handleHoudao} className="select_btn" type="primary" ghost={true} >添加后道包装</Button>

          <Button onClick={handleFahuo} className="select_btn" type="primary" ghost={true} >添加发货包装</Button>
        </div>
        
        <Divider />
        {/* 搜索框 */}
        <div className="sousuo">
          <Input style={{ width:'170px' }} placeholder="请输入方案名" />
          <Select defaultValue="请选择功用" style={{ width: 120 }} onChange={handleChange}>
            <Option value="后道">后道</Option>
            <Option value="发货">发货</Option>
          </Select>
          <Button>搜索</Button>
        </div>

        <div>
          {
            listData !== null ?
            <List
              itemLayout="horizontal"
              dataSource={listData}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={item.plan_name}
                    description={item.total_price}
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
          
        </div>

        <div className="list_footer">
          <Pagination onChange={handleChangePage} defaultPageSize={3} defaultCurrent={1} total={listData.length} />
        </div>
      </div>
    </div>
  )

}

export default Lists;