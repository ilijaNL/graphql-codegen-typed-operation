import { oldVisit, PluginFunction, PluginValidateFn, Types } from '@graphql-codegen/plugin-helpers';
import { extname } from 'path';
import { LoadedFragment, RawClientSideBasePluginConfig } from '@graphql-codegen/visitor-plugin-common';
import { Config } from './config';
import { concatAST, FragmentDefinitionNode, GraphQLSchema, Kind } from 'graphql';
import { TypeScriptDocumentNodesVisitor } from './visitor';

export const plugin: PluginFunction<Config, Types.ComplexPluginOutput> = (
  schema: GraphQLSchema,
  rawDocuments: Types.DocumentFile[],
  config: Config
) => {
  const documents = rawDocuments;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const allAst = concatAST(documents.map((v) => v.document!));

  const allFragments: LoadedFragment[] = [
    ...(allAst.definitions.filter((d) => d.kind === Kind.FRAGMENT_DEFINITION) as FragmentDefinitionNode[]).map(
      (fragmentDef) => ({
        node: fragmentDef,
        name: fragmentDef.name.value,
        onType: fragmentDef.typeCondition.name.value,
        isExternal: false,
      })
    ),
  ];

  const visitor = new TypeScriptDocumentNodesVisitor(schema, allFragments, config, documents);
  const visitorResult = oldVisit(allAst, { leave: visitor as any });

  const content: string[] = [
    `\
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
`,
  ];

  return {
    // delete the document node import since we dont use it
    prepend:
      allAst.definitions.length === 0 ? [] : visitor.getImports().filter((im) => !im.includes('{ DocumentNode }')),
    content: [
      ...content,
      // we dont need fragments
      // visitor.fragments,
      ...visitorResult.definitions.filter((t: any) => typeof t === 'string'),
      `\nexport const OPERATIONS = ${JSON.stringify(Array.from(visitor.operationMap.values()), null, 2)}`,
    ].join('\n'),
  };
};

export const validate: PluginValidateFn<RawClientSideBasePluginConfig> = async (
  _schema: GraphQLSchema,
  _documents: Types.DocumentFile[],
  _config,
  outputFile: string
) => {
  if (extname(outputFile) !== '.ts' && extname(outputFile) !== '.tsx') {
    throw new Error(`Plugin "graphql-codegen-typed-operation" requires extension to be ".ts" or ".tsx"!`);
  }
};
