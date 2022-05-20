import React, { Component } from 'react'
import { View, Image, ScrollView, StatusBar, SafeAreaView, StyleSheet, Text, Dimensions, ToastAndroid ,FlatList, TouchableOpacity, ActivityIndicator, RefreshControl  } from 'react-native'
import { Header, Icon, CheckBox } from 'react-native-elements'
import { Menu, Divider,Provider } from 'react-native-paper';
import Color from '../../Assets/Colors/Color'
import DashboardLeftHeaderComponent from '../../Components/DashboardLeftHeaderComponent'
import RightHeaderComponents from '../../Components/RightHeaderComponents'
import CalendarStrip from 'react-native-calendar-strip';
import TwoIconComponents from '../../Components/TwoIconComponents'
import AsyncStorage from '@react-native-community/async-storage';
import { deleteInsertedMeal, fetchInsertbreakfastItems, fetchInsertDinnerItems, fetchInsertLunchItems, fetchInsertMorningItems, fetchInsertSnacksItems, markActivityComplete, markMealComplete, showAllActivity } from '../../Server/Api';
import moment from 'moment';
import axios from 'axios';
import { set } from 'react-native-reanimated';
import { addMealDate, addMealDateErr, getUserData, logOut } from '../../Redux/Actions/ActionCreator';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
    return {
        login: state.login,
        user: state.user,
        mealDate: state.mealDate,
    };
};

const mapDispatchToProps = (dispatch) => ({
    logOut: () => dispatch(logOut()),
    getUserData: (customerId) => dispatch(getUserData(customerId)),
    addMealDate: (mealDate) => dispatch(addMealDate(mealDate)),
    addMealDateErr: (errMsg) => dispatch(addMealDateErr(errMsg)),
});



class SheduleScreen extends Component {

    

    constructor(props){
        super(props);
        // this.currentDay = moment().format('YYYY-MM-DD');

        this.state ={
            todaysDate : new Date(),
            dateSelected: '',
            checked: '',
            openActivityCard: true,
            openMealCard: true,
            openSideMenuMeal: false,
            openSideMenuActivity: false,
            mealBreakfast: [],
            breakfastCal : '',
            breakfastError : false,
            breakfastRefreshing : false,
            mealMorning: [],
            morningCal :'',
            morningError : false,
            mealLunch: [],
            lunchCal :'',
            lunchError : false,
            mealSnacks: [],
            snacksCal :'',
            snacksError : false,
            mealDinner: [],
            dinnerCal :'',
            errorInGetingMeal : false,
            openModal : false,
            userMail : '',
            selectedDate: '',
            showPlanBttn : false,
            isLoading : false,
            openModal : false,
            showProgrss : false,
            breakfastCheckboxSelected : [],
            refreshing: false,

            activityData: [],
            activitySelectedArray:[]
        }

        
    }

    componentDidMount = async () =>  {
        const date = new Date();
        this.setState({  })
        var fromatDate = moment(date).format('YYYY-MM-DD')
        
        
        // const newDate = date.getFullYear()+"-"+("0" + ((new Date(date)).getMonth() + 1)).slice(-2)+"-"+("0" + ((new Date(date)).getDate() + 1)).slice(-2)
        this.setState({ showProgrss : true, todaysDate :  moment(this.state.todaysDate).format('YYYY-MM-DD') });
        console.log("todays final date  ----> ", this.state.todaysDate , ' ', fromatDate);
        // var updateDateInReducer = {
        //     defaultDate : fromatDate,
        //     errDateMsg : null, 
        //     updatedDate : ''
        // }
        // this.props.addMealDate(updateDateInReducer);
        // console.log("===== date in reducer ----> ", this.props.mealDate.updatedDate );

        await this.fetchInsertedACtivity(fromatDate);

        await this.getBreakfastItems(fromatDate);
        await this.getmorningItems(fromatDate)
        await this.getLunchItems(fromatDate)
        await this.getSnacksItems(fromatDate)
        await this.getDinnerItems(fromatDate)
        
        this.setState({ showProgrss : false })
    }

    switchMealDate  = async (date) => {

        this.setState({ showProgrss : true, dateSelected : date})
        console.log("normal date ---> ", this.state.dateSelected);
        
        this.setState({ showProgrss: false, refreshing: true });
        const onDay = moment(date).format('dddd');
        const currentDate = moment().format('YYYY-MM-DD')
        const nextDate = date;
        console.log(" ---> date ", currentDate);
        console.log(" ---> next date ", nextDate);
        if (currentDate < nextDate) {
            console.log(" dont show bttn ", currentDate );
            this.setState({ showPlanBttn : false })
        }else{
            console.log("=== shhow bttn ==== ", nextDate);
            this.setState({ showPlanBttn : true })
        }
        this.setState({ selectedDate : onDay,  })

        await this.fetchInsertedACtivity(date);

        await this.getBreakfastItems(date);
        await this.getmorningItems(date)
        await this.getLunchItems(date)
        await this.getSnacksItems(date)
        await this.getDinnerItems(date)

        this.setState({ refreshing : false })
    }
    getBreakfastItems = (date) => {
        this.setState({ isLoading : true })
        const url = fetchInsertbreakfastItems();
        var body = {
            email : this.props.user.id,
            intake_time : 'breakfast',
            date : date,
        }
        axios.post(url,body).then((resp) => {
            console.log("respp in breakfast ---> ", resp.data);
            // if (resp.data.status) {
            //     var calc = [];
            //     resp.data.data.forEach(element => {
            //         calc.push(element.calories_gain)
            //         var totalCcalc = calc.reduce(this.add,0)
            //         this.setState({ breakfastCal : totalCcalc })
            //         // console.log("item ind ", totalCcalc ); 
            //     });
            // }else{
            //     console.log("no items found");
            // }
            if (resp.data.message === 'success') {
                this.setState({ breakfastError : false, mealBreakfast : resp.data.data, isLoading : false, breakfastCal : resp.data.Calories })
            }else {
                this.setState({ breakfastError: true })
            }
        }).catch((err) => {
            console.log("err ",err);
            this.setState({ breakfastError: true.valueOf, isLoading: false, })
        })
    }

