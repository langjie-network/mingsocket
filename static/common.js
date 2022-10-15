
const Common={};

Common.nowStr=()=>{
   return  new Date().format("yyyy-MM-dd hh:mm:ss");
}
Common.dec2ip=(dec)=> {
   // 十进制数转为二进制数
   let ipBinary = Number(dec).toString(2);
   // 二进制高位补0
   while (ipBinary.length < 32) {
      ipBinary = "0" + ipBinary;
   }
   let ip1 = parseInt(ipBinary.slice(0, 8), 2);
   let ip2 = parseInt(ipBinary.slice(8, 16), 2);
   let ip3 = parseInt(ipBinary.slice(16, 24), 2);
   let ip4 = parseInt(ipBinary.slice(24, 32), 2);
   return `${ip1}.${ip2}.${ip3}.${ip4}`
}