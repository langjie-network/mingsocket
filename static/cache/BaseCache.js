class BaseCache {
    constructor(request,param) {
        this.request=request;
        this.params=param;
        this.value=null;
    }

    /**
     * 获取原始缓存
     * @returns {Promise<null>}
     */
    async getValue(){
        if(this.value==null){
            this.value= await this.request(this.params);
            return this.value;
        }else {
            return this.value;
        }
    }
}

export default BaseCache;