import React, { Component } from 'react'
import { View, processColor } from 'react-native'
import { LineChart } from 'react-native-charts-wrapper';
import Color from '../../Assets/Colors/Color';
import { getUserData, logOut } from '../../Redux/Actions/ActionCreator';
import { connect } from 'react-redux';
import WebView from 'react-native-webview';

const mapStateToProps = (state) => {
    return {
        login: state.login,
        user: state.user,
    };
  };
  
  const mapDispatchToProps = (dispatch) => ({
    logOut: () => dispatch(logOut()),
    getUserData: (customerId) => dispatch(getUserData(customerId)),
  });

  class WeightGraph extends Component {
    constructor(props){
        super(props);

        this.state = {
            data: {
                dataSets: [{
                values: [5, 40, 77, 81, 43, 50 , 90],
                label: 'Steps',
                config: {
                    drawValues: false,
                    color: processColor(Color.primaryColor),
                    // barWidth: 0.5,

                }
                
                }],
                config: {
                    mode: "CUBIC_BEZIER",
                    drawValues: false,
                    lineWidth: 1,
                    drawCircles: true,
                    circleColor: processColor('red'),
                    drawCircleHole: false,
                    circleRadius: 5,
                    highlightColor: processColor("transparent"),
                    color: processColor('red'),
                    drawFilled: true,
                    fillGradient: {
                    colors: [processColor('red'), processColor('blue')],
                    positions: [0, 0.5],
                    angle: 90,
                    orientation: "TOP_BOTTOM"
                    },
                    fillAlpha: 1000,
                    barWidth: 0.6,
                    
                }
            },

            xAxis: {
                valueFormatter: ["Jan", "Feb", "Mar","Apr", "May","Jun", "Jly"],
                granularityEnabled: true,
                granularity: 1,
                axisMaximum: 7,
                axisMinimum: 0,
                centerAxisLabels: false
            },
        
            marker: {
                enabled: true,
                markerColor: processColor(Color.primaryColor),
                textColor: processColor('#fff'),
                markerFontSize: 14,
            },
            legend: {
                enabled: false,
                textSize: 14,
                form: 'SQUARE',
                formSize: 14,
                xEntrySpace: 10,
                yEntrySpace: 5,
                formToTextSpace: 5,
                wordWrapEnabled: true,
                maxSizePercent: 0.5
            },
        }
    }
render() {
    return (
    <View style={{ flex: 1 }}>
        {/* <LineChart
            style={{ height: 250 }}
            data={this.state.data}
            chartDescription={{text: ''}}
            legend={this.state.legend}
            marker={this.state.marker}
            xAxis={this.state.xAxis}            
            drawGridBackground={false}
            borderColor={processColor('teal')}
            borderWidth={1}
            drawBorders={true}
            autoScaleMinMaxEnabled={false}
            touchEnabled={true}
            dragEnabled={true}
            scaleEnabled={true}
            scaleXEnabled={true}
            scaleYEnabled={true}
            pinchZoom={true}
            doubleTapToZoomEnabled={true}
            highlightPerTapEnabled={true}
            highlightPerDragEnabled={false}
            // visibleRange={this.state.visibleRange}
            dragDecelerationEnabled={true}
            dragDecelerationFrictionCoef={0.99}
            ref="chart"
            keepPositionOnRotation={false}
            // onSelect={this.handleSelect.bind(this)}
            onChange={(event) => console.log(event.nativeEvent)}  
        /> */}

            <WebView
                source={{html: `<iframe src="https://paybycal.com/api/widgets.php?data=weight_${this.props.user.id}" style="width:100%;height:100%;" frameborder="0" scrolling="yes"></iframe>` }}
                style={{ height: 160}}
            />
    </View>
    )
}
}

export default connect(mapStateToProps,mapDispatchToProps)(WeightGraph);


