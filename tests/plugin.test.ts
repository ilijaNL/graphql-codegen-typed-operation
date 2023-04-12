import tap from 'tap';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { Config } from '../src/config';
import { DocumentNode, parse } from 'graphql';
import { plugin } from '../src/plugin';

const schema = makeExecutableSchema({
  typeDefs: `
    type User {
      name: String!
      id: String!
    }
    type Query {
      test: String!
      user: User!
    }
    type Mutation {
      create: String!
    }
`,
});

// Nooop gql fn for prettier
function gql(...things: TemplateStringsArray[]) {
  return things.join('');
}

function runPlugin(docs: DocumentNode[], config: Config = {}) {
  // const documents = docs.map((doc: any) => ({
  //   filePath: '',
  //   content: doc,
  // }));

  return plugin(
    schema,
    docs.map((d) => ({ document: d })),
    config
  );
}

tap.test('query', async (t) => {
  const result = await runPlugin([
    parse(gql`
      query test {
        test
      }
    `),
  ]);

  t.match(
    result.content,
    'export const TestDocument: TypedOperation<TestQuery, TestQueryVariables> = { operation: "test", operationType: "query" };'
  );
});

tap.test('mutation', async (t) => {
  const result = await runPlugin([
    parse(gql`
      mutation mut {
        create
      }
    `),
  ]);

  t.match(
    result.content,
    'export const MutDocument: TypedOperation<MutMutation, MutMutationVariables> = { operation: "mut", operationType: "mutation" };'
  );

  t.matchSnapshot(result.content);
});

tap.test('throws when no operation name', async (t) => {
  t.throws(() =>
    runPlugin([
      parse(gql`
        mutation {
          create
        }
      `),
    ])
  );
});

tap.test('fragment', async (t) => {
  const result = await runPlugin([
    parse(gql`
      fragment user on User {
        name
      }

      query user {
        user {
          ...user
        }
      }
    `),
  ]);

  t.match(
    result.content,
    'export const UserDocument: TypedOperation<UserQuery, UserQueryVariables> = { operation: "user", operationType: "query" };'
  );

  t.matchSnapshot(result.content);
});

tap.test('cached directive', async (t) => {
  const result = await runPlugin([
    parse(gql`
      fragment user on User {
        name
      }
      query cachedUser @pcached(ttl: 1) {
        user {
          ...user
        }
      }
    `),
    parse(gql`
      query cUser @cached(ttl: 1) {
        user {
          ...user
        }
      }
    `),
  ]);

  t.match(
    result.content,
    'export const CachedUserDocument: TypedOperation<CachedUserQuery, CachedUserQueryVariables> = { operation: "cachedUser", operationType: "query" };'
  );

  t.match(
    result.content,
    'export const CUserDocument: TypedOperation<CUserQuery, CUserQueryVariables> = { operation: "cUser", operationType: "query" };'
  );

  t.matchSnapshot(result.content);
});

tap.test('public directive', async (t) => {
  const result = await runPlugin([
    parse(gql`
      fragment user on User {
        name
      }
      query pUser @ppublic {
        user {
          ...user
        }
      }
    `),
    parse(gql`
      query cUser {
        user {
          ...user
        }
      }
    `),
  ]);

  t.matchSnapshot(result.content);
});

tap.test('options', async (t) => {
  const result = await runPlugin(
    [
      parse(gql`
        fragment user on User {
          name
        }

        query user {
          user {
            ...user
          }
        }
      `),
    ],
    { typesPrefix: 'TP', typesSuffix: 'TS' }
  );

  t.match(
    result.content,
    'export const UserDocumentTS: TypedOperation<TPUserQueryTS, TPUserQueryVariablesTS> = { operation: "user", operationType: "query" };'
  );

  t.matchSnapshot(result.content);
});
