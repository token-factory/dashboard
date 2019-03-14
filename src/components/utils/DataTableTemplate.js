import React, { Component, Fragment } from 'react';
import {
    DataTable,
    DataTableSkeleton,
    PaginationV2,
    InlineNotification,
    Button,
    Icon
} from 'carbon-components-react';
import DataTableRow from './DataTableRow';
import AssetCard from '../account/AssetCard';
import '../../style/scss/table.scss';
import lodash from 'lodash'
import { SORT_ORDER, REQUEST_STATUS } from '../../libs/constants'
import { iconGrid, iconList } from 'carbon-icons'

const {
    TableContainer,
    TableToolbar,
    TableToolbarContent,
    TableToolbarSearch,
    TableToolbarAction,
    Table,
    TableHead,
    TableRow,
    TableBody,
} = DataTable;

const PAGE_SIZES = {
    DEFAULT: 10,
    VALUES: [10, 20, 30]
};

const initialState = {
    page: 1,
    pageSize: PAGE_SIZES.DEFAULT,
    showAddNew: false,
    searchValue: undefined,
    sortDirection: undefined,
    sortColumn: undefined,
    format: 'grid'
};

const TableErrorNotification = (
    <InlineNotification
        kind="error"
        title="Error"
        subtitle="An unexpected error occurred. Please try again."
    />
);

const EmptySearchNotification = (
    <InlineNotification
        className='empty-search'
        kind='info'
        title='No results found.'
        subtitle='Try modifying the search keywords.'
        iconDescription='Empty search notification'
    />
)

