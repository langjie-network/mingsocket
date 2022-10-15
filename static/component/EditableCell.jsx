import React from 'react';
import { Input } from 'antd';


const EditableFormRow = ({  ...props }) =>
{
    return (<tr { ...props} />);

}


class EditableCell extends React.Component {
    state = {
        editing: false
    };

    toggleEdit = () => {
        const editing = !this.state.editing;
        this.setState({ editing }, () => {
            if (editing) {
                this.input.focus();
            }
        });
    };

    save = e => {
        const { record, handleSave,dataIndex } = this.props;
        let v= this.input.state.value
        record[dataIndex]=v;
        handleSave(record,dataIndex);
        this.setState({
            editing:false
        })
    };

    renderCell = () => {

        const { children, dataIndex, record, title } = this.props;

        const { editing } = this.state;
        return editing ? (
            <Input defaultValue={record[dataIndex]} ref={node => (this.input = node)} onPressEnter={this.save.bind(this)} onBlur={this.save.bind(this)} />
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{ paddingRight: 24 }}
                onClick={this.toggleEdit}
            >
                {children}
            </div>
        );
    };

    render() {
        const {
            editable,
            dataIndex,
            title,
            record,
            index,
            handleSave,
            children,
            ...restProps
        } = this.props;
        return (
            <td {...restProps}>
                {editable ? (
                    <div>{this.renderCell()}</div>
                ) : (
                    children
                )}
            </td>
        );
    }
}

export  {EditableCell,EditableFormRow};