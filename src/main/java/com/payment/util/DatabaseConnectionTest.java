package com.payment.util;

import javax.sql.DataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import lombok.extern.slf4j.Slf4j;

import java.sql.Connection;
import java.sql.SQLException;

/**
 * Utility class to test database connectivity
 * Run with: mvn spring-boot:run -Dspring-boot.run.profiles=dbtest
 */
@Component
@Slf4j
public class DatabaseConnectionTest {

    @Autowired
    private DataSource dataSource;
    
    @Bean
    @Profile("dbtest")
    public CommandLineRunner testDatabaseConnection() {
        return args -> {
            log.info("Testing database connection...");
            
            try (Connection connection = dataSource.getConnection()) {
                log.info("Database connection successful!");
                log.info("Database product name: {}", connection.getMetaData().getDatabaseProductName());
                log.info("Database product version: {}", connection.getMetaData().getDatabaseProductVersion());
                log.info("JDBC driver name: {}", connection.getMetaData().getDriverName());
                log.info("JDBC driver version: {}", connection.getMetaData().getDriverVersion());
                log.info("JDBC URL: {}", connection.getMetaData().getURL());
                log.info("Connected user: {}", connection.getMetaData().getUserName());
            } catch (SQLException e) {
                log.error("Failed to connect to database!", e);
                throw e;
            }
            
            // Test query execution
            JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
            try {
                int result = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
                log.info("Query executed successfully, result: {}", result);
            } catch (Exception e) {
                log.error("Failed to execute test query!", e);
                throw e;
            }
            
            log.info("Database connection test completed successfully!");
        };
    }
} 