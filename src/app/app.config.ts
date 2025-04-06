import { ApplicationConfig, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';

import { provideApollo } from 'apollo-angular';
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';

export const appConfig: ApplicationConfig = {
    providers: [
      provideRouter(routes),
      provideHttpClient(withInterceptors([])),
      provideApollo((): ApolloClientOptions<any> => {
        const httpLink = inject(HttpLink);
  
        return {
          cache: new InMemoryCache(),
          link: httpLink.create({ uri: 'https://assignment-101415046-backend.onrender.com/graphql' })
        };
      })
    ]
  };