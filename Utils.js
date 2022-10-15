const os = require("os");

const Utils={};

Utils.num2Bytes=(num,length=4)=>{
    if(length==2){
        return [(num&(0xFF00))>>8,num&(0x00FF)]
    }
    if(length==4){
        return [(num&(0xFF000000))>>24,(num&(0x00FF0000))>>16,(num&(0x0000FF00))>>8,num&(0x00FF)]
    }
}

Utils.str2Bytes=(str,length=16)=>{
    let zeroBuffer=new Buffer(length);
    let strBuffer=new Buffer(str);
    for (let i=0;i<16;i++){
        zeroBuffer[i]=strBuffer[i];
    }
    return zeroBuffer;
}

Utils.parseIpToInt=(ip)=> {
    var buf = ip.split(".")
    return (parseInt(buf[0]) << 24 |
        parseInt(buf[1]) << 16 |
        parseInt(buf[2]) << 8 |
        parseInt(buf[3]))>>>0;
}

Utils.getHeatBeatBuffer=({
    protVer,
    model,
    ver,
    sn,
     name,
     msgIp,
     msgPort,
     hotState,
     hotMasterIp,
     unused
})=>{
    if(false){
        let heatBeatBuffer = new Buffer([
            0,0,0,1,              //    DWORD	protVer;				// 协议版本
            0,0,0,1,            //DWORD	model;				// 产品型号（类）
            0,0,0,1,                         //DWORD	ver;					// 产品固件版本
            0,0,0,1,                        //DWORD	sn;					// 序列号（实例）
            97,97,97,97, 97,98,98,98,98,98,99,99,99,99,99,99,  //char	name[16];			// 名称
            0,0,0,1,                  // DWORD	msgIp;				// 报文IP地址
            0,1,                   // WORD		msgPort;				// 报文端口
            0,1,                   // WORD		hotState;			// 连接后的热线状态
            0,0,0,1,                  //DWORD	hotMasterIp;			// 连接主机IP地址
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0             // BYTE		unused[20];			// 凑足64字节
        ]);
    }
    let heatBeatBuffer = new Buffer([
        ...Utils.num2Bytes(protVer),             //    DWORD	protVer;				// 协议版本
        ...Utils.num2Bytes(model),            //DWORD	model;				// 产品型号（类）
        ...Utils.num2Bytes(ver),                         //DWORD	ver;					// 产品固件版本
        ...Utils.num2Bytes(sn),                        //DWORD	sn;					// 序列号（实例）
        ...Utils.str2Bytes(name,16),  //char	name[16];			// 名称
        ...Utils.num2Bytes(msgIp),                  // DWORD	msgIp;				// 报文IP地址
        ...Utils.num2Bytes(msgPort,2),                   // WORD		msgPort;				// 报文端口
        ...Utils.num2Bytes(hotState,2),                   // WORD		hotState;			// 连接后的热线状态
        ...Utils.num2Bytes(hotMasterIp),                  //DWORD	hotMasterIp;			// 连接主机IP地址
        ...Utils.str2Bytes("",20)             // BYTE		unused[20];			// 凑足64字节
    ]);
    return heatBeatBuffer;
}
Utils.getIpAddress=()=> {
    /**os.networkInterfaces() 返回一个对象，该对象包含已分配了网络地址的网络接口 */
    var interfaces = os.networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (
                alias.family === "IPv4" &&
                alias.address !== "127.0.0.1" &&
                !alias.internal
            ) {
                return alias.address;
            }
        }
    }
}

Utils.getBrostAddress=()=> {
    /**os.networkInterfaces() 返回一个对象，该对象包含已分配了网络地址的网络接口 */
    var interfaces = os.networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (
                alias.family === "IPv4" &&
                alias.address !== "127.0.0.1" &&
                !alias.internal
            ) {
                let  broadcastIp=alias.address.substr(0,alias.address.lastIndexOf("."))+".255";
                return broadcastIp;
            }
        }
    }
}



module.exports = Utils;