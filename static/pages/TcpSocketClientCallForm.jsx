
class TcpSocketClientCallForm  extends Component {
    constructor(props) {
        super(props);
        this.jsonEditorWindow={};
    }
    state = {
        callResult:{},
        s2xTime:"",
        x2sTime:"",
        callTemplateListMethead:[]
    }

    async componentDidMount(){
        M.Component.TcpSocketClientCallForm=this;
        let that=this;
        try {
            this.jsonEditorWindow1= document.getElementById('jsonPreview_id1').contentWindow;
            this.jsonEditorWindow1.onload=function (){
                that.jsonEditorWindow1.jsonEditor.set({
                    "method": "call.setSpeed",
                    "params": {
                        "v": 5
                    }
                });
                //json 修改了
                that.jsonEditorWindow1.jsonEditor.myChange=(v)=>{

                };
            }


            this.jsonEditorWindow2= document.getElementById('jsonPreview_id2').contentWindow;
            this.jsonEditorWindow2.onload=function (){
                that.jsonEditorWindow2.jsonEditor.set({
                    "method": "call.setSpeed",
                    "params": {
                        "v": 5
                    }
                });
                //json 修改了
                that.jsonEditorWindow2.jsonEditor.myChange=(v)=>{


                };
            }
        }catch (e){
            console.error(e);
        }
    }


     changeRequestBySelest=async (sel)=>{

        this.jsonEditorWindow1.jsonEditor.set("")
    }

    onRecverMsg(msg){
        if(msg.clientId==this.props.parent.state.curRecord.endPoint){

            this.setState({
                x2sTime: Common.nowStr()
            });

            this.jsonEditorWindow2.jsonEditor.set(msg.jsonRpcRequest);

        }


    }



    render() {
        return (
            <div>
                <Button onClick={async ()=>{
                     let r= this.jsonEditorWindow1.jsonEditor.get();
                     let r2=await MIO.tcpSocketClientCall({
                          body:r,
                          clientId: this.props.parent.state.curRecord.endPoint
                      });
                     if(r2.code==0){
                         this.setState({
                             s2xTime: Common.nowStr()
                         })
                     }
                    message.success(r2.msg);
                }}>发送</Button>
                <br/>   <br/>
                <Select
                    mode="combobox"
                    placeholder=""
                    filterOption={false}
                    onChange={()=>{}}
                    onSelect={(v)=>{
                        this.changeRequestBySelest(v);
                    }}
                    style={{ width: '100%' }}
                >
                    {this.state.callTemplateListMethead.map((d,index) => <Option key={index} value={d}>{d}</Option>)}
                </Select>   <br/>   <br/>
                <label>
                    上位机 ==>  {this.props.parent.state.curRecord.endPoint}&nbsp;&nbsp;&nbsp;
                    最后时间: {this.state.s2xTime}
                </label>
                <iframe id={"jsonPreview_id1"} src={"/publicpage/jsonPreview.html"} style={{width:'100%',height:'200px',border:'none'}}></iframe>
                <label>
                     {this.props.parent.state.curRecord.endPoint} ==> 上位机 &nbsp;&nbsp;&nbsp;
                     最后时间: {this.state.x2sTime}
                </label>
                <iframe id={"jsonPreview_id2"} src={"/publicpage/jsonPreview.html"} style={{width:'100%',height:'200px',border:'none'}}></iframe>
            </div>

        );
    }
}
