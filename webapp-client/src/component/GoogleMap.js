import React from 'react';
import PropTypes, {func} from 'prop-types';

function NoLocation() {
  return (
    <div
      className="notification has-text-centered"
      style={{margin: '30vh auto', fontSize: '25px'}}
    >
      No location linked
    </div>
  );
}

function HasLocation(props) {
  return (
    <div
      ref={props.googleMapRef}
      style={{width: '550px', height: '412.5px', margin: '25vh auto'}}
    ></div>
  );
}

export default class GoogleMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasLocation: true,
    };
    this.googleMapRef = React.createRef();
    this.noLocation = this.noLocation.bind(this);
  }

  componentDidMount() {
    const googleMapScript = document.createElement('script');
    googleMapScript.src =
      `https://maps.googleapis.com/maps/api/js?key=` +
      process.env.REACT_APP_API_KEY +
      `&libraries=places`;
    window.document.body.appendChild(googleMapScript);
    googleMapScript.addEventListener('load', this.loadMap);
  }

  noLocation() {
    this.setState({
      hasLocation: false,
    });
  }

  loadMap = () => {
    if (!this.props.placeId || this.props.placeId === 'something') {
      this.noLocation();
    } else {
      const map = new window.google.maps.Map(this.googleMapRef.current, {
        zoom: 8,
        center: {lat: 40.72, lng: -73.96},
      });
      const findPlace = new window.google.maps.places.PlacesService(map);
      const infowindow = new window.google.maps.InfoWindow();
      const request = {
        placeId: this.props.placeId,
        fields: [
          'name',
          'formatted_address',
          'international_phone_number',
          'website',
          'rating',
          'geometry',
        ],
      };
      findPlace.getDetails(request, (results, status) => {
        if (status === 'OK') {
          map.setZoom(13);
          map.setCenter(results.geometry.location);
          const marker = new window.google.maps.Marker({
            map,
            position: results.geometry.location,
          });
          let content = '';
          if (results.name) {
            content +=
              '<div style="font-size:18px"><p style="font-size:20px"><strong>' +
              results.name +
              '</strong></p><br>';
          }
          const addField = (title, info) => {
            if (info) {
              content += '<strong>' + title + ': </strong>' + info + '<br>';
            }
          };
          addField('Address', results.formatted_address);
          addField('Rating', results.rating);
          addField('Phone', results.international_phone_number);
          addField('Website', results.website);

          content += '</div>';

          infowindow.setContent(content);
          infowindow.open(map, marker);
        } else {
          this.noLocation();
        }
      });
    }
  };

  render() {
    let content;
    if (this.state.hasLocation) {
      content = <HasLocation googleMapRef={this.googleMapRef} />;
    } else {
      content = <NoLocation />;
    }
    return (
      <>
        <div className="container">
          <div className="modal is-active">
            <div className="modal-background">
              <div className="modal-content is-vcentered"></div>
              {content}
              <button
                className="modal-close is-large"
                aria-label="close"
                onClick={() => this.props.setShowMap(false)}
              ></button>
            </div>
          </div>
        </div>
      </>
    );
  }
}

GoogleMap.propTypes = {
  setShowMap: PropTypes.func.isRequired,
  placeId: PropTypes.string.isRequired,
};
