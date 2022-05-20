import axios from 'axios';
import React, { Component } from 'react'
import { View, processColor, Dimensions, Text } from 'react-native'
import { LineChart } from 'react-native-chart-kit';
import Color from '../../Assets/Colors/Color';
import { getGraph } from '../../Server/Api';
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

 class CaloireBurn extends Component {
    constructor(props){
        super(props);

        this.state = {
            userID : '',
            chartConfig : {
                backgroundGradientFrom: "#fff",
                backgroundGradientFromOpacity: 1,
                backgroundGradientTo: "#fff",
                backgroundGradientToOpacity: 1,
                color: (opacity = 100) => `rgba(249, 91, 48, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(000, 000, 000, ${opacity})`,
                
                strokeWidth: 1, // optional, default 3
                barPercentage: 0.5,
                useShadowColorFromDataset: false ,// optional
                fillShadowGradientFrom : '#F95B30',
                fillShadowGradientTo : '#F95B30',
                fillShadowGradientOpacity : 10,
                decimalPlaces: 0
            }, 

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
                valueFormatter: ["Mon", "Tue", "Wed","Thu", "Fri","Sat", "Sun"],
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

            calorieBurnWeekly : [],
            isLodaing: false,
        }
    }

    componentDidMount(){
        this.getGraphsWeekly()
        this.setState({ userID : this.props.user.id })
        console.log(" in calories burn ---> ", this.props.user.id);
    }

    getGraphsWeekly = () => {
        this.setState({ isLodaing : true })
        const url = getGraph()
        var body = {
          user_id : this.props.user.id,
          graph_type : 'calories_burn',
          graph_timing : 'current_week'
        }

        axios.post(url,body).then((resp) => {
          console.log("calorie burn --> ", resp.data.data);
          this.setState({ calorieBurnWeekly : resp.data.data, isLodaing : false })
          // stategraphWeekly
          // weeklyGraphData.push(item)
        }).catch((errr)=> {
          console.log("err---> ", errr);
        })
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

            {/* {
                this.state.calorieBurnWeekly.length === 0 ? <Text>NO Graph available</Text> :
                // <ActivityIndicator size="large" color={Color.primaryColor} /> : 
                <LineChart
                data={{
                    labels: [ "Mon", "Tue", "Wed", "Thu", "Fri", "Sat","Sun"],
                    // labels: [
                    //   this.state.weeklyGraph.map(item => {
                    //     return(
                    //       moment(item.date).format('dddd').slice(0,2)
                    //     )
                    //   })
                    // ],
                    datasets: [
                      {                        
                        // data: [50,91,80,630]
                        data : this.state.calorieBurnWeekly.map((data) => {
                            return(
                                data.total_calories_burn
                            )
                        })
                      }
                    ]
                }}
                width={Dimensions.get('window').width/1.1}
                height={250}
                // verticalLabelRotation={30}
                chartConfig={this.state.chartConfig}
                bezier
                showBarTops={false}
                fromZero={true}
                withInnerLines={true}
                yLabelsOffset={25}
            
            />
            } */}

            <WebView
                source={{html: `<iframe src="https://paybycal.com/api/widgets.php?data=caloriesgain_${this.state.userID}" style="width:100%;height:100%;" frameborder="0" scrolling="yes"></iframe>` }}
                style={{ height: 160}}
            />


    </View>
    )
}
}


export default connect(mapStateToProps, mapDispatchToProps)(CaloireBurn);