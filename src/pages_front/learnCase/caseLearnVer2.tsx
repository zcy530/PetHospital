import React, { useEffect, useState } from 'react';
import { LaptopOutlined, MailOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, Row, Col} from 'antd';
import { dataFrom_Categories, dataFrom_oneDiseaseCaseMenu,caseData } from './mockData.tsx';
import { allDiseasesType } from './caseTypeDefine.tsx';
import {Card}  from 'react-bootstrap';
import { oneDiseaseCaseMenu } from './caseTypeDefine.tsx';
import Link from 'antd/es/typography/Link';
import CaseDetail from './caseDetails.tsx';
import axios from 'axios';
import CaseCards from './caseCards.tsx';
import { mytoken } from '../token.js';
import { useSelector } from 'react-redux';

const CaseLearnVer2 = () => {

  // 布局相关
  const { Content, Sider } = Layout;
  // 初始数据
  const initial_category:allDiseasesType[]=[]
  const [showDetail, setShowDetail] = useState<boolean>(false)
  const [detailID, setDetailID] = useState<number>(0)
  const [category, setCategory] = useState<allDiseasesType[]>(initial_category)
  const [chooseNow, setChooseNow] = useState<number>(1)
  const [bigDiseaseName, setBigDiseaseName] = useState<string>('肠胃病')
  const [smallDiseaseName, setSmallDiseaseName] = useState<string>('胃炎')

  // 发送请求相关
  const userLogin = useSelector((state:any) => state.userLogin)
  const { userInfo } = userLogin

  const config = {
    headers:{
      "Authorization": userInfo.data.result.token,
    }
  };
  
  useEffect(() => {
		const fetchCategory = async() => {
      
      const { data } = await axios.get('https://47.120.14.174:443/petHospital/categories',config);
      setCategory(data.result);
      
    }
    fetchCategory();
	},[])

  const numAscending = category.sort((a, b) => b.typeId - a.typeId);

  // 左侧菜单栏
  const tabItems: MenuProps['items'] = numAscending.map((info, index) => {
    console.log(numAscending);
      const key = info.typeName;
      return {
        key: key,
        label: info.typeName,
        children: info.diseaseDTOList.map((dto, subindex) => {
          // console.log(dto.diseaseName+':'+dto.diseaseId)
          return {
            key: dto.diseaseId,
            label: dto.diseaseName,
          };
        })
      };
  });

  // 控制每次只打开一个 tab 的函数
  const rootSubmenuKeys = [ '产科病', '传染病', '内科病', '外科病','寄生虫病','牙科病','眼科疾病','神经科病','肠胃病'];
  const [openKeys, setOpenKeys] = useState(['肠胃病']);

  const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
    
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    } 
  };


  return (
      <Layout className='learn-case'>
        {/* 侧边栏 */}
        <Sider className='learn-slider'>
          <Menu
            className='learn-slidermenu'
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['肠胃病']}
            items={tabItems}
            onSelect={(item)=> {
              setChooseNow(parseInt(item.key));
              setShowDetail(false);
              console.log(item.key);
            }}
            onOpenChange={onOpenChange}
            openKeys={openKeys}
            style={{ width: '200px', borderRadius : 15, opacity : 1, height:'660px' }}
          />
        </Sider>

        {/* 右边的内容 */}
        <Layout className={showDetail?'learn-rightarea-detail':'learn-rightarea'}>
          <Content className='learn-rightcontent'>
          <Breadcrumb className='learn-breadcrumb'>
            <Breadcrumb.Item>病例学习</Breadcrumb.Item>
            <Breadcrumb.Item>{bigDiseaseName}</Breadcrumb.Item>
            <Breadcrumb.Item>{smallDiseaseName}</Breadcrumb.Item>
          </Breadcrumb>
          { !showDetail ? (
            // 展示病例列表
            <CaseCards 
              id={chooseNow}
              showDetail={showDetail}
              setShowDetail={setShowDetail}
              detailID={detailID}
              setDetailID={setDetailID}
            />
          ) : (
            // 展示详细信息
            <CaseDetail 
              id={detailID}
              showDetail={showDetail}
              setShowDetail={setShowDetail}/>
          )}
          </Content>
        </Layout>

      </Layout>
  );
};

export default CaseLearnVer2;