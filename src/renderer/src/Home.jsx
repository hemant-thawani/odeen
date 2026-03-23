import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Database, History } from "lucide-react";
import { Button, Layout, Menu, theme } from 'antd';

const { Header, Sider, Content } = Layout;

const Home = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <Layout className="min-w-screen h-screen">
            <Sider trigger={null} collapsed={collapsed}>

                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['/home/dataentry']}
                    onClick={({ key }) => navigate(key)}
                    items={[
                        {
                            key: '/home/dataentry',
                            label: 'Data Entry',
                            icon: <Database size={16} />,

                        },
                        {
                            key: '/home/history',
                            label: 'History',
                            icon: <History size={16} />,

                        },
                    ]}
                />
                <Button
                    type="text"
                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={() => setCollapsed(!collapsed)}
                />
            </Sider>
            <Layout>

                <Content
                    className='h-screen'
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default Home;