import React, {Component} from 'react';
import {View, Text, Image} from 'react-native';
import {Icon} from 'react-native-elements';
import {Marker, Callout} from 'react-native-maps';
import MapView from 'react-native-map-clustering';

export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      position => resolve(position),
      e => reject(e),
    );
  });
};

class CustomCalloutView extends React.Component {
  render() {
    let creditCard =
      this.props.creditCardReader === '1' ? (
        <View style={styles.bottomLeftIcon}>
          <Icon
            name="cc-visa"
            type={'font-awesome'}
            color="#6495ED"
            size={28}
          />
        </View>
      ) : (
        <View />
      );

    return (
      <View style={styles.popupView}>
        <Text style={styles.titlePopup}>{this.props.title}</Text>

        <View style={styles.bottomLeftSide}>
          <Text style={styles.descrPopup}>{this.props.occupiedPlaces}</Text>
          <View style={styles.bottomLeftIcon}>
            <Icon name="ios-bicycle" type="ionicon" color="#6495ED" />
          </View>
          <View style={styles.separator}>
            <Icon name="ellipsis-v" type={'font-awesome'} color="grey" />
          </View>
          <Text style={styles.descrPopup}>{this.props.availablePlaces}</Text>
          <Icon name="local-parking" color="#6495ED" size={28} />
          {creditCard}
        </View>
      </View>
    );
  }
}

export default class Map extends Component {
  state = {
    bottomMargin: 1,
    region: {
      latitude: 43.610769,
      longitude: 3.876716,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
  };

  renderMarkers() {
    return this.props.places.map((place, i) => (
      <Marker
        key={i}
        coordinate={place.coordinates}
        pinColor={place.color}
        opacity={0.8}>
        {/* <Image
          source={require('./../../assets/bicycle_1.png')}
          style={{
            width: 28,
            height: 28,
            resizeMode: 'contain',
            tintColor: place.color,
          }}
        />
*/}

        <Icon name="ios-bicycle" type="ionicon" color={place.color} size={30} />

        <Callout tooltip={true}>
          <CustomCalloutView
            title={place.title}
            availablePlaces={place.availablePlaces}
            occupiedPlaces={place.occupiedPlaces}
            creditCardReader={place.creditCardReader}
          />
        </Callout>
      </Marker>
    ));
  }

  componentDidMount() {}

  render() {
    return (
      <View>
        <MapView
          style={styles.container}
          initialRegion={this.state.region}
          clusterColor={'#6495ED'}
          showsUserLocation={true}
          showsMyLocationButton={true}
          showsBuildings={true}>
          {this.renderMarkers()}
        </MapView>
      </View>
    );
  }
}

const styles = {
  container: {
    width: '100%',
    height: '100%',
  },
  popupView: {
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRadius: 10,
    width: 200,
  },
  titlePopup: {
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  descrPopup: {
    fontWeight: 'normal',
    fontFamily: 'Roboto',
    fontSize: 18,
  },
  bottomLeftSide: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    verticalAlign: 'center',
    alignContent: 'center',
  },
  bottomLeftIcon: {
    marginLeft: 5,
  },
  separator: {
    marginLeft: 5,
    marginRight: 5,
  },
};
