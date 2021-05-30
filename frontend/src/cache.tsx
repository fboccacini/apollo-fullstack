import { InMemoryCache, makeVar } from "@apollo/client";
import { User } from './models/user'

// Create the initial value
const userInitialValue: User = {
  name: '',
  logged: false
}

// Create the todos var and initialize it with the initial value
export const userVar = makeVar<User>(
  userInitialValue
);

export const cache: InMemoryCache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        user: {
          read() {
            return userVar();
          }
        }
      }
    }
  }
});