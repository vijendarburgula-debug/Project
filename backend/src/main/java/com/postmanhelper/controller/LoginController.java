package com.postmanhelper.controller;

import com.postmanhelper.model.LoginRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.time.Instant;
import java.util.*;

// Lightweight "who's using this tool" tracker — no passwords, no accounts.
// Anyone can type any email to get in; every login is appended to logins.csv
// so it can be opened directly in Excel or queried through this API.
@RestController
@RequestMapping("/api/auth")
public class LoginController {

    private static final Path CSV_PATH = Paths.get("logins.csv");
    private static final String HEADER = "email,timestamp,ip";
    private static final Object LOCK = new Object();

    @Value("${app.admin.email}")
    private String adminEmail;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest req, HttpServletRequest httpReq) {
        String email = req.getEmail() == null ? "" : req.getEmail().trim();
        if (email.isEmpty() || !email.contains("@")) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "A valid email is required."));
        }

        String timestamp = Instant.now().toString();
        String ip = httpReq.getRemoteAddr();

        try {
            appendRow(email, timestamp, ip);
        } catch (IOException e) {
            return ResponseEntity.status(500).body(Collections.singletonMap("error", "Could not record login: " + e.getMessage()));
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", "ok");
        result.put("email", email);
        result.put("timestamp", timestamp);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/logins")
    public ResponseEntity<?> logins(@RequestParam(required = false) String requesterEmail) throws IOException {
        if (!isAdmin(requesterEmail)) {
            return ResponseEntity.status(403).body(Collections.singletonMap("error", "Admin access only."));
        }
        List<Map<String, String>> rows = readRows();
        Collections.reverse(rows); // newest first
        return ResponseEntity.ok(rows);
    }

    @GetMapping("/logins/export")
    public ResponseEntity<?> exportCsv(@RequestParam(required = false) String requesterEmail) throws IOException {
        if (!isAdmin(requesterEmail)) {
            return ResponseEntity.status(403).body(Collections.singletonMap("error", "Admin access only."));
        }
        byte[] bytes = Files.exists(CSV_PATH)
                ? Files.readAllBytes(CSV_PATH)
                : (HEADER + "\n").getBytes(StandardCharsets.UTF_8);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"logins.csv\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(bytes);
    }

    private boolean isAdmin(String requesterEmail) {
        return requesterEmail != null && requesterEmail.trim().equalsIgnoreCase(adminEmail.trim());
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private void appendRow(String email, String timestamp, String ip) throws IOException {
        synchronized (LOCK) {
            boolean isNew = !Files.exists(CSV_PATH);
            if (isNew) {
                Files.write(CSV_PATH, (HEADER + "\n").getBytes(StandardCharsets.UTF_8), StandardOpenOption.CREATE);
            }
            String line = String.format("%s,%s,%s%n", escape(email), timestamp, escape(ip));
            Files.write(CSV_PATH, line.getBytes(StandardCharsets.UTF_8), StandardOpenOption.APPEND);
        }
    }

    private List<Map<String, String>> readRows() throws IOException {
        List<Map<String, String>> rows = new ArrayList<>();
        if (!Files.exists(CSV_PATH)) return rows;

        List<String> lines = Files.readAllLines(CSV_PATH, StandardCharsets.UTF_8);
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
