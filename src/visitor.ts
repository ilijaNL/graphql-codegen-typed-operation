import { Types } from '@graphql-codegen/plugin-helpers';
import {
  ClientSideBasePluginConfig,
  ClientSideBaseVisitor,
  DocumentMode,
  LoadedFragment,
  RawClientSideBasePluginConfig,
} from '@graphql-codegen/visitor-plugin-common';
import autoBind from 'auto-bind';
import { pascalCase } from 'change-case-all';
import { GraphQLSchema, OperationDefinitionNode, print, parse, visit, Kind } from 'graphql';
import { printExecutableGraphQLDocument } from '@graphql-tools/documents';

interface TypeScriptDocumentNodesVisitorPluginConfig extends RawClientSideBasePluginConfig {}

type OperationDefinition = {
  operationName: string;
  operationType: 'query' | 'mutation' | 'subscription';
  query: string;
  behaviour: Partial<{
    ttl: number;
    public: boolean;
  }>;
};

export class TypeScriptDocumentNodesVisitor extends ClientSideBaseVisitor<
  TypeScriptDocumentNodesVisitorPluginConfig,
  ClientSideBasePluginConfig
> {
  public readonly operationMap = new Map<string, OperationDefinition>();

  constructor(
    schema: GraphQLSchema,
    fragments: LoadedFragment[],
    config: TypeScriptDocumentNodesVisitorPluginConfig,
    documents: Types.DocumentFile[]
  ) {
    super(
      schema,
      fragments,
      {
        ...config,
        documentMode: DocumentMode.documentNode,
      },
      {},
      documents
    );

    autoBind(this);
  }

  public OperationDefinition(node: OperationDefinitionNode): string {
    this._collectedOperations.push(node);

    const documentVariableName = this.getOperationVariableName(node);

    const operationType: string = pascalCase(node.operation);
    const operationTypeSuffix: string = this.getOperationSuffix(node, operationType);

    const operationResultType: string = this.convertName(node, {
      suffix: operationTypeSuffix + this._parsedConfig.operationResultSuffix,
    });
    const operationVariablesTypes: string = this.convertName(node, {
      suffix: operationTypeSuffix + 'Variables',
    });

    const operationName = node.name?.value;

    if (!operationName) {
      throw new Error(`document ${documentVariableName} does not contain an operation name`);
    }

    const includeNestedFragments = true;
    const fragmentNames = this._extractFragments(node, includeNestedFragments);
    const fragments = this._transformFragments(fragmentNames);

    const doc = this._prepareDocument(`
    ${print(node).split('\\').join('\\\\') /* Re-escape escaped values in GraphQL syntax */}
    ${this._includeFragments(fragments, node.kind)}`);

    // do some validation
    const docNode = parse(doc);

    const behaviour: OperationDefinition['behaviour'] = {};

    // extract directives
    const finalDoc = visit(docNode, {
      [Kind.DIRECTIVE]: {
        enter(node) {
          if (node.name.value === 'ppublic') {
            behaviour.public = true;
            return null;
          }
          if (node.name.value === 'pcached') {
            visit(node, {
              [Kind.ARGUMENT]: {
                enter(argNode) {
                  if (argNode.name.value === 'ttl') {
                    visit(argNode, {
                      [Kind.INT]: {
                        enter(intNode) {
                          behaviour.ttl = +intNode.value;
                        },
                      },
                    });
                  }
                },
              },
            });
            // delete this node
            return null;
          }
          return;
        },
      },
    });

    this.operationMap.set(operationName, {
      operationName: operationName,
      operationType: node.operation,
      query: printExecutableGraphQLDocument(finalDoc),
      behaviour,
    });

    return `export const ${documentVariableName}: TypedOperation<${operationResultType}, ${operationVariablesTypes}> = { operation: "${operationName}", operationType: "${node.operation}" };`;
  }
}
