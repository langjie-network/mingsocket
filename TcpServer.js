const net = require('net');
const Utils = require('./Utils.js');
class TcpServer {

    constructor() {
       this.localAddress=Utils.getIpAddress();
       this.socketClientMap={};
    }


    listen(port){
        let that=this;
        this.localPort=port;
        this.socketServer = net.createServer(function (client) {
            console.log('someones connects');
            let endPoint= client.remoteAddress+":"+client.remotePort;
            M.tcStatus="hot";
            client.time=new Date().format("yyyy-MM-dd hh:mm:ss");
            that.socketClientMap[endPoint]=client;
            M.sseApp.send({
                method:"tcpListChange",
                params:{}
            })
            // 接收客户端的数据
            client.on('data', function (data) {
                let messageObj= JSON.parse(data.toString())
                M.sseApp.send({
                    method:"tcpCall",
                    params:{
                        remoteEndPoint:endPoint,
                        time:new Date().format("yyyy-MM-dd hh:mm:ss"),
                        msg:messageObj
                    }
                });
            });

            // 客户端连接关闭
            client.on('close', function (err) {
                delete that.socketClientMap[endPoint];
                if(Object.keys(that.socketClientMap).length==0){
                    M.tcStatus="on";
                }
                M.sseApp.send({
                    method:"tcpListChange",
                    params:{}
                })
                console.log('客户端下线');
            });
            // 客户端连接错误
            client.on('error', function (err) {
                delete that.socketClientMap[endPoint];
                if(Object.keys(that.socketClientMap).length==0){
                    M.tcStatus="on";
                }
                M.sseApp.send({
                    method:"tcpListChange",
                    params:{}
                })
                console.log('客户端连接错误');
            });
        });
        this.socketServer.listen(
            {
                port: port,
                host: '0.0.0.0',
            },
            function () {
                console.log('server start listening');
            }
        );

        //设置监听时的回调函数
        this.socketServer.on('listening', function () {
            const { address, port } =  that.socketServer.address();
            console.log('Tcpserver listen on:' + address + ':' + port);
        });

        //设置关闭时的回调函数
        this.socketServer.on('close', function () {
            console.log('sever closed');
            M.sseApp.send({
                method:"tcpListChange",
                params:{}
            })
            that.socketClientMap={};
        });

        //设置出错时的回调函数
        this.socketServer.on('error', function () {
            console.log('sever error');
            M.sseApp.send({
                method:"tcpListChange",
                params:{}
            })
            that.socketClientMap={};
        });
    }

    send(buffer){
       let clientEndPointList= Object.keys(this.socketClientMap);
       for (let i=0;i<clientEndPointList.length;i++){
           this.socketClientMap[clientEndPointList[i]].write(buffer)
       }

    }

}

module.exports = TcpServer;