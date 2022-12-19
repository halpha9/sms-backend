#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { AuthStack } from "../lib/authStack";
import { FileStorageStack } from "../lib/fileStorageStack";
import { DatabaseStack } from "../lib/databaseStack";
import { APIStack } from "../lib/apiStack";

const app = new cdk.App();

const options = {
  env: {
    account: process.env.CDK_DEPLOY_ACCOUNT,
    region: process.env.CDK_DEPLOY_REGION,
  },
};

const databaseStack = new DatabaseStack(
  app,
  `${process.env.PROJECT_NAME}-DatabaseStack`,
  {
    ...options,
  }
);

const authStack = new AuthStack(app, `${process.env.PROJECT_NAME}-Authstack`, {
  ...options,
  stage: "dev",
  hasCognitoGroups: true,
  groupNames: ["admin"],
  userpoolConstructName: "ChatUserPool",
  identitypoolConstructName: "ChatIdentityPool",
  userTable: databaseStack.userTable,
});

const fileStorageStack = new FileStorageStack(
  app,
  `${process.env.PROJECT_NAME}-FileStorageStack`,
  {
    ...options,
    authenticatedRole: authStack.authenticatedRole,
    unauthenticatedRole: authStack.unauthenticatedRole,
    allowedOrigins: ["http://localhost:3000"],
  }
);

const apiStack = new APIStack(app, `${process.env.PROJECT_NAME}-AppSyncStack`, {
  ...options,
  userpool: authStack.userpool,
  roomTable: databaseStack.roomTable,
  messageTable: databaseStack.messageTable,
  userTable: databaseStack.userTable,
  unauthenticatedRole: authStack.unauthenticatedRole,
});
