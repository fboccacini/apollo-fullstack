import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './components/App';
import { BrowserRouter } from 'react-router-dom';
import { setContext } from '@apollo/client/link/context';

import reportWebVitals from './reportWebVitals';

import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { ApolloLink, split } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";

import { TOKEN_KEY } from './utils';
import { address } from './env_vars.js';

const API_URL = `${address}:4000/graphql`;

const createLink = () => {
  const authLink = setContext((_, { headers }) => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : ''
      }
    };
  });
  const wsLink = new WebSocketLink({
    uri: `ws://${API_URL}`,
    credentials: 'include',
    sameSite: true,
    options: {
      reconnect: true,
      connectionParams: {
        authToken: sessionStorage.getItem(TOKEN_KEY)
      }
    }
  });
  const httpLink = new HttpLink({
    uri: `http://${API_URL}`,
    credentials: 'include',
    sameSite: true,
  });
  return split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === "OperationDefinition" && operation === "subscription";
    },
    wsLink,
    authLink.concat(httpLink)
  );
};

const onErrorHandler = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        '[GraphQL error]: Message: ',message, 'Location: ', locations, 'Path: ', path
      )
    );
  if (networkError) console.log('[Network error]: ', networkError);
});

const link = ApolloLink.from([onErrorHandler, createLink()]);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache({
    addTypename: true
  }),
  connectToDevTools: true,
});

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root')
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
