import * as React from 'react';
import { useState, useEffect } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { listLogEntries } from './API';
import { ReactComponent as Edit } from './assets/edit.svg';
import { ReactComponent as Close } from './assets/close.svg';
import { ReactComponent as Bin } from './assets/bin.svg';
import { ReactComponent as Location } from './assets/location-icon.svg';
import LogEntryForm from './LogEntryForm';

const App = () => {
  const [logEntries, setLogEntries] = useState([]);
  const [showPopup, setShowPopup] = useState({});
  const [addEntryLocation, setAddEntryLocation] = useState(null);
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 28.5535,
    longitude: 77.2588,
    zoom: 8
  });

  const getEntries = async () => {
    const logEntries = await listLogEntries();
    setLogEntries(logEntries);
  }

  useEffect(() => {
    getEntries();
  }, []);

  const showAddMarkerPopup = (e) => {
    const [longitude, latitude] = e.lngLat;
    setAddEntryLocation({
      latitude,
      longitude,
    })

  }

  return (
    <ReactMapGL
      {...viewport}
      mapStyle={'mapbox://styles/dep121/ckbysda0x39gv1hqufi2yuv5h'}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onViewportChange={nextViewport => setViewport(nextViewport)}
      onDblClick={showAddMarkerPopup}
    >
      {
        logEntries.map(entry => (
          <React.Fragment key={entry._id}>
            <Marker
              latitude={entry.latitude}
              longitude={entry.longitude}
            >
              <div
                onClick={() => setShowPopup({
                  ...showPopup,
                  [entry._id]: true,
                })}
              >
                <Location
                  className='marker'
                  style={{
                    height: `${6 * viewport.zoom}px`,
                    width: `${6 * viewport.zoom}px`,
                  }}
                  fill='orange'
                />
              </div>
            </Marker>
            {
              showPopup[entry._id] ?
                (
                  <Popup
                    key={entry._id + 'popup'}
                    latitude={entry.latitude}
                    longitude={entry.longitude}
                    closeButton={false}
                    closeOnClick={false}
                    anchor="top"
                    className={'popupWrapper'}
                  >
                    <div className="popup">
                      <div className="actions" >
                        <span className='left'>
                          <Edit title='edit-button' className='image' />
                          <Bin title='delete-button' className='image' />
                        </span>
                        <span className='right'>
                          <Close title='close-button' className='image right'
                            onClick={() => setShowPopup({ ...showPopup, [entry._id]: false })}
                          />
                        </span>
                      </div>
                      <h3>{entry.title}</h3>
                      <p>{entry.comments}</p>
                      <small>Visited on: {new Date(entry.visitDate).toLocaleDateString()}</small>
                      {entry.image ? <img src={entry.image} alt={entry.title} /> : null}
                    </div>
                  </Popup>
                ) : null
            }
          </React.Fragment>
        ))
      }
      {
        addEntryLocation ? (
          <>
            <Marker
              latitude={addEntryLocation.latitude}
              longitude={addEntryLocation.longitude}
            >
              <div>
                <img
                  className="marker"
                  style={{
                    height: `${6 * viewport.zoom}px`,
                    width: `${6 * viewport.zoom}px`,
                  }}
                  src="https://i.imgur.com/y0G5YTX.png"
                  alt="marker"
                />
              </div>
            </Marker>
            <Popup
              latitude={addEntryLocation.latitude}
              longitude={addEntryLocation.longitude}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setAddEntryLocation(null)}
              anchor="top"
            >
              <div className="popup">
                <LogEntryForm onClose={()=>{
                  setAddEntryLocation(null);
                  getEntries();
                }} location={addEntryLocation} />
              </div>
            </Popup>
          </>
        ) : null
      }
    </ReactMapGL>
  );
}

export default App;