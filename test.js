const Utils=require("./Utils.js")

r=Utils.getHeatBeatBuffer({
    protVer:1,
    model:1,
    ver:1,
    sn:1,
    name:"abcdefg",
    msgIp:1,
    msgPort:1,
    hotState:1,
    hotMasterIp:1,
})

console.log(r)