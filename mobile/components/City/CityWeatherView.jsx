import React from 'react';
import { Text, StyleSheet, View, ImageBackground, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import imageDictionary from './../../utils/imageDictionary';

const searchIcon = require("./../../assets/icons/search.png")
const personageCity = require("./../../assets/personageCity.png")
const airplane1 = require("./../../assets/airplane1.png")
const airplane2 = require("./../../assets/airplane2.png")
const airplane3 = require("./../../assets/airplane3.png")

let customFonts = {
    'PlayfairDisplay': require('./../../assets/fonts/PlayfairDisplay-Bold.ttf'),
    'Tillana': require('./../../assets/fonts/Tillana-SemiBold.ttf'),
    'Roboto': require('./../../assets/fonts/Roboto-Medium.ttf'),
};

function timestampToDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + '.' + mm + '.' + yyyy;
    return today;
}

/** Вью погоды по поиску города  */
export default class CityWeatherView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: "",
            isLoading: true,
            temp: "",
            city: "Kazan",
            icon: "",
            city_display: "",
            desc: "",
            main: "",
            humidity: "",
            pressure: "",
            visiblity: "",
            fontsLoaded: false,
            wind: "?",
            feels_like: "?",
        }
        this.fetch_weather()
    }

    fetch_weather = () => {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${this.state.city}&appid=ae4b4e0ee9db8f4040b03a514cf7a928`)
            .then((response) => response.json())
            .then((json) => {
                this.setState({ data: timestampToDate() });
                this.setState({ temp: Math.round(json.main.temp - 273) + "°C" })
                this.setState({ city_display: json.name })
                this.setState({ icon: json.weather[0].icon })
                this.setState({ desc: json.weather[0].description })
                this.setState({ main: json.weather[0].main })
                this.setState({ humidity: json.main.humidity + " %" })
                this.setState({ pressure: json.main.pressure + " hPa" })
                this.setState({ visibility: (json.visibility / 1000).toFixed(2) + " Km" })
                this.setState({ wind: json.wind.speed })
                this.setState({ feels_like: json.main.feels_like - 273 })

            })
            .catch((error) => Alert.alert("Такого города не существует"))
            .finally(() => {
                this.setState({ isLoading: false });
            });
    }

    async _loadFontsAsync() {
        await Font.loadAsync(customFonts);
        this.setState({ fontsLoaded: true });
    }

    componentDidMount() {
        this._loadFontsAsync();
    }

    render() {
        if (this.state.fontsLoaded) {
            return (
                <ImageBackground source={imageDictionary['background']} style={styles.back}>
                    <View style={styles.container}>

                        <View style={styles.cityView}>
                            <Text style={styles.city}>{this.state.city_display}</Text>
                            <View style={styles.searchBoxView}>
                                <TextInput style={styles.searchBox}
                                    onChangeText={(text) => this.setState({ city: text })}
                                    placeholder={"Введите город"}>
                                </TextInput>
                                <TouchableOpacity onPress={this.fetch_weather}>
                                    <Image style={styles.searchIcon} source={searchIcon} />
                                </TouchableOpacity>
                            </View>
                        </View>


                        <View style={styles.info}>
                            <View style={styles.weather}>
                                <Text style={styles.date}>{this.state.data}</Text>
                                <Text style={styles.temp}>{this.state.temp}</Text>
                                <Image source={imageDictionary[this.state.icon
                                ] || imageDictionary["02d"]}
                                    style={styles.todayWeatherIcon}></Image>
                            </View>
                            <View style={styles.wind}>
                                <Text style={{
                                    fontFamily: 'Roboto',
                                    textDecorationLine: 'underline',
                                    fontSize: 18,
                                    color: '#6B7AC9',
                                    paddingRight: 11,
                                    paddingTop: 5
                                }}>По ощущениям: {Math.round(this.state.feels_like)}°C</Text>
                                <Text style={{
                                    fontFamily: 'Roboto',
                                    textDecorationLine: 'underline',
                                    fontSize: 18,
                                    color: '#6B7AC9',
                                    paddingLeft: 11,
                                    paddingTop: 5
                                }}>Ветер: {Math.round(this.state.wind)} м/с</Text>
                            </View>
                        </View>

                        <View style={styles.personage}>
                            <View style={styles.airplanes}>
                                <View style={{ alignItems: 'center' }}>
                                    <Image source={airplane1} style={{ width: 50, height: 50 }} />
                                </View>
                                <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
                                    <Image source={airplane3} style={{ width: 50, height: 50, marginHorizontal: 60 }} />
                                    <Image source={airplane2} style={{ width: 50, height: 50, marginHorizontal: 60 }} />
                                </View>
                            </View>
                            <View style={styles.personageContainer}>
                                <Image source={personageCity} style={styles.personageImage}></Image>
                            </View>
                        </View>
                    </View>
                </ImageBackground>

            );
        }
        else { return <AppLoading />; }
    }
}


const styles = StyleSheet.create({
    back: {
        flex: 1,
        width: null,
        height: null,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
    },
    searchBoxView: {
        flex: 1 / 4,
        height: "20%",
        width: "100%",
        justifyContent: 'center',
        alignItems: 'flex-start',
        flexDirection: "row",
    },
    searchBox: {
        height: 50,
        width: 250,
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 15,
        color: "black",
        paddingHorizontal: 15,
        fontSize: 20
    },
    searchIcon: {
        marginLeft: 5,
        height: 52,
        width: 62,
        justifyContent: "center",
        alignItems: "center"
    },

    cityView: {
        flex: 1 / 2,
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 80,
    },
    info: {
        flex: 1 / 2,
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },

    personage: {
        flex: 1,
        flexDirection: 'column',
    },
    city: {
        fontFamily: 'PlayfairDisplay',
        fontWeight: 'bold',
        fontSize: 36,
        color: '#6B7AC9',
        paddingTop: 60,
        paddingBottom: 20,
    },

    weather: {
        flex: 3 / 5,
        width: '90%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        backgroundColor: '#C0CDFE',
        borderRadius: 20,
    },
    temp: {
        fontFamily: 'Tillana',
        fontWeight: 'bold',
        fontSize: 36,
        color: '#4F48A2',
    },
    date: {
        fontFamily: 'Tillana',
        fontWeight: 'bold',
        fontSize: 20,
        color: '#4F48A2',
        marginLeft: '5%'
    },
    todayWeatherIcon: {
        height: 50,
        width: 50,
        marginRight: '5%'
    },

    wind: {
        flex: 1 / 5,
        width: '90%',
        justifyContent: 'center',
        flexDirection: 'row',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },

    airplanes: {
        flex: 1,
        flexDirection: 'column',
        paddingTop: 40
    },

    personageContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    personageImage: {
        width: 200,
        height: 200
    }
})