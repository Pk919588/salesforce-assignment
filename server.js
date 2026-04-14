
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
const PORT = 5000;
const SALESFORCE_AUTH_BASE_URL =
  process.env.SALESFORCE_AUTH_BASE_URL || "https://login.salesforce.com";
const SALESFORCE_TOKEN_URL =
  `${SALESFORCE_AUTH_BASE_URL}/services/oauth2/token`;
const METHODS_WITH_BODY = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const ALLOWED_SALESFORCE_HOST_SUFFIXES = [
  ".salesforce.com",
  ".force.com",
  ".salesforce-sites.com",
];

// Enable CORS for the React client and parse both JSON and form-encoded requests.
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function logInfo(message, data) {
  if (data) {
    console.log(`[Salesforce Backend] ${message}`, data);
    return;
  }

  console.log(`[Salesforce Backend] ${message}`);
}

function logError(message, error) {
  console.error(`[Salesforce Backend] ${message}`, {
    message: error.message,
    stack: error.stack,
  });
}

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function pickHeader(headers, name) {
  if (!isPlainObject(headers)) {
    return undefined;
  }

  const match = Object.keys(headers).find(
    (headerName) => headerName.toLowerCase() === name.toLowerCase()
  );

  return match ? headers[match] : undefined;
}

function isAllowedSalesforceUrl(targetUrl) {
  let parsedUrl;

  try {
    parsedUrl = new URL(targetUrl);
  } catch {
    return false;
  }

  if (!["https:", "http:"].includes(parsedUrl.protocol)) {
    return false;
  }

  const hostname = parsedUrl.hostname.toLowerCase();

  return (
    hostname === "login.salesforce.com" ||
    hostname === "test.salesforce.com" ||
    ALLOWED_SALESFORCE_HOST_SUFFIXES.some((suffix) =>
      hostname.endsWith(suffix)
    )
  );
}

function validateProxyRequest(body) {
  if (!isPlainObject(body)) {
    return "Request body must be a JSON object.";
  }

  if (!body.targetUrl || typeof body.targetUrl !== "string") {
    return "targetUrl is required and must be a string.";
  }

  try {
    new URL(body.targetUrl);
  } catch (error) {
    return "targetUrl must be a valid URL.";
  }

  if (!isAllowedSalesforceUrl(body.targetUrl)) {
    return "targetUrl must point to an allowed Salesforce domain.";
  }

  if (body.method && typeof body.method !== "string") {
    return "method must be a string when provided.";
  }

  if (body.headers !== undefined && !isPlainObject(body.headers)) {
    return "headers must be an object when provided.";
  }

  return null;
}

function validateTokenRequest(body) {
  if (!isPlainObject(body)) {
    return "Request body must contain OAuth parameters.";
  }

  const grantType = body.grant_type || "authorization_code";

  if (grantType === "authorization_code") {
    const requiredFields = ["code", "client_id", "redirect_uri", "code_verifier"];
    const missingFields = requiredFields.filter(
      (field) => !body[field] || typeof body[field] !== "string"
    );

    if (missingFields.length > 0) {
      return `Missing required OAuth fields: ${missingFields.join(", ")}.`;
    }

    return null;
  }

  if (grantType === "refresh_token") {
    const requiredFields = ["refresh_token", "client_id"];
    const missingFields = requiredFields.filter(
      (field) => !body[field] || typeof body[field] !== "string"
    );

    if (missingFields.length > 0) {
      return `Missing required refresh fields: ${missingFields.join(", ")}.`;
    }

    return null;
  }

  return "Unsupported grant_type. Supported values: authorization_code, refresh_token.";
}

function buildRequestBody(body, headers) {
  if (body === undefined || body === null) {
    return undefined;
  }

  // Keep string and buffer payloads untouched so the proxy can pass them through.
  if (typeof body === "string" || Buffer.isBuffer(body)) {
    return body;
  }

  const contentType = pickHeader(headers, "content-type") || "application/json";

  if (
    contentType.includes("application/x-www-form-urlencoded") &&
    isPlainObject(body)
  ) {
    return new URLSearchParams(body).toString();
  }

  if (isPlainObject(body) || Array.isArray(body)) {
    return JSON.stringify(body);
  }

  return String(body);
}

function buildTokenParams(body) {
  const params = new URLSearchParams();

  // Forward only defined OAuth fields and let Salesforce validate the rest.
  Object.entries(body).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => params.append(key, String(item)));
      return;
    }

    params.append(key, String(value));
  });

  if (!params.get("grant_type")) {
    params.set("grant_type", "authorization_code");
  }

  return params;
}

