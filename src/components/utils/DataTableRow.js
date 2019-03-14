import React from 'react';
import {
    DataTable,
    OverflowMenu,
    OverflowMenuItem,
    Link,
    TooltipIcon,
    Icon
} from 'carbon-components-react';
import Truncate from '../utils/Truncation';
import { splitNumber, round } from '../../libs/common';

const { TableRow, TableCell } = DataTable;

const generateCellContent = (value, useTruncate, balance) => {
    if (Array.isArray(value)) {
        return (
            <ul className="description-list">
                {value.map(({ name, value, link }) => {
                    return (
                        <li key={name} title={value}>
                            <span>{name}: </span>
                            {useTruncate
                                ? <Truncate text={value} />
                                : link ? <Link href={value} target='_blank' rel='noopener noreferrer'>{value}</Link> : value}
                        </li>
                    );
                })}
            </ul>
        );
    } else if (useTruncate) {
        return <Truncate text={value} />;
    } else if (balance) {
        return splitNumber(round(value, 2));
    }
    return value;
}

const DataTableRow = ({ row }) =>
    <TableRow>
        {row.cells.map(cell => {
            /*eslint indent: [2, 4, {"SwitchCase": 1}]*/
            switch (cell.value.type) {
                case 'tooltip':
                    return (
                        <TableCell key={cell.id}>
                            <div className="tooltip-wrapper">
                                <div className="resource-tablecell" title={generateCellContent(cell.value.value)}>
                                    {generateCellContent(cell.value.value, cell.value.truncate)}
                                </div>
                                {cell.value.memo && (
                                    <TooltipIcon tooltipText={cell.value.memo}>
                                        <Icon name='info--solid' width='16px' height='16px' description='' />
                                    </TooltipIcon>
                                )}
                            </div>
                        </TableCell>
                    );
                case 'link':
                    return (
                        <TableCell key={cell.id}>
                            <div className="resource-tablecell" title={generateCellContent(cell.value.value)}>
                                <Link href={cell.value.link}>
                                    {generateCellContent(cell.value.value, cell.value.truncate)}
                                </Link>
                                {cell.value.launchLink
                                    && <a href={cell.value.launchLink} target="_blank" rel="noopener noreferrer">
                                        <Icon
                                            name='launch'
                                            className='launch-icon'
                                            fill='#3d70b2'
                                            width='15px'
                                            height='15px'
                                            description={cell.value.launchLinkDesc} />
                                    </a>}
                            </div>
                        </TableCell>
                    );
                case 'action':
                    return (
                        <TableCell key={cell.id}>
                            <OverflowMenu
                                className="action-overflow"
                                ariaLabel=""
                                iconDescription=""
                                floatingMenu>
                                {cell.value.value.map(
                                    item => (
                                        <OverflowMenuItem
                                            key={item.id}
                                            disabled={item.disabled}
                                            onClick={() => item.onClick(item.payload)}
                                            itemText={item.itemText} />
                                    )
                                )}
                            </OverflowMenu>
                        </TableCell>
                    );
                default:
                    return (
                        <TableCell key={cell.id}>
                            <div className="resource-tablecell" title={generateCellContent(cell.value.value)}>
                                {generateCellContent(cell.value.value, cell.value.truncate, cell.value.balance)}
                            </div>
                        </TableCell>
                    );
            }
        })}
    </TableRow>

export default DataTableRow;
