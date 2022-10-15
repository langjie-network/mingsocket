const net = require('net');

class TcpClient {

    constructor() {
       this.connected=false;
    }


    connect(remoteEndPoint){
        let that=this;
        that.remoteEndPoint=remoteEndPoint;
        if(this.connected){
            return
        }
        let [remoteIp,remotePort] =this.remoteEndPoint.split(":");
        this.client = net.createConnection({
            port:remotePort  ,
            host:remoteIp
        });
        this.connected=true;
        //当套字节与服务端连接成功时触发connect事件
        this.client.on('connect', () =>{
           // this.client.write('他乡踏雪');
            M.tcStatus="hot";
            M.sseApp.send({
                method:"tcStatusChange",
                params:{
                    tcStatus:M.tcStatus
                }
            })
        });
        //使用data事件监听服务端响应过来的数据
        this.client.on('data', (chunk) => {

            let messageObj= JSON.parse(chunk.toString())
            M.sseApp.send({
                method:"tcpReply",
                params:{
                    time:new Date().format("yyyy-MM-dd hh:mm:ss"),
                    msg:messageObj
                }
            });
            console.log(messageObj);
        });
        this.client.on('error', (err)=>{
            console.log('tcp err');
            console.log(err);
        });
        this.client.on('close', ()=>{
            console.log('tcp close');
            that.connected=false;
        });
    }

    send(buffer){
        if(this.connected){
            this.client.write(buffer);
        }
    }

}

module.exports = TcpClient;