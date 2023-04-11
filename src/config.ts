import { RawConfig } from '@graphql-codegen/visitor-plugin-common';

export interface Config extends RawConfig {
  dedupeOperationSuffix?: boolean;
  /**
   * @default false
   * @description Set this configuration to `true` if you wish to disable auto add suffix of operation name, like `Query`, `Mutation`, `Subscription`, `Fragment`.
   */
  omitOperationSuffix?: boolean;
  /**
   * @default ""
   * @description Adds a suffix to generated operation result type names
   */
  operationResultSuffix?: string;
  /**
   * @default ""
   * @description Changes the GraphQL operations variables prefix.
   */
  documentVariablePrefix?: string;
  /**
   * @default Document
   * @description Changes the GraphQL operations variables suffix.
   */
  documentVariableSuffix?: string;
  /**
   * @default ""
   * @description Changes the GraphQL fragments variables prefix.
   */
  fragmentVariablePrefix?: string;
  /**
   * @default FragmentDoc
   * @description Changes the GraphQL fragments variables suffix.
   */
  fragmentVariableSuffix?: string;
  /**
   * @default true
   * @description If you are using `documentNode: documentMode | documentNodeImportFragments`, you can set this to `true` to apply document optimizations for your GraphQL document.
   * This will remove all "loc" and "description" fields from the compiled document, and will remove all empty arrays (such as `directives`, `arguments` and `variableDefinitions`).
   */
  optimizeDocumentNode?: boolean;
  /**
   * @default false
   * @description If set to true, it will enable support for parsing variables on fragments.
   */
  experimentalFragmentVariables?: boolean;
}
