const { claimCheck } = require('express-oauth2-jwt-bearer');

const verifyAdmin = ( (req, res, next) => {
    const claims = req.auth?.payload || req.auth;

    if(!claims) {
        return res.status(404).json({
            success: false,
            message: "Unauthorized - No tokens claims found"
        });
    };

    const targetKey = `${process.env.AUTH0_AUDIENCE}/group`;
    const userGroup = claims[targetKey];

    if( userGroup !== 'admin' ) {
        return res.status(403).json({
            success: false,
            message: 'Forbidden - Requires admin group',
        });
    };

    next();
})

module.exports = verifyAdmin;


















// verbose

/*
const { claimCheck } = require('express-oauth2-jwt-bearer');

const verifyAdmin = (req, res, next) => {
  console.log("\n--- [Admin Auth Debug: Start] ---");

  // Dane ze zweryfikowanego tokenu JWT są automatycznie wstrzykiwane przez checkJwt do req.auth
  const claims = req.auth;

  if (!claims) {
    console.error("❌ [Admin Auth Error]: Brak zdekodowanych danych claims w żądaniu! Czy checkJwt na pewno wykonało się przed tym middleware?");
    console.log("---------------------------------\n");
    return res.status(401).json({ success: false, message: "Unauthorized - No tokens claims found" });
  }

  // Szukany klucz w claims (np. http://api.server-panel.com/roles)
  const targetKey = `${process.env.AUTH0_AUDIENCE}/roles`;
  
  console.log(`[Target Audience Key]: "${targetKey}"`);
  console.log("[All JWT Claims available]:", JSON.stringify(claims, null, 2));

  // Wyciągamy role z tokenu
  const roles = claims[targetKey] || [];
  console.log("[Found Roles in Token]:", roles);

  // Sprawdzamy warunek dostępu
  const isAdmin = roles.includes('admin');
  console.log(`[Evaluation]: Czy użytkownik ma rolę 'admin'? -> ${isAdmin ? "TAK" : "NIE"}`);

  if (!isAdmin) {
    console.error("❌ [Admin Auth Error]: Odmowa dostępu. Użytkownik nie posiada roli 'admin'.");
    console.log("---------------------------------\n");
    return res.status(403).json({ 
      success: false, 
      message: "Forbidden - Requires admin role",
      debugInfo: {
        expectedRole: 'admin',
        yourRoles: roles
      }
    });
  }

  console.log("✅ [Admin Auth]: Dostęp przyznany! Użytkownik jest administratorem.");
  console.log("---------------------------------\n");
  
  next();
};

module.exports = verifyAdmin;
*/