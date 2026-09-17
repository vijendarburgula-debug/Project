package com.postmanhelper.store;

import java.io.IOException;
import java.util.List;
import java.util.Map;

// Abstracts where login records are persisted — a local CSV file by default,
// or Postgres in production (see CsvLoginStore / PostgresLoginStore).
public interface LoginStore {

    void append(String email, String timestamp, String ip) throws IOException;

    // Newest first.
    List<Map<String, String>> list() throws IOException;

    // Raw CSV content (header + rows), for the export endpoint.
    String exportCsv() throws IOException;
}
