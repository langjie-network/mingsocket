const {app, M,common} = window;


app.get("/tcpSocketClientCall",async (req,res)=>{
    const body=req.params.body;
    const clientId=req.params.clientId;
    let apiPath=  M.config.baseUrl("/api/tcpSocketClientCall?clientId="+clientId);
    let r = await window.M.request.post(apiPath,body);
    res.send(r);
});

app.get("/tcpSocketClientList",async (req,res)=>{
    const queryCode=req.params;
    let apiPath=  M.config.baseUrl("/api/tcpSocketClientList");
    let r = await window.M.request.get(apiPath);
    res.send(r);
});


app.get("/udpSocketClientCall",async (req,res)=>{
    const body=req.params.body;
    const clientId=req.params.clientId;
    let apiPath=  M.config.baseUrl("/api/udpSocketClientCall?clientId="+clientId);
    let r = await window.M.request.post(apiPath,body);
    res.send(r);
});

app.get("/updSocketClientList",async (req,res)=>{
    const queryCode=req.params;
    let apiPath=  M.config.baseUrl("/api/udpSocketClientList");
    let r = await window.M.request.get(apiPath);
    res.send(r);
});



app.get("/tcpSocketConnect",async (req,res)=>{
    let apiPath=  M.config.baseUrl("/api/tcpSocketConnect");
    let r = await window.M.request.post(apiPath,req.params);
    res.send(r);
});


app.get("/tcpSocketDisConnect",async (req,res)=>{
    const queryCode=req.params;
    let apiPath=  M.config.baseUrl("/api/tcpSocketDisConnect");
    let r = await window.M.request.post(apiPath,req.params);
    res.send(r);
});
