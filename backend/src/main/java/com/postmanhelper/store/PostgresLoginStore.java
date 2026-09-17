package com.postmanhelper.store;

import com.postmanhelper.model.LoginRecordEntity;
import com.postmanhelper.repository.LoginRecordRepository;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

// Durable store used in production — survives restarts/redeploys, unlike the
// default CSV file on hosts with an ephemeral disk. Active only when
// SPRING_PROFILES_ACTIVE=postgres (see application-postgres.properties).
@Component
@Profile("postgres")
public class PostgresLoginStore implements LoginStore {

    private static final String HEADER = "email,timestamp,ip";

    private final LoginRecordRepository repository;

    public PostgresLoginStore(LoginRecordRepository repository) {
        this.repository = repository;
    }

    @Override
    public void append(String email, String timestamp, String ip) {
        LoginRecordEntity entity = new LoginRecordEntity();
        entity.setEmail(email);
        entity.setTimestamp(timestamp);
        entity.setIp(ip);
        repository.save(entity);
    }

    @Override
    public List<Map<String, String>> list() {
        return repository.findAllByOrderByIdDesc().stream()
                .map(this::toRow)
                .collect(Collectors.toList());
    }

    @Override
    public String exportCsv() {
        StringBuilder sb = new StringBuilder(HEADER).append("\n");
        // Oldest first in the CSV export, matching the original file format.
        List<LoginRecordEntity> ordered = repository.findAll();
        for (LoginRecordEntity e : ordered) {
            sb.append(escape(e.getEmail())).append(',')
              .append(e.getTimestamp()).append(',')
              .append(escape(e.getIp())).append('\n');
        }
        return sb.toString();
    }

    private Map<String, String> toRow(LoginRecordEntity e) {
        Map<String, String> row = new LinkedHashMap<>();
        row.put("email", e.getEmail());
        row.put("timestamp", e.getTimestamp());
        row.put("ip", e.getIp());
        return row;
    }

    private String escape(String v) {
        if (v == null) return "";
        return v.contains(",") ? "\"" + v.replace("\"", "\"\"") + "\"" : v;
    }
}
