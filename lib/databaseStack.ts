import { CfnOutput, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import {
  Effect,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

interface DatabaseStackProps extends StackProps {}

export class DatabaseStack extends Stack {
  public readonly roomTable: Table;
  public readonly userTable: Table;
  public readonly messageTable: Table;

  constructor(scope: Construct, id: string, props: DatabaseStackProps) {
    super(scope, id, props);

    const userTable = new Table(
      this,
      `${process.env.PROJECT_NAME}-user-table`,
      {
        removalPolicy: RemovalPolicy.DESTROY,
        billingMode: BillingMode.PAY_PER_REQUEST,
        partitionKey: { name: "id", type: AttributeType.STRING },
      }
    );

    const roomTable = new Table(
      this,
      `${process.env.PROJECT_NAME}-room-table`,
      {
        removalPolicy: RemovalPolicy.DESTROY,
        billingMode: BillingMode.PAY_PER_REQUEST,
        partitionKey: { name: "id", type: AttributeType.STRING },
      }
    );

    const messageTable = new Table(
      this,
      `${process.env.PROJECT_NAME}-message-table`,
      {
        removalPolicy: RemovalPolicy.DESTROY,
        billingMode: BillingMode.PAY_PER_REQUEST,
        partitionKey: { name: "id", type: AttributeType.STRING },
      }
    );

    messageTable.addGlobalSecondaryIndex({
      indexName: "messages-by-room-id",
      partitionKey: { name: "roomId", type: AttributeType.STRING },
      sortKey: { name: "createdAt", type: AttributeType.STRING },
    });

    const messageTableServiceRole = new Role(
      this,
      `${process.env.PROJECT_NAME}-MessageTableServiceRole`,
      {
        assumedBy: new ServicePrincipal("dynamodb.amazonaws.com"),
      }
    );

    messageTableServiceRole.addToPolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: [`${messageTable.tableArn}/index/messages-by-room-id`],
        actions: ["dymamodb:Query"],
      })
    );

    this.roomTable = roomTable;
    this.userTable = userTable;
    this.messageTable = messageTable;
  }
}