// Generic Salesforce API proxy for requests made by the React application.
app.post("/api/salesforce/proxy", async (req, res) => {
  try {
    const validationError = validateProxyRequest(req.body);

    if (validationError) {
      logInfo("Proxy request validation failed", { error: validationError });
      return res.status(400).json({ error: validationError });
    }

    const method = (req.body.method || "GET").toUpperCase();
    const headers = isPlainObject(req.body.headers) ? { ...req.body.headers } : {};
    const requestBody = METHODS_WITH_BODY.has(method)
      ? buildRequestBody(req.body.body, headers)
      : undefined;

    logInfo("Forwarding Salesforce proxy request", {
      method,
      targetUrl: req.body.targetUrl,
    });

    const salesforceResponse = await fetch(req.body.targetUrl, {
      method,
      headers,
      body: requestBody,
    });

    // Return Salesforce's raw response body so the frontend gets the original payload.
    const responseBuffer = await salesforceResponse.buffer();
    const contentType = salesforceResponse.headers.get("content-type");
    const responsePreview = responseBuffer.toString("utf8").slice(0, 1000);

    if (contentType) {
      res.set("Content-Type", contentType);
    }

    logInfo("Salesforce proxy response received", {
      status: salesforceResponse.status,
      targetUrl: req.body.targetUrl,
    });

    if (!salesforceResponse.ok && responsePreview) {
      logInfo("Salesforce proxy error body", {
        status: salesforceResponse.status,
        targetUrl: req.body.targetUrl,
        preview: responsePreview,
      });
    }

    return res.status(salesforceResponse.status).send(responseBuffer);
  } catch (error) {
    logError("Proxy request failed", error);
    return res.status(500).json({
      error: "Failed to proxy request to Salesforce.",
      details: error.message,
    });
  }
});

// PKCE token exchange endpoint. No client_secret is used or required here.
app.post("/api/salesforce/token", async (req, res) => {
  try {
    const validationError = validateTokenRequest(req.body);

    if (validationError) {
      logInfo("Token request validation failed", { error: validationError });
      return res.status(400).json({ error: validationError });
    }

    const tokenParams = buildTokenParams(req.body);
    const grantType = tokenParams.get("grant_type");

    logInfo("Forwarding Salesforce token request", { grantType });

    const salesforceResponse = await fetch(SALESFORCE_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: tokenParams.toString(),
    });

    const contentType = salesforceResponse.headers.get("content-type") || "";
    const responsePayload = contentType.includes("application/json")
      ? await salesforceResponse.json()
      : await salesforceResponse.text();

    if (!salesforceResponse.ok) {
      logInfo("Salesforce token request returned an error", {
        status: salesforceResponse.status,
        grantType,
      });

      return res.status(salesforceResponse.status).send(responsePayload);
    }

    logInfo("Salesforce token request succeeded", {
      status: salesforceResponse.status,
      grantType,
    });

    return res.status(200).json({
      access_token: responsePayload.access_token,
      instance_url: responsePayload.instance_url,
      id: responsePayload.id || null,
      refresh_token: responsePayload.refresh_token || null,
    });
  } catch (error) {
    logError("Token request failed", error);
    return res.status(500).json({
      error: "Failed to exchange token with Salesforce.",
      details: error.message,
    });
  }
});


app.get("/api/rules", (req, res) => {
  res.json([
    {
      id: 1,
      ruleName: "Account Name Required",
      description: "Name cannot be empty",
      errorMessage: "Enter account name",
      active: true
    },
    {
      id: 2,
      ruleName: "Phone Required",
      description: "Phone is required",
      errorMessage: "Enter phone number",
      active: false
    },
    {
      id: 3,
      ruleName: "Email Required",
      description: "Email is required",
      errorMessage: "Enter valid email",
      active: true
    },
    {
      id: 4,
      ruleName: "Website Validation",
      description: "Website must be valid URL",
      errorMessage: "Enter valid website URL",
      active: false
    },
    {
      id: 5,
      ruleName: "Industry Required",
      description: "Industry field is mandatory",
      errorMessage: "Select industry",
      active: true
    }
  ]);
});

app.post("/api/rules/update", (req, res) => {
  res.json({ success: true });
});
app.use((req, res) => {
  return res.status(404).json({ error: "Route not found." });
});

app.listen(PORT, () => {
  logInfo(`Server is running on port ${PORT}`);
});
