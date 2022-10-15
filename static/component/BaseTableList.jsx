
/**
 *  Abstract Class
 */
class BaseTableList extends Component {
    constructor(props) {
        super(props);
        this.handleTableChange = this.handleTableChange.bind(this);
        this.handleTableClick = this.handleTableClick.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.orderChange = this.orderChange.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
        this.handleModalDefine = this.handleModalDefine.bind(this);
        this.handleModalCancel = this.handleModalCancel.bind(this);
        this.closeTag = this.closeTag.bind(this);
        this.tableRender = this.tableRender.bind(this);
        this.filter = [];
        this.actionWidth = 150;
        this.tableWidth = 172;
        this.actioncolumns = true;
        this.canRowSelection = false;
    }

    state = {
        data: [],       //fetch的数据源
        pagination: {   //搜索参数
            current: 1,
            pageSize: 10,
            keywords: '',
            order: '',
            filter: {},
            total: 0,
            showSizeChanger: true,
            pageSizeOptions: ['10','30','50','100','500'],
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
    }

    //获取数据
    async fetch() {
        this.setState({ loading: true });
        let { current,pageSize,keywords,order,filter } = this.state.pagination;
        let r=await window.M.request.get(this.fetchUrl,{
            page: current,
            num: pageSize,
            keywords: keywords,
            order: order,
            filter: JSON.stringify(filter)
        })
        let total =r.data.total;
        const pagination = { ...this.state.pagination };
        pagination.total = total;
        this.setState({
            pagination,
            data: r.data.dataList,
            loading: false
        })
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

    //搜索
    handleSearch(){
        let keywords = $('input[name=keywords]').val();
        let pagination = this.state.pagination;
        pagination.keywords = keywords;
        pagination.current = 1;
        this.setState({
            pagination,
            selectedRowKeys: [],
            selectedRows: [],
        },() => {
            this.fetch();
        });
    }

    //点击排序
    orderChange(v){
        let pagination = this.state.pagination;
        pagination.order = v;
        pagination.current = 1;
        this.setState({
            pagination
        },() => this.fetch());
    }

    //新增
    handleCreate(){
        M.SetStateSession(this.state);
        hashHistory.push({
            pathname: this.addPathName,
            state: {
                scoreGoodsList:this.state.scoreGoodsList
            }
        });
    }

    //分页
    handleTableChange(pagination){
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
            pagination: pager
        },() => {
            this.fetch();
        });
    }

    //表格点击
    handleTableClick(record, index, e){

    }

    handleModalDefine(){

    }

    handleModalCancel(){
        
    }

    componentDidMount() {
        this.fetch();
    };



    componentDidUpdate(){


    }

    filterContent(){
        const { pagination,  } = this.state;
        if(JSON.stringify(pagination.filter)=='{}') return <div></div>;
        const tagOptions = ['头像','配置'];
        return <div>
            <div style={{padding: '5px 0px 5px 0px'}}>
                <span style={{fontWeight: 'bolder'}}>{"标签："}</span>
                <CheckboxGroup options={tagOptions} value={pagination.filter.tag_name_list.split(',')} onChange={(v) => this.filterType('tag_name_list',v)} />
            </div>
        </div>
    }

    actionRender(text, row, index) {
        return(
            <p >
                <a href="javascript:void(0)" onClick={()=>{
                    this.edit(row);
                }} style={{marginLeft: 10}} >编辑</a>
            </p>
        )
    }

    viewRender(key,res_data,text, row, index){
        if(key=='album'){
            let albumArr;
            try{
                albumArr = row[key].split(',');
            }catch(e){  
                albumArr = [];
            }
            return(
                <div>
                    <p style={{width: res_data[key]['width']-32,margin: 0,"overflow": "hidden","textOverflow":"ellipsis","whiteSpace": "nowrap"}}>
                        {
                            albumArr.map((items,index) => {
                                if(items){
                                    let src = '/img/'+items;
                                    return(
                                        <a key={index} target={'_blank'} href={common.staticBaseUrl(src)}>
                                            <img style={{width: 35,height: 35,marginRight: 10}} src={common.staticBaseUrl(src)} />
                                        </a>
                                    )
                                }
                            })
                        }
                    </p>
                </div>
            )
        }else{
            return <p style={{width: res_data[key]['width']-32,margin: 0,"overflow": "hidden","textOverflow":"ellipsis","whiteSpace": "nowrap"}}>
                        <Tooltip placement="top" title={row[key]}>
                            {row[key]}
                        </Tooltip>
                    </p>
        }
    }



