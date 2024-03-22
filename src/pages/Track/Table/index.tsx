import { Table} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import { TrackInfo } from '../../../model/response-model';
import './index.less';


interface props {
    key?: string;
    data: TrackInfo[];
    columns: ColumnsType<TrackInfo>;
    pagination: {};
    loading:boolean;
}

export default function MyTable(props: props) {
    const {data, columns, pagination,loading} = props;
    return (
        <div>
            <Table
                rowKey={record => {
                    return record.id;
                }}
                className="tack"
                dataSource={data}
                columns={columns}
                pagination={pagination}
                loading={loading}
            />
        </div>
    );
}
