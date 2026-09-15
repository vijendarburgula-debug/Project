package com.postmanhelper.model;

import java.util.Map;

public class ProxyRequest {

    private String url;
    private String method;
    private Map<String, String> headers;
    private Map<String, String> queryParams;
    private Object body;

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public String getMethod() { return method; }
    public void setMethod(String method) { this.method = method; }

    public Map<String, String> getHeaders() { return headers; }
    public void setHeaders(Map<String, String> headers) { this.headers = headers; }

    public Map<String, String> getQueryParams() { return queryParams; }
    public void setQueryParams(Map<String, String> queryParams) { this.queryParams = queryParams; }

    public Object getBody() { return body; }
    public void setBody(Object body) { this.body = body; }
}
