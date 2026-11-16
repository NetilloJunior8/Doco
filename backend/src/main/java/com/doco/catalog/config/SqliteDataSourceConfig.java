package com.doco.catalog.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

/**
 * SQLite DataSource tuned for web concurrency: single-writer Hikari pool + WAL journal mode + busy_timeout.
 * Inactive when running under the 'postgres' profile.
 */
@Configuration
@Profile("sqlite")
public class SqliteDataSourceConfig {

    @Bean
    public DataSource dataSource(@Value("${app.sqlite.path:./data/doco-catalog.db}") String dbPath)
            throws IOException {
        Path filePath = Path.of(dbPath).toAbsolutePath().normalize();
        if (filePath.getParent() != null) {
            Files.createDirectories(filePath.getParent());
        }

        HikariConfig config = new HikariConfig();
        config.setPoolName("doco-sqlite-pool");
        config.setDriverClassName("org.sqlite.JDBC");
        config.setJdbcUrl("jdbc:sqlite:" + filePath);
        config.setMaximumPoolSize(1);
        config.setMinimumIdle(1);
        config.setConnectionInitSql(
                "PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000; PRAGMA foreign_keys=ON; PRAGMA synchronous=NORMAL;"
        );
        return new HikariDataSource(config);
    }
}
