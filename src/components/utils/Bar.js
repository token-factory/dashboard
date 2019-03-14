import React, { Component } from 'react'
import { ORDERBOOK_CONFIG } from '../../libs/constants'

const { BIDS_COLOR, ASKS_COLOR, BIDS_COLOR_HOVER, ASKS_COLOR_HOVER, HORIZONTAL_LEFT, BIDS, ASKS } = ORDERBOOK_CONFIG;

const TEXT_PADDING = 5;

const initialState = {
    offer: undefined,
    barColor: undefined,
}

class Bar extends Component {
    constructor(props) {
        super(props)
        this.state = initialState;
    }

    componentWillMount() {
        const { orientation } = this.props;
        let barColor;
        let offer;
        if (orientation === HORIZONTAL_LEFT) {
            barColor = BIDS_COLOR;
            offer = BIDS;
        } else {
            barColor = ASKS_COLOR;
            offer = ASKS;
        }
        this.setState({
            offer: offer,
            barColor: barColor
        })
    }

    onHover(hover) {
        const barColor = this.state.barColor;
        let nextColor;
        if (hover) {
            nextColor = barColor === BIDS_COLOR ? BIDS_COLOR_HOVER : ASKS_COLOR_HOVER;
            document.body.style.cursor = 'pointer';
        } else {
            nextColor = barColor === BIDS_COLOR_HOVER ? BIDS_COLOR : ASKS_COLOR;
            document.body.style.cursor = 'default';
        }
        this.setState({ barColor: nextColor });
    }

    render() {
        const { x, y, barWidth, height, price, amount, handleBarClick, orientation } = this.props;
        const textSettings = {
            x: orientation === HORIZONTAL_LEFT ? x + TEXT_PADDING : x + barWidth - TEXT_PADDING,
            textAnchor: orientation === HORIZONTAL_LEFT ? 'start' : 'end',
            y: y,
            dy: '1rem',
        };
        const bar = (<rect
            x={x}
            y={y}
            width={barWidth}
            height={height}
            fill={this.state.barColor}
            onMouseEnter={() => this.onHover(true)}
            onMouseLeave={() => this.onHover(false)}
            onClick={() => {
                handleBarClick(price, amount, this.state.offer);
            }}
        />);
        const text = <text {...textSettings}>{Math.round(amount)}</text>
        return <g>
            {bar}
            {text}
        </g>;
    }
}

export default Bar;
