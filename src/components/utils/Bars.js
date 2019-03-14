import React from 'react';
import { ORDERBOOK_CONFIG } from '../../libs/constants';
import { round } from '../../libs/common';
import Bar from './Bar';

import '../../style/scss/bar.scss'

const Bars = ({ scales, data, margins, orientation, svgDimensions, handleBarClick }) => {
    const { xScale, yScale } = scales
    const { width } = svgDimensions
    const barsHorizontal = (data.map(datum => {
        const { price, amount } = datum;
        const y = yScale(round(price, 2));
        const height = yScale.bandwidth();
        let x;
        let barWidth;
        if (orientation === ORDERBOOK_CONFIG.HORIZONTAL_LEFT) {
            barWidth = width - margins.right - xScale(amount);
            x = width - barWidth - margins.right;
        } else {
            x = margins.left;
            barWidth = xScale(amount) - margins.left;
        }
        return (
            <Bar
                key={`${price}-${amount}-bar`}
                x={x}
                y={y}
                barWidth={barWidth}
                height={height}
                price={price}
                amount={amount}
                orientation={orientation}
                handleBarClick={handleBarClick}
            />
        )
    }));
    return (
        <g>{barsHorizontal}</g>
    );
}

export default Bars;
