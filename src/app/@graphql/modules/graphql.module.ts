import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { NgModule } from '@angular/core';
import { Apollo, ApolloModule } from 'apollo-angular';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [HttpClientModule,
    ApolloModule,
    HttpLinkModule
  ]
})
export class GraphqlModule {
  constructor(apollo: Apollo, httpLink: HttpLink) {
    // Para capturar los errores de consulta o de red
    const errorLink = onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        console.log('GraphQL Errors', graphQLErrors);
      }

      if (networkError) {
        console.log('Network Errors', networkError);
      }
    });
    const uri = 'http://localhost:2001/graphql';
    const link = ApolloLink.from(
      [
        errorLink,
        httpLink.create({ uri })
      ]
    );
    apollo.create({
      link,
      cache: new InMemoryCache()
    });
  }
}
