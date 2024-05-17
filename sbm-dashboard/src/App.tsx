import { useState } from 'react'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Layout, Button, theme } from 'antd'
import './App.css'

import OperationsPage from './pages/OperationsPage'
import TimeSeriesView from './pages/TimeSeriesView'
import SideNavigation from './components/global/SideNavigation'
import AlertBar from './components/global/AlertBar'
 
const { Header, Sider, Content } = Layout

function App() {
  const [collapsed, setCollapsed] = useState(true)
  const {
    token: {colorBgContainer, borderRadiusLG}
  } = theme.useToken();

  return (
    <Router>
      <Layout id='main-content' 
        style={{
          minHeight: '100vh', 
          width: '100%', 
          margin: '0', 
          padding: '0'
          }}>
        <Sider id='side-nav-bar' trigger={null} collapsible collapsed={true} width={250}>
          <SideNavigation /> 
        </Sider>
        <Layout>
          <Header id='top-nav-bar' 
            style={{ 
              padding: 0, 
              background: colorBgContainer, 
              display: 'flex',
              flexDirection: 'row-reverse',
              }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
                left: 0,
              }}
              />
            </Header>
            <Content id='site-content'
            style={{
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}>
            <Routes>
              <Route path='/' element={<OperationsPage/>} />
              <Route path="/time-series/:sensorId" element={<TimeSeriesView />} />
              <Route path='/dynamic-scheduling' element={<div>Content for Dynamic Scheduling</div>} />
              <Route path='/sales-forecast' element={<div>Content for Sales Forecast</div>} />
              <Route path='/accounts' element={<div>Content for Accounts</div>} />
            </Routes>
          </Content>
        </Layout>
        <Sider id='side-alerts-bar' trigger={null} collapsible collapsed={collapsed} width={250}>
          <div>
            <AlertBar collapsed={collapsed}/>
          </div>
        </Sider>
      </Layout>
    </Router>
  )
}

export default App
