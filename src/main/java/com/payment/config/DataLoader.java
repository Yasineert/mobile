package com.payment.config;

import com.payment.entity.Card;
import com.payment.entity.Trip;
import com.payment.repository.CardRepository;
import com.payment.repository.TripRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Configuration
@RequiredArgsConstructor
@Slf4j
@Profile("dev") // Active seulement si le profil "dev" est activé
public class DataLoader {

    private final CardRepository cardRepository;
    private final TripRepository tripRepository;
    private final Random random = new Random();
    
    @Value("${app.data-loader.enabled:false}")
    private boolean dataLoaderEnabled;
    
    @PostConstruct
    public void loadData() {
        if (!dataLoaderEnabled) {
            log.info("Data loader is disabled. Skipping data initialization.");
            return;
        }
        
        log.info("Starting data initialization...");
        
        if (cardRepository.count() == 0) {
            loadSeedData();
        } else {
            log.info("Database already contains data. Skipping initialization.");
        }
    }
    
    private void loadSeedData() {
        log.info("Loading seed data...");
        
        // Create sample cards for 5 users
        List<Card> cards = new ArrayList<>();
        cards.add(new Card("M-358914", 75.0, "user1", 15.0));
        cards.add(new Card("M-496238", 120.0, "user2", 10.0));
        cards.add(new Card("M-237651", 45.5, "user3", 20.0));
        cards.add(new Card("M-789124", 200.0, "user4", 5.0));
        cards.add(new Card("M-123456", 500.0, "admin", 25.0));
        
        cardRepository.saveAll(cards);
        log.info("Saved {} sample cards", cards.size());
        
        // Create sample trips
        List<Trip> trips = new ArrayList<>();
        
        // Locations in Marrakesh for realistic data
        String[] locations = {
            "Gueliz", 
            "Jamaa el-Fna", 
            "Medina", 
            "Majorelle Garden", 
            "Marrakesh Train Station", 
            "Palmeraie", 
            "Menara Mall", 
            "Bahia Palace", 
            "Marrakesh Airport", 
            "City Center", 
            "Agdal", 
            "Hivernage", 
            "Royal Palace", 
            "Mellah", 
            "Ben Youssef Madrasa"
        };
        
        // Bus lines in Marrakesh
        String[] busLines = {"L1", "L3", "L8", "L9", "L12", "L16", "L19", "L20", "L25"};
        String[] trainLines = {"M1", "M2", "T1", "T2", "T3"};
        
        // Generate trips for user1 (frequent traveler)
        generateTrips(trips, "user1", 20, locations, busLines, trainLines);
        
        // Generate trips for user2 (occasional traveler)
        generateTrips(trips, "user2", 10, locations, busLines, trainLines);
        
        // Generate trips for user3 (new user)
        generateTrips(trips, "user3", 5, locations, busLines, trainLines);
        
        // Generate trips for user4 (commuter)
        generateTrips(trips, "user4", 15, locations, busLines, trainLines);
        
        // Generate trips for admin (testing)
        generateTrips(trips, "admin", 3, locations, busLines, trainLines);
        
        tripRepository.saveAll(trips);
        log.info("Saved {} sample trips", trips.size());
        
        log.info("Seed data loaded successfully");
    }
    
    private void generateTrips(List<Trip> trips, String userId, int count, 
                             String[] locations, String[] busLines, String[] trainLines) {
        for (int i = 0; i < count; i++) {
            String fromLocation = locations[random.nextInt(locations.length)];
            
            // Ensure destination is different from origin
            String toLocation;
            do {
                toLocation = locations[random.nextInt(locations.length)];
            } while (toLocation.equals(fromLocation));
            
            // Determine transport type (80% bus, 20% train)
            String type = random.nextDouble() < 0.8 ? "bus" : "train";
            String line;
            double price;
            
            if (type.equals("bus")) {
                line = busLines[random.nextInt(busLines.length)];
                // Bus prices between 4.0 and 30.0 MAD
                price = 4.0 + (random.nextDouble() * 26.0);
                price = Math.round(price * 2) / 2.0; // Round to nearest 0.5
            } else {
                line = trainLines[random.nextInt(trainLines.length)];
                // Train prices between 50.0 and 200.0 MAD
                price = 50.0 + (random.nextDouble() * 150.0);
                price = Math.round(price * 2) / 2.0; // Round to nearest 0.5
            }
            
            // Generate random time in the past 30 days
            LocalDateTime time = LocalDateTime.now().minusDays(random.nextInt(30) + 1)
                                             .minusHours(random.nextInt(24))
                                             .minusMinutes(random.nextInt(60));
            
            Trip trip = new Trip(null, fromLocation, toLocation, line, price, time, userId, type);
            trips.add(trip);
        }
    }
} 