    getmorningItems = (date) => {
        this.setState({ isLoading : true })
        const url = fetchInsertbreakfastItems();
        var body = {
            email : this.props.user.id,
            intake_time : 'mid_morning',
            date : date
        }
        axios.post(url,body).then((resp) => {
            console.log("respp in midmoring ---> ", resp.data);
            // if (resp.data.status) {
            //     var calc = [];
            //     resp.data.data.forEach(element => {
            //         calc.push(element.calories_gain)
            //         var totalCcalc = calc.reduce(this.add,0)
            //         this.setState({ morningCal : totalCcalc })
            //         // console.log("item ind ", totalCcalc ); 
            //     });
            // }else{
            //     console.log("no items found");
            // }
            if (resp.data.message === 'success') {
                this.setState({morningError : false, mealMorning : resp.data.data, isLoading: false,  morningCal: resp.data.Calories })
            }else{
                this.setState({ morningError : true })
            }
        }).catch((err) => {
            console.log("err ",err);
            this.setState({ morningError : true, isLoading: false, })
        })
    }
    
    getLunchItems = (date) => {
        this.setState({ isLoading : true })
        const url = fetchInsertbreakfastItems();
        var body = {
            email : this.props.user.id,
            intake_time : 'lunch',
            date : date
        }
        axios.post(url,body).then((resp) => {
            console.log("respp in lunch ---> ", resp.data);
            if (resp.data.message === 'success') {
                this.setState({ lunchError: false , mealLunch : resp.data.data, isLoading: false,  lunchCal : resp.data.Calories })
            }else{
                this.setState({ lunchError: true })
            }
        }).catch((err) => {
            console.log("err ",err);
            this.setState({ lunchError : true, isLoading: false, })
        })
    }
    
    getSnacksItems = (date) => {
        this.setState({ isLoading : true })
        const url = fetchInsertbreakfastItems();
        var body = {
            email : this.props.user.id,
            intake_time : 'snacks',
            date : date
        }
        axios.post(url,body).then((resp) => {
            console.log("respp in snacks ---> ", resp.data);
            if (resp.data.message === 'success') {
                this.setState({ snacksError: false ,mealSnacks : resp.data.data, isLoading: false,  snacksCal : resp.data.Calories })
            }else{
                this.setState({ snacksError: true })
            }
        }).catch((err) => {
            console.log("err ",err);
            this.setState({ snacksError : true, isLoading: false, })
        })
    }


    getDinnerItems = (date) => {
        this.setState({ isLoading : true })
        const url = fetchInsertbreakfastItems();
        var body = {
            email : this.props.user.id,
            intake_time : 'dinner',
            date : date
        }
        axios.post(url,body).then((resp) => {
            console.log("respp in dinner ---> ", resp.data);
            if (resp.data.message === 'success') {
                this.setState({ errorInGetingMeal : false ,mealDinner : resp.data.data, isLoading: false,  dinnerCal : resp.data.Calories })
            }else{
                this.setState({ errorInGetingMeal: true })
            }
        }).catch((err) => {
            console.log("err ",err);
            this.setState({ errorInGetingMeal: true , isLoading: false,})
        })
    }


    deleteMeal = () => {
        const url = deleteInsertedMeal();
        var meal_ids = this.state.breakfastCheckboxSelected.toString();
        // console.log("meal id in to string  ---> ", meal_ids);
        const body  = {
            delete : meal_ids
        }
        axios.post(url, body).then((resp) => {
            // console.log("successfully deleted ---> ", resp.data);
            // this.setState({ breakfastCheckboxSelected : '' })
            this.switchMealDate()
            // await this.getBreakfastItems(fromatDate);
            // await this.getmorningItems(fromatDate)
            // await this.getLunchItems(fromatDate)
            // await this.getSnacksItems(fromatDate)
            // await this.getDinnerItems(fromatDate)
            // switch (intakeTime) {
            //     case 'breakfast':
            //         this.getBreakfastItems(date);
            //         break;
            //     case 'mid_morning' :
            //         this.getmorningItems(date);
            //         break;
            //     case 'lunch':
            //         this.getLunchItems(date);
            //         break;
            //     case 'snacks':
            //         this.getSnacksItems(date);
            //         break;
            //     case 'dinner':
            //         this.getDinnerItems(date);
            //         break
            //     default:
            //         break;
            // }
            
        }).catch((err) => {
            console.log("err in delteting --> ",err);
        })
    } 

