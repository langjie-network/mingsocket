

class MiMsgList extends React.Component {


    constructor(props) {
        super(props);

    }

    state={
        data:[],
        isMonitorSocketMsg:false,
        isMonitorMqMsg:false,
        mqProductStatue:false,
        queueName:""
    }
    componentDidMount() {
        M.Component.MiMsgList=this;

    };


    onRecverMsg(params){
        params.t=  params.clientId+"==>"+ new Date().format("yyyy-MM-dd hh:mm:ss")
        params.m=JSON.stringify( params.jsonRpcRequest);
        if(this.state.data.length>250){
            this.state.data.length=10;
        }
        let list=[params,...this.state.data]
        this.setState({
            data:list
        });


    }

    appendMsg(t,m){
        let list=[{t,m},...this.state.data]
         this.setState({
             data:list
         });
    }

    render() {

          return (
              <div>
                <List
                      style={{"overflow-y":"scroll","height":800}}
                      itemLayout="horizontal"
                      dataSource={this.state.data}
                      renderItem={(item) => {
                          return <List.Item>
                              <List.Item.Meta
                                  avatar={<Avatar src={"./img/socket.png"} />}
                                  title={item.t}
                                  description={item.m}
                              />
                          </List.Item>

                      }}
                  />
              </div>

        )
    }
}











