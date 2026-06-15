const { auth } = require('express-oauth2-jwt-bearer');

const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
  tokenSigningAlg: 'RS256'
});

module.exports = checkJwt;


















// verbose
/*
const { auth } = require('express-oauth2-jwt-bearer');

const validateJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
  tokenSigningAlg: 'RS256'
});

const checkJwt = (req, res, next) => {
  console.log("\n--- [Auth Debug: Start Żądania] ---");
  console.log(`[Method/URL]: ${req.method} ${req.originalUrl}`);
  console.log("[Headers]:", JSON.stringify(req.headers, null, 2));
  
  const authHeader = req.headers.authorization;
  if (authHeader) {
    console.log(`[Raw Authorization Header]: ${authHeader}`);
    const tokenParts = authHeader.split(' ')[1]?.split('.');
    if (tokenParts) {
      console.log(`[Token Format]: Liczba segmentów = ${tokenParts.length} (Oczekiwane: 3 dla JWT)`);
    }
  } else {
    console.log("[Auth Warning]: Brak nagłówka Authorization!");
  }

  validateJwt(req, res, (err) => {
    if (err) {
      console.error("❌ [Auth Debug: BŁĄD WERYFIKACJI]:");
      console.error(`  - Name: ${err.name}`);
      console.error(`  - Message: ${err.message}`);
      console.error(`  - Status: ${err.status || 401}`);
      if (err.statusCode) console.error(`  - StatusCode: ${err.statusCode}`);
      console.log("-----------------------------------\n");
      
      return next(err);
    }

    console.log("✅ [Auth Debug]: Token zweryfikowany pomyślnie!");
    console.log("[Decoded Claims]:", JSON.stringify(req.auth, null, 2));
    console.log("-----------------------------------\n");
    
    next();
  });
};

module.exports = checkJwt;
*/