    fetchInsertedACtivity = (date) => {
        const url = showAllActivity();
        var body ={
            user_id : this.props.user.id,
            date : date
        }
        // console.log("bodyy ===> ", body);
        axios.post(url, body).then((resp) => {
            console.log("resp from activity --> ", JSON.stringify(resp.data));
            this.setState({ activityData : resp.data.data })
        }).catch((err) => {
            console.log("error in activity ---> ". err);
        })
    }


    handleCheckbox = (index) => {
        var completeMealStatus = 'complete'
        let helperArray = this.state.breakfastCheckboxSelected;
        let itemIndex = helperArray.indexOf(index);

        if (helperArray.includes(index)) {
            helperArray.splice(itemIndex,1);
            completeMealStatus = 'incomplete'
            console.log("reomve id ====> ", completeMealStatus );
            this.markMealAsComplete(completeMealStatus)
        }else{
            helperArray.push(index)
            this.setState({ breakfastCheckboxSelected : helperArray,   })
            // completeMealStatus = "Complete"
            // console.log("completedd---> ", completeMealStatus )    
            this.markMealAsComplete(completeMealStatus)
            console.log("deletion meal item ", this.state.breakfastCheckboxSelected, );
        }
    }

    markMealAsComplete = (completeMealStatus) => {
        const date = new Date();
        var fromatDate = moment(date).format('YYYY-MM-DD')
        
        var deleteMaelId = this.state.breakfastCheckboxSelected.toString();
        

        const url = markMealComplete();
        var body = {
            meal_id: deleteMaelId,
            email : this.props.user.email,
            date: fromatDate,
            status: completeMealStatus,
        }

        // console.log("meal coplete body info  --->  ", body.meal_id, body.status );

        axios.post(url,body).then((resp) => {
            console.log("resp ---> ", resp.data);
            this.switchMealDate(fromatDate)
        }).catch((err) => {
            console.log("error in completing meal ---> ", err);
        })
        
    }


    handleActivityCheckbox = (index ,id ) => {
        var completeAcctivityStatus = 'Complete'
        let helperArray = this.state.activitySelectedArray;
        let itemIndex = helperArray.indexOf(index);

        if (helperArray.includes(index)) {
            helperArray.splice(itemIndex,1);
            completeAcctivityStatus = 'Incomplete'
            // console.log("reomve id ====> ", completeAcctivityStatus );
            // this.markMealAsComplete(completeAcctivityStatus)
        }else{
            helperArray.push(index)
        }
        this.setState({ activitySelectedArray : helperArray,   })
        // completeAcctivityStatus = "Complete"
        // console.log("completedd---> ", completeAcctivityStatus )    
        this.markActivityAsComplete(completeAcctivityStatus)
        console.log("deletion meal item ", this.state.activitySelectedArray, );
    }

    markActivityAsComplete = (completeAcctivityStatus) => {
        const date = new Date();
        var fromatDate = moment(date).format('YYYY-MM-DD')
        
        var deleteMaelId = this.state.activitySelectedArray.toString();
        

        const url = markActivityComplete();
        var body = {
            data_id: deleteMaelId,
            // email : this.props.user.email,
            // date: fromatDate,
            status: completeAcctivityStatus,
        }

        console.log("meal coplete body info  --->  ", body.data_id, body.status );

        axios.post(url,body).then((resp) => {
            console.log("comple status in activity data ---> ", resp.data);
            this.switchMealDate(fromatDate)
        }).catch((err) => {
            console.log("error in completing meal ---> ", err);
        })
        
    }

    add = (accumulator, a) => {
        return accumulator + parseFloat(a);
    }

    openMenu = () => {
        this.setState({ openSideMenuMeal: true })
    }

    closeMenu = () => {
        this.setState({ openSideMenuMeal: false })
    }

    openMenuActivity = () => {
        this.setState({ openSideMenuActivity: true })
    }

