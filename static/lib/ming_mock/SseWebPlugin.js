
class SseWebPlugin {
    constructor(url) {
        this.url=url;
        this.connectFun=()=>{};
        this.eventFun=()=>{};
    }
    async connect(){
        let that=this;
        this.eventSource=new EventSource(that.url);

        this.eventSource.onmessage = function (event) {
            let obj= JSON.parse(event.data)
            that.eventFun( obj);
        };
        <!-- 添加一个开启回调 -->
        this.eventSource.onopen = function (event) {
            that.connectFun(event);
        };

        this.eventSource.onerror = function (event) {
             console.error(event)
        };
    }

    async install(app,args){
        if(args.event){
            this.eventFun=args.event;
        }
        if(args.connect){
            this.connectFun=args.connect;
        }
    }

}



// if(0){
//     const sseWebPlugin =new SseWebPlugin(M.config.baseUrl("/sse/subscribe?id=ming"));
//     app.use(sseWebPlugin,{
//         event(v){
//             let obj=JSON.parse(v);
//             switch (obj.method){
//                 case "call.apiLogAddStep": MIO.apiLogAddStep(obj);
//             }
//         }
//     })
//     sseWebPlugin.connect();
// }




