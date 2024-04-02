import { useState } from 'react'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import { Layout, Menu, Button, theme } from 'antd'
import './App.css'

import OperationsPage from './pages/OperationsPage'

const { Header, Sider, Content } = Layout

function App() {
  const [collapsed, setCollapsed] = useState(true)
  const {
    token: {colorBgContainer, borderRadiusLG}
  } = theme.useToken();

  return (
    <Router>
      <Layout style={{ minHeight: '100vh', width: '100vh', margin: '0', padding: '0'}}>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className='logo'/>
            <Menu
              theme='dark'
              mode='inline'
              defaultSelectedKeys={['1']}
            >
            <Menu.Item key='1' icon={<UserOutlined />}>
              <Link to='/'>Operations</Link>
            </Menu.Item>  
            <Menu.Item key='2' icon={<VideoCameraOutlined />}>
              <Link to='/dynamic-scheduling'>Dynamic Scheduling</Link>
            </Menu.Item>  
            <Menu.Item key='3' icon={<UploadOutlined />}>
              <Link to='/sales-forecast'>Sales Forecast</Link>
            </Menu.Item>  
            <Menu.Item key='4' icon={<UserOutlined />}>
              <Link to='/accounts'>Accounts</Link>
            </Menu.Item>  
            </Menu>
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
              />
            </Header>
            <Content
            style={{
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}>
            <Routes>
              <Route path='/' element={<OperationsPage/>} />
              <Route path='/dynamic-scheduling' element={<div>Content for Dynamic Scheduling</div>} />
              <Route path='/sales-forecast' element={<div>Content for Sales Forecast</div>} />
              <Route path='/accounts' element={<div>Content for Accounts</div>} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  )
}

export default App
