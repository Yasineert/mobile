# Map-Based React Native Template

A starter template for map-based applications with React Native, featuring:

- MapView integration with react-native-maps
- Location services with geolocation
- Clean, minimal UI
- Tab-based navigation

## Features

- **Interactive Map:** Display a map with user location
- **Location Services:** Get user's current location
- **UI Components:** Search bar, location button, and more
- **Navigation:** Tab-based navigation with React Navigation

## Getting Started

### Prerequisites

- Node.js
- React Native development environment
- Android Studio or Xcode

### Installation

1. Clone the repository:
```
git clone <repository-url>
```

2. Install dependencies:
```
npm install
```

3. Run the app:
```
npm run android
# or
npm run ios
```

## Project Structure

- `/src/screens` - Main application screens
- `/src/navigators` - Navigation configuration
- `/src/components` - Reusable UI components
- `/src/assets` - Images and other static resources
- `/src/theme` - Styling constants

## Customization

### Adding Markers

You can add markers to the map by implementing the following in `MapScreen.tsx`:

```javascript
// 1. Add a marker data interface
interface MarkerData {
  id: number;
  name: string;
  description?: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

// 2. Add marker data in your component
const markerData: MarkerData[] = [
  {
    id: 1,
    name: "Location Name",
    description: "Location description",
    coordinates: {
      latitude: YOUR_LATITUDE,
      longitude: YOUR_LONGITUDE,
    },
  },
  // Add more markers here
];

// 3. Render markers in the MapView component
<MapView
  ...other props
>
  {markerData.map(marker => (
    <Marker
      key={marker.id}
      coordinate={marker.coordinates}
      title={marker.name}
      description={marker.description}
    />
  ))}
</MapView>
```

### Styling

Global styles and colors are defined in `src/theme/theme.js`.

## Dependencies

- react-native-maps
- @react-native-community/geolocation
- react-native-permissions
- @react-navigation/bottom-tabs
- react-native-vector-icons

## License

This project is licensed under the MIT License.
