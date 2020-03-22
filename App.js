import React, {Component} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import Map from './app/components/Map'
import {Header, Text} from "react-native-elements";
import {AppLoading,} from "expo";
import {default as XMLParser_} from "react-xml-parser"


class App extends Component {
	state = {
		parkMarkers:  [],
		loading: true,
	};

	componentWillMount() {
	}

	static getRandomColor() {
		let letters = '0123456789ABCDEF';
		let color = '#';
		for (let i = 0; i < 6; i++)
			color += letters[Math.floor(Math.random() * 16)];
		return color;
	}

	componentDidMount() {
		this._allParkPos();
	};

	_allParkPos =  () => {
		let array = [];
		let XMLParser = require('react-xml-parser');

		fetch('https://data.montpellier3m.fr/sites/default/files/ressources/TAM_MMM_VELOMAG.xml')
			.then(response => response.text())
			.then((response) => {
				const xml = new XMLParser().parseFromString(response);    // Assume xmlText contains the example XML
				for (let i = 0 ; i < xml.getElementsByTagName('si').length ; i++) {

					let occupiedPlaces = xml.getElementsByTagName('si')[i]['attributes']['av'];
					let creditCardReader = xml.getElementsByTagName('si')[i]['attributes']['cb'];
					let availablePlaces = xml.getElementsByTagName('si')[i]['attributes']['fr'];
					let latitude = xml.getElementsByTagName('si')[i]['attributes']['la'];
					let longitude = xml.getElementsByTagName('si')[i]['attributes']['lg'];
					let stationName = xml.getElementsByTagName('si')[i]['attributes']['na'];
					let totalPlaces = xml.getElementsByTagName('si')[i]['attributes']['to'];

					let output = "";
					output += "Nombre total de places:" + totalPlaces + "\n";
					output += "Nombre de places occupées:" + occupiedPlaces + "\n";
					output += "Nombre de place libres:" + availablePlaces + "\n";

					if (creditCardReader === "1")
						output += "Lecteur de CB disponible" + "\n";
					else
						output += "Lecteur de CB non disponible" + "\n";

					array.push({
						title: stationName.substr(stationName.indexOf(' ') + 1),
						occupiedPlaces: occupiedPlaces,
						availablePlaces: availablePlaces,
						creditCardReader: creditCardReader,
						color: App.getRandomColor(),
						coordinates: {
							latitude: parseFloat(latitude),
							longitude: parseFloat(longitude),
						},
					});
				}
				this.setState({loading: false})
			}).catch((err) => {
				alert("an error was occured. Try to restart the app.")
		});
		this.setState({parkMarkers: array,});
	};

	render () {
		const {parkMarkers, loading} = this.state;

		if (loading) {
			return (
				<View>
					<AppLoading />
				</View>
			);
		}

		return (
			<View style={styles.container}>
				<Header
					statusBarProps={{ barStyle: 'light-content' }}
					barStyle="light-content"
					centerComponent={<Text h4 style={styles.titleHeader}>{"Velo Magg Park"}</Text>}
					containerStyle={styles.header}
				/>
				<SafeAreaView style={{	width: '100%',
					height: '100%', marginTop: '20%'}}>
					<Map region={region} places={parkMarkers} />
				</SafeAreaView>
			</View>
		);
	}
}

// A placeholder until we get our own location
const region = {
	latitude: 43.610769,
	longitude: 3.876716,
	latitudeDelta: 0.0922,
	longitudeDelta: 0.0421
};


const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: '100%',
	},
	container2: {
		flex: 1,
	},
	header: {
		backgroundColor: '#6495ED',
		justifyContent: 'space-around',
		height: "10%",
		position: 'absolute',
		top: 0, left: 0, right: 0,
		zIndex: 1,
	},
	titleHeader: {
		color: 'white',
	},
});

export default App;