import Vue from "vue";
import VueApollo from "vue-apollo";
// import store from './store/index'
import {
  createApolloClient,
  restartWebsockets,
} from "vue-cli-plugin-apollo/graphql-client";
import { onError } from "apollo-link-error";
import { Observable } from "apollo-link"
// import { setContext } from "apollo-link-context"

// Install the vue plugin
Vue.use(VueApollo);

// Name of the localStorage item
const AUTH_TOKEN = "apollo-token";

const getToken = new Promise(function(resolve, reject) {
  const token = localStorage.getItem("apollo-token");
  if (token) {
    resolve(token);
  } else {
    reject("no token");
  }
});

const errorHandler = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors[0].extensions.code == "invalid-jwt") {
    // Let's refresh token through async request
    return new Observable((observer) => {
      getToken
        .then((token) => {
          operation.setContext(({ headers = {} }) => ({
            headers: {
              // Re-add old headers
              ...headers,
              // Switch out old access token for new one
              Authorization: token ? `Bearer ${token}` : "",
            },
          }));
        })
        .then(() => {
          const subscriber = {
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          };

          // Retry last failed request
          forward(operation).subscribe(subscriber);
        })
        .catch((error) => {
          // No refresh or client token available, we force user to login
          observer.error(error);
        });
    });
  }
});

// Http endpoint
const httpEndpoint =
  process.env.VUE_APP_GRAPHQL_HTTP ||
  "https://true-gannet-28.hasura.app/v1/graphql";

// const link = new TokenRefreshLink({
//   accessTokenField: 'apollo-token',
//   isTokenValidOrUndefined: () => boolean,
//   fetchAccessToken: () => $vue,
//   handleFetch: (accessToken: string) => void,
//   handleResponse?: (operation, accessTokenField) => response => any,
//   handleError?: (err: Error) => void,
// });

// Config
const defaultOptions = {
  // You can use `https` for secure connection (recommended in production)
  httpEndpoint,
  // You can use `wss` for secure connection (recommended in production)
  // Use `null` to disable subscriptions
  wsEndpoint:
    process.env.VUE_APP_GRAPHQL_WS ||
    "wss://true-gannet-28.hasura.app/v1/graphql",
  // LocalStorage token
  tokenName: AUTH_TOKEN,
  // Enable Automatic Query persisting with Apollo Engine
  persisting: false,
  // Use websockets for everything (no HTTP)
  // You need to pass a `wsEndpoint` for this to work
  websocketsOnly: false,
  // Is being rendered on the server?
  ssr: false,

  // Override default apollo link
  // note: don't override httpLink here, specify httpLink options in the
  // httpLinkOptions property of defaultOptions.
  link: errorHandler

  // Override default cache
  // cache: myCache

  // Override the way the Authorization header is set
  // getAuth: (tokenName) => ...

  // Additional ApolloClient options
  // apollo: { ... }

  // Client local data (see apollo-link-state)
  // clientState: { resolvers: { ... }, defaults: { ... } }
};

// Call this in the Vue app fill
export function createProvider(options = {}) {
  // Create apollo client
  const { apolloClient, wsClient } = createApolloClient({
    ...defaultOptions,
    ...options,
  });
  apolloClient.wsClient = wsClient;

  // Create vue apollo provider
  const apolloProvider = new VueApollo({
    defaultClient: apolloClient,
    defaultOptions: {
      $query: {
        // fetchPolicy: 'cache-and-network',
      },
    },
    errorHandler(error) {
      // eslint-disable-next-line no-console
      console.log(
        "%cError",
        "background: red; color: white; padding: 2px 4px; border-radius: 3px; font-weight: bold;",
        error.message
      );
    },
  });

  return apolloProvider;
}

// Manually call this when user log in
export async function onLogin(apolloClient, token) {
  if (typeof localStorage !== "undefined" && token) {
    localStorage.setItem(AUTH_TOKEN, token);
  }
  if (apolloClient.wsClient) restartWebsockets(apolloClient.wsClient);
  try {
    await apolloClient.resetStore();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log("%cError on cache reset (login)", "color: orange;", e.message);
  }
}

// Manually call this when user log out
export async function onLogout(apolloClient) {
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem(AUTH_TOKEN);
  }
  if (apolloClient.wsClient) restartWebsockets(apolloClient.wsClient);
  try {
    await apolloClient.resetStore();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log("%cError on cache reset (logout)", "color: orange;", e.message);
  }
}
