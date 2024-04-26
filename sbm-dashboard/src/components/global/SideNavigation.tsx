import { Menu } from 'antd'
import { Link } from 'react-router-dom'
import {
    LayoutOutlined,
    LineChartOutlined,
    CalendarOutlined,
    BranchesOutlined,
    BellOutlined,
    SettingOutlined,
    UserOutlined,
  } from '@ant-design/icons'


function SideNavigation(): JSX.Element {
        return (
        <div className='side-navigation-content'>
        <div className='logo'/>
        <Menu
            theme='dark'
            mode='inline'
            defaultSelectedKeys={['1']}
        >
            <Menu.Item key='1' icon={<LayoutOutlined />}>
                <Link to='/'>Operations</Link>
            </Menu.Item>  
            <Menu.Item key='2' icon={<LineChartOutlined />}>
                <Link to='/dynamic-scheduling'>Dynamic Scheduling</Link>
            </Menu.Item>  
            <Menu.Item key='3' icon={<CalendarOutlined />}>
                <Link to='/sales-forecast'>Sales Forecast</Link>
            </Menu.Item>  
            <Menu.Item key='4' icon={<BranchesOutlined />}>
                <Link to='/accounts'>Accounts</Link>
            </Menu.Item>  
            <div style={{ height: '47vh' }}></div>
            <Menu.Item key='5' icon={<BellOutlined />}>
                <Link to='/notifications'>Notifications</Link>
            </Menu.Item>  
            <Menu.Item key='6' icon={<SettingOutlined />}>
                <Link to='/settings'>Settings</Link>
            </Menu.Item>  
            <Menu.Item key='7' icon={<UserOutlined />}>
                <Link to='/users'>Users</Link>
            </Menu.Item>  
        </Menu>
        
        </div>
        );
}

export default SideNavigation;