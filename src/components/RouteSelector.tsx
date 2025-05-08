import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"

interface RouteSelectorProps {
  origin: string
  destination: string
  route: any
  onSelectTransport: (transportType: string) => void
}

const RouteSelector: React.FC<RouteSelectorProps> = ({ origin, destination, route, onSelectTransport }) => {
  return (
    <View style={styles.container}>
      <View style={styles.routeInfo}>
        <Text style={styles.routeTitle}>
          {origin} → {destination}
        </Text>
        {route && (
          <View style={styles.routeDetails}>
            <View style={styles.routeBadge}>
              <Text style={styles.routeBadgeText}>{route.id}</Text>
            </View>
            <Text style={styles.routeTime}>35 min</Text>
            <Text style={styles.routeDistance}>5.2 km</Text>
          </View>
        )}
      </View>

      <View style={styles.transportSelector}>
        <TouchableOpacity
          style={[styles.transportButton, styles.transportButtonActive]}
          onPress={() => onSelectTransport("bus")}
        >
          <Ionicons name="bus" size={20} color="#1E88E5" />
          <Text style={styles.transportButtonTextActive}>Bus</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.transportButton} onPress={() => onSelectTransport("tram")}>
          <Ionicons name="train" size={20} color="#666" />
          <Text style={styles.transportButtonText}>Tram</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
    paddingTop: 15,
  },
  routeInfo: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  routeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  routeDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  routeBadge: {
    backgroundColor: "#1E88E5",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginRight: 10,
  },
  routeBadgeText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  routeTime: {
    fontSize: 14,
    fontWeight: "500",
    marginRight: 10,
  },
  routeDistance: {
    fontSize: 14,
    color: "#666",
  },
  transportSelector: {
    flexDirection: "row",
    paddingVertical: 15,
  },
  transportButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  transportButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#1E88E5",
  },
  transportButtonText: {
    marginLeft: 5,
    fontSize: 16,
    color: "#666",
  },
  transportButtonTextActive: {
    marginLeft: 5,
    fontSize: 16,
    color: "#1E88E5",
    fontWeight: "500",
  },
})

export default RouteSelector
