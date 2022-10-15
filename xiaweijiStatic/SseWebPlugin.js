
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
            that.eventFun(event.data);
        };
        this.eventSource.onopen = function (event) {
            that.connectFun(event);
        };

        this.eventSource.onerror = function (event) {
             console.error(event)
        };

        this.eventSource.addEventListener('slide', event => {
            that.eventFun(JSON.parse(event.data));
        }, false);
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


export default  SseWebPlugin;

