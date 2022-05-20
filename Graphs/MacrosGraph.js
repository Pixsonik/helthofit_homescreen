import React, { Component } from 'react'
import { View, processColor } from 'react-native'
import {BarChart} from 'react-native-charts-wrapper';
import { getGraph } from '../../Server/Api';
import { getUserData, logOut } from '../../Redux/Actions/ActionCreator';
import { connect } from 'react-redux';
import axios from 'axios';
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


class MacrosGraph extends Component {
    constructor() {
        super();
    
        this.state = {


          userID : '',

          legend: {
            enabled: true,
            textSize: 14,
            form: "SQUARE",
            formSize: 14,
            xEntrySpace: 10,
            yEntrySpace: 5,
            wordWrapEnabled: true
          },
          data: {
            dataSets: [{
              values: [5, 40, 77, 81, 43, 55, 99],
              label: 'Fats',
              
              config: {
                drawValues: false,
                colors: [processColor('#5F7BDE')],
                
              },
              
              
            }, {
              values: [40, 5, 50, 23, 79, 99, 100],
              label: 'Carbs',
              config: {
                drawValues: false,
                colors: [processColor('#FACE46')],
              }
            }, {
              values: [10, 55, 35, 90, 82,88 ,33 ],
              label: 'Protien',
              config: {
                drawValues: false,
                colors: [processColor('#29D67F')],
              }
            }],
            config: {
              barWidth: 0.1,
              group: {
                fromX: 0,
                groupSpace: 0.4,
                barSpace: 0.1,
              },
            }
          },
          xAxis: {
            valueFormatter: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            granularityEnabled: true,
            granularity: 1,
            axisMaximum: 7,
            axisMinimum: 0,
            centerAxisLabels: true
          },
    
          marker: {
            enabled: true,
            markerColor: processColor('#F0C0FF8C'),
            textColor: processColor('white'),
            markerFontSize: 14,
          },

          
          isLodaing : false,
          macrosWeekly: [],

        };
      }

      componentDidMount(){
        this.getGraphsWeekly()
        this.setState({ userID : this.props.user.id })
        console.log("graph user data --->  ", this.props.user.id);
    }

    getGraphsWeekly = () => {
        this.setState({ isLodaing : true })
        const url = getGraph()
        var body = {
          user_id : this.props.user.id,
          graph_type : 'macronic',
          graph_timing : 'current_week'
        }

        axios.post(url,body).then((resp) => {
          console.log("calorie intake --> ", resp.data.data);
          this.setState({ macrosWeekly : resp.data.data, isLodaing : false })
          // stategraphWeekly
          // weeklyGraphData.push(item)
        }).catch((errr)=> {
          console.log("err---> ", errr);
        })
    }
  render() {
    return (
        <View style={{ flex: 1 }}>
            {/* <BarChart
                style={{ height: 250 }}
                xAxis={this.state.xAxis}
                data={this.state.data}
                legend={this.state.legend}
                drawValueAboveBar={false}
                // onSelect={this.handleSelect.bind(this)}
                onChange={(event) => console.log(event.nativeEvent)}
                highlights={this.state.highlights}
                marker={this.state.marker}
            /> */}

              <WebView
                source={{html: `<iframe src="https://paybycal.com/api/widgets.php?data=macronic_${this.props.user.id}" style="width:100%;height:100%;" frameborder="0" scrolling="yes"></iframe>` }}
                style={{ height: 160}}
              />
        </View>
    )
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(MacrosGraph);