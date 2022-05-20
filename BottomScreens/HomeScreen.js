import React, { Component } from 'react'
import { View, Image, ScrollView, StatusBar, SafeAreaView, StyleSheet, processColor ,RefreshControl ,Text, Dimensions, ImageBackground,  ToastAndroid, PermissionsAndroid, Modal  } from 'react-native'
import { Header, Icon } from 'react-native-elements'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Color from '../../Assets/Colors/Color'
import DashboardLeftHeaderComponent from '../../Components/DashboardLeftHeaderComponent'
import RightHeaderComponents from '../../Components/RightHeaderComponents'
import { AnimatedCircularProgress } from 'react-native-circular-progress';
// import { BarChart, LineChart, ProgressChart, } from "react-native-chart-kit";
import Svg, { Circle, Line } from 'react-native-svg'
import Carousel from 'react-native-snap-carousel'
import GoogleFit, { Scopes } from 'react-native-google-fit'
import notifee from '@notifee/react-native';
import { fetchArticles, fetchArticlesList, getAds, getCalBurn, getCalIntake, getUserProfile, insertStep } from '../../Server/Api'
import axios from 'axios'
import {BarChart, CombinedChart, LineChart} from 'react-native-charts-wrapper';
import { startCounter, stopCounter } from 'react-native-accurate-step-counter';
import auth from '@react-native-firebase/auth'
import AsyncStorage from '@react-native-community/async-storage'
import moment from 'moment'
import Pedometer  from "react-native-pedometer";
import { getUserData, logOut } from '../../Redux/Actions/ActionCreator'
import { connect } from 'react-redux'
import StepCountGraph from '../Graphs/StepCountGraph'
import CalorieIntake from '../Graphs/CalorieIntake'
import MacrosGraph from '../Graphs/MacrosGraph'
import CaloireBurn from '../Graphs/CaloireBurn'
import WeightGraph from '../Graphs/WeightGraph'
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import RenderHTML from 'react-native-render-html'
import WebView from 'react-native-webview'

const Graphsource = {
    html: `
    <Html>
    <iframe src="https://widget.crictimes.org/" style="width:100%;min-height: 450px;" frameborder="0" scrolling="yes"></iframe>
    </Html>`
};

const ora = "prasahnt";

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

// var stepDailyCount = 0
// var stepConfig = {
//     default_threshold: 15.0,
//     default_delay: 15000,
//     cheatInterval: 3000,
//     onStepCountChange: (stepCount) => { stepDailyCount = stepCount },
//     onCheat: () => { console.log("User is Cheating") }
// }

class HomeScreen extends Component {
    constructor(props){
        super(props);

        this.state = {
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
            products: [
                {img : require('../../Assets/Images/prodt.png')},
                {img : require('../../Assets/Images/prodt.png')},
                {img : require('../../Assets/Images/prodt.png')},
                {img : require('../../Assets/Images/prodt.png')},
                {img : require('../../Assets/Images/prodt.png')},
                {img : require('../../Assets/Images/prodt.png')},
            ] ,
            articles: [
                {img : require('../../Assets/Images/articles_One.jpg'), heading: 'Body Building Tips', subTitle: '7 Must known Tips for body building', date: '28/09/2021'},
                {img : require('../../Assets/Images/articles_Two.jpg'), heading: 'Body Building Tips', subTitle: '7 Must known Tips for body building', date: '28/09/2021'},
                {img : require('../../Assets/Images/articles_Three.jpg'), heading: 'Body Building Tips', subTitle: '7 Must known Tips for body building', date: '28/09/2021'},
                
            ] ,
            refreshing: false,
            fill: 0,
            steps: [],
            rawSteps: [],
            finalSteps: 0,
            dataSource: [],
            monStepGraph: 0,
            tueStepGraph: 0,
            wedStepGraph: 0,
            thuStepGraph: 0,
            friStepGraph: 0,
            satStepGraph: 0,
            sunStepGraph: 0,
            allArticles : [],
            isLoding: false,
            formatDate: '',
            calIntake : 0,
            calBurnt : '',
            demoStep : 0,
            visible : false,
            weeklyStpes : [],
            data: {
                dataSets: [{
                  values: [5, 40, 77, 81, 43, 50 , 90],
                  label: 'Carbs',
                  config: {
                    drawValues: false,
                    color: processColor(Color.primaryColor),
                  }
                
                }],
                config: {
                    mode: "CUBIC_BEZIER",
                    drawValues: false,
                    lineWidth: 2,
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
                }
              },

              xAxis: {
                valueFormatter: ["Mon", "Tue", "Wed","Thu", "Fri","Sat", "Sun"],
                granularityEnabled: true,
                granularity: 1,
                axisMaximum: 7,
                axisMinimum: 0,
                centerAxisLabels: true
              },
        
              marker: {
                enabled: true,
                markerColor: processColor(Color.primaryColor),
                textColor: processColor('#ffff'),
                markerFontSize: 14,
              },

            mapCOunt : 1,
            popupAds : [],
            adModalVisible : false,
      
        }
    }
    

