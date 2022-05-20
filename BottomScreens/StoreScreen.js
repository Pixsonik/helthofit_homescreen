import React, { Component } from 'react'
import { View, SafeAreaView, Text, StatusBar, TouchableOpacity, ScrollView, FlatList, Image, Dimensions } from 'react-native'
import { Header, Icon, TabView,  CheckBox, ListItem, Divider, SearchBar } from 'react-native-elements'
import Color from '../../Assets/Colors/Color'
import RightHeaderComponents from '../../Components/RightHeaderComponents';
import { SliderBox } from "react-native-image-slider-box";
import TwoIconComponent from '../../Components/TwoIconComponents';
import { getProductByBrand, showAllCategory, getAllCategory, storeBearer } from '../../Server/Api';
import axios from 'axios';
import wooCommerce from '../../Server/Commerce'



export default class StoreScreen extends Component {
    constructor(props){
        super(props);

        this.state = {
            categories:[],
            brands:[],
            isLoading: false,
            catgegotiesOptions : [
                { catImg : require('../../Assets/Images/cat_one.png'), catName : 'Active Wear' },
                { catImg : require('../../Assets/Images/cat-two.png'), catName : 'Supplements' },
                { catImg : require('../../Assets/Images/cat_three.png'), catName : 'Fitness Essentials' },
                { catImg : require('../../Assets/Images/cat_four.png'), catName : 'Healthy Groceries' },
                { catImg : require('../../Assets/Images/cat_five.png'), catName : 'General Wellness' },
                { catImg : require('../../Assets/Images/cat_six.png'), catName : 'Footwear' },
                { catImg : require('../../Assets/Images/cat_eight.png'), catName : 'Electronics' },
                { catImg : require('../../Assets/Images/cat_seven.png'), catName : 'Body Care' },
                { catImg : require('../../Assets/Images/cat_nine.png'), catName : 'Health Books' },
            ],
            bannerImages: [
                require('../../Assets/Images/Banner1.png'),
                require('../../Assets/Images/Banner1.png'),
                require('../../Assets/Images/Banner1.png'),
                // require('../../Assets/Images/Banner1.png'),
                // require('../../Assets/Images/Banner1.png'),
            ],
            bannerImages2: [
                require('../../Assets/Images/Banner2.png'),
                require('../../Assets/Images/Banner2.png'),
                require('../../Assets/Images/Banner2.png'),
                // require('../../Assets/Images/Banner1.png'),
                // require('../../Assets/Images/Banner1.png'),
            ],
            hotProducts :[
                { pImg: require('../../Assets/Images/hot_one.png'), pName: 'Fitness Product', discounPrice: 299, price: 599, pCompnyName: 'Generic Category of Product' },
                { pImg: require('../../Assets/Images/hot_two.png'), pName: 'Fitness Product', discounPrice: 299, price: 599, pCompnyName: 'Generic Category of Product' },
                { pImg: require('../../Assets/Images/hot_three.png'), pName: 'Fitness Product', discounPrice: 299, price: 599, pCompnyName: 'Generic Category of Product' },
                { pImg: require('../../Assets/Images/hot_four.png'), pName: 'Fitness Product', discounPrice: 299, price: 599, pCompnyName: 'Generic Category of Product' },
            ],
            simialrProducts :[
                { pImg: require('../../Assets/Images/hot_four.png'), pName: 'Fitness Product', discounPrice: 299, price: 599, pCompnyName: 'Generic Category of Product' },
                { pImg: require('../../Assets/Images/hot_three.png'), pName: 'Fitness Product', discounPrice: 299, price: 599, pCompnyName: 'Generic Category of Product' },
                { pImg: require('../../Assets/Images/hot_one.png'), pName: 'Fitness Product', discounPrice: 299, price: 599, pCompnyName: 'Generic Category of Product' },
                { pImg: require('../../Assets/Images/hot_two.png'), pName: 'Fitness Product', discounPrice: 299, price: 599, pCompnyName: 'Generic Category of Product' },
            ],
            bestOrganicSellers :[
                { pImg: require('../../Assets/Images/organinc_1.png'), pName: 'Fitness Product', discounPrice: 299, price: 599, pCompnyName: 'Generic Category of Product' },
                { pImg: require('../../Assets/Images/organinc_2.png'), pName: 'Fitness Product', discounPrice: 299, price: 599, pCompnyName: 'Generic Category of Product' },
                { pImg: require('../../Assets/Images/organinc_3.png'), pName: 'Fitness Product', discounPrice: 299, price: 599, pCompnyName: 'Generic Category of Product' },
                { pImg: require('../../Assets/Images/organinc_4.png'), pName: 'Fitness Product', discounPrice: 299, price: 599, pCompnyName: 'Generic Category of Product' },
            ],

            bestVeganSellers :[
                { pImg: require('../../Assets/Images/organinc_3.png'), pName: 'Fitness Product', discounPrice: 299, price: 599, pCompnyName: 'Generic Category of Product' },
                { pImg: require('../../Assets/Images/organinc_4.png'), pName: 'Fitness Product', discounPrice: 299, price: 599, pCompnyName: 'Generic Category of Product' },
                { pImg: require('../../Assets/Images/organinc_2.png'), pName: 'Fitness Product', discounPrice: 299, price: 599, pCompnyName: 'Generic Category of Product' },
                { pImg: require('../../Assets/Images/organinc_1.png'), pName: 'Fitness Product', discounPrice: 299, price: 599, pCompnyName: 'Generic Category of Product' },
            ],

            bestFitnessSellers :[
                { pImg: require('../../Assets/Images/fitness_es_1.png'), pName: 'Fitness Product', discounPrice: 299, price: 599, pCompnyName: 'Generic Category of Product' },
                { pImg: require('../../Assets/Images/fitness_es_2.png'), pName: 'Fitness Product', discounPrice: 299, price: 599, pCompnyName: 'Generic Category of Product' },
                { pImg: require('../../Assets/Images/hot_four.png'), pName: 'Fitness Product', discounPrice: 299, price: 599, pCompnyName: 'Generic Category of Product' },
                { pImg: require('../../Assets/Images/hot_six.png'), pName: 'Fitness Product', discounPrice: 299, price: 599, pCompnyName: 'Generic Category of Product' },
            ],
        }
    }

