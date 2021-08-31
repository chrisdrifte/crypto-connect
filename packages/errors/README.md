# CryptoConnect Errors

```ts
import {
  UndocumentedResponseError,
  CryptoConnectError,
  NoCredentialsError,
  NotAuthorizedError,
  ServerError,
} from "@crypto-connect/errors";

try {
  // Do something with Crypto Connect
  // ...
} catch (err) {
  if (err instanceof CryptoConnectError) {
    // All custom errors
  }

  if (err instanceof UndocumentedResponseError) {
    // API response doesn't match CryptoConnect's expectations
  }

  if (err instanceof NoCredentialsError) {
    // Methods that requires authorization has been called before
    // credentials have been provided
  }

  if (err instanceof NotAuthorizedError) {
    // Credentials have been supplied but are not sufficient to authorize
    // the request
  }

  if (err instanceof ServerError) {
    // Server responded with a non-200 status
  }
}
```
