import React from 'react';
import { Text, StyleSheet, View, ImageBackground, Image, TextInput, TouchableOpacity } from 'react-native';

/** Задний фон  */
const back = require("./../../assets/images/background.jpg")
const searchIcon = require("./../../assets/icons/searchIcon.png")

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
            .catch((error) => console.error(error))
            .finally(() => {
                this.setState({ isLoading: false });
            });
    }


    render() {
        return (
            <ImageBackground source={back} style={styles.container}>
                <View style={styles.searchBoxView}>
                    <TextInput style={styles.searchBox}
                        onChangeText={(text) => this.setState({ city: text })}
                        placeholder={"Введите город"} />
                    <TouchableOpacity onPress={this.fetch_weather}>
                        <Image style={styles.searchIcon} source={searchIcon} />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 3 / 5 }}>
                    <Text style={{ color: 'black' }}>{this.state.temp}</Text>
                    <Text style={{ color: 'black' }}>{this.state.city_display}</Text>
                </View>
            </ImageBackground>

        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: null,
        height: null,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchBoxView: {
        height: "20%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row"
    },
    searchBox: {
        height: "20%",
        width: "80%",
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 15,
        color: "black",
        paddingHorizontal: 15
    },
    searchIcon: {
        marginLeft: "2%",
        height: 25,
        width: 25,
        justifyContent: "center",
        alignItems: "center"
    }
})