    componentDidMount(){
        // this.fetchCategories();
        // this.fetchBrands();
        this.getCategories()
    }

    fetchCategories = () => {
        this.setState({ isLoading: true })
        const url = showAllCategory();
        axios.post(url).then((resp) => {
            // console.log("data ---> ", resp.data);
            this.setState({ categories : resp.data.data , isLoading: false })
        }).catch((err) => {
            console.log("error in categoreis -> ", err );
        })
    }

    // fetchBrands = () => {
    //     this.setState({ isLoading: true })
    //     const url = getProductByBrand();
    //     axios.post(url).then((resp) => {
    //         console.log("data in brands---> ", resp.data);
    //         this.setState({ brands : resp.data.data , isLoading: false })
    //     }).catch((err) => {
    //         console.log("error in categoreis -> ", err );
    //     })
    // }

    getCategories = () => {
        this.setState({ isLoading: true })
        const url = getAllCategory();
        var bearerToken = storeBearer

       
        var config = {
            method: 'post',
            url: url,
            headers: { 
              'Authorization': 'Bearer '+bearerToken, 
            //   'Cookie': 'ci_session=4c6168bf2297e96ba18f7f49e074d207b0cf7507'
            }
          };
          
          axios(config).then((response) => {
            console.log(JSON.stringify(response.data));
            this.setState({ categories : response.data.data, isLoading : false,  })
          }).catch((error) => {
            console.log(error);
          });
    }
    