    async componentDidMount() {
        this.getCalIntakeData()
        this.getCalBurntData()
        this.getArticles()
        // this.getPoppAds()
       
       
        // try {
        //     const granted = PermissionsAndroid.request(
        //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        //       {
        //         title: "HealthoFit wants Permission",
        //         message:
        //           "Healthofit App needs access to your location " +
        //           "so we can track your steps.",
        //         // buttonNeutral: "Ask Me Later",
        //         buttonNegative: "Cancel",
        //         buttonPositive: "OK"
        //       }
        //     );
        //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {

            check(PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION).then(result => {
                switch (result) {
                    case RESULTS.UNAVAILABLE:
                        console.log('This feature is not available (on this device / in this context)');
                        break;
                    case RESULTS.DENIED:
                        console.log('The permission has not been requested / is denied');

                        request(PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION).then(() => {
                            // GoogleFit.startRecording(callback => {
                            //     console.log(callback);
                            // });
                            ToastAndroid.showWithGravity('Please Give Permission To Record Your Step Coun', ToastAndroid.BOTTOM, ToastAndroid.SHORT)
                        });
                        break;
                    case RESULTS.GRANTED:
                        console.log('The permission has not been requested / is');
                        request(PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION).then(() => {

                            GoogleFit.checkIsAuthorized().then(() => {
                                console.log("is auth --> ",GoogleFit.isAuthorized) // Then you can simply refer to `GoogleFit.isAuthorized` boolean.
                                if (!GoogleFit.isAuthorized) {
                                    const options = {
                                        scopes: [
                                        //   Scopes.FITNESS_ACTIVITY_READ_WRITE,
                                        //   Scopes.FITNESS_BODY_READ_WRITE,
                                            Scopes.FITNESS_ACTIVITY_READ,
                                            Scopes.FITNESS_ACTIVITY_READ_WRITE,
                                            Scopes.FITNESS_BODY_READ,
                                            Scopes.FITNESS_BODY_READ_WRITE,  
                                        ],
                                    }
                                      
                                      GoogleFit.authorize(options.scopes)
                                        .then(authResult => {
                                          if (authResult.success) {
                                            console.log("AUTH_SUCCESS");
                                          } else {
                                            console.log("AUTH_DENIED", authResult.message);
                                          }
                                      }).catch(() => {
                                          console.log("AUTH_ERROR");
                                      });
                                }
                            }).then(() => {
                                
                                  GoogleFit.startRecording((callback) => {
                                      console.log("app startes recording ", callback);
                                    //   this.startCountingSteps();
                                    //   this.getWeeklyStepCount()
                                     setInterval(() => {
                                        this.startCountingSteps();
                                        this.insertStepCount();
                                    }, 30000);
                                  })

                            })
                            

                            });
                        }
            })};
        
                // notifee.requestPermission();
        
        
                // notifee.displayNotification({
                //     title: 'Notification Title',
                //     body: 'Main body content of the notification',
                //     android: {
                //       channelId : 'default',
                //     //   smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
                //     },
                //   });
            // } else {
            //   ToastAndroid('HealthoFit Needs Permission to Proceed', ToastAndroid.CENTER, ToastAndroid.LONG);
            //   console.log("Permission not Found");
            // }
        //   } catch (e) {
        // }   
        //   }

