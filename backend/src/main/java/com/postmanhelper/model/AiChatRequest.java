package com.postmanhelper.model;

import java.util.List;
import java.util.Map;

public class AiChatRequest {

    private String message;                      // current user message
    private List<Map<String, String>> history;   // prior turns [{role, content}]

    // Context from the UI
    private String service;
    private String operation;
    private String lastUrl;
    private Integer lastStatus;
    private String lastResponse;   // JSON-stringified body (truncated on frontend)
    private String apiKey;         // per-user Anthropic API key, sent from the browser

    public String getMessage()                      { return message; }
    public void   setMessage(String v)              { this.message = v; }

    public List<Map<String, String>> getHistory()   { return history; }
    public void   setHistory(List<Map<String, String>> v) { this.history = v; }

    public String getService()                      { return service; }
    public void   setService(String v)              { this.service = v; }

    public String getOperation()                    { return operation; }
    public void   setOperation(String v)            { this.operation = v; }

    public String getLastUrl()                      { return lastUrl; }
    public void   setLastUrl(String v)              { this.lastUrl = v; }

    public Integer getLastStatus()                  { return lastStatus; }
    public void    setLastStatus(Integer v)         { this.lastStatus = v; }

    public String getLastResponse()                 { return lastResponse; }
    public void   setLastResponse(String v)         { this.lastResponse = v; }

    public String getApiKey()                       { return apiKey; }
    public void   setApiKey(String v)               { this.apiKey = v; }
}
