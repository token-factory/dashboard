import { ORDERBOOK_CONFIG } from '../../libs/constants'
import React from 'react'
import Axis from './Axis'

export default ({ scales, margins, svgDimensions, orientation }) => {
    const { height, width } = svgDimensions

    const xPropsRight = {
        orient: 'Top',
        scale: scales.xScale,
        translate: `translate(0, ${margins.top - 1})`,
        tickSize: height - margins.top - margins.bottom,
    }

    const yPropsRight = {
        orient: 'Left',
        scale: scales.yScale,
        translate: `translate(${margins.left - 1}, 0)`,
        tickSize: width - margins.left - margins.right,
    }

    const xPropsLeft = {
        orient: 'Top',
        scale: scales.xScale,
        translate: `translate(0, ${margins.top - 1})`,
        tickSize: height - margins.top - margins.bottom
    }

    const yPropsLeft = {
        orient: 'Right',
        scale: scales.yScale,
        translate: `translate(${width - margins.right}, 0)`,
        tickSize: width - margins.left - margins.right,
    }

    if (orientation === ORDERBOOK_CONFIG.RIGHT_ORIENTED) {
        return (
            <g>
                <Axis {...xPropsRight} />
                <Axis {...yPropsRight} />
            </g>
        )
    } else {
        return (
            <g>
                <Axis {...xPropsLeft} />
                <Axis {...yPropsLeft} />
            </g>
        )
    }
}
