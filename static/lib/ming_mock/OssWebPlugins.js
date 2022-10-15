
class OssWebPlugins {
    constructor(ossStsConfig) {
        this.ossStsConfig=ossStsConfig;
        this.ossClient=new OSS.Wrapper({
            secure:true,
            region: ossStsConfig.region,
            accessKeyId: ossStsConfig.accessKeyId,
            accessKeySecret: ossStsConfig.accessKeySecret,
            stsToken:ossStsConfig.securityToken,
            bucket: ossStsConfig.bucket});
    }


    async install(app,args){
        let  that=this;
        window.MIO.uplodaOssFile=function (ossKey,file,progress,success,fail){
            that.ossClient.multipartUpload(ossKey, file,{
                progress: function (p) { //上传进度设置
                    return function (done) {
                        progress(p)
                        done();
                    }
                }
            }).then(function (result) {
                success(result);
            }).catch(function (err) {
                console.error(err)
                fail(err);
            });
        }
    }

}


export default OssWebPlugins;