    closeMenuActivity = () => {
        this.setState({ openSideMenuActivity: false })
    }

    
    render() {

        var changeDay = this.state.dateSelected;
        
        var markedDatesArray = [
            
            {
                date:  moment().format('YYYY-MM-DD'),                
                lines: [
                    {
                    color: 'red',
                    },                
                ],
            },
            {
                date: changeDay,
                dots: [
                    {
                    color: 'red',
                    },
                ],
            },
        ];

       
        // console.log("date to show  ---> ", this.state.selectedDate );

        let datesWhitelist = [{
            start: moment().subtract(3, 'days'),
            end: moment().add(30, 'days')  // total 30 days enabled
        }];
        
        // console.log("checkedd ---> ", this.state.checkboxSelected);
        return (
            <Provider>
                
                <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
                    <View style={{ flex: 1, }}>
                        <StatusBar translucent={true} barStyle="dark-content" backgroundColor="transparent" />
                        <Header backgroundColor='rgba(196, 196, 196, 0.1)' containerStyle={{ paddingVertical: 15, }}
                            leftComponent={<DashboardLeftHeaderComponent onOpenDrawer={() =>  this.props.navigation.openDrawer() } />}
                            rightComponent={<RightHeaderComponents onPressCart={() => this.props.navigation.navigate('Cart') } onPressWallet={() => this.props.navigation.navigate('WalletScreen') }  />}
                        />
    
                        <ScrollView style={{ flex: 1,  }} showsVerticalScrollIndicator={false}>
                            {
                                this.state.refreshing ? <ActivityIndicator size="large" color={Color.primaryColor} /> : <View style={{ paddingTop: 0 }}>
                                    <CalendarStrip
                                        onDateSelected={(date) => this.switchMealDate(date.format('YYYY-MM-DD')) }
                                        scrollable
                                        markedDates={markedDatesArray}
                                        markedDatesStyle={{ duration: 200,type: 'background', highlightColor: Color.primaryColor, }}
                                        calendarAnimation={{type: 'sequence', duration: 30}}
                                        daySelectionAnimation={{duration: 200,type: 'background', highlightColor: Color.primaryColor,}}
                                        style={{height: 100, paddingTop: 10, paddingBottom: 10,  backgroundColor: 'rgba(196, 196, 196, 0.0)' }}
                                        calendarHeaderStyle={{ alignSelf: 'flex-start', paddingLeft: 20, fontSize: 15, color: '#565656' }}
                                        highlightDateNumberStyle={{color: '#fff'}}
                                        highlightDateNameStyle={{color: '#fff'}}
                                        datesWhitelist={datesWhitelist}
                                        theme={{
                                            backgroundColor: "#ffffff",
                                            calendarBackground: "#ffffff",
                                            todayTextColor: "#57B9BB",
                                            dayTextColor: "#222222",
                                            textDisabledColor: "#d9e1e8",
                                            monthTextColor: "#57B9BB",
                                            arrowColor: "#57B9BB",
                                            textDayFontWeight: "300",
                                            textMonthFontWeight: "bold",
                                            textDayHeaderFontWeight: "500",
                                            textDayFontSize: 16,
                                            textMonthFontSize: 18,
                                            selectedDayBackgroundColor: "#57B9BB",
                                            selectedDayTextColor: "#fff",
                                            textDayHeaderFontSize: 8
                                        }}
                            
                                    />
                                    
                                    <View style={{ padding: 12 }}>
                                        {/* <Text style={{ color: Color.primaryColor, fontSize: 18, paddingLeft: 15 ,textTransform: 'capitalize', fontWeight: 'bold' }}>Schedule for {this.state.dateSelected}</Text> */}

                                        <View style={{ backgroundColor: '#F8F4F4', padding: 10, borderRadius: 5 ,shadowColor: "#000",shadowOffset: { width: 0, height: 6, }, shadowOpacity: 0.37, shadowRadius: 7.49, elevation: 12, }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <TouchableOpacity onPress={() => this.props.navigation.navigate('PlanActivity')} style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 5 }}>
                                                    <Image source={require('../../Assets/Images/home_step.png')} style={{ height: 40, width: 40 }} resizeMode="center" />
                                                    <Text style={{ color: Color.primaryColor, fontSize: 18, paddingLeft: 15 ,textTransform: 'capitalize', fontWeight: 'bold' }}>Activity Plan</Text>
                                                </TouchableOpacity>
                                                <View style={{ flexDirection: 'row',alignItems: 'center' }}>
                                                    <TwoIconComponents iconName={this.state.openActivityCard ? "close-circle-outline" : "caret-down-circle-outline" }
                                                        iconColor={Color.primaryColor} iconSize={25} iconType="ionicon" onPress={() => this.setState({ openActivityCard: !this.state.openActivityCard }) }
                                                        // iconTwoName="ellipsis-vertical-outline" iconTwoColor={Color.black_Color} iconTwoSize={20} iconTwoType="ionicon" onTwoPress={() => this.setState({ openModal: !this.state.Modal  }) }
                                                    />
                                                    <Menu
                                                        visible={this.state.openSideMenuActivity}
                                                        onDismiss={this.closeMenuActivity}
                                                        contentStyle={{   }}
                                                        style={{ width: 150, paddingTop: '35%',  }}
                                                        anchor={<Icon name="ellipsis-vertical-outline" color="#787878" type="ionicon" size={20} onPress={this.openMenuActivity} />}>
                                                        <Menu.Item onPress={() => {}} title="Mark as Complete" icon="checkmark-circle-outline" titleStyle={{ fontSize: 14 , right: 20}} />
                                                        <Menu.Item onPress={() => {}} title="Edit Meal Plan" icon="pencil" titleStyle={{ fontSize: 14, right: 20 }} />
                                                        <Menu.Item onPress={() => {}} title="Delete Plan" icon="delete-outline" titleStyle={{ fontSize: 14, right: 20 }}  />
                                                    </Menu>
                                                </View>
                                            </View>
                                            
                                            {
                                                this.state.openActivityCard ? <View> 
                                                    {
                                                    this.state.activityData.acivity_plan_list === false ? null :
                                                    <FlatList data={this.state.activityData} keyExtractor={(item,index) => String(index)} renderItem={({ item,index }) => (
                                                        <View style={{ paddingVertical: 15 }}>
                                                            <View style={{ backgroundColor: '#F8F4F4',  padding: 10,}}>
                                                                <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                        <View style={{   alignItems: 'center', height: 40, width: 40, justifyContent: 'center', borderRadius: 10 }}>
                                                                            <Image source={{ uri : item.image }} style={{ height: 50, width: 50, paddingRight: 2 }} resizeMode="center" />
                                                                        </View>
                                                                        <View style={{ paddingLeft: 20 }}>
                                                                            <Text style={{ color: '#565656', fontSize: 15, fontWeight: '600', textTransform: 'capitalize'  }}>{item.category}</Text>
                                                                            {/* <Text style={{ color: '#565656', fontSize: 12,   }}>15 mins routine planned</Text> */}
                                                                        </View>
                                                                    </View>
                                                                
                                                                </View>
                                                                <View style={{  }}>
                                                                    {
                                                                        item.acivity_plan_list !== 'false' ?    <FlatList data={item.acivity_plan_list} keyExtractor={({item, index}) => index} renderItem={({ item, index }) => (
                                                                            <View style={{ flexDirection: 'row',  alignItems: 'center', justifyContent: 'space-between' }}>
                                                                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: '19%'  }}>
                                                                                <View style={{ backgroundColor: '#323232',height: 5, width: 5,borderRadius: 30 }} />
                                                                                <Text style={{ color: '#323232', fontSize: 13, paddingLeft: 10, width: '80%' }} ellipsizeMode='tail' numberOfLines={1} >{item.workout_name}</Text>
                                                                            </View>
                                                                            {
                                                                                item.status === 'Complete' ? <CheckBox checked={true} size={30} style={{  }} checkedIcon={<Icon name="checkbox" size={20} color={Color.primaryColor} type="ionicon" />} containerStyle={{ borderColor: Color.primaryColor , alignItems: 'center', paddingVertical: 1 }} checkedColor={Color.primaryColor}   /> :  <CheckBox checked={this.state.activitySelectedArray.includes(item.actid)} onPress={() => this.handleCheckbox(item.actid) } size={20} style={{  }} checkedIcon={<Icon name="checkbox" size={18} color={Color.primaryColor} type="ionicon" />} containerStyle={{ borderColor: Color.primaryColor , alignItems: 'center', paddingVertical: 1 }} checkedColor={Color.primaryColor}   />
                                                                            } 
                                                                        </View>
                                                                        )} ItemSeparatorComponent={() => (
                                                                            <View style={{   }} />
                                                                        )}  /> : null
                                                                    }
                                                            
                                                                </View>
                                                            </View>
                                                        </View>
                                                    )}  ItemSeparatorComponent={() => (
                                                        <View style={{  }}>
                                                            <View style={{ height: 2, backgroundColor: 'rgba(196, 196, 196, 0.7)' }} />
                                                        </View>
                                                    )} />  }
                                                        </View> : null
                                        
                                            }
                                        </View>
                                    
