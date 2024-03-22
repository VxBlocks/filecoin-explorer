import { Pagination, Spin, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import { TableComponents } from "rc-table/lib/interface";
import { TableProps as RcTableProps } from "rc-table/lib/Table";
import { TableRowSelection } from "antd/es/table/interface";
import "./public.less"
// import {useScroll} from "../hooks/useScroll";

/**
 * @description
 * header: 表格标题
 * rowKey: 表格主键，如果需要增加过滤功能，或者排序等，会根据传入的rowKey进行规则判断；rowKey通常是ColumnsType表格配置的每列的key属性
 * tableDataTypeConfig：
 * @see https://ant.design/components/table-cn/#Column
 * dataSource: 需要渲染的数据，渲染数据需与ColumnsType配置中定于的列属性规则相对应
 *
 * */

interface BlockListProps {
  rowKey: string
  tableDataTypeConfig: ColumnsType<any>
  dataSource: Object[]
  className?: string
  rowSelection?: TableRowSelection<any>
  loading?: boolean
  isSmallPagination?: boolean
  scroll?: RcTableProps['scroll'] & {
    scrollToFirstRowOnChange?: boolean;
  }
}

// @ts-ignore
const Tabulation = (props: BlockListProps) => {
  const { rowKey, tableDataTypeConfig, loading, className, isSmallPagination, dataSource, rowSelection, scroll } = props

  /**
   * @constructor
   * 设置表格初始渲染的属性值
  * */
  const [page, setPage] = useState({
    page: 1,
    pageSize: 50,
    blockCount: dataSource.length,
  })
  const [spDataSlice, setSpDataSlice] = useState({
    start: 0,
    end: 5
  })
  const navigate = useNavigate()
  /**
   * 表格分页器属性配置
   * */
  const pagingConfig: TablePaginationConfig = {
    defaultPageSize: 50,                // 如果当pageSize为没有定义时，初始的表格单页展示数据大小为50
    total: page.blockCount,             // 总数据量
    defaultCurrent: 1,
    hideOnSinglePage: true,            // 只有一页数据时是否隐藏分页器
    responsive: true,                   //
    pageSize: page.pageSize,
    current: page.page,                 // 当前的页码
    position: ["bottomCenter"],         // 分页器显示位置
    showLessItems: true,
    pageSizeOptions: [20, 50, 100],     // 用户可设置的单页显示条数
    showQuickJumper: true,
    showSizeChanger: false,
  }
  //   const {backTop} = useScroll()
  return (
    <>
      <Table className={className} loading={loading} style={{ borderRadius: '8px' }} scroll={scroll} rowKey={rowKey} columns={tableDataTypeConfig} 
        dataSource={isSmallPagination? dataSource.slice(spDataSlice.start, spDataSlice.end) : dataSource} pagination={isSmallPagination ? false : pagingConfig} rowSelection={rowSelection} onChange={(pagination) => {
          // backTop()
          setPage({
            ...page,
            pageSize: pagination.pageSize ? pagination.pageSize : 50,
            page: pagination.current ? pagination.current : 0,
          })
        }} />
      {isSmallPagination &&
        <Pagination
          className={'small_pagination'}
          size="small"
          onChange={(pg, pageSize) => {
            setPage({
              ...page,
              page: pg,
            })
            setSpDataSlice({
              start: pg * pageSize - pageSize ,
              end: pg * pageSize
            })
          }}
          showSizeChanger={false}
          total={page.blockCount}
          current={page.page}
          pageSize={5} />}

    </>
  )
}


export default Tabulation;