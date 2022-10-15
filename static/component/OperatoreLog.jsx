import React, { Component } from 'react';
import {  Table,message,Icon } from 'antd';
import request from 'superagent';
import common from '../../public/js/common';


class OperatoreLog extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: '操作人',
                dataIndex: 'insert_person',
                key: 'insert_person',
            },
            {
                title: '操作时间',
                dataIndex: 'insert_time',
                key: 'insert_time',
            },
            {
                title: '操作类型',
                dataIndex: 'operator_type',
                key: 'operator_type',
            },
            {
                title: '操作内容',
                dataIndex: 'content',
                key: 'content',
            },
            {
                title: '备注',
                dataIndex: 'rem',
                key: 'rem',
            }
        ];
        this.state = {
            data: [],
            pagination: {   //搜索参数
                current: 1,
                pageSize: 5,
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



    async fetchOperalog(){
        const token = sessionStorage.getItem('token');
        let { current,pageSize} = this.state.pagination;
        return await new Promise(resolve => {
            request.get(common.baseUrl("/operatorLog/list/"))
                .set("token",token).query({
                    ownerId: this.props.ownerId,
                    parent_ownerId:this.props.parent_ownerId,
                    biz_name: this.props.biz_name,
                    page: current,
                    num: pageSize,
                 }).end((err,res) => {
                    let data=  res.body.data.rows
                    const pagination = { ...this.state.pagination };
                    pagination.total = res.body.data.count;
                    this.setState({data,pagination})
                })
        })

    }



    componentDidMount(){
        this.fetchOperalog()
    }

    //分页
    handleTableChange(pagination){
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
            pagination: pager
        },() => {
            this.fetchOperalog()
        });
    }

    render(){
        return <div>
            <Table dataSource={this.state.data}  columns={this.columns}  pagination={this.state.pagination}   onChange={this.handleTableChange.bind(this)} />
        </div>
    }
}

export default OperatoreLog;