    render() {
        return (
            <View style={{ flex: 1 }}>
                <SafeAreaView style={{ flex: 1 }}>
                    <StatusBar translucent={true} barStyle="dark-content" backgroundColor="transparent" />
                    <Header backgroundColor={Color.primaryColor} containerStyle={{ paddingVertical: 15, alignItems: 'center' }}
                        leftComponent={ <Icon  name="chevron-back" type="ionicon" size={25} color="#fff" onPress={() => this.props.navigation.goBack()} />  }
                        centerComponent={
                            <View style={{ flexDirection: 'row', right: 90 , alignItems: 'center' }}>
                                <Icon name='store-outline' type='material-community' size={30} color="#fff" />
                                <Text style={{ color: '#fff', fontSize: 18, paddingLeft: 10 ,textTransform: 'capitalize', fontWeight: 'bold' }}>Store</Text>
                            </View>
                        }
                        rightComponent={<View style={{ flexDirection: 'row' }}>
                            <Icon name="search-outline" type="ionicon" size={25} color="#fff" onPress={() => console.log("press serach icon")}   />
                            <View  style={{ paddingRight: 10 }} />
                            <TwoIconComponent iconName="cart-outline" iconSize={25} iconType="ionicon" iconColor="#fff" onPress={() => this.props.navigation.navigate('Cart')}
                            iconTwoName="wallet-outline" iconTwoColor="#fff" iconTwoSize={25} iconTwoType="ionicon" onTwoPress={() => this.props.navigation.navigate('WalletScreen')} />
                        </View>}
                        
                    />

                    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} >
                        <View style={{ flex: 1,  paddingTop: 5 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
                                <Text style={{ color: '#000', fontSize: 17, fontWeight: '600',  borderBottomWidth: 2, borderBottomColor: Color.primaryColor, width: '45%', }}>Shop by Categories</Text>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('CategoriesScreen')} style={{ flexDirection: 'row', alignItems: 'center', justifyContent:'center',  }}>
                                    <Text style={{ color: '#02518B', fontSize: 11, borderBottomColor: '#02518B', borderBottomWidth: 0.8 }}>See All</Text>
                                    <Icon name="arrow-forward-outline" type="ionicon" size={12} color="#02518B" style={{ top: 1 }} />
                                </TouchableOpacity>
                            </View>

                            <View style={{ paddingHorizontal: 5, paddingVertical: 10 }}>
                                {
                                     this.state.isLoading ? <FlatList data={[1,2,3,4,5,6,7]}  horizontal={true} showsHorizontalScrollIndicator={false} keyExtractor={(item,index) => index.toString()} renderItem={({ item, index }) => (
                                        <TouchableOpacity   style={{ alignItems: 'center', backgroundColor:"#E0E0E0" }}>
                                            <Image  style={{ height: 90, width: 90,   }} resizeMode="contain" />
                                            <Text style={{ color: '#565656', fontSize: 12,  paddingTop: 5, textAlign: 'center', width: '80%' }}></Text>
                                        </TouchableOpacity>
                                    )} ItemSeparatorComponent={() => <View style={{ paddingHorizontal: 3 }} />} />  : <FlatList data={this.state.categories}  horizontal={true} showsHorizontalScrollIndicator={false} keyExtractor={(item,index) => index.toString()} renderItem={({ item, index }) => (
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('SubCategoriesScreen', { subCat : item.children, catName : item.name })} style={{ alignItems: 'center' }}>
                                        <Image source={{ uri : item.image === '' || null ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png' : item.image }} style={{ height: 90, width: 90,   }} resizeMode="contain" />
                                        <Text style={{ color: '#565656', fontSize: 12,  paddingTop: 5, textAlign: 'center', width: '80%' }}>{item.name}</Text>
                                    </TouchableOpacity>
                                    )} ItemSeparatorComponent={() => <View style={{ paddingHorizontal: 3 }} />} />
                                }
                            </View>

                            <View style={{  }}>
                                <SliderBox
                                    images={this.state.bannerImages}
                                    sliderBoxHeight={180}
                                    onCurrentImagePressed={index => console.warn(`image ${index} pressed`)}
                                    dotColor={Color.primaryColor}
                                    inactiveDotColor="#C4C4C4"
                                    resizeMode="contain"
                                    ImageComponentStyle={{ width: '94%', marginTop: 5}}
                                    autoplay
                                    circleLoop
                                    dotStyle={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: 5,
                                        marginHorizontal: 0,
                                        padding: 0,
                                        margin: 0,
                                        backgroundColor: Color.primaryColor
                                    }}
                                    paginationBoxStyle={{
                                        position: "absolute",
                                        bottom: 0,
                                        padding: 0,
                                        alignItems: "center",
                                        alignSelf: "center",
                                        justifyContent: "center",
                                        paddingVertical: 20
                                    }}
                                />
                            </View>

                            {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
                                <Text style={{ color: '#000', fontSize: 17, fontWeight: '600',  borderBottomWidth: 2, borderBottomColor: Color.primaryColor, width: '35%', }}>Shop by Brands</Text>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('CategoriesScreen')} style={{ flexDirection: 'row', alignItems: 'center', justifyContent:'center',  }}>
                                    <Text style={{ color: '#02518B', fontSize: 11, borderBottomColor: '#02518B', borderBottomWidth: 0.8 }}>See All</Text>
                                    <Icon name="arrow-forward-outline" type="ionicon" size={12} color="#02518B" style={{ top: 1 }} />
                                </TouchableOpacity>
                            </View>

                            <View style={{ paddingHorizontal: 5, paddingVertical: 10 }}>
                                {
                                     this.state.isLoading ? <FlatList data={[1,2,3,4,5,6,7]}  horizontal={true} showsHorizontalScrollIndicator={false} keyExtractor={(item,index) => index.toString()} renderItem={({ item, index }) => (
                                        <TouchableOpacity   style={{ alignItems: 'center', backgroundColor:"#E0E0E0" }}>
                                            <Image  style={{ height: 90, width: 90,   }} resizeMode="contain" />
                                            <Text style={{ color: '#565656', fontSize: 12,  paddingTop: 5, textAlign: 'center', width: '80%' }}></Text>
                                        </TouchableOpacity>
                                    )} ItemSeparatorComponent={() => <View style={{ paddingHorizontal: 3 }} />} />  : <FlatList data={this.state.brands}  horizontal={true} showsHorizontalScrollIndicator={false} keyExtractor={(item,index) => index.toString()} renderItem={({ item, index }) => (
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('SubCategoriesScreen', { id : item.id })} style={{ alignItems: 'center' }}>
                                        <Image source={{ uri : item.brand_logo }} style={{ height: 90, width: 90,   }} resizeMode="contain" />
                                        <Text style={{ color: '#565656', fontSize: 12,  paddingTop: 5, textAlign: 'center', width: '80%' }}>{item.name}</Text>
                                    </TouchableOpacity>
                                    )} ItemSeparatorComponent={() => <View style={{ paddingHorizontal: 3 }} />} />
                                }
                            </View> */}

