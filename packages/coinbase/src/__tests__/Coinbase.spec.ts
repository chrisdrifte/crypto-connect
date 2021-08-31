/**
 * Coinbase
 *
 * @group coinbase
 * @group unit
 */
describe("Coinbase", () => {
  describe("instance", () => {
    it.todo("should have apikey auth initialized with context");
    it.todo("should have oauth auth initialized with context");
    it.todo("should have currentAuth property");
  });

  describe("withApiKeys()", () => {
    it.todo("should set credentials");
    it.todo("should set currentAuth");
    it.todo("should be chainable");
  });

  describe("withOAuth()", () => {
    it.todo("should set credentials");
    it.todo("should set currentAuth");
    it.todo("should be chainable");
  });

  describe("throwErrorOnInvalidPermissions()", () => {
    it.todo("should throw error with unexpected response");
    it.todo("should make single request");
    it.todo("should throw error with missing scopes");
    it.todo("should not throw error with extra scopes");
    it.todo("should not throw error with exact scopes");
  });

  describe("getPaginatedResource()", () => {
    it.todo("should throw error with unexpected responses");

    describe("resource with single page", () => {
      it.todo("should make single request");
      it.todo("should return items");
    });

    describe("resource with multiple pages", () => {
      it.todo("should make mulitple requests");
      it.todo("should return concated items");
    });
  });

  describe("getAccounts()", () => {
    it.todo("should throw error with unexpected responses");
    it.todo("should return accounts");
  });

  describe("getBalances()", () => {
    it.todo("should return normalized balances");
  });
});
