package com.postmanhelper.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.postmanhelper.model.ProxyRequest;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/proxy")
public class ProxyController {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ProxyController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @PostMapping("/execute")
    public ResponseEntity<Map<String, Object>> execute(@RequestBody ProxyRequest request) {
        try {
            // Build headers
            HttpHeaders headers = new HttpHeaders();
            if (request.getHeaders() != null) {
                request.getHeaders().forEach(headers::set);
            }

            // Build URL with query params
            UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(request.getUrl());
            if (request.getQueryParams() != null) {
                request.getQueryParams().forEach(uriBuilder::queryParam);
            }
            String url = uriBuilder.build(false).toUriString();

            HttpEntity<Object> entity = new HttpEntity<>(request.getBody(), headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.valueOf(request.getMethod().toUpperCase()),
                    entity,
                    String.class
            );

            Map<String, Object> result = new LinkedHashMap<>();
            result.put("status", response.getStatusCode().value());
            result.put("body", parseBody(response.getBody()));
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            Map<String, Object> error = new LinkedHashMap<>();
            error.put("status", 500);
            error.put("error", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    private Object parseBody(String body) {
        if (body == null || body.trim().isEmpty()) return null;
        try {
            return objectMapper.readValue(body, Object.class);
        } catch (Exception e) {
            return body;
        }
    }
}
