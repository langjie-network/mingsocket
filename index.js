const M=require('ming_node');
require('./config.js');
const UdpClient=require('./UdpClient.js');
const TcpServer=require('./TcpServer.js');
const Utils = require('./Utils.js');
M.config=global.CONFIG;
M.tcStatus="on";
M.tcpServer=new TcpServer();
M.tcpServer.listen(global.CONFIG.tcpServerPort);
const  udpClient= new UdpClient(Utils.getBrostAddress()+":"+global.CONFIG.udpBrostPort)
const app= M.server();
app.set("views","./xiaweijiStatic")
app.listen(global.CONFIG.httpServerPort);

M.sseApp=M.sseServer();
app.get("/sseServer",M.sseApp);

app.begin((req, res)=>{
    console.log(req.url);
    if(req.method=="OPTIONS"){ res.send({}); return}

})

app.get("/getTcStatus",(req,res)=>{
    res.send(M.successResult(M.tcStatus))
})


app.get("/tcpClientList",(req,res)=>{
    let list= Object.keys(M.tcpServer.socketClientMap);
    let rlist= list.map(u=>{
        return {
            endPoint:u,
            time:M.tcpServer.socketClientMap[u].time,
        }
    })
    res.send(M.successResult(rlist))
})

app.get("/tcpOffLine",(req,res)=>{
    if( M.tcpClient.client){
        M.tcpClient.client.destroy();
    }
    res.send(M.successResult())
})


app.post("/tcpRequest",(req,res)=>{
    M.tcpServer.send(req.body+"\r\n")
    res.send(M.successResult())
})

app.get("/udpHeateBeatConfig",(req,res)=>{
    if(req.params.v=="1"){
        M.tcStatus="on";
        udpClient.enable=true;
    }else {
        M.tcStatus="off";
        udpClient.enable=false;
    }
    res.send(M.successResult("ok"))
})

