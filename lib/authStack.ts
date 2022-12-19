import {
  CfnOutput,
  Duration,
  Expiration,
  RemovalPolicy,
  Stack,
  StackProps,
} from "aws-cdk-lib";
import {
  AccountRecovery,
  CfnUserPoolGroup,
  UserPool,
  UserPoolClient,
  UserPoolOperation,
  VerificationEmailStyle,
} from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";
import {
  IdentityPool,
  UserPoolAuthenticationProvider,
} from "@aws-cdk/aws-cognito-identitypool-alpha";
import { IRole } from "aws-cdk-lib/aws-iam";
import { Code, Runtime, Function } from "aws-cdk-lib/aws-lambda";
import * as path from "path";
import { Table } from "aws-cdk-lib/aws-dynamodb";

interface AuthStackProps extends StackProps {
  readonly stage: string;
  readonly userpoolConstructName: string;
  readonly hasCognitoGroups: boolean;
  readonly groupNames?: string[];
  readonly identitypoolConstructName: string;
  readonly userTable: Table;
}

const handler = "handler";
const runtime = Runtime.NODEJS_16_X;
export class AuthStack extends Stack {
  public readonly identityPoolId: CfnOutput;
  public readonly authenticatedRole: IRole;
  public readonly unauthenticatedRole: IRole;
  public readonly userpool: UserPool;

  constructor(scope: Construct, id: string, props: AuthStackProps) {
    super(scope, id, props);

    const addUserFunc = new Function(
      this,
      `${process.env.PROJECT_NAME}-postConfirmTriggerFunc`,
      {
        runtime,
        handler: "postConfirm.main",
        code: Code.fromAsset(
          path.join(__dirname, "./functions/postConfirmTrigger")
        ),
        environment: {
          TABLENAME: props.userTable.tableName,
          REGION: process.env.CDK_DEPLOY_REGION!,
        },
      }
    );

    const preSignUp = new Function(
      this,
      `${process.env.PROJECT_NAME}-triggers-presignup`,
      {
        runtime,
        handler: "preSignUp.main",
        code: Code.fromAsset(path.join(__dirname, "./functions/preSignUp")),
      }
    );

    const userPool = new UserPool(
      this,
      `${process.env.PROJECT_NAME}_user_pool`,
      {
        userPoolName: `${process.env.PROJECT_NAME}_user_pool`,
        selfSignUpEnabled: true,
        removalPolicy: RemovalPolicy.DESTROY,
        accountRecovery: AccountRecovery.EMAIL_ONLY,
        enableSmsRole: false,
        userVerification: {
          emailStyle: VerificationEmailStyle.CODE,
        },
        autoVerify: {
          email: true,
        },
        passwordPolicy: {
          minLength: 6,
          requireDigits: false,
          requireLowercase: false,
          requireUppercase: false,
          requireSymbols: false,
          tempPasswordValidity: Duration.days(14),
        },
        signInAliases: {
          email: true,
        },
        signInCaseSensitive: false,
        standardAttributes: {
          email: {
            mutable: true,
            required: true,
          },
          givenName: {
            required: false,
            mutable: true,
          },
          familyName: {
            required: false,
            mutable: true,
          },
          phoneNumber: {
            required: false,
            mutable: true,
          },
        },
        lambdaTriggers: {
          postConfirmation: addUserFunc,
          preSignUp,
        },
      }
    );

    props.userTable.grantWriteData(addUserFunc);

    if (props.hasCognitoGroups) {
      props.groupNames?.forEach(
        (groupName) =>
          new CfnUserPoolGroup(
            this,
            `${props.userpoolConstructName}${groupName}Group`,
            {
              userPoolId: userPool.userPoolId,
              groupName: groupName,
            }
          )
      );
    }

    const userPoolClient = new UserPoolClient(
      this,
      `${process.env.PROJECT_NAME}-user-pool-client`,
      {
        userPool,
      }
    );

    const identityPool = new IdentityPool(
      this,
      `${process.env.PROJECT_NAME}_identity`,
      {
        identityPoolName: `${process.env.PROJECT_NAME}_identity`,
        allowUnauthenticatedIdentities: true,
        authenticationProviders: {
          userPools: [
            new UserPoolAuthenticationProvider({ userPool, userPoolClient }),
          ],
        },
      }
    );

    this.authenticatedRole = identityPool.authenticatedRole;
    this.unauthenticatedRole = identityPool.unauthenticatedRole;
    this.userpool = userPool;

    this.identityPoolId = new CfnOutput(this, "IdentityPoolId", {
      value: identityPool.identityPoolId,
    });

    new CfnOutput(this, "UserPoolId", {
      value: userPool.userPoolId,
    });

    new CfnOutput(this, "UserPoolClientId", {
      value: userPoolClient.userPoolClientId,
    });
  }
}