    inputRender(){
        const {pagination, selectedRows, selectedRowKeys } = this.state;
        return <div>
            <Form style={{"display":"flex",padding: "24px 0 0 24px"}}>
                <div style={{flex: 1,display:  'flex'}}>
                    <Popover placement={'bottomLeft'} content={this.filterContent()} trigger="hover">
                        <Button style={{"marginRight": 15,"top": 4}}>{"筛选"}</Button>
                    </Popover>
                    <Form.Item>
                        <Input  name="keywords" style={{width: 300}} placeholder={this.placeholder} defaultValue={pagination.keywords}/>
                    </Form.Item>
                    <Button type="primary" onClick={this.handleSearch} style={{"position":"relative","left":15,"top":3}}>搜索</Button>
                </div>
                <Button type="primary" onClick={this.handleCreate} style={{"position":"relative","top":3,marginRight: 60}}>新增</Button>
            </Form>
            <div style={{position: 'relative',top: -15,left: 25}}>
                {
                    this.tagsRender()
                }
            </div>
        </div>
    }



    filterType = (type,v) => {
        const { pagination } = this.state;
        let { filter } = pagination;
        pagination.current = 1;
        this.filter.forEach((items,index) => {
            if(type==items){
                try{
                    filter[items] = v.join();
                }catch(e){
                    filter[items] = v;
                }
            }
        });
        this.setState({
            pagination,
            selectedRowKeys: [],
            selectedRows: [],
        },() => this.fetch());
    }

    tagsRender(){
        const { pagination } = this.state;
        let allTagArr = [];
        try{
            this.filter.forEach((items,index) => {
                allTagArr = [...allTagArr,...pagination.filter[items].split(',')];
            });
        }catch(e){

        }
        const endArr = allTagArr.filter(items => items);
        return endArr.map(items => <Tag key={items} data-text={items} closable onClose={this.closeTag}>{items}</Tag>)
    }

    closeTag(e){
        e.preventDefault();
        // const v = $(e.target).prev().text();
        const v = $(e.target).parent().parent().attr('data-text');
        const { pagination } = this.state;
        this.filter.forEach((items,index) => {
            const _arr = pagination.filter[items].split(',');
            _arr.forEach((it,ind) => {
                if(it==v){
                    _arr.splice(ind,1);
                }
            });
            pagination.filter[items] = _arr.join();
        });
        this.setState({
            pagination,
            selectedRowKeys: [],
            selectedRows: [],
        },() => this.fetch());
    }

    expandedRowRender(){
        
    }

    tableRender(params){
        const {columns,data,tableWidth,b_height} = params;
        if (this.canRowSelection) {
            return <Table 
                    columns={columns} 
                    dataSource={data} 
                    pagination={this.state.pagination}
                    loading={this.state.loading}
                    scroll={{ x: tableWidth, y: b_height }} 
                    onRowClick={this.handleTableClick}
                    rowSelection={this.rowSelection()}
                    onChange={this.handleTableChange} />
        }
        return <Table 
                    columns={columns} 
                    dataSource={data} 
                    pagination={this.state.pagination}
                    loading={this.state.loading}
                    scroll={{ x: tableWidth, y: b_height }} 
                    onRowClick={this.handleTableClick}
                    onChange={this.handleTableChange} />
    }


    rowSelection = () => {
        const { selectedRowKeys } = this.state;
        return {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRowKeys,
                });
            },
            getCheckboxProps: record => ({
                name: record.id+"",
            }),
            onSelect: (record, selected, selectedRows, nativeEvent) => {
                let { selectedRows: globalSelectedRows } = this.state;
                if (selected) {
                    if (globalSelectedRows.length === 0) {
                        globalSelectedRows.push(record);
                    } else {
                        for (let i = 0; i < globalSelectedRows.length; i++) {
                            const items = globalSelectedRows[i];
                            if (items.id != record.id && i === globalSelectedRows.length - 1) {
                                globalSelectedRows.push(record);
                            }
                        }
                    }
                } else {
                    globalSelectedRows = globalSelectedRows.filter(items => items.id != record.id);
                }
                this.setState({
                    selectedRows: globalSelectedRows,
                });
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
                let { selectedRows: globalSelectedRows, selectedRowKeys } = this.state;
                const keyArr = changeRows.map(items => items.id);
                if (selected) {
                    selectedRowKeys = [...selectedRowKeys, ...keyArr];
                    globalSelectedRows = [...globalSelectedRows, ...changeRows];
                } else {
                    selectedRowKeys = selectedRowKeys.filter(key => keyArr.indexOf(key) === -1 );
                    globalSelectedRows = globalSelectedRows.filter(items => keyArr.indexOf(items.id) === -1 );
                }
                this.setState({
                    selectedRowKeys,
                    selectedRows: globalSelectedRows,
                });
            }
        }
    }

    clearSelectedRowKeys = () => {
        this.setState({
            selectedRowKeys: [],
            selectedRows: [],
        });
        this.handleSearch();
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
            </div>
        )
    }
    
}

