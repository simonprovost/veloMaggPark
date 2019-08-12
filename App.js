import React, {Component} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import Map from './app/components/Map'
import {Header, Text} from "react-native-elements";


const deltas = {
	latitudeDelta: 0.0922,
	longitudeDelta: 0.0421
};

// A placeholder until we get our own location
const region = {
	latitude: 43.610769,
	longitude: 3.876716,
	latitudeDelta: 0.0922,
	longitudeDelta: 0.0421
};


global = {};
global.userName = '';
global.binaryName = '';
global.projectName = '';
global.branchName = '';
global.occupiedPlaces = "";
global.creditCardReader = "";
global.availablePlaces = "";
global.stationId = "";
global.latitude = "";
global.longitude = "";
global.stationName = "";
global.totalPlaces = "";
global.nameStations = [""];
global.XMLParser = require('react-xml-parser');
var parseString = require('react-native-xml2js').parseString;
window.DOMParser = require('xmldom').DOMParser;


global.output = "test";


class App extends Component {

	state = {
		services: ['null'],
		selectedService: global.nameStations[1],
		output: "",
		region: null,
		parkMarkers:  [],
	};

	componentWillMount() {
		this.getListOfVeloMaggPark();
	}

	static getRandomColor() {
		let letters = '0123456789ABCDEF';
		let color = '#';
		for (let i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}

	componentDidMount() {
		let allParkPos = () => {
			let array = [];

			fetch('https://data.montpellier3m.fr/sites/default/files/ressources/TAM_MMM_VELOMAG.xml')
				.then(response => response.text())
				.then((response) => {
					const xml = new global.XMLParser().parseFromString(response);    // Assume xmlText contains the example XML
					console.log("works!!");
					for (let i = 0 ; i < xml.getElementsByTagName('si').length ; i++) {

						global.occupiedPlaces = xml.getElementsByTagName('si')[i]['attributes']['av'];
						global.creditCardReader = xml.getElementsByTagName('si')[i]['attributes']['cb'];
						global.availablePlaces = xml.getElementsByTagName('si')[i]['attributes']['fr'];
						global.latitude = xml.getElementsByTagName('si')[i]['attributes']['la'];
						global.longitude = xml.getElementsByTagName('si')[i]['attributes']['lg'];
						global.stationName = xml.getElementsByTagName('si')[i]['attributes']['na'];
						global.totalPlaces = xml.getElementsByTagName('si')[i]['attributes']['to'];

						global.output = "";
						global.output += "Nombre total de places:" + global.totalPlaces + "\n";
						global.output += "Nombre de places occupées:" + global.occupiedPlaces + "\n";
						global.output += "Nombre de place libres:" + global.availablePlaces + "\n";
						if (global.creditCardReader === "1") {
							global.output += "Lecteur de CB disponible" + "\n";
						} else {
							global.output += "Lecteur de CB non disponible" + "\n";
						}

						this.setState({output: global.output});

						array.push({
							title: global.stationName.substr(global.stationName.indexOf(' ') + 1),
							description: global.output,
							color: App.getRandomColor(),
							coordinates: {
								latitude: parseFloat(global.latitude),
								longitude: parseFloat(global.longitude),
							},
						});
					}

				}).catch((err) => {
				console.log('fetch', err)
			});

			return array
		};

		this.setState({
			parkMarkers: allParkPos(),
		});
		setTimeout(() =>  {
			this.setState({
				services: global.nameStations,
			})
		}, 1000)
	};

	getListOfVeloMaggPark() {

		fetch('https://data.montpellier3m.fr/sites/default/files/ressources/TAM_MMM_VELOMAG.xml')
			.then(response => response.text())
			.then((response) => {
				const xml = new global.XMLParser().parseFromString(response);

				for (let i = 0 ; i < xml.getElementsByTagName('si').length ; i++)
					global.nameStations.push(xml.getElementsByTagName('si')[i]['attributes']['na']);

			}).catch((err) => {
			console.log('fetch', err)
		})

	};

	render () {

		return (
			<View style={styles.container}>
				<Header
					statusBarProps={{ barStyle: 'light-content' }}
					barStyle="light-content"
					centerComponent={<Text h3 style={{color: 'white', }}>{"Velo Magg Park"}</Text>}
					containerStyle={{
						backgroundColor: '#6495ED',
						justifyContent: 'space-around',
						height: "10%",
						borderBottomRightRadius: 60,
						borderBottomLeftRadius: 60,
						position: 'absolute',
						top: 0, left: 0, right: 0,
						zIndex: 1,
					}}
				/>
				<SafeAreaView style={styles.container}>
					<Map
						region={region}
						places={this.state.parkMarkers}
					/>

				</SafeAreaView>


			</View>

		);
	}


}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: '100%',
		zIndex: -1,
	},
	container2: {
		flex: 1,
	},
});

export default App;