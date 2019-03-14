import React, { Component } from 'react'
import { scaleBand, scaleLinear } from 'd3-scale'
import { ORDERBOOK_CONFIG } from '../../libs/constants'
import ResponsiveWrapper from './ResponsiveWrapper'
import { round } from '../../libs/common'
import Axes from './Axes'
import Bars from './Bars'


class BarChart extends Component {
    constructor() {
        super()
        this.yScale = scaleBand()
        this.xScale = scaleLinear()
    }

    render() {
        const { data, orientation, handleBarClick } = this.props;
        const { LEFT_ORIENTED, HORIZONTAL_RIGHT, HORIZONTAL_LEFT, BAR_HEIGHT } = ORDERBOOK_CONFIG;
        const margins = orientation === LEFT_ORIENTED ? { top: 50, right: 30, bottom: 100, left: 20 }
            : { top: 50, right: 20, bottom: 100, left: 30 }

        const svgDimensions = {
            width: Math.max(this.props.parentWidth, 400),
            height: data.length * BAR_HEIGHT + margins.top + margins.bottom
        }

        const maxValue = Math.max(...data.map(d => d.amount))

        // scaleBand type
        let xScale;
        if (orientation === LEFT_ORIENTED) {
            xScale = this.xScale
                .domain([0, maxValue])
                .range([svgDimensions.width - margins.right, margins.left])
        } else {
            xScale = this.xScale
                .domain([0, maxValue])
                .range([margins.left, svgDimensions.width - margins.right])
        }

        // scaleLinear type
        const yScale = this.yScale
            .domain(data.map(d => round(d.price, 2)))
            .range([svgDimensions.height - margins.bottom, margins.top])

        return (
            <svg width={svgDimensions.width} height={svgDimensions.height}>
                <Axes
                    scales={{ xScale, yScale }}
                    margins={margins}
                    svgDimensions={svgDimensions}
                    orientation={orientation}
                />
                <Bars
                    scales={{ xScale, yScale }}
                    margins={margins}
                    data={data}
                    maxValue={maxValue}
                    svgDimensions={svgDimensions}
                    orientation={orientation === LEFT_ORIENTED ? HORIZONTAL_LEFT : HORIZONTAL_RIGHT}
                    handleBarClick={handleBarClick}
                />
            </svg>
        )
    }
}

export default ResponsiveWrapper(BarChart);
