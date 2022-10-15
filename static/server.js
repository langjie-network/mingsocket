M=require("ming_node");
var url_module = require('url');
var querystring = require('querystring');
fs=require("fs");

app=M.server();
app.listen(8888)




app.set("views","./")

sseApp=M.sseServer()
app.get("/sseServer",sseApp)




let r=[]

if(fs.existsSync("pages")){
    r1= M.getFileDirList("./pages");
    r=[...r,...r1,"pages"]
}

r.push(".");

r.forEach(u=>{
    M.watchFile(u,({file,event})=>{
        if(event=="change"){
            // console.log(file,event);
            sseApp.send("change");
        }
    })

})

console.log("watch on ",r)