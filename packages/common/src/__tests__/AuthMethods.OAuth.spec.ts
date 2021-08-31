/**
 * OAuth
 *
 * @group auth-method
 * @group unit
 */

describe("OAuth", () => {
  describe("signIn()", () => {
    it.todo("should return sign in url");
  });

  describe("exchangeCode()", () => {
    it.todo("should make request with credentials");
    it.todo("should call setTokensHandler with tokens");
  });

  describe("exchangeRefreshToken()", () => {
    it.todo("should make request with credentials");
    it.todo("should call setTokensHandler with tokens");
  });

  describe("revoke()", () => {
    it.todo("should make request with access token");
    it.todo("should call setTokensHandler to clear tokens");
  });

  describe("requst()", () => {
    it.todo("should make request with access token");
    it.todo("should refresh token if necessary");
    it.todo("should throw error with non-zero status");
    it.todo("should return result with 200 status");
  });
});
