import React, { Component } from 'react';
import {  Table,message,Icon } from 'antd';
import common from '../../public/js/common';
import moment from "moment";


class OssFileList extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: '时间',
                dataIndex: 'gmt_create',
                key: 'gmt_create',
                render: (text, record) =>{
                    return <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>
                }
            },
            {
                title: '大小',
                dataIndex: 'capacity',
                key: 'capacity',
                render: (text, row, index) => {
                    if(text==null){
                        text=0;
                    }
                    text=Number.parseInt(text);
                    return <span>{common.humanFileCapacity(text)}</span>
                }
            },
            {
                title: '操作',
                dataIndex: 'id',
                key: 'id',
                render: (text, row, index) => {
                   return  <a href={row.oss_url}>下载</a>
                },
            }
        ];
        this.state = {
            data: [],
            pagination: {   //搜索参数
                current: 1,
                pageSize: 10,
                keywords: '',
                order: '',
                filter: {},
                total: 0,
                showSizeChanger: true,
                pageSizeOptions: ['5','10','30','50'],
                onShowSizeChange: (current, pageSize) => {
                    const { pagination } = this.state;
                    pagination.pageSize = pageSize;
                    this.setState({
                        pagination
                    });
                }
            },
        };
    }



    async fetchOssFileList(){
        let { current,pageSize} = this.state.pagination;
        let r=  await  window.M.request.get("/ossFile/listByPage",
            {
                owner_id: this.props.owner_id,
                biz_name: this.props.biz_name,
                page: current,
                num: pageSize,}
        );
        let data=  r.data.rows
        const pagination = { ...this.state.pagination };
        pagination.total = r.data.count;
        this.setState({data,pagination})
    }



    componentDidMount(){
        this.fetchOssFileList()
    }

    //分页
    handleTableChange(pagination){
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
            pagination: pager
        },() => {
            this.fetchOssFileList()
        });
    }

    render(){
        return <div>
            <Table dataSource={this.state.data}  columns={this.columns}  pagination={this.state.pagination}   onChange={this.handleTableChange.bind(this)} />
        </div>
    }
}

export default OssFileList;