                            <View style={{ paddingVertical: 15 }}>
                                <View style={{ padding: 10, paddingTop: 10, backgroundColor: '#FFFFFF' }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Text style={{ color: '#000', fontSize: 17, fontWeight: '600', borderBottomWidth: 2, borderBottomColor: Color.primaryColor, width: '30%', }}>Hot Products</Text>
                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('ProductListiing')} style={{ flexDirection: 'row', alignItems: 'center', justifyContent:'center',  }}>
                                            <Text style={{ color: '#02518B', fontSize: 11, borderBottomColor: '#02518B', borderBottomWidth: 0.8 }}>See All</Text>
                                            <Icon name="arrow-forward-outline" type="ionicon" size={12} color="#02518B" style={{ top: 1 }} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ paddingTop: 15 }}>
                                        <FlatList showsHorizontalScrollIndicator={false}  data={this.state.hotProducts} keyExtractor={(item, index) => index.toString()} horizontal={true} renderItem={({  item,index }) => (
                                            <View style={{ width: Dimensions.get('window').width/2.2 }}>
                                                    <View>
                                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('ProductDetail')}>
                                                            <Image source={item.pImg} style={{ height: 180, width: '100%', borderTopLeftRadius: 10, borderTopRightRadius: 10 }} />
                                                        </TouchableOpacity>
                                                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 5 }}>
                                                            <View>
                                                                <Text style={{ fontSize: 14, color: '#565656', textTransform: 'capitalize',  }}>{item.pName}</Text>
                                                                <Text style={{ fontSize: 11, color: '#565656', textTransform: 'capitalize',  }}>{item.pCompnyName}</Text>
                                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                    <Text style={{ fontSize: 17, color: '#565656', textTransform: 'capitalize', fontWeight: 'bold' }}>₹ {item.discounPrice}</Text>
                                                                    <Text style={{ fontSize: 13, color: '#565656', textTransform: 'capitalize', textDecorationLine: 'line-through', paddingLeft: 10, textDecorationColor:"red" }}>₹ {item.price}</Text>
                                                                </View>
                                                            </View>
                                                            <Icon name="heart-outline" type="ionicon" size={20} color="#565656" />
                                                        </View>
                                                    </View>
                                            </View>
                                        )} ItemSeparatorComponent={() => (
                                            <View style={{ paddingHorizontal: 8 }} />
                                        )} />
                                    </View>
                                </View>
                            </View>

                            <View style={{ }}>
                                <View style={{ padding: 10,  backgroundColor: '#FFFFFF'  }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{ color: '#000', fontSize: 17, fontWeight: '600', borderBottomWidth: 2, borderBottomColor: Color.primaryColor, width: '27%',  }}>Best Sellers</Text>
                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('ProductListiing')} style={{ flexDirection: 'row', alignItems: 'center', justifyContent:'center',  }}>
                                            <Text style={{ color: '#02518B', fontSize: 11, borderBottomColor: '#02518B', borderBottomWidth: 0.8 }}>See All</Text>
                                            <Icon name="arrow-forward-outline" type="ionicon" size={12} color="#02518B" style={{ top: 1 }} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ paddingTop: 15 }}>
                                        <FlatList showsHorizontalScrollIndicator={false} data={this.state.simialrProducts} keyExtractor={(item, index) => index.toString()} horizontal={true} renderItem={({  item,index }) => (
                                            <View style={{ width: Dimensions.get('window').width/2.2 }}>
                                                    <View>
                                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('ProductDetail')}>
                                                            <Image source={item.pImg} style={{ height: 180, width: '100%', borderTopLeftRadius: 10, borderTopRightRadius: 10 }} />
                                                        </TouchableOpacity>
                                                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 5 }}>
                                                            <View>
                                                                <Text style={{ fontSize: 14, color: '#565656', textTransform: 'capitalize',  }}>{item.pName}</Text>
                                                                <Text style={{ fontSize: 11, color: '#565656', textTransform: 'capitalize',  }}>{item.pCompnyName}</Text>
                                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                    <Text style={{ fontSize: 17, color: '#565656', textTransform: 'capitalize', fontWeight: 'bold' }}>₹ {item.discounPrice}</Text>
                                                                    <Text style={{ fontSize: 13, color: '#565656', textTransform: 'capitalize', textDecorationLine: 'line-through', paddingLeft: 10 }}>₹ {item.price}</Text>
                                                                </View>
                                                            </View>
                                                            <Icon name="heart-outline" type="ionicon" size={20} color="#565656" />
                                                        </View>
                                                    </View>
                                            </View>
                                        )} ItemSeparatorComponent={() => (
                                            <View style={{ paddingHorizontal: 8 }} />
                                        )} />
                                    </View>
                                </View>
                            </View>

                            <View style={{  paddingVertical: 10 }}>
                                <SliderBox
                                    images={this.state.bannerImages2}
                                    sliderBoxHeight={180}
                                    onCurrentImagePressed={index => console.warn(`image ${index} pressed`)}
                                    dotColor={Color.primaryColor}
                                    inactiveDotColor="#C4C4C4"
                                    resizeMode="contain"
                                    ImageComponentStyle={{ width: '94%', marginTop: 5}}
                                    autoplay
                                    circleLoop
                                    dotStyle={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: 5,
                                        marginHorizontal: 0,
                                        padding: 0,
                                        margin: 0,
                                        backgroundColor: Color.primaryColor
                                    }}
                                    paginationBoxStyle={{
                                        position: "absolute",
                                        bottom: 0,
                                        padding: 0,
                                        alignItems: "center",
                                        alignSelf: "center",
                                        justifyContent: "center",
                                        paddingVertical: 20
                                    }}
                                />
                            </View>

                            <View style={{ paddingVertical: 15 }}>
                                <View style={{padding: 10, backgroundColor: '#FFFFFF' }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{ color: '#000', fontSize: 17, fontWeight: '600', borderBottomWidth: 2, borderBottomColor: Color.primaryColor, width: '47%',  }}>Best Sellers Organic</Text>
                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('ProductListiing')} style={{ flexDirection: 'row', alignItems: 'center', justifyContent:'center',  }}>
                                            <Text style={{ color: '#02518B', fontSize: 11, borderBottomColor: '#02518B', borderBottomWidth: 0.8 }}>See All</Text>
                                            <Icon name="arrow-forward-outline" type="ionicon" size={12} color="#02518B" style={{ top: 1 }} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ paddingTop: 15 }}>
                                        <FlatList showsHorizontalScrollIndicator={false} data={this.state.bestOrganicSellers} keyExtractor={(item, index) => index.toString()} horizontal={true} renderItem={({  item,index }) => (
                                            <View style={{ width: Dimensions.get('window').width/2.2 }}>
                                                    <View>
                                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('ProductDetail')}>
                                                            <Image source={item.pImg} style={{ height: 180, width: '100%', borderTopLeftRadius: 10, borderTopRightRadius: 10 }} />
                                                        </TouchableOpacity>
                                                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 5 }}>
                                                            <View>
                                                                <Text style={{ fontSize: 14, color: '#565656', textTransform: 'capitalize',  }}>{item.pName}</Text>
                                                                <Text style={{ fontSize: 11, color: '#565656', textTransform: 'capitalize',  }}>{item.pCompnyName}</Text>
                                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                    <Text style={{ fontSize: 17, color: '#565656', textTransform: 'capitalize', fontWeight: 'bold' }}>₹ {item.discounPrice}</Text>
                                                                    <Text style={{ fontSize: 13, color: '#565656', textTransform: 'capitalize', textDecorationLine: 'line-through', paddingLeft: 10 }}>₹ {item.price}</Text>
                                                                </View>
                                                            </View>
                                                            <Icon name="heart-outline" type="ionicon" size={20} color="#565656" />
                                                        </View>
                                                    </View>
                                            </View>
                                        )} ItemSeparatorComponent={() => (
                                            <View style={{ paddingHorizontal: 8 }} />
                                        )} />
                                    </View>
                                </View>
                            </View>

                            <View style={{  }}>
                                <View style={{ padding: 10, backgroundColor: '#FFFFFF' }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{ color: '#000', fontSize: 17, fontWeight: '600', borderBottomWidth: 2, borderBottomColor: Color.primaryColor, width: '40%',  }}>Vegan Exclusive</Text>
                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('ProductListiing')} style={{ flexDirection: 'row', alignItems: 'center', justifyContent:'center',  }}>
                                            <Text style={{ color: '#02518B', fontSize: 11, borderBottomColor: '#02518B', borderBottomWidth: 0.8 }}>See All</Text>
                                            <Icon name="arrow-forward-outline" type="ionicon" size={12} color="#02518B" style={{ top: 1 }} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ paddingTop: 15 }}>
                                        <FlatList showsHorizontalScrollIndicator={false} data={this.state.bestVeganSellers} keyExtractor={(item, index) => index.toString()} horizontal={true} renderItem={({  item,index }) => (
                                            <View style={{ width: Dimensions.get('window').width/2.2 }}>
                                                    <View>
                                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('ProductDetail')}>
                                                            <Image source={item.pImg} style={{ height: 180, width: '100%', borderTopLeftRadius: 10, borderTopRightRadius: 10 }} />
                                                        </TouchableOpacity>
                                                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 5 }}>
                                                            <View>
                                                                <Text style={{ fontSize: 14, color: '#565656', textTransform: 'capitalize',  }}>{item.pName}</Text>
                                                                <Text style={{ fontSize: 11, color: '#565656', textTransform: 'capitalize',  }}>{item.pCompnyName}</Text>
                                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                    <Text style={{ fontSize: 17, color: '#565656', textTransform: 'capitalize', fontWeight: 'bold' }}>₹ {item.discounPrice}</Text>
                                                                    <Text style={{ fontSize: 13, color: '#565656', textTransform: 'capitalize', textDecorationLine: 'line-through', paddingLeft: 10 }}>₹ {item.price}</Text>
                                                                </View>
                                                            </View>
                                                            <Icon name="heart-outline" type="ionicon" size={20} color="#565656" />
                                                        </View>
                                                    </View>
                                            </View>
                                        )} ItemSeparatorComponent={() => (
                                            <View style={{ paddingHorizontal: 8 }} />
                                        )} />
                                    </View>
                                </View>
                            </View>


                            <View style={{ paddingVertical: 15 }}>
                                <View style={{ padding: 10, backgroundColor: '#FFFFFF' }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{ color: '#000', fontSize: 17, fontWeight: '600', borderBottomWidth: 2, borderBottomColor: Color.primaryColor, width: '28%',  }}>Eco-Friendly</Text>
                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('ProductListiing')} style={{ flexDirection: 'row', alignItems: 'center', justifyContent:'center',  }}>
                                            <Text style={{ color: '#02518B', fontSize: 11, borderBottomColor: '#02518B', borderBottomWidth: 0.8 }}>See All</Text>
                                            <Icon name="arrow-forward-outline" type="ionicon" size={12} color="#02518B" style={{ top: 1 }} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ paddingTop: 15 }}>
                                        <FlatList showsHorizontalScrollIndicator={false} data={this.state.bestFitnessSellers} keyExtractor={(item, index) => index.toString()} horizontal={true} renderItem={({  item,index }) => (
                                            <View style={{ width: Dimensions.get('window').width/2.2 }}>
                                                    <View>
                                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('ProductDetail')}>
                                                            <Image source={item.pImg} style={{ height: 180, width: '100%', borderTopLeftRadius: 10, borderTopRightRadius: 10 }} />
                                                        </TouchableOpacity>
                                                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 5 }}>
                                                            <View>
                                                                <Text style={{ fontSize: 14, color: '#565656', textTransform: 'capitalize',  }}>{item.pName}</Text>
                                                                <Text style={{ fontSize: 11, color: '#565656', textTransform: 'capitalize',  }}>{item.pCompnyName}</Text>
                                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                    <Text style={{ fontSize: 17, color: '#565656', textTransform: 'capitalize', fontWeight: 'bold' }}>₹ {item.discounPrice}</Text>
                                                                    <Text style={{ fontSize: 13, color: '#565656', textTransform: 'capitalize', textDecorationLine: 'line-through', paddingLeft: 10 }}>₹ {item.price}</Text>
                                                                </View>
                                                            </View>
                                                            <Icon name="heart-outline" type="ionicon" size={20} color="#565656" />
                                                        </View>
                                                    </View>
                                            </View>
                                        )} ItemSeparatorComponent={() => (
                                            <View style={{ paddingHorizontal: 8 }} />
                                        )} />
                                    </View>
                                </View>
                            </View>





                            {/* <View style={{ alignSelf: 'center', paddingLeft: 10  }}>
                                <TouchableOpacity>
                                    <Image source={require('../../Assets/Images/Banner3.png')} style={{ height: 180, width: Dimensions.get('window').width/1 }} resizeMode="center" />
                                </TouchableOpacity>
                            </View> */}



                        </View>
                    </ScrollView>

                    

                </SafeAreaView>
            </View>
        )
    }
}
