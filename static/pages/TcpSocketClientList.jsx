





class TcpSocketClientList extends BaseTableList  {

    constructor(props) {
        super(props);
        this.fixedKey="id";
        this.filter = [ 'tag_name_list' ];
        this.actioncolumns = true;
        this.actionWidth=200;
        this.placeholder="请输入ip";
        this.state.filter= {  tag_name_list: ''};
        this.columns=this.getColumns();

    }

    state = {
        data: [],       //fetch的数据源
        detailViasble:false,
        callVisable:false,
        pagination: {   //搜索参数
            current: 1,
            pageSize: 500,
            keywords: '',
            startDate: (new Date().getFullYear()-1)+"-10-01",
            order: '',
            filter: {},
            total: 0,
            showSizeChanger: true,
            pageSizeOptions: ['500'],
            showTotal: ((total) => {
                return `共 ${total} 条`;
            }),
            onShowSizeChange: (current, pageSize) => {
                const { pagination } = this.state;
                pagination.pageSize = pageSize;
                this.setState({
                    pagination
                });
            }
        },
        loading: false,
        visible: false,
        modalText: '确定删除？',
        selectedRowKeys: [],
        selectedRows: [],
        curRecord:{}
    }

    res_data = {
        endPoint: {
            label: 'endPoint',
            width: 230
        },
        lastHeatTime: {
            label: '最后心跳时间',
            width: 400
        }
    }


    getColumns(){
        let res_data = this.res_data;
        let columns = [];
        let tableWidth = this.tableWidth;
        for(let key in res_data){
            tableWidth += res_data[key]['width'];
            let o = {
                title: res_data[key].label,
                dataIndex: key,
                key: key,
                width: res_data[key]['width'],
                sorter: (a, b) => a[key]-b[key],
                render: (text, row, index) => {
                    return this.viewRender(key, res_data, text, row, index);
                }
            };
            if(key=="index"){
                o = {
                    title: res_data[key].label,
                    dataIndex: key,
                    key: key,
                    width: res_data[key]['width'],
                    sorter: (a, b) => a[key]-b[key],
                    render: (text, row, index) => {
                        return <div>{index}</div>;
                    }
                };
            }

            columns.push(o);
        }
        if(this.actioncolumns){
            columns.push({
                title: '操作',
                key: 'operation',
                fixed: 'right',
                width: this.actionWidth,
                render: (text, row, index) => {
                    return this.actionRender(text, row, index);
                },
            });
        }
        this.tableWidth=tableWidth;
        return columns;
    }


    //新增
    handleCreate(){
        M.SetStateSession(this.state);
        location.hash="#/MiApiInsAdd";
    }

    actionRender(text, row, index) {
        return(
            <p >
                <a href="javascript:void(0)" onClick={()=>{
                     this.setState({
                         curRecord:row,
                         callVisable:true
                     })
                }} style={{marginLeft: 10}}>通讯</a>
                &nbsp;  &nbsp;
                <a href="javascript:void(0)" onClick={()=>{
                    this.setState({
                        curRecord:row,
                        detailViasble:true
                    })
                }} style={{marginLeft: 10}}>详情</a>
                &nbsp;  &nbsp;
            </p>
        )
    }


    viewRender(key,res_data,text, row, index){

        if(key=="lastHeatTime"){
            let yyyymmdd=   new Date(Number.parseInt(row[key])).format("yyyy-MM-dd hh:mm:ss");

            return <div style={{
                left:0,
                width: res_data[key]['width']-32,
                display:"inline-block",
                wordWrap:"break-word"
            }}>
                {yyyymmdd}
            </div>

        }


        return <div style={{
            left:0,
            width: res_data[key]['width']-32,
            display:"inline-block",
            wordWrap:"break-word"
         }}>
            {row[key]}
        </div>
    }

    inputRender(){
        const {pagination, selectedRows, selectedRowKeys } = this.state;
        let defaultDate=   new Date();
        defaultDate.setFullYear(new Date().getFullYear()-1);
        defaultDate.setMonth(9);
        defaultDate.setDate(1);
        return <div>
            <Form style={{"display":"flex",padding: "24px 0 0 24px"}}>
                <div style={{flex: 1,display:  'flex'}}>
                    <Popover placement={'bottomLeft'} content={this.filterContent()} trigger="hover">
                        <Button style={{"marginRight": 15,"top": 4}}>{"筛选"}</Button>
                    </Popover>
                    <Form.Item>
                        <Input  name="keywords" style={{width: 300}} placeholder={this.placeholder} defaultValue={pagination.keywords}/>
                    </Form.Item>
                    <Button  type="primary" onClick={this.handleSearch} style={{"position":"relative","left":15,"top":3}}>搜索</Button>
                </div>
            </Form>
            <div style={{position: 'relative',top: -15,left: 25}}>
                {
                    this.tagsRender()
                }
            </div>
        </div>
    }

    componentDidMount() {
        M.Component.TcpSocketClientList=this;
        this.fetch();
    };


    //获取数据
    async fetch() {
        this.setState({ loading: true,callVisable:false  });
            let { current,pageSize,keywords,order,filter ,startDate} = this.state.pagination;
            let r=await window.MIO.tcpSocketClientList({
                page: current,
                num: pageSize,
                keywords: keywords,
                startDate:startDate,
                order: order,
                ...filter
            })
            let total =r.data.length;
            const pagination = { ...this.state.pagination };
            pagination.total = total;
            this.setState({
                pagination,
                data: r.data,
                loading: false
        })
    }


    render() {
        return (
            <div>
                {this.inputRender()}
                <Table
                    rowKey={record => record.id}
                    columns={this.columns}
                    dataSource={this.state.data}
                    pagination={this.state.pagination}
                    loading={this.state.loading}
                    scroll={{ x: this.tableWidth, y: 1000 }}
                    onRowClick={this.handleTableClick}
                    rowSelection={this.rowSelection()}
                    onChange={this.handleTableChange} />

                {
                    this.state.callVisable?
                        <Drawer
                            onClose={()=>{this.setState({callVisable:false})}}
                            visible={this.state.callVisable}
                            getContainer={false}
                            destroyOnClose={true}
                            width={600}
                        >
                            <TcpSocketClientCallForm parent={this}/>
                        </Drawer>:""
                }


                    
            </div>
        )
    }


}