        insertStepCount = () => {
            const url = insertStep();
            var body = {
                user_id : this.props.user.id,
                current_step_count : this.state.finalSteps
            }

            console.log(" step update body ---> ", body.user_id, body.current_step_count);

            axios.post(url, body).then((resp) => {
                console.log("resp in step update ----> ", resp.data);
            }).catch((err) => {
                console.log("err -> ", err);
            })

        }

        

        onRefreshComopnent = async () => {
            this.setState({ refreshing : true })
                GoogleFit.startRecording((callback) => {
                    // Process data from Google Fit Recording API (no google fit app needed)
                    console.log("app starretd recording ", callback);
                    this.startCountingSteps()
                    this.getArticles()
                });
                console.log("refreshin");
                this.setState({ refreshing: false })
            
        }


        startCountingSteps = async () => {
            const  opt  = {
                startDate: "2017-01-01T00:00:17.971Z", // required ISO8601Timestamp
                endDate: new Date().toISOString(), // required ISO8601Timestamp
                bucketUnit: "DAY", // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
                bucketInterval: 1, // optional - default 1. 
            };

            console.log("started recording step");

            await GoogleFit.getDailyStepCountSamples(opt).then((res) => {
                res.map((item, index) => {
                    // console.log(" full response of stepsss  -----> ", item );
                    if (item.source == "com.google.android.gms:estimated_steps") {
                        // totalValue = item.steps.length ? item.steps..value : 0
                        this.setState({ finalSteps : item.steps.length ? item.steps[item.steps.length -1].value : 0 })
                        // console.log(">>> ", totalValue);
                        // this.setState({ finalSteps : totalValue })

                    }
                })

            }).catch((err) => {
                console.log("error on steps >>>> ", err);
            });



            // await GoogleFit.getDailyStepCountSamples(opt).then((res) => {
            //     res.map((item, index) => {
            //         // console.log("itemmm >>> ", item);
            //         if (item.source == "com.google.android.gms:estimated_steps") {
            //             var day = new Date().getDate();
            //             var month = new Date().getMonth()+1;
            //             var year = new Date().getFullYear();
            //             var fullDate = year+"-"+month+"-"+day

            //             this.setState({ monStepGraph : item.steps[item.steps.length -1].date < fullDate || item.steps[item.steps.length -1].date > fullDate  ? item.steps[item.steps.length -1].value : 0  })
            //             this.setState({ tueStepGraph : item.steps[item.steps.length -2].date < fullDate || item.steps[item.steps.length -2].date > fullDate  ? item.steps[item.steps.length -2].value : 0  })
            //             this.setState({ wedStepGraph : item.steps[item.steps.length -3].date <  fullDate || item.steps[item.steps.length -3].date > fullDate  ? item.steps[item.steps.length -3].value : 0  })
            //             this.setState({ thuStepGraph : item.steps[item.steps.length -4].date <  fullDate || item.steps[item.steps.length -4].date > fullDate  ? item.steps[item.steps.length -4].value : 0  })
            //             this.setState({ wedStepGraph : item.steps[item.steps.length -5].date <  fullDate || item.steps[item.steps.length -5].date > fullDate  ? item.steps[item.steps.length -5].value : 0  })
            //             this.setState({ wedStepGraph : item.steps[item.steps.length -6].date <  fullDate || item.steps[item.steps.length -6].date > fullDate  ? item.steps[item.steps.length -6].value : 0  })
            //             this.setState({ wedStepGraph : item.steps[item.steps.length -7].date <  fullDate || item.steps[item.steps.length -7].date > fullDate  ? item.steps[item.steps.length -7].value : 0  })
            //             // console.log( " ----<<<  ", this.state.monStepGraph);
                        

            //             // this.setState({ monStepGraph : item.steps ? item.steps[item.steps.length -7].value : 0 })
            //             // this.setState({ tueStepGraph : item.steps ? item.steps[item.steps.length -6].value : 0 })
            //             // this.setState({ wedStepGraph : item.steps ? item.steps[item.steps.length -5].value : 0 })
            //             // this.setState({ thuStepGraph : item.steps ? item.steps[item.steps.length -4].value : 0 })
            //             // this.setState({ friStepGraph : item.steps ? item.steps[item.steps.length -3].value : 0 })
            //             // this.setState({ satStepGraph : item.steps ? item.steps[item.steps.length -2].value : 0 })
            //             // this.setState({ sunStepGraph : item.steps ? item.steps[item.steps.length -1].value : 0 })
                        
            //         }
            //     })

            //     }).catch((err) => {
            //         console.log("error on steps >>>> ", err);
            //     })

        }

        


