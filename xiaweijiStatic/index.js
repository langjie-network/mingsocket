import SseWebPlugin from  "/SseWebPlugin.js"

const sseWebPlugin =new SseWebPlugin(M.config.baseUrl("/sseServer?clientId=ming"));
app.use(sseWebPlugin,{
    event(v){
        switch (v.method){
            case "udpReply":{
                let oldList= M.Component["index"].list;
                if(oldList.length>10){
                    oldList.length=5;
                }
                v.params.protocol="udp";
                v.params.msg=JSON.stringify(v.params.msg)
                M.Component["index"].list=[v.params,...oldList,]
                break;
            }
            case "tcpReply":{
                let oldList= M.Component["index"].list;
                if(oldList.length>10){
                    oldList.length=5;
                }
                v.params.msg=JSON.stringify(v.params.msg)
                M.Component["index"].list=[v.params,...oldList,]
                break;
            }
            case "tcpCall":{
                let oldList= M.Component["index"].list;
                if(oldList.length>10){
                    oldList.length=5;
                }
                v.params.msg=JSON.stringify(v.params.msg)
                M.Component["index"].list=[v.params,...oldList,]
                break;
            }
            case "tcpListChange":{
                M.Component["index"].tcpListChange();
                break;
            }
            case "tcStatusChange":{
                M.Component["index"].tcStatus=v.params.tcStatus
                break;
            }
        }
       console.log(v)
    }
})


const vueConstructorData={
    el: '#main',
    data() {
        return {
            list: [{
                time: '2022-10-13 14:17:23',
                protocol:"",
                msg: ""
            }],
            tcpClientList: [{
                endPoint: ''
            }],
            tcStatus:"off", //off 离线  on 在线  hot热线
            draggable: null
        }
    },
    async mounted() {
        M.Component["index"]=this;
        sseWebPlugin.connect();
        var jsonEditor1 = document.getElementById('left');
        var jsonOptions1 = {
            mode: 'code',
            modes: ['code', 'form', 'text', 'tree', 'view'],
            onError: function(err) {

            },
            onChange(){

            },
        };
        this.jsonEdit = new JSONEditor(jsonEditor1, jsonOptions1, [] );
        this.jsonEdit.set({
            "method": "call.setSpeed",
            "params": {
                "v": 5
            }
        })
        let r= await M.request.get("/getTcStatus",{});
        this.tcStatus=r.data;

        let tcpClientListRes= await M.request.get("/tcpClientList",{});
        this.tcpClientList=tcpClientListRes.data;
    },
    methods:{
        statusChange(){
            if(this.tcStatus=="off"){
                this.tcStatus="on";
                M.request.get("/udpHeateBeatConfig",{
                    v:1
                });
            }else {
                this.tcStatus="off";
                M.request.get("/udpHeateBeatConfig",{
                    v:0
                });
            }

        },
        tcpOffLine(){
            M.request.get("/tcpOffLine");
        },
        tcpRequest(){
            M.request.post("/tcpRequest",this.jsonEdit.get());
        },
        async tcpListChange(){
            let r= await M.request.get("/getTcStatus",{});
            this.tcStatus=r.data;
            let tcpClientListRes= await M.request.get("/tcpClientList",{});
            this.tcpClientList=tcpClientListRes.data;
        }
    },
    computed:{
        btnStatusTxt(){
            switch (this.tcStatus){
                case "off":return "打开广播心跳"
                case "on":return "关闭广播心跳"
                case "hot":return "关闭广播心跳"
            }
            return "...."
        },
        tcStatusTxt(){
            switch (this.tcStatus){
                case "off":return "离线"
                case "on":return "在线"
                case "hot":return "热线"
            }
            return "...."
        }
    }
}
new Vue(vueConstructorData);