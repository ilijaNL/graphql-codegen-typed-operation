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
    'export const TestDocument = new TypedOperation<TestQuery, TestQueryVariables>("test", "query");'
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
    'export const MutDocument = new TypedOperation<MutMutation, MutMutationVariables>("mut", "mutation");'
  );

  t.match(
    result.content,
    'export const OPERATIONS = [{"operationName":"mut","operationType":"mutation","query":"mutation mut { create }","behaviour":{}}]'
  );
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
    'export const UserDocument = new TypedOperation<UserQuery, UserQueryVariables>("user", "query");'
  );

  t.match(
    result.content,
    'export const OPERATIONS = [{"operationName":"user","operationType":"query","query":"fragment user on User { name } query user { user { ...user } }","behaviour":{}}]'
  );
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
    'export const CachedUserDocument = new TypedOperation<CachedUserQuery, CachedUserQueryVariables>("cachedUser", "query");'
  );

  t.match(
    result.content,
    'export const CUserDocument = new TypedOperation<CUserQuery, CUserQueryVariables>("cUser", "query");'
  );

  t.match(
    result.content,
    `[{"operationName":"cachedUser","operationType":"query","query":"fragment user on User { name } query cachedUser { user { ...user } }","behaviour":{"ttl":1}},{"operationName":"cUser","operationType":"query","query":"fragment user on User { name } query cUser @cached(ttl: 1) { user { ...user } }","behaviour":{}}]`
  );
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
    'export const UserDocumentTS = new TypedOperation<TPUserQueryTS, TPUserQueryVariablesTS>("user", "query");'
  );

  t.match(
    result.content,
    'export const OPERATIONS = [{"operationName":"user","operationType":"query","query":"fragment user on User { name } query user { user { ...user } }","behaviour":{}}]'
  );
});
