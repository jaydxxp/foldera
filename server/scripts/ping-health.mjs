const apiHostport = process.env.API_HOSTPORT;
const healthcheckPath = process.env.HEALTHCHECK_PATH ?? "/api/health";

if (!apiHostport) {
  console.error("Missing API_HOSTPORT environment variable");
  process.exit(1);
}

const targetUrl = `http://${apiHostport}${healthcheckPath}`;

const response = await fetch(targetUrl, {
  method: "GET",
  headers: {
    "User-Agent": "foldera-render-keepalive",
  },
});

if (!response.ok) {
  console.error(`Keepalive ping failed with status ${response.status} for ${targetUrl}`);
  process.exit(1);
}

console.log(`Keepalive ping succeeded for ${targetUrl}`);