                                    </View>
                                            
                                    <View style={{ padding: 12 }}>
                                        <View style={{ backgroundColor: '#F8F4F4', padding: 10, borderRadius: 5 ,shadowColor: "#000",shadowOffset: { width: 0, height: 6, }, shadowOpacity: 0.37, shadowRadius: 7.49, elevation: 12, }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <TouchableOpacity onPress={() => this.props.navigation.navigate('PlanMeal')} style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 5 }}>
                                                    <Image source={require('../../Assets/Images/home_meal.png')} style={{ height: 40, width: 40 }} resizeMode="center" />
                                                    <Text style={{ color: Color.primaryColor, fontSize: 18, paddingLeft: 15 ,textTransform: 'capitalize', fontWeight: 'bold' }}>Meal Plan</Text>
                                                </TouchableOpacity>
                                                <View style={{ flexDirection: 'row',alignItems: 'center' }}>
                                                    <TwoIconComponents iconName={this.state.openMealCard ? "close-circle-outline" : "caret-down-circle-outline" }
                                                        iconColor={Color.primaryColor} iconSize={25} iconType="ionicon" onPress={() => this.setState({ openMealCard: !this.state.openMealCard }) }
                                                        // iconTwoName="ellipsis-vertical-outline" iconTwoColor={Color.black_Color} iconTwoSize={20} iconTwoType="ionicon" onTwoPress={() => console.log("dsds")}
                                                    />
                                                    <Menu
                                                        visible={this.state.openSideMenuMeal}
                                                        onDismiss={this.closeMenu}
                                                        contentStyle={{   }}
                                                        style={{ width: 160, paddingTop: '35%',  }}
                                                        anchor={<Icon name="ellipsis-vertical-outline" color="#787878" type="ionicon" size={20} onPress={this.openMenu} />}>
                                                        <Menu.Item onPress={() => {}} title="Mark Complete" icon="check-circle-outline" titleStyle={{ fontSize: 14 , right: 20}} />
                                                        <Menu.Item onPress={() => this.props.navigation.navigate('PlanMeal') } title="Edit Meal Plan" icon="pencil" titleStyle={{ fontSize: 14, right: 20 }} />
                                                        <Menu.Item onPress={() => this.deleteMeal() } title="Delete Plan" icon="delete-outline" titleStyle={{ fontSize: 14, right: 20 }}  />
                                                    </Menu>
                                                </View>
                                            </View>
                                            {
                                                this.state.openMealCard ?  (  this.state.showProgrss ?  <ActivityIndicator style={{ alignSelf: 'center' }} size={"large"} color={Color.primaryColor} />  : ( this.state.breakfastError && this.state.morningError && this.state.lunchError 
                                                    && this.state.snacksError && this.state.errorInGetingMeal ? <View style={{ justifyContent:'center', alignItems: 'center', flex: 1 }}>
                                                    <Text style={{ textAlign: 'center', fontSize: 16, width: '80%', paddingVertical: 20 }}>Uh-Oh! Seems like you haven’t made plans for {this.state.selectedDate}!</Text>
                                                    <Image source={require('../../Assets/Images/noMealFound.png')} style={{ height: 250, width: '100%' , resizeMode:'center' }} />
                                                    <View style={{ paddingTop: '10%', paddingBottom: 10, alignItems: 'center' }}>
                                                        <TouchableOpacity style={{ paddingVertical: 15, width: 270, alignItems: 'center', borderRadius: 20, backgroundColor: '#fff' ,borderColor: 'rgba(0, 0, 0, 0.25)', borderWidth: 1, elevation: 3 }}>
                                                            <Text style={{ fontSize: 13, textAlign: 'center', color: '#323232', fontWeight: '500' }}>Repeat Last Plan</Text>
                                                        </TouchableOpacity>
                                                        <View style={{ paddingVertical: 10 }} />
                                                        <TouchableOpacity onPress={() => this.props.navigation.push('MakeANewPlan') } style={{ paddingVertical: 15, width: 270, alignItems: 'center', borderRadius: 20, backgroundColor: '#fff' ,borderColor: 'rgba(0, 0, 0, 0.25)', borderWidth: 1, elevation: 3 }}>
                                                            <Text style={{ fontSize: 13, textAlign: 'center', color: '#323232', fontWeight: '500' }}>Make New Plan Plan</Text>
                                                        </TouchableOpacity> 
                                                    </View> 
                                                    
                                                </View> :  <View>
                                                {
                                                    this.state.breakfastError ? null :  <View>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, paddingTop: 20 }}>
                                                            <View style={{   alignItems: 'center', backgroundColor: 'rgba(249, 91, 48, 0.2)', height: 40, width: 40, justifyContent: 'center', borderRadius: 10 }}>
                                                                <Icon name="coffee" type="material-community" size={20} color={Color.primaryColor} />
                                                            </View>
                                                            <View style={{ paddingLeft: 10 }}>
                                                                <Text style={{ color: '#565656', fontSize: 15, fontWeight: '600'  }}>Breakfast</Text>
                                                                <Text style={{ color: '#565656', fontSize: 12,   }}>{parseInt(this.state.breakfastCal)} kcal intake </Text>
                                                            </View>
                                                        </View>
                                                        <View style={{ bottom: '2%' }}>
                                                            <FlatList data={this.state.mealBreakfast} keyExtractor={({item, index}) => index} renderItem={({ item, index }) => (
                                                                <View style={{ flexDirection: 'row',  alignItems: 'center', justifyContent: 'space-between' }}>
                                                                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: '19%'  }}>
                                                                        <View style={{ backgroundColor: '#323232',height: 5, width: 5,borderRadius: 30 }} />
                                                                        <Text style={{ color: '#323232', fontSize: 13, paddingLeft: 10,  }} ellipsizeMode='tail' numberOfLines={1} >{item.name}</Text>
                                                                    </View>
                                                                        {
                                                                        item.status == 'complete' ? <CheckBox checked={true} onPress={() => this.handleCheckbox(item.id) } size={30} style={{  }} checkedIcon={<Icon name="checkbox" size={20} color={Color.primaryColor} type="ionicon" />} containerStyle={{ borderColor: Color.primaryColor , alignItems: 'center', paddingVertical: 1 }} checkedColor={Color.primaryColor}   /> :  <CheckBox checked={this.state.breakfastCheckboxSelected.includes(item.id)} onPress={() => this.handleCheckbox(item.id) } size={20} style={{  }} checkedIcon={<Icon name="checkbox" size={18} color={Color.primaryColor} type="ionicon" />} containerStyle={{ borderColor: Color.primaryColor , alignItems: 'center', paddingVertical: 1 }} checkedColor={Color.primaryColor}   />
                                                                        }                                                               
                                                                    </View>
                                                            )} ItemSeparatorComponent={() => (
                                                                <View style={{   }} />
                                                            )} />
                                                        </View>
                
                                                        <View style={{ paddingVertical: 20 }}>
                                                            <View style={{ height: 2, backgroundColor: 'rgba(196, 196, 196, 0.7)' }} />
                                                        </View>
                                                    </View>
                                                }
                                                
        

                                                {
                                                    this.state.morningError ? null : <View>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, paddingTop: 10 }}>
                                                            <View style={{   alignItems: 'center', backgroundColor: 'rgba(249, 91, 48, 0.2)', height: 40, width: 40, justifyContent: 'center', borderRadius: 10 }}>
                                                                <Icon name="food-apple" type="material-community" size={20} color={Color.primaryColor} />
                                                            </View>
                                                            <View style={{ paddingLeft: 10 }}>
                                                                <Text style={{ color: '#565656', fontSize: 15, fontWeight: '600'  }}>Mid-Morning</Text>
                                                                <Text style={{ color: '#565656', fontSize: 12,   }}>{parseInt(this.state.morningCal)} Kal routine</Text>
                                                            </View>
                                                        </View>
                                                        <View style={{ bottom: 8 }}>
                                                            <FlatList data={this.state.mealMorning} keyExtractor={({item, index}) => index} renderItem={({ item, index }) => (
                                                                <View style={{ flexDirection: 'row',  alignItems: 'center', justifyContent: 'space-between' }}>
                                                                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: '19%'  }}>
                                                                        <View style={{ backgroundColor: '#323232',height: 5, width: 5,borderRadius: 30 }} />
                                                                        <Text style={{ color: '#323232', fontSize: 13, paddingLeft: 10,  }} ellipsizeMode='tail' numberOfLines={1} >{item.name}</Text>
                                                                    </View>
                                                                    {
                                                                        item.status == 'complete' ? <CheckBox checked={true} onPress={() => this.handleCheckbox(item.id) } size={30} style={{  }} checkedIcon={<Icon name="checkbox" size={20} color={Color.primaryColor} type="ionicon" />} containerStyle={{ borderColor: Color.primaryColor , alignItems: 'center', paddingVertical: 1 }} checkedColor={Color.primaryColor}   /> :  <CheckBox checked={this.state.breakfastCheckboxSelected.includes(item.id)} onPress={() => this.handleCheckbox(item.id) } size={20} style={{  }} checkedIcon={<Icon name="checkbox" size={18} color={Color.primaryColor} type="ionicon" />} containerStyle={{ borderColor: Color.primaryColor , alignItems: 'center', paddingVertical: 1 }} checkedColor={Color.primaryColor}   />
                                                                        } 
                                                                </View>
                                                            )} ItemSeparatorComponent={() => (
                                                                <View style={{   }} />
                                                            )} />
                                                        </View>
                                                        
                                                        <View style={{ paddingVertical: 20 }}>
                                                            <View style={{ height: 2, backgroundColor: 'rgba(196, 196, 196, 0.7)' }} />
                                                        </View>

                                                    </View>
                                                }  
                                                
                                                
                                                {
                                                    this.state.lunchError ? null : <View>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, paddingTop: 10 }}>
                                                            <View style={{   alignItems: 'center', backgroundColor: 'rgba(249, 91, 48, 0.2)', height: 40, width: 40, justifyContent: 'center', borderRadius: 10 }}>
                                                                {/* <Image source={require('../../Assets/Images/meal_two.png')} style={{ height: 30, width: 30, paddingRight: 2 }} resizeMode="center" /> */}
                                                                <Icon name="food-fork-drink" type="material-community" size={20} color={Color.primaryColor} />
                                                            </View>
                                                            <View style={{ paddingLeft: 10 }}>
                                                                <Text style={{ color: '#565656', fontSize: 15, fontWeight: '600'  }}>Lunch</Text>
                                                                <Text style={{ color: '#565656', fontSize: 12,   }}>{parseInt(this.state.lunchCal)} Kal routine</Text>
                                                            </View>
                                                        </View>
                                                        <View style={{ bottom: 8 }}>
                                                            <FlatList data={this.state.mealLunch} keyExtractor={({item, index}) => index} renderItem={({ item }) => (
                                                                <View style={{ flexDirection: 'row',  alignItems: 'center', justifyContent: 'space-between' }}>
                                                                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: '19%'  }}>
                                                                        <View style={{ backgroundColor: '#323232',height: 5, width: 5,borderRadius: 30 }} />
                                                                        <Text style={{ color: '#323232', fontSize: 13, paddingLeft: 10, width:"70%" }}>{item.name}</Text>
                                                                    </View>
                                                                    {
                                                                        item.status == 'complete' ? <CheckBox checked={true} onPress={() => this.handleCheckbox(item.id) } size={30} style={{  }} checkedIcon={<Icon name="checkbox" size={20} color={Color.primaryColor} type="ionicon" />} containerStyle={{ borderColor: Color.primaryColor , alignItems: 'center', paddingVertical: 1 }} checkedColor={Color.primaryColor}   /> :  <CheckBox checked={this.state.breakfastCheckboxSelected.includes(item.id)} onPress={() => this.handleCheckbox(item.id) } size={20} style={{  }} checkedIcon={<Icon name="checkbox" size={18} color={Color.primaryColor} type="ionicon" />} containerStyle={{ borderColor: Color.primaryColor , alignItems: 'center', paddingVertical: 1 }} checkedColor={Color.primaryColor}   />
                                                                    } 
                                                                </View>
                                                            )} ItemSeparatorComponent={() => (
                                                                <View style={{   }} />
                                                            )} />
                                                        </View>

                                                        <View style={{ paddingVertical: 20 }}>
                                                            <View style={{ height: 2, backgroundColor: 'rgba(196, 196, 196, 0.7)' }} />
                                                        </View>

                                                    </View>
                                                }

                                                
                                                {
                                                    this.state.snacksError ? null : <View>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, paddingTop: 10 }}>
                                                            <View style={{   alignItems: 'center', backgroundColor: 'rgba(249, 91, 48, 0.2)', height: 40, width: 40, justifyContent: 'center', borderRadius: 10 }}>
                                                                {/* <Image source={require('../../Assets/Images/meal_two.png')} style={{ height: 30, width: 30, paddingRight: 2 }} resizeMode="center" /> */}
                                                                <Icon name="hamburger" type="material-community" size={20} color={Color.primaryColor} />
                                                            </View>
                                                            <View style={{ paddingLeft: 10 }}>
                                                                <Text style={{ color: '#565656', fontSize: 15, fontWeight: '600'  }}>Snacks</Text>
                                                                <Text style={{ color: '#565656', fontSize: 12,   }}>{parseInt(this.state.snacksCal)} Kal routine</Text>
                                                            </View>
                                                        </View>
                                                        <View style={{ bottom: 8 }}>
                                                            <FlatList data={this.state.mealSnacks} keyExtractor={({item, index}) => index} renderItem={({ item }) => (
                                                                <View style={{ flexDirection: 'row',  alignItems: 'center', justifyContent: 'space-between' }}>
                                                                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: '19%'  }}>
                                                                        <View style={{ backgroundColor: '#323232',height: 5, width: 5,borderRadius: 30 }} />
                                                                        <Text style={{ color: '#323232', fontSize: 13, paddingLeft: 10, width:"70%" }}>{item.name}</Text>
                                                                    </View>
                                                                    {
                                                                        item.status == 'complete' ? <CheckBox checked={true} onPress={() => this.handleCheckbox(item.id) } size={30} style={{  }} checkedIcon={<Icon name="checkbox" size={20} color={Color.primaryColor} type="ionicon" />} containerStyle={{ borderColor: Color.primaryColor , alignItems: 'center', paddingVertical: 1 }} checkedColor={Color.primaryColor}   /> :  <CheckBox checked={this.state.breakfastCheckboxSelected.includes(item.id)} onPress={() => this.handleCheckbox(item.id) } size={20} style={{  }} checkedIcon={<Icon name="checkbox" size={18} color={Color.primaryColor} type="ionicon" />} containerStyle={{ borderColor: Color.primaryColor , alignItems: 'center', paddingVertical: 1 }} checkedColor={Color.primaryColor}   />
                                                                    } 
                                                                </View>
                                                            )} ItemSeparatorComponent={() => (
                                                                <View style={{   }} />
                                                            )} />
                                                        </View>

                                                        <View style={{ paddingVertical: 20 }}>
                                                            <View style={{ height: 2, backgroundColor: 'rgba(196, 196, 196, 0.7)' }} />
                                                        </View>

                                                    </View>
                                                }

                                                
                                                {
                                                    this.state.errorInGetingMeal ? null : <View>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, paddingTop: 10 }}>
                                                            <View style={{   alignItems: 'center', backgroundColor: 'rgba(249, 91, 48, 0.2)', height: 40, width: 40, justifyContent: 'center', borderRadius: 10 }}>
                                                                {/* <Image source={require('../../Assets/Images/meal_two.png')} style={{ height: 30, width: 30, paddingRight: 2 }} resizeMode="center" /> */}
                                                                <Icon name="noodles" type="material-community" size={20} color={Color.primaryColor} />
                                                            </View>
                                                            <View style={{ paddingLeft: 10 }}>
                                                                <Text style={{ color: '#565656', fontSize: 15, fontWeight: '600'  }}>Dinner</Text>
                                                                <Text style={{ color: '#565656', fontSize: 12,   }}>{parseInt(this.state.dinnerCal)} Kal routine</Text>
                                                            </View>
                                                        </View>
                                                        <View style={{ bottom: 8 }}>
                                                            <FlatList data={this.state.mealDinner} keyExtractor={({item, index}) => index} renderItem={({ item }) => (
                                                                <View style={{ flexDirection: 'row',  alignItems: 'center', justifyContent: 'space-between' }}>
                                                                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: '19%'  }}>
                                                                        <View style={{ backgroundColor: '#323232',height: 5, width: 5,borderRadius: 30 }} />
                                                                        <Text style={{ color: '#323232', fontSize: 13, paddingLeft: 10, width:"70%" }}>{item.name}</Text>
                                                                    </View>
                                                                    {
                                                                        item.status == 'complete' ? <CheckBox checked={true} onPress={() => this.handleCheckbox(item.id) } size={30} style={{  }} checkedIcon={<Icon name="checkbox" size={20} color={Color.primaryColor} type="ionicon" />} containerStyle={{ borderColor: Color.primaryColor , alignItems: 'center', paddingVertical: 1 }} checkedColor={Color.primaryColor}   /> :  <CheckBox checked={this.state.breakfastCheckboxSelected.includes(item.id)} onPress={() => this.handleCheckbox(item.id) } size={20} style={{  }} checkedIcon={<Icon name="checkbox" size={18} color={Color.primaryColor} type="ionicon" />} containerStyle={{ borderColor: Color.primaryColor , alignItems: 'center', paddingVertical: 1 }} checkedColor={Color.primaryColor}   />
                                                                    } 
                                                                </View>
                                                            )} ItemSeparatorComponent={() => (
                                                                <View style={{   }} />
                                                            )} />
                                                        </View>

                                                        <View style={{ paddingVertical: 20 }}>
                                                            <View style={{ height: 2, backgroundColor: 'rgba(196, 196, 196, 0.7)' }} />
                                                        </View>

                                                    </View>
                                                }
                                                
                                                
                                            </View> )) : null
                                        
                                            }
                                        </View>
                                    </View>
                            
                                    
                                </View>
                            }
                            
                            
                        </ScrollView>
                            
                    </View>
                </SafeAreaView>
            
            </Provider>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SheduleScreen);