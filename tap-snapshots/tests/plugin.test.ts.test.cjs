/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`tests/plugin.test.ts TAP additional directives > must match snapshot 1`] = `
export type TypedOperation<Result, Variables> = {
  readonly operation: string;
  readonly operationType: "query" | "mutation" | "subscription";
  /**
   * This type is used to ensure that the variables you pass in to the query are assignable to Variables
   * and that the Result is assignable to whatever you pass your result to. The method is never actually
   * implemented, but the type is valid because we list it as optional
   */
  __apiType?: (variables: Variables) => Result;
}

export const PUserDocument: TypedOperation<PUserQuery, PUserQueryVariables> = { operation: "pUser", operationType: "query" };
export const KUserDocument: TypedOperation<KUserQuery, KUserQueryVariables> = { operation: "kUser", operationType: "query" };
export const CUserDocument: TypedOperation<CUserQuery, CUserQueryVariables> = { operation: "cUser", operationType: "query" };

export const OPERATIONS = [
  {
    "operationName": "pUser",
    "operationType": "query",
    "query": "fragment user on User { name } query pUser { user { ...user } }",
    "behaviour": {
      "abc": {
        "abc": 123,
        "works": "awdawd",
        "bool": true
      }
    }
  },
  {
    "operationName": "kUser",
    "operationType": "query",
    "query": "fragment user on User { name } query kUser { user { ...user } }",
    "behaviour": {
      "ddd": {
        "n": 123.22
      }
    }
  },
  {
    "operationName": "cUser",
    "operationType": "query",
    "query": "fragment user on User { name } query cUser { user { ...user } }",
    "behaviour": {}
  }
]
`

exports[`tests/plugin.test.ts TAP cached directive > must match snapshot 1`] = `
export type TypedOperation<Result, Variables> = {
  readonly operation: string;
  readonly operationType: "query" | "mutation" | "subscription";
  /**
   * This type is used to ensure that the variables you pass in to the query are assignable to Variables
   * and that the Result is assignable to whatever you pass your result to. The method is never actually
   * implemented, but the type is valid because we list it as optional
   */
  __apiType?: (variables: Variables) => Result;
}

export const CachedUserDocument: TypedOperation<CachedUserQuery, CachedUserQueryVariables> = { operation: "cachedUser", operationType: "query" };
export const CUserDocument: TypedOperation<CUserQuery, CUserQueryVariables> = { operation: "cUser", operationType: "query" };

export const OPERATIONS = [
  {
    "operationName": "cachedUser",
    "operationType": "query",
    "query": "fragment user on User { name } query cachedUser { user { ...user } }",
    "behaviour": {
      "ttl": 1
    }
  },
  {
    "operationName": "cUser",
    "operationType": "query",
    "query": "fragment user on User { name } query cUser @cached(ttl: 1) { user { ...user } }",
    "behaviour": {}
  }
]
`

exports[`tests/plugin.test.ts TAP fragment > must match snapshot 1`] = `
export type TypedOperation<Result, Variables> = {
  readonly operation: string;
  readonly operationType: "query" | "mutation" | "subscription";
  /**
   * This type is used to ensure that the variables you pass in to the query are assignable to Variables
   * and that the Result is assignable to whatever you pass your result to. The method is never actually
   * implemented, but the type is valid because we list it as optional
   */
  __apiType?: (variables: Variables) => Result;
}

export const UserDocument: TypedOperation<UserQuery, UserQueryVariables> = { operation: "user", operationType: "query" };

export const OPERATIONS = [
  {
    "operationName": "user",
    "operationType": "query",
    "query": "fragment user on User { name } query user { user { ...user } }",
    "behaviour": {}
  }
]
`

exports[`tests/plugin.test.ts TAP mutation > must match snapshot 1`] = `
export type TypedOperation<Result, Variables> = {
  readonly operation: string;
  readonly operationType: "query" | "mutation" | "subscription";
  /**
   * This type is used to ensure that the variables you pass in to the query are assignable to Variables
   * and that the Result is assignable to whatever you pass your result to. The method is never actually
   * implemented, but the type is valid because we list it as optional
   */
  __apiType?: (variables: Variables) => Result;
}

export const MutDocument: TypedOperation<MutMutation, MutMutationVariables> = { operation: "mut", operationType: "mutation" };

export const OPERATIONS = [
  {
    "operationName": "mut",
    "operationType": "mutation",
    "query": "mutation mut { create }",
    "behaviour": {}
  }
]
`

exports[`tests/plugin.test.ts TAP options > must match snapshot 1`] = `
export type TypedOperation<Result, Variables> = {
  readonly operation: string;
  readonly operationType: "query" | "mutation" | "subscription";
  /**
   * This type is used to ensure that the variables you pass in to the query are assignable to Variables
   * and that the Result is assignable to whatever you pass your result to. The method is never actually
   * implemented, but the type is valid because we list it as optional
   */
  __apiType?: (variables: Variables) => Result;
}

export const UserDocumentTS: TypedOperation<TPUserQueryTS, TPUserQueryVariablesTS> = { operation: "user", operationType: "query" };

export const OPERATIONS = [
  {
    "operationName": "user",
    "operationType": "query",
    "query": "fragment user on User { name } query user { user { ...user } }",
    "behaviour": {}
  }
]
`

exports[`tests/plugin.test.ts TAP public directive > must match snapshot 1`] = `
export type TypedOperation<Result, Variables> = {
  readonly operation: string;
  readonly operationType: "query" | "mutation" | "subscription";
  /**
   * This type is used to ensure that the variables you pass in to the query are assignable to Variables
   * and that the Result is assignable to whatever you pass your result to. The method is never actually
   * implemented, but the type is valid because we list it as optional
   */
  __apiType?: (variables: Variables) => Result;
}

export const PUserDocument: TypedOperation<PUserQuery, PUserQueryVariables> = { operation: "pUser", operationType: "query" };
export const CUserDocument: TypedOperation<CUserQuery, CUserQueryVariables> = { operation: "cUser", operationType: "query" };

export const OPERATIONS = [
  {
    "operationName": "pUser",
    "operationType": "query",
    "query": "fragment user on User { name } query pUser { user { ...user } }",
    "behaviour": {
      "public": true
    }
  },
  {
    "operationName": "cUser",
    "operationType": "query",
    "query": "fragment user on User { name } query cUser { user { ...user } }",
    "behaviour": {}
  }
]
`
