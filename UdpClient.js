const Utils=require("./Utils.js")
let dgram = require('dgram');

class UdpClient {

    constructor(remoteEndPoint) {
        this.remoteEndPoint=remoteEndPoint;
        let [remoteIp,remotePort] =this.remoteEndPoint.split(":");
        this.remotePort=Number.parseInt(remotePort);
        this.remoteIp=remoteIp;
        this.udp_client = dgram.createSocket('udp4');
        this.udp_client.bind(40018);
        this.enable=true;
        this.init();
        this.heateBeat();
    }


    init(){
        this.udp_client.on('close',function(){
            console.log('udp client closed.')
        })
        //错误处理
        this.udp_client.on('error', function () {
            console.log('some error on udp client.')
        })

        // 接收消息
        this.udp_client.on('message', function (msg,rinfo) {
            //console.log(`receive message from ${rinfo.address}:${rinfo.port}：${msg}`);
            let messageObj= JSON.parse(msg.toString())

            M.sseApp.send({
                method:"udpReply",
                params:{
                    time:new Date().format("yyyy-MM-dd hh:mm:ss"),
                    msg:messageObj
                }
            })
            switch (messageObj.method){
                case "reply.heatBeat":{
                    let remoteTcpEndPoint=messageObj.params;
                    if(M.tcpClient.connected==false){
                        M.tcpClient.connect(remoteTcpEndPoint);
                    }
                    break
                }

            }
           // console.log(messageObj);

        })
    }

    send(buffer,remoteEndPoint){
        if(remoteEndPoint==null){
            this.udp_client.send(buffer, 0, buffer.length, this.remotePort, this.remoteIp);
        }else {
            let [remoteIp,remotePort] =this.remoteEndPoint.split(":");
            this.remotePort=Number.parseInt(remotePort);
            this.remoteIp=remoteIp;
            this.udp_client.send(buffer, 0, buffer.length, this.remotePort, this.remoteIp);
        }
    }

    heateBeat(){
        let heatBeatBuffer = Utils.getHeatBeatBuffer({
            protVer:1,
            model:1,
            ver:1,
            sn:2740114,
            name:"aaaaaaaaaaaaaaaa",
            msgIp: Utils.parseIpToInt(M.tcpServer.localAddress) ,
            msgPort:M.tcpServer.localPort,
            hotState:1,
            hotMasterIp:Utils.parseIpToInt(M.tcpServer.localAddress) ,
        })
        let that=this;
        setInterval(function(){
            if(that.enable){
                that.send(heatBeatBuffer,null);
            }
        },3000);

    }

}

module.exports = UdpClient;