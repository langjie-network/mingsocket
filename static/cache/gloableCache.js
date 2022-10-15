import BaseCache from "./BaseCache.js";


window.M.gloableCache={}

//缓存  会员组
window.M.gloableCache.vip_group_list=new BaseCache(async ()=>{
    let r=await window.MIO.gloable_crmhelp_dictionary_list("vip_group")
    return r;
});





