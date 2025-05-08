import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import { Marker, Callout } from "react-native-maps"
import { busRoutes } from "../data/busData"

interface BusStopMarkerProps {
  coordinate: {
    latitude: number
    longitude: number
  }
  stopId: string
  routeId: string
}

const BusStopMarker: React.FC<BusStopMarkerProps> = ({ coordinate, stopId, routeId }) => {
  // Find the route to get its color
  const route = busRoutes.find((r) => r.id === routeId)
  const routeColor = route ? route.color : "#000000"

  // Extract the numeric part from the stopId (e.g., "L12" -> "12")
  const displayId = stopId.replace(/[^\d]/g, "")

  return (
    <Marker coordinate={coordinate}>
      <View style={[styles.markerContainer, { backgroundColor: "#333333" }]}>
        <Text style={styles.markerText}>{displayId}</Text>
      </View>
      <Callout>
        <View style={styles.calloutContainer}>
          <Text style={styles.calloutTitle}>Bus Stop {stopId}</Text>
          <Text style={styles.calloutSubtitle}>Route: {routeId}</Text>
          <Text style={styles.calloutInfo}>Next bus: 5 min</Text>
        </View>
      </Callout>
    </Marker>
  )
}

const styles = StyleSheet.create({
  markerContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  markerText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  calloutContainer: {
    width: 150,
    padding: 10,
  },
  calloutTitle: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 5,
  },
  calloutSubtitle: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
  },
  calloutInfo: {
    fontSize: 12,
    color: "#1E88E5",
  },
})

export default BusStopMarker
