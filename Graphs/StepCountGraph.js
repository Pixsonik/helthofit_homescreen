import React, { Component } from 'react'
import { View, processColor, Dimensions } from 'react-native'
import Color from '../../Assets/Colors/Color';
import {BarChart } from 'react-native-chart-kit';
import { getUserData, logOut } from '../../Redux/Actions/ActionCreator';
import { connect } from 'react-redux';
import { getGraph } from '../../Server/Api'
import axios from 'axios';
import GoogleFit, { Scopes } from 'react-native-google-fit';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import moment from 'moment'
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

var weeklyGraphData = [20,80.800]

class StepCountGraph extends Component {
    constructor(props){
        super(props);


        this.state = {
          
          userID :'',

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
            decimalPlaces: 0,
            
          },  
            labels : [],        
            stategraphWeekly : [],
            weeklyGraph : [],
            monStepGraph: 0,
            tueStepGraph: 0,
            wedStepGraph: 0,
            thuStepGraph: 0,
            friStepGraph: 0,
            satStepGraph: 0,
            sunStepGraph: 0,
            data: {
                dataSets: [{
                  values: [
                    20
                  ],
                  label: 'Steps',
                  config: {
                    drawValues: false,
                    color: processColor(Color.primaryColor),
                    // barWidth: 0.5,
                    highlightAlpha: 90,
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
                centerAxisLabels: true,
                
              },

              yAxis: {
                valueFormatter: ["Mon", "Tue", "Wed","Thu", "Fri","Sat", "Sun"],
                granularityEnabled: true,
                granularity: 1,
                axisMaximum: 7,
                axisMinimum: 0,
                centerAxisLabels: true,
                
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

    componentDidMount(){

        this.setState({ userID : this.props.user.id })
        // this.getGraphsWeekly();
        
        // check(PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION).then(result => {
        //   switch (result) {
        //       case RESULTS.UNAVAILABLE:
        //           console.log('This feature is not available (on this device / in this context)');
        //           break;
        //       case RESULTS.DENIED:
        //           console.log('The permission has not been requested / is denied');
        //           request(PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION).then(() => {
        //               GoogleFit.startRecording(callback => {
        //                   console.log(callback);
        //               });
        //           });
        //           break;
        //       case RESULTS.GRANTED:
        //           console.log('The permission has not been requested / is');
        //           request(PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION).then(() => {
                      
        //               const options = {
        //                   scopes: [
        //                   //   Scopes.FITNESS_ACTIVITY_READ_WRITE,
        //                   //   Scopes.FITNESS_BODY_READ_WRITE,
        //                       Scopes.FITNESS_ACTIVITY_READ,
        //                       Scopes.FITNESS_ACTIVITY_READ_WRITE,
        //                       Scopes.FITNESS_BODY_READ,
        //                       Scopes.FITNESS_BODY_READ_WRITE,  
        //                   ],
        //               }
                        
        //                 GoogleFit.authorize(options.scopes)
        //                   .then(authResult => {
        //                     if (authResult.success) {
        //                       console.log("AUTH_SUCCESS");
        //                     } else {
        //                       console.log("AUTH_DENIED", authResult.message);
        //                     }
        //                 }).catch(() => {
        //                     console.log("AUTH_ERROR");
        //                 });

        //                 GoogleFit.checkIsAuthorized().then(() => {
        //                     console.log("is auth --> ",GoogleFit.isAuthorized) // Then you can simply refer to `GoogleFit.isAuthorized` boolean.
        //                 });

        //                 GoogleFit.startRecording((callback) => {
        //                     console.log("app startes recording ", callback);
        //                     this.getWeeklyStepCount()
        //                 })

        //               });
        //           }
        //   });
        console.log("weekly graph in compodidMount ---> ", this.props.user.id );
        
    }

    getGraphsWeekly = () => {
        const url = getGraph()
        var body = {
          user_id : this.props.user.id,
          graph_type : 'step_count',
          graph_timing : 'current_week'
        }

        axios.post(url,body).then((resp) => {
          // console.log("graphs --> ", resp.data.data);
          this.setState({ stategraphWeekly : resp.data.data })
          // stategraphWeekly
          // weeklyGraphData.push(item)
        }).catch((errr)=> {
          console.log("err---> ", errr);
        })
    }

    getWeeklyStepCount = () => {
      var today = new Date();
      var lastWeekDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 8,
      );
      const opt = {
      startDate: lastWeekDate.toISOString(), // required ISO8601Timestamp
      endDate: today.toISOString(), // required ISO8601Timestamp
      bucketUnit: 'DAY', // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
      bucketInterval: 1, // optional - default 1.
      };
      
      GoogleFit.getWeeklySteps(opt).then((resp) => {
          if (resp.length !== 0) {
              for (var i = 0; i < resp.length; i++) {
                if (resp[i].source === 'com.google.android.gms:estimated_steps') {
                  var dailyStepCount = []
                  let data = resp[i].steps.reverse();
                  dailyStepCount = resp[i].steps;
                  // console.log(" weekly steps  ---> ", dailyStepCount);
                  this.setState({ monStepGraph : data[0].value, tueStepGraph : data[1].value, weeklyGraph : dailyStepCount  })
                  // console.log("weekly steps in state ----> ", this.state.weeklyGraph);
                }
              }
            } else {
              console.log('Not Found in wekly steps');
            }
      }).catch((err) => {
          console.log("error in weekly steps --> ", err);
      })
  }

  getWeekLabels = () => {
    console.log("date  ---->  ", this.state.weeklyGraph);
  }

  render() {
    // console.log(" ---====>  ", this.state.monStepGraph, this.state.tueStepGraph);
    return (
      <View style={{ flex: 1, }}>
           {/* <BarChart
                style={{ height: 250, }}
                xAxis={this.state.xAxis}
                yAxis={this.state.yAxis}
                data={this.state.data}
                legend={this.state.legend}
                // drawValueAboveBar={false}
                // onSelect={this.handleSelect.bind(this)}
                onChange={(event) => console.log(event.nativeEvent)}
                highlights={this.state.highlights}
                marker={this.state.marker}
                drawBarShadow={false}
                drawValueAboveBar={true}
                drawHighlightArrow={true}
                
            /> */}
           
                {/* <BarChart
                    // style={{ height: 280 }}
                    data={{
                        labels: [ "Mon", "Tue", "Wed", "Thu", "Fri", "Sat","Sun"],
                        // labels: [
                        //   this.state.weeklyGraph.map(item => {
                        //     return(
                        //       moment(item.date).format('dddd').slice(0,3).toString()
                        //     )
                        //   })
                        // ],
                        datasets: [
                          {
                            data: this.state.weeklyGraph.map(item => {
                              return(
                                item.value 
                              )
                            })
                          }
                        ]
                    }}
                    width={Dimensions.get('window').width/1.1}
                    height={220}
                    chartConfig={this.state.chartConfig}
                    showBarTops={false}
                    fromZero={true}
                    withInnerLines={true}
                    yLabelsOffset={25}
                    segments={5}
                    spacingInner={0.8}

                    // withDots={true}
                    spacing={0.2}
                    // yAxisLabel={50}
                    // yAxisInterval={5}
                    // verticalLabelRotation={30}
                  /> */}

              <WebView
                source={{html: `<iframe src="https://paybycal.com/api/widgets.php?data=stepcount_${this.props.user.id}" style="width:100%;height:100%;" frameborder="0" scrolling="yes"></iframe>` }}
                style={{ height: 160}}
              />
      </View>
    )
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(StepCountGraph);

