import React from 'react';
import { Text, StyleSheet, View, ImageBackground, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';


/** Задний фон  */
const back = require("./../../assets/images/background.jpg")
const searchIcon = require("./../../assets/icons/search.png")

let customFonts = {
    'PlayfairDisplay': require('./../../assets/fonts/PlayfairDisplay-Bold.ttf'),
};

/** Вью погоды по поиску города  */
export default class CityWeatherView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
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
        }
        this.fetch_weather()
    }

    fetch_weather = () => {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${this.state.city}&appid=ae4b4e0ee9db8f4040b03a514cf7a928`)
            .then((response) => response.json())
            .then((json) => {
                this.setState({ data: json });
                this.setState({ temp: Math.round(json.main.temp - 273) + "°C" })
                this.setState({ city_display: json.name })
                this.setState({ icon: json.weather[0].icon })
                this.setState({ desc: json.weather[0].description })
                this.setState({ main: json.weather[0].main })
                this.setState({ humidity: json.main.humidity + " %" })
                this.setState({ pressure: json.main.pressure + " hPa" })
                this.setState({ visibility: (json.visibility / 1000).toFixed(2) + " Km" })
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
                <ImageBackground source={back} style={styles.back}>
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

                        <View style={styles.weather}>
                            <Text style={styles.temp}>{this.state.temp}</Text>
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
        flex: 1 / 4,
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    city: {
        fontFamily: 'PlayfairDisplay',
        fontWeight: 'bold',
        fontSize: 36,
        color: '#6B7AC9',
        paddingTop: 50,
        paddingBottom: 20,
    },

    weather: {
        flex: 3 / 4,
        height: '100%',
        width: '100%',
        alignItems: 'center',
    },
    temp: {
        fontFamily: 'PlayfairDisplay',
        fontWeight: 'bold',
        fontSize: 20,
        color: '#6B7AC9',
    }
})