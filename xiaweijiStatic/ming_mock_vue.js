(function (window) {
    const M = {};

    //全局组件
    M.Component={}
    /**
     * 加载html文件 start
     */
    M._loadHtmlCache={};
    M._loadCssCache={};
    //全局缓存map
    M._globle_cacheMap = {}
    //全局对象缓存
    M._globle_lib_cacheMap={}
    //全局插件地址缓存
    M._globle_plugin_url_cacheMap={};
    //全局插件
    M._globle_plugin=new Set();

    M.pushRouter=function (){
    }

    //全局组件注册
    M.registComponent=function (key,component){
        M.Component[key]=component;
    }

    M.html =function (htmlUrl){
        let r=  M._loadHtmlCache[htmlUrl]||"<h1>wait...</h1>";
        return r;
    }
    /**
     * 加载html文件 end
     */

    M.urlParse = function (url) {
        url = url.substr(url.indexOf("?") + 1);
        let t, n, r, i = url, s = {};
        t = i.split("&"),
            r = null,
            n = null;
        for (let o in t) {
            let u = t[o].indexOf("=");
            u !== -1 && (r = t[o].substr(0, u),
                n = t[o].substr(u + 1),
                s[r] = n);
        }
        return s
    };




    var App = {
        _get: {},
        get (methodName, callback) {
            M.IO.reg(methodName.replace("/", ""));
            methodName = M.formatUrl(methodName);
            App._get[methodName] = callback;
        },
        _begin: function () {
        },
        _end: function () {
        },

        begin(callback) {
            App._begin = callback;
        },
        end(callback) {
            App._end = callback;
        },
        use(url,callback){
            if(typeof url === 'function' || typeof url === 'object'  ){
                let plugin=url;
                let args=callback;
                if(plugin.installed){
                    return App;
                }
                if (typeof plugin === 'function') {
                    plugin(App, args);
                } else {
                    plugin.install(App, args);
                }
                plugin.installed = true;
                M._globle_plugin.add(plugin);
            }else {
                if (Array.isArray(url)) {
                    url.forEach(u=>{
                        let regExp=new RegExp(u)
                        App._use[u] = {url,regExp,callback};
                    })
                } else {
                    let regExp=new RegExp(url)
                    App._use[url] = {url,regExp,callback};
                }
            }
            return App;
        },
        async installPlugin(pluginUrl,constructorParams,pluginParams){
            if(M._globle_plugin_url_cacheMap[pluginUrl]){
                return
            }
            M._globle_plugin_url_cacheMap[pluginUrl]=pluginUrl;
            return  new Promise(resolve => {
                import(pluginUrl).then(async modul=>{
                    const Plugin= modul.default;
                    const plugin= new Plugin(constructorParams);
                    App.use(plugin,pluginParams)
                    resolve(plugin);
                })
            })
        },
        async doget(methodName,params,callback) {
            const req = {};
            const res = {};
            if(params==0){
                req.params=0;
            }else {
                req.params = params||{};
            }
            req.url = methodName;
            res.send = function (d) {
                res.alreadySend = true;
                callback(d);
                App._end(req, d);
            }.bind(this);

            await App._begin(req, res);
            if (!res.alreadySend) await App._get[methodName](req, res);
        }
    };
    //服务方法注册
    M.IO = {};
    M.IO.reg = function (methedName) {
        M.IO[methedName] = (param) => {
            return new Promise(
                function (reslove) {
                    App.doget("/" + methedName,param,(d)=>{
                        reslove(d);
                    })
                }
            )
        }
    };

    /**
     * 去掉参数加让斜杠
     */
    M.formatUrl = function (url) {
        if (url.indexOf("?") > 0) {
            url = url.substr(0, url.indexOf("?"));
        } else {
            url = url;
        }
        if (!url.startsWith('/')) {
            url = '/' + url;
        }
        return url;
    };


    M.get = function (url, param) {
        let u;
        App.doget(url,param,(d)=>{
            u = d;
        });
        return u;
    };

    M.delayMs=async function (ms){
        return new Promise(r=>{
            setTimeout(()=>{
                r(1)
            },ms)
        })
    }




    M.urlStringify = function (obj) {
        if (obj !== null && typeof obj === 'object') {
            var keys = Object.keys(obj);
            var len = keys.length;
            var flast = len - 1;
            var fields = '';
            for (var i = 0; i < len; ++i) {
                var k = keys[i];
                var v = obj[k];
                var ks = k + "=";
                fields += ks + v;
                if (i < flast) {
                    fields += "&";
                }
            }
            return fields;
        }
        return '';
    };

    const translateApi=(api)=>{

        return api;
    }


    function preHeader(headers){
        let reqHeader=headers||{
            'Content-Type': 'application/json'
        }
        return reqHeader;
    }


    const post  = async (api, params = {},headers) => {
        api=translateApi(api)
        return new Promise((reslove, reject) => {
            fetch(api, {
                method: 'POST',
                mode: 'cors',
                headers:preHeader(headers),
                body: JSON.stringify(params)
            }).then(function (response) {
                return response.json();
            }).then((res) => {
                reslove(res)
            }).catch((err) => {
                reject(err)
            });
        })
    }
    const get = async (api, params = {},headers) => {
        api=translateApi(api)
        let getData = "";
        if (params) {
            getData = window.M.urlStringify(params);
            if (api.indexOf("?") > 0) {
                getData = "&" + getData;
            } else {
                getData = "?" + getData;
            }
        }
        api = api + getData;
        return new Promise((reslove, reject) => {
            fetch(api, {
                method: 'GET',
                mode: 'cors',
                headers: preHeader(headers),
            }).then(function (response) {
                return response.json();
            }).then((res) => {
                reslove(res)
            }).catch((err) => {
                reject(err)
            });
        })
    };
    const jsonp=async (url, callbackFunction)=>{
        return new Promise(resolve => {
            let callbackStr = M.urlParse(url).callback;
            window[callbackStr]=(...params)=>{
                if(callbackFunction) {
                    callbackFunction(params);
                }
                document.body.removeChild(document.getElementById("ming_mock_jsonp_id"))
                resolve(params);
            }
            var scriptElement = document.createElement('script');
            scriptElement.src = url;
            scriptElement.id="ming_mock_jsonp_id"
            document.body.appendChild(scriptElement);
        })
    };

    M.checkR=function (r){
        return r.code==200 || r.code==0;
    }

    M.geogebraCall  = async (msg)=>{
       let r= await M.request.post("http://localhost:8888/geogebraCall",msg);
       return r;
    }

    M.geogebraReply  = async (msg)=>{
        let r=await M.request.post("http://localhost:8888/geogebraReply",msg);
        return r;
    }
    window.M = M;
    window.MIO = M.IO;
//将ajax请求挂到全局对象M上
    window.M.request={}
    window.M.request.get=get;
    window.M.request.post=post;
    window.M.request.jsonp=jsonp;
    window.app = App;
})(window);