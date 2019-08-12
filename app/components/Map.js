import React, { Component } from 'react'
import {View, Text, Button, TouchableOpacity, Image, SafeAreaView, TouchableHighlight} from 'react-native'
import { Icon } from 'react-native-elements'
import MapView, {AnimatedRegion, Callout} from 'react-native-maps';

const Marker = MapView.Marker;
let value = 0.8;

export const getCurrentLocation = () => {
	return new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(position => resolve(position), e => reject(e));
	});
};

class CustomCalloutView extends React.Component {

	render() {

		return (

			<View style={{
				flex: 1,
				flexDirection: "row"
			}}>
				<View>
					<Text style={{
						fontWeight: "bold",
						width: "100%",
						height: 100,
						margin: 10,
					}}>
						{this.props.title}
					</Text>
				</View>
				<View>
					<Text style={{

						fontWeight: "normal",
						width: "100%",
						height: 100,
						margin: 10,

					}}>
						{this.props.descr}
					</Text>
				</View>
			</View>



		)
	}
}

export default class Map extends Component
{

	state = {
		region:  {
			latitude: 43.610769,
			longitude: 3.876716,
			latitudeDelta: 0.0922,
			longitudeDelta: 0.0421
		},
	};

	renderMarkers() {
		return this.props.places.map((place, i) => (
			<Marker
				key={i}
				coordinate={place.coordinates}
				pinColor={place.color}
				opacity={value}
			>
				<Callout>
					<CustomCalloutView
						title={place.title}
						descr={place.description}
					/>
				</Callout>
			</Marker>

		))
	}

	_setPositionToTheUser() {
		console.log("je suis passé");
		getCurrentLocation().then(position => {
			if (position) {
				this.setState({
					region: {
						latitude: position.coords.latitude,
						longitude: position.coords.longitude,
						latitudeDelta: 0.009,
						longitudeDelta: 0.009,
					},
				});
			}
		});

	}

	render() {
		const buttonStyle = {
			alignItems:'center',
			justifyContent:'center',
			backgroundColor:'transparent',
		};

		return (
			<View>

				<MapView
					style={styles.container}
					region={this.state.region}
					showsUserLocation={true}
					showsMyLocationButton={true}
					showsBuildings={true}
				>
					{this.renderMarkers()}
				</MapView>

				<View style={{
					width: '100%',
					height: 50,
					justifyContent: 'center',
					alignItems: 'center',
					position: 'absolute',
					bottom: 30,
				}}>
					<TouchableOpacity
						style={buttonStyle}
						onPress={ ()=>{
							getCurrentLocation().then(position => {
								if (position) {
									this.setState({
										region: {
											latitude: position.coords.latitude,
											longitude: position.coords.longitude,
											latitudeDelta: 0.009,
											longitudeDelta: 0.009,
										},
									});
								}
							});
						}}
					>
						<Image style={{ width: 80, height: 80 }} source={require('./../../assets/localization.png')} />
					</TouchableOpacity>
				</View>



			</View>
		)
	}
}
const styles = {
	container: {
		width: '100%',
		height: '100%',
	}
};