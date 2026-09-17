package com.postmanhelper.store;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

// Default store — a local CSV file. Zero setup for local dev, but not durable
// on hosts with an ephemeral disk (wiped on restart/redeploy). See
// PostgresLoginStore for the durable alternative used in production.
@Component
@Profile("!postgres")
public class CsvLoginStore implements LoginStore {

    private static final String HEADER = "email,timestamp,ip";
    private static final Object LOCK = new Object();

    @Value("${app.logins.csv.path:logins.csv}")
    private String csvPathProp;

    private Path csvPath() { return Paths.get(csvPathProp); }

    @Override
    public void append(String email, String timestamp, String ip) throws IOException {
        synchronized (LOCK) {
            Path path = csvPath();
            if (path.getParent() != null) {
                Files.createDirectories(path.getParent());
            }
            if (!Files.exists(path)) {
                Files.write(path, (HEADER + "\n").getBytes(StandardCharsets.UTF_8), StandardOpenOption.CREATE);
            }
            String line = String.format("%s,%s,%s%n", escape(email), timestamp, escape(ip));
            Files.write(path, line.getBytes(StandardCharsets.UTF_8), StandardOpenOption.APPEND);
        }
    }

    @Override
    public List<Map<String, String>> list() throws IOException {
        List<Map<String, String>> rows = readRows();
        Collections.reverse(rows);
        return rows;
    }

    @Override
    public String exportCsv() throws IOException {
        Path path = csvPath();
        return Files.exists(path)
                ? new String(Files.readAllBytes(path), StandardCharsets.UTF_8)
                : HEADER + "\n";
    }

    private List<Map<String, String>> readRows() throws IOException {
        List<Map<String, String>> rows = new ArrayList<>();
        Path path = csvPath();
        if (!Files.exists(path)) return rows;

        List<String> lines = Files.readAllLines(path, StandardCharsets.UTF_8);
        for (int i = 1; i < lines.size(); i++) { // skip header
            String line = lines.get(i);
            if (line.trim().isEmpty()) continue;
            String[] parts = line.split(",", -1);
            Map<String, String> row = new LinkedHashMap<>();
            row.put("email", parts.length > 0 ? unescape(parts[0]) : "");
            row.put("timestamp", parts.length > 1 ? parts[1] : "");
            row.put("ip", parts.length > 2 ? unescape(parts[2]) : "");
            rows.add(row);
        }
        return rows;
    }

    private String escape(String v) {
        if (v == null) return "";
        return v.contains(",") ? "\"" + v.replace("\"", "\"\"") + "\"" : v;
    }

    private String unescape(String v) {
        if (v != null && v.startsWith("\"") && v.endsWith("\"")) {
            return v.substring(1, v.length() - 1).replace("\"\"", "\"");
        }
        return v;
    }
}