export default class DataTableTemplate extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
        this.generateTableBody = this.generateTableBody.bind(this);
    }
    filterByPage(rows) {
        const { page, pageSize } = this.state;
        const pageStart = (page - 1) * pageSize;
        const pageEnd = pageStart + pageSize;
        return rows.slice(pageStart, pageEnd);
    }
    getFilteredRows(rows, searchValue) {
        const newFilteredRows = [];
        if (!searchValue) {
            // return original table row data if search value is cleared
            return rows;
        }
        rows.forEach(row => {
            Object.keys(row).forEach(column => {
                const value = row[column] && row[column].value
                if (value && typeof value === 'string') {
                    if (value.toLowerCase().includes(searchValue.toLowerCase())) {
                        newFilteredRows.push(row);
                    }
                }
            });
        });
        return lodash.uniq(newFilteredRows);
    }
    getSortedRows(rows, sortColumn, sortDirection) {
        return lodash.orderBy(rows, row => row[sortColumn] && row[sortColumn].value, [sortDirection]);
    }
    searchTable(searchValue) {
        this.setState({
            searchValue: searchValue ? searchValue : initialState.searchValue,
            page: 1
        });
    }
    sortTable(e) {
        const target = e.currentTarget;
        if (target) {
            const { sortDirection } = this.state;
            const newSortColumn = target.getAttribute('data-header-key');
            const newSortDirection = sortDirection === SORT_ORDER.ASC ? SORT_ORDER.DESC : SORT_ORDER.ASC;
            this.setState({
                sortDirection: newSortDirection,
                sortColumn: newSortColumn
            });
        }
    }
    changeTablePage(event) {
        const { page, pageSize } = event;
        this.setState({
            page,
            pageSize
        });
    }
    getActionButton() {
        const { addNewButtonText, addNewButton, addNewClick, addNewComponent } = this.props;
        let addButton;
        if (addNewComponent) {
            addButton = (
                <Button onClick={() => addNewClick()} small kind='primary'>
                    {addNewButtonText}
                </Button>
            );
        } else if (addNewButton) {
            addButton = addNewButton;
        }
        return addButton;
    }

    tableFormatChange() {
        const nextFormat = this.state.format === 'grid' ? 'list' : 'grid';
        this.setState({ format: nextFormat })
    }

    generateTableBody(rows, headers, gridView, format, publicKey, sortDirection, sortColumn) {
        //Render CardView
        if (gridView && format === 'grid') {
            return (<div className='cardview-grid bx--grid'>
                <div className='bx--row'>
                    {rows.map((row, i) => {
                        const cells = row.cells;
                        return <AssetCard
                            // eslint-disable-next-line react/no-array-index-key
                            key={`${row.id}-${i}-card`}
                            assetCode={cells[0].value.value}
                            assetIssuer={cells[1].value.value}
                            assetBalance={cells[2].value.value}
                            publicKey={publicKey}
                        />
                    })}
                </div>
            </div>);
        } else { //Render Table View
            return <Table className="resource-table">
                <TableHead>
                    <TableRow>
                        {headers.map(header => (
                            <th scope='col' key={header.key}>
                                {header.key !== 'action'
                                    && <button
                                        onClick={e => this.sortTable(e)}
                                        type="button"
                                        title="Sort table column"
                                        data-header-key={header.key}
                                        className={`bx--table-sort-v2${sortDirection === 'asc' ? ' bx--table-sort-v2--ascending' : ''}${sortColumn === header.key ? ' bx--table-sort-v2--active' : ''}`}>
                                        <span className="bx--table-header-label">{header.header}</span>
                                        <Icon
                                            name="caret--up"
                                            className="bx--table-sort-v2__icon"
                                            description="Sort table column" />
                                    </button>}
                            </th>
                        ))
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(rows.map((row, i) => {
                        // eslint-disable-next-line react/no-array-index-key
                        return <DataTableRow row={row} key={`${row.id}-${i}`} />;
                    }))}
                </TableBody>
            </Table>
        }
    }

    render() {
        const {
            addNewComponent,
            addNewModalShow,
            headers,
            title,
            tableStatus,
            paginationId,
            rows,
            gridView,
            publicKey
        } = this.props;
        const { searchValue, sortDirection, sortColumn, page, pageSize, format } = this.state;
        const sortedRows = (sortColumn && sortDirection) ? this.getSortedRows(rows, sortColumn, sortDirection) : rows;
        const filteredBySearchRows = this.getFilteredRows(sortedRows, searchValue);

        const DataTableComponent = (
            <Fragment>
                <DataTable
                    rows={this.filterByPage(filteredBySearchRows)}
                    headers={headers}
                    render={({ rows, headers }) => (
                        <TableContainer>
                            {title && <h4 className="bx--data-table-v2-header">{title}</h4>}
                            <TableToolbar>
                                <TableToolbarSearch onChange={e => this.searchTable(e.target && e.target.value)} name="search" />
                                {gridView ? (<TableToolbarAction
                                    className='table-layout-switch'
                                    icon={format === 'grid' ? iconList : iconGrid}
                                    iconDescription='Toggle layout'
                                    onClick={() => this.tableFormatChange()}
                                />) : null}
                                <TableToolbarContent>
                                    {this.getActionButton()}
                                </TableToolbarContent>
                            </TableToolbar>
                            {/* TODO: popup modle embeded in table, probably not ideal */}
                            {addNewComponent && addNewModalShow ? addNewComponent : null}

                            {rows.length === 0 ? (EmptySearchNotification)
                                : (this.generateTableBody(rows, headers, gridView, format, publicKey, sortDirection, sortColumn))}
                        </TableContainer>)
                    }
                />
                {(filteredBySearchRows.length !== 0) && (!gridView || format !== 'grid') ? (
                    <PaginationV2
                        id={paginationId || 'data-table-pagination'}
                        onChange={event => this.changeTablePage(event)}
                        pageSize={pageSize || PAGE_SIZES.DEFAULT}
                        pageSizes={PAGE_SIZES.VALUES}
                        totalItems={filteredBySearchRows.length}
                        page={page}
                        disabled={pageSize >= filteredBySearchRows.length}
                        isLastPage={pageSize >= filteredBySearchRows.length}
                        pageInputDisabled={pageSize >= filteredBySearchRows.length}
                    />
                ) : null}

            </Fragment>
        );

        return (
            <div className="resource-table">
                {tableStatus === REQUEST_STATUS.LOADING ? <DataTableSkeleton /> : null}
                {tableStatus === REQUEST_STATUS.ERROR ? TableErrorNotification : null}
                {tableStatus === REQUEST_STATUS.SUCCESS ? DataTableComponent : null}
            </div>
        );
    }
}
