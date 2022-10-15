const { Content, Sider,Footer,Header } = Layout;
const {HashRouter  , Route, Link } = ReactRouterDOM;


class App extends React.Component {
    state = {
        collapsed: false,
        userInfo:{
            avatar:"https://langjie.oss-cn-hangzhou.aliyuncs.com/space/root/project/ruyunsuixing/img/default_avatar.png",
            user_name:"未登录"
        }
    };
    onCollapse = (collapsed) => {
        this.setState({ collapsed });
    }

    componentDidMount() {
        const sseWebPlugin =new SseWebPlugin(M.config.baseUrl("/sseServer?clientId=ming"));
        app.use(sseWebPlugin,{
            event(msg){
                //console.log(msg)
                switch (msg.method){
                    case "reload":{
                        if( msg.params!="3" &&
                            msg.params!="4" &&
                            msg.params!="1" &&
                            msg.params!="2"
                        ){
                            return;
                        }
                        if(M.Component.UdpSocketClientList){
                            M.Component.UdpSocketClientList.handleSearch()
                        }
                        return;
                    }
                }
                if(M.Component.MiMsgList){
                    M.Component.MiMsgList.onRecverMsg(msg)
                }
                if(M.Component.TcpSocketClientCallForm){
                    M.Component.TcpSocketClientCallForm.onRecverMsg(msg)
                }
            }
        })
        sseWebPlugin.connect();
        M.Component.App=this;
    };


    render() {
        return (
            <HashRouter>
                <Layout style={{ minHeight: '100vh' }}>
                    <Sider
                        defaultCollapsed={true} collapsible={true}  width={200} style={{ background: '#fff' }}
                    >
                        <Menu theme="light" defaultSelectedKeys={['1']} mode="inline">
                            <Menu.Item key="UdpSocketClientList">
                                <Link to="/UdpSocketClientList">TC列表</Link>
                            </Menu.Item>
                            <Menu.Item key="MiMsgList">
                                <Link to="/MiMsgList">消息</Link>
                            </Menu.Item>
                            <Menu.Item key="help">
                                <Link to="/help">帮助</Link>
                            </Menu.Item>
                        </Menu>
                    </Sider>
                    <Layout>
                        <Content style={{ margin: '0 16px' }}>
                            <div style={{ padding: 24, background: '#fff', height: "100%" }}>
                                <Route path="/UdpSocketClientList" component={UdpSocketClientList} />
                                <Route path="/MiMsgList" component={MiMsgList} />
                                <Route path="/help" component={MiHelp} />
                            </div>
                        </Content>
                    </Layout>
                </Layout>
            </HashRouter>
        );
    }F
}


