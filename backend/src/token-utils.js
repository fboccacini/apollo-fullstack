
const APP_SECRET = 'GraphQL-is-aw3some';

const { sign, verify } = require("jsonwebtoken");

function setTokens(user) {
  const sevenDays = 60 * 60 * 24 * 7 * 1000;
  const fifteenMins = 60 * 15 * 1000;
  const accessUser = {
    id: user.id
  };
  const accessToken = sign(
    { user: accessUser },
    APP_SECRET,
    {
      expiresIn: fifteenMins
    }
  );
  const refreshUser = {
    id: user.id,
    count: user.tokenCount
  };
  const refreshToken = sign(
    { user: refreshUser },
    APP_SECRET,
    {
      expiresIn: sevenDays
    }
  );

  return { accessToken, refreshToken };
}

function tokenCookies({ accessToken, refreshToken }) {
  const cookieOptions = {
    httpOnly: true,
    // secure: true, //for HTTPS only
    // domain: "your-website.com",
    SameSite: true,
  };
  return {
    access: ["access", accessToken, cookieOptions],
    refresh: ["refresh", refreshToken, cookieOptions]
  };
}

function validateAccessToken(token) {
  try {
    return verify(token, APP_SECRET);
  } catch {
    return null;
  }
}

function validateRefreshToken(token) {
  try {
    return verify(token, APP_SECRET);
  } catch {
    return null;
  }
}

async function validateTokensMiddleware(req, res, next) {
  const refreshToken = req.cookies["refresh"];
  const accessToken = req.cookies["access"];

  const decodedAccessToken = validateAccessToken(accessToken);
  console.log('access token: ',decodedAccessToken);
  if (decodedAccessToken && decodedAccessToken.user) {
    req.user = decodedAccessToken.user;
    return next();
  }
  
  const decodedRefreshToken = validateRefreshToken(refreshToken);
  if (decodedRefreshToken && decodedRefreshToken.user) {
    const user = await userRepo.get({ userId: decodedRefreshToken.user.id });
    if (!user.data || user.data.tokenCount !== decodedRefreshToken.user.count) {
      // remove cookies if token not valid
      res.clearCookie("access");
      res.clearCookie("refresh");
      return next();
    }

    const userTokens = setTokens(user.data);
    req.user = decodedRefreshToken.user;
    // update the cookies with new tokens
    const cookies = tokenCookies(userTokens);
    res.cookie(...cookies.access);
    res.cookie(...cookies.refresh);
    return next();
  }
  next();
}

module.exports = {
  APP_SECRET,
  validateTokensMiddleware,
  validateAccessToken,
  setTokens,
  tokenCookies,
};