        _renderItem = ({item, index}) => {
            return (
                <View style={{ backgroundColor: '#fff', padding: 10, borderRadius: 10 }}>
                    <TouchableOpacity>
                        <Image source={item.img} style={{ height: Dimensions.get('window').height/3.1, width: Dimensions.get('window').width/1.5, backgroundColor: '#fff', borderRadius: 10, overflow: 'hidden' }}  resizeMode="contain"/>
                    </TouchableOpacity>
                </View>
            );
        }

        _renderArticlesItem = ({item, index}) => {
            return (
                <View  style={{  }}>
                    <View style={{ padding: 10, backgroundColor: '#fff', borderRadius: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.23, shadowRadius: 2.62, elevation: 4, }}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('FullPageArticles', { id: item.id })}>
                            <Image source={{ uri: item.image }} style={{ height: 140,  width: Dimensions.get('window').width/1.3,  overflow: 'hidden' }}  resizeMode="contain"/>
                            <View style={{ padding: 5  }}>
                                <Text style={{ fontWeight: '500', fontSize: 14, color:'#656565', }}>{item.title}</Text>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 13, color:'#656565', width: '90%' }}>{item.short_description}</Text>
                                <Text style={{ fontSize: 12, color:'#656565' }}>Published At {item.create_time}</Text>
                                <Text  style={{ fontSize: 14, color:Color.primaryColor, paddingTop: 3, fontWeight : 'bold' }}>Read More</Text>
                                {/* <Text onPress={() => this.props.navigation.navigate('FullArticles')} style={{ fontSize: 14, color:Color.primaryColor, paddingTop: 3, fontWeight : 'bold' }}>Read More</Text> */}
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }

        getArticles = async () => {
            this.setState({ isLoding: true })
            var url = await fetchArticlesList()
            axios.post(url).then((resp) => {
                // console.log("===> articless ", JSON.stringify(resp.data.data));
                this.setState({ allArticles: resp.data.data, isLoding: false });

            }).catch((err) => {
                console.log("==> ", err);
            })
        }

        getCalIntakeData = async () => {
            this.setState({ isLoding: true })
            var url = await getCalIntake();

            var body = {
                email : this.props.user.id
            }
            axios.post(url, body).then((resp) => {
                console.log("===> cal intake ", JSON.stringify(resp.data.data[0].calories_gain));
                this.setState({ calIntake : resp.data.data[0].calories_gain,  });

            }).catch((err) => {
                console.log("==> ", err);
            })
        }

        getCalBurntData = async () => {
            this.setState({ isLoding: true })
            var url = await getCalBurn();

            var body = {
                user_id: this.props.user.id
            }
            axios.post(url, body).then((resp) => {
                console.log("===> cal burn ", JSON.stringify(resp.data.data[0].calories_burn));
                this.setState({ calBurnt : resp.data.data[0].calories_burn,  });

            }).catch((err) => {
                console.log("==> ", err);
            })
        }

        getPoppAds = () => {
            const url = getAds();
            var body = {
                page: "home",
                for : "pop-up"
            }

            axios.post(url,body).then((resp) => {
                // console.log("ads ---> ", resp.data.data[0]);
                this.setState({ popupAds : resp.data.data[0] })
            }).catch((err) => {
                // console.log("err in ads ---> ", err);
            })
        }

        xAxis =  {
            valueFormatter: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            granularityEnabled: true,
            granularity : 1,
        }

        setModalVisible = (visible) => {
            this.setState({ visible : visible });
            }


        scrollMap = () => {
            const { mapCOunt } = this.state
            if (mapCOunt <= 5) {
                this.setState({ mapCOunt : mapCOunt+1 })
            }
            
        }
        scrollMinusMap = () => {
            const { mapCOunt } = this.state
            this.setState({ mapCOunt : mapCOunt-1 })
        }



        render() {
            // var from = this.props.route.params
            // console.log("dily stepss --->  ", this.state.finalSteps );
            var graphData = [
                this.state.monStepGraph,
                this.state.tueStepGraph,
                this.state.wedStepGraph,
                this.state.thuStepGraph,
                this.state.friStepGraph,
                this.state.satStepGraph,
                this.state.sunStepGraph,
            ]
            // const { calIntake } = this.state.calIntake
            // var newCalIntake = calIntake
            // /newCalIntake.toFixed(3)

         

        return (
            <SafeAreaView style={{flex: 1, }}>
                    <View style={{ flex: 1, }}>
                    <StatusBar translucent={true} barStyle="dark-content" backgroundColor="transparent" />
                    <Header backgroundColor='rgba(196, 196, 196, 0.1)' containerStyle={{ paddingVertical: 15,  }}
                        leftComponent={<DashboardLeftHeaderComponent onOpenDrawer={() =>  this.props.navigation.openDrawer() } />}
                        rightComponent={<RightHeaderComponents onPressCart={() => this.props.navigation.navigate('Cart') } onPressWallet={() => this.props.navigation.navigate('WalletScreen') }  />}
                    />

                    <RefreshControl style={{ flex: 1 }} tintColor={Color.primaryColor}  refreshing={this.state.refreshing} onRefresh={this.onRefreshComopnent}   >
                    <ScrollView scrollEventThrottle={400} style={{flex: 1 }} showsVerticalScrollIndicator={false}>
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingTop: '7%', padding: 10 }}>
                                {/* <TouchableOpacity onPress={() => this.props.navigation.push('PlanActivity')} style={{ alignItems: 'center', backgroundColor: Color.primaryColor, borderRadius: 5, paddingVertical: 15 ,shadowColor: "#000", shadowOffset: { width: 0, height: 3, }, shadowOpacity: 0.29, shadowRadius: 4.65, elevation: 7, }}>
                                    <Image source={(require('../../Assets/Images/activity_icon.png'))} style={{ height: 80, width: 100 }} resizeMode="cover" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.props.navigation.push('PlanMeal')} style={{ alignItems: 'center', backgroundColor: Color.primaryColor, borderRadius: 5, paddingVertical: 15 ,shadowColor: "#000", shadowOffset: { width: 0, height: 3, }, shadowOpacity: 0.29, shadowRadius: 4.65, elevation: 7, }}>
                                    <Image source={(require('../../Assets/Images/meal_icon.png'))} style={{ height: 80, width: 100 }} resizeMode="cover" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.props.navigation.push('CoachDashboard')} style={{ alignItems: 'center', backgroundColor: Color.primaryColor, borderRadius: 5, paddingVertical: 15 ,shadowColor: "#000", shadowOffset: { width: 0, height: 3, }, shadowOpacity: 0.29, shadowRadius: 4.65, elevation: 7, }}>
                                    <Image source={(require('../../Assets/Images/coach_icon.png'))} style={{ height: 80, width: 100 }} resizeMode="cover" />
                                </TouchableOpacity> */}

                                <TouchableOpacity onPress={() => this.props.navigation.push('PlanActivity')} style={{ alignItems: 'center', backgroundColor: Color.primaryColor, borderRadius: 5, paddingVertical: 15 ,shadowColor: "#000", shadowOffset: { width: 0, height: 3, }, shadowOpacity: 0.29, shadowRadius: 4.65, elevation: 7, }}>
                                    <Image source={(require('../../Assets/Images/activity_icon.png'))} style={{ height: 50, width: 100 }} resizeMode="contain" />
                                    <Text style={{ fontSize: 14, color: '#fff', fontWeight: '700', textAlign: 'center', paddingTop: 8 }}>Activity</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.props.navigation.push('PlanMeal')} style={{ alignItems: 'center', backgroundColor: Color.primaryColor, borderRadius: 5, paddingVertical: 15 ,shadowColor: "#000", shadowOffset: { width: 0, height: 3, }, shadowOpacity: 0.29, shadowRadius: 4.65, elevation: 7, }}>
                                    <Image source={(require('../../Assets/Images/meal_icon.png'))} style={{ height: 50, width: 100 }} resizeMode="contain" />
                                    <Text style={{ fontSize: 14, color: '#fff', fontWeight: '700', textAlign: 'center', paddingTop: 8 }}>Meal</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.props.navigation.push('CoachDashboard')} style={{ alignItems: 'center', backgroundColor: Color.primaryColor, borderRadius: 5, paddingVertical: 15 ,shadowColor: "#000", shadowOffset: { width: 0, height: 3, }, shadowOpacity: 0.29, shadowRadius: 4.65, elevation: 7, }}>
                                    <Image source={(require('../../Assets/Images/coach_icon.png'))} style={{ height: 50, width: 100 }} resizeMode="contain" />
                                    <Text style={{ fontSize: 14, color: '#fff', fontWeight: '700', textAlign: 'center', paddingTop: 8 }}>Coach</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{ paddingVertical: 20 }}>
                            
                                <View style={{ backgroundColor: Color.primaryColor }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingTop: 10 }}>
                                        <View style={{  alignItems: 'center' }}>
                                            <Image source={require('../../Assets/Images/cal_burn.png')} style={{ height: 35, width: 35 }} resizeMode="contain" />
                                            <Text style={{ fontWeight: '700', fontSize: 16, color: '#fff', paddingVertical: 1 }}>{this.state.calBurnt === null || this.state.calBurnt === '' ? 0 : parseFloat(this.state.calBurnt).toFixed(2) }</Text>
                                            <Text style={{ fontSize: 10, color: '#fff', width: '60%', textAlign: 'center' }}>Calories Burnt</Text>
                                        </View>
                                        <View style={{   }}>
                                            <View style={{ backgroundColor: '#FF6F47', borderRadius: 100, borderColor: '#F55327', borderWidth: 1, padding: 13, elevation: 2 }}>
                                                <AnimatedCircularProgress
                                                    size={110}
                                                    width={4}
                                                    fill={this.state.finalSteps/80}
                                                    tintColor="#fff"
                                                    backgroundWidth={3}
                                                    rotation={180}
                                                    style={{  }}
                                                    renderCap={({ center }) => <Circle cx={center.x} cy={center.y} r="5" fill="#fff" />}
                                                    backgroundColor="#FDC1B1"
                                                    childrenContainerStyle={{  }}
                                                    >
                                                        
                                                    {
                                                        (fill) => (
                                                            <View style={{ alignItems: 'center' ,justifyContent: 'center',  }}>
                                                                <Image source={require('../../Assets/Images/step.png')} style={{ height: 30, width: 40 }} resizeMode="contain" />
                                                                <Text style={{ fontWeight: 'bold', fontSize: 17, color: '#fff', textAlign: 'center', paddingTop: 1 }}>{this.state.finalSteps}</Text>
                                                                <Text style={{  fontSize: 11, color: '#fff',textAlign: 'center'  }}>steps taken</Text>
                                                            </View>
                                                        )
                                                    }
                                                    </AnimatedCircularProgress>
                                            </View>
                                        </View>
                                        <View style={{  alignItems: 'center' }}>
                                            <Image source={require('../../Assets/Images/cal_in.png')} style={{ height: 35, width: 35 }} resizeMode="contain" />
                                            <Text style={{ fontWeight: '700', fontSize: 16, color: '#fff', paddingVertical: 1  }}>{ this.state.calIntake === null ? 0 : parseFloat(this.state.calIntake).toFixed(2) }</Text>
                                            <Text style={{ fontSize: 10, color: '#fff', width: '60%', textAlign: 'center' }}>Calorie Intake</Text>
                                        </View>
                                    </View>

                                    {/* ======= chart  =========*/}
                                    <View style={{ padding: 10 }}>
                                        <View style={{ backgroundColor: '#fff' , borderRadius: 20, width: Dimensions.get('screen').width/1.05, padding: 10 }}>
                                            <View style={{ flexDirection: 'row',  paddingVertical: 10, justifyContent: 'space-between', alignItems: 'center', paddingBottom: 20 }}>
                                                    {/* {
                                                        this.state.mapCOunt === 1 ? null : */}
                                                        <Icon onPress={() => this.scrollMinusMap()} name="chevron-back-outline" size={20} color='#000' type='ionicon'  />
                                                    {/* } */}
                                                <Text style={{ color: '#464646', fontSize: 17, textAlign: 'center', fontWeight: 'bold', }}>{
                                                        this.state.mapCOunt === 1 ?  "Step Count" : this.state.mapCOunt === 2 ? "Calorie Intake" : 
                                                        this.state.mapCOunt === 3 ? "Macros" : this.state.mapCOunt === 4 ? "Calorie Burn" : this.state.mapCOunt === 5 ?  "Weight"  : "Weight"
                                                }</Text>
                                                    {/* {
                                                        this.state.mapCOunt === 5 ? null : */}
                                                        <Icon onPress={() => this.scrollMap()} name="chevron-forward-outline" size={20} color='#000' type='ionicon'  />
                                                    {/* } */}
                                            </View>
          
                                                {
                                                    this.state.mapCOunt === 1 ? <StepCountGraph /> : this.state.mapCOunt === 2 ? <CalorieIntake /> : 
                                                    this.state.mapCOunt === 3 ? <MacrosGraph /> : this.state.mapCOunt === 4 ? <CaloireBurn /> : this.state.mapCOunt === 5 ?  <WeightGraph />  : <WeightGraph />
                                                }
                                               

                                        </View>
                                    </View>

                                </View>
                            </View>

                                <View style={{ alignItems: 'center', paddingBottom: '3%' }}>
                                    <Text style={{ color: '#323232', fontSize: 16, fontWeight: 'bold', alignSelf: 'flex-start', paddingLeft: 18, paddingBottom: 10 }}>Hot Products 🔥</Text>
                                    <Carousel
                                        layout="stack"
                                        style={{  }}
                                        layoutCardOffset={18}
                                        ref={(c) => { this._carousel = c; }}
                                        data={this.state.products}
                                        renderItem={this._renderItem}
                                        sliderWidth={Dimensions.get('screen').width/1.5}
                                        sliderHeight={Dimensions.get('screen').height/1.1}
                                        itemWidth={Dimensions.get('screen').width/1}
                                        itemHeight={Dimensions.get('screen').height/1.1}
                                        hasParallaxImages={true}
                                        inactiveSlideScale={0.94}
                                        inactiveSlideOpacity={0.7}
                                        activeAnimationType={'timing'} 
                                        activeAnimationOptions={{ friction: 4, tension: 40 }} 
                                    /> 
                                   
                                </View>

                                <View>
                                    <View style={{ paddingBottom: '8%', paddingTop: 20 }}>
                                        <Text style={{ color: '#323232', fontSize: 16, fontWeight: 'bold', alignSelf: 'flex-start', paddingLeft: 18, paddingBottom: 10 }}>Articles You May Like</Text>
                                        <Carousel
                                            layout="default"
                                            hasParallaxImages={true}
                                            ref={(c) => { this._carousel = c; }}
                                            style={{ padding: 0 }}
                                            containerStyle={{ backgroundColor: 'red', padding: 20 }} 
                                            data={this.state.allArticles}
                                            renderItem={this._renderArticlesItem}
                                            sliderWidth={Dimensions.get('window').width/1}
                                            sliderHeight={Dimensions.get('window').height/2}
                                            itemWidth={Dimensions.get('window').width/1.2}
                                            itemHeight={Dimensions.get('window').height/1}
                                            
                                        />
                                    </View>
                                </View>

                                <View style={{ flex: 1, backgroundColor: 'red', justifyContent: 'center', }}>
                                    <Modal animationType='fade'  visible={this.state.adModalVisible} transparent={true} style={{  }} >
                                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20, paddingTop: '20%' }}>
                                            <ImageBackground source={ this.state.popupAds.image_video ? {  uri  : this.state.popupAds.image_video } : require('../../Assets/Images/no_data_found.png') } resizeMode="cover" borderRadius={50} style={{ height: Dimensions.get('screen').height/1.4 , width: '100%',   }} >
                                                <TouchableOpacity onPress={() => this.setState({ adModalVisible : false }) } style={{  backgroundColor: '#000', height: 40, width: 40, padding: 5, borderRadius: 50, alignItems: 'center', alignSelf: 'flex-end' }}>
                                                    <Icon  onPress={() => this.setState({ adModalVisible : false }) } name="close-circle-outline" type='ionicon' size={29} color='#fff' />
                                                </TouchableOpacity>
                                            </ImageBackground>
                                        </View>
                                    </Modal>
                                </View>
                        
                        </View>
                    </ScrollView>
                </RefreshControl>
                </View>
            </SafeAreaView>
        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);