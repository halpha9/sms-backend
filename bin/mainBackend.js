#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const cdk = require("aws-cdk-lib");
const authStack_1 = require("../lib/authStack");
const fileStorageStack_1 = require("../lib/fileStorageStack");
const databaseStack_1 = require("../lib/databaseStack");
const apiStack_1 = require("../lib/apiStack");
const app = new cdk.App();
const options = {
    env: {
        account: process.env.CDK_DEPLOY_ACCOUNT,
        region: process.env.CDK_DEPLOY_REGION,
    },
};
const databaseStack = new databaseStack_1.DatabaseStack(app, `${process.env.PROJECT_NAME}-DatabaseStack`, {
    ...options,
});
const authStack = new authStack_1.AuthStack(app, `${process.env.PROJECT_NAME}-Authstack`, {
    ...options,
    stage: "dev",
    hasCognitoGroups: true,
    groupNames: ["admin"],
    userpoolConstructName: "ChatUserPool",
    identitypoolConstructName: "ChatIdentityPool",
    userTable: databaseStack.userTable,
});
const fileStorageStack = new fileStorageStack_1.FileStorageStack(app, `${process.env.PROJECT_NAME}-FileStorageStack`, {
    ...options,
    authenticatedRole: authStack.authenticatedRole,
    unauthenticatedRole: authStack.unauthenticatedRole,
    allowedOrigins: ["http://localhost:3000"],
});
const apiStack = new apiStack_1.APIStack(app, `${process.env.PROJECT_NAME}-AppSyncStack`, {
    ...options,
    userpool: authStack.userpool,
    roomTable: databaseStack.roomTable,
    messageTable: databaseStack.messageTable,
    userTable: databaseStack.userTable,
    unauthenticatedRole: authStack.unauthenticatedRole,
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbkJhY2tlbmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtYWluQmFja2VuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSx1Q0FBcUM7QUFDckMsbUNBQW1DO0FBQ25DLGdEQUE2QztBQUM3Qyw4REFBMkQ7QUFDM0Qsd0RBQXFEO0FBQ3JELDhDQUEyQztBQUUzQyxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUUxQixNQUFNLE9BQU8sR0FBRztJQUNkLEdBQUcsRUFBRTtRQUNILE9BQU8sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQjtRQUN2QyxNQUFNLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUI7S0FDdEM7Q0FDRixDQUFDO0FBRUYsTUFBTSxhQUFhLEdBQUcsSUFBSSw2QkFBYSxDQUNyQyxHQUFHLEVBQ0gsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksZ0JBQWdCLEVBQzNDO0lBQ0UsR0FBRyxPQUFPO0NBQ1gsQ0FDRixDQUFDO0FBRUYsTUFBTSxTQUFTLEdBQUcsSUFBSSxxQkFBUyxDQUFDLEdBQUcsRUFBRSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxZQUFZLEVBQUU7SUFDNUUsR0FBRyxPQUFPO0lBQ1YsS0FBSyxFQUFFLEtBQUs7SUFDWixnQkFBZ0IsRUFBRSxJQUFJO0lBQ3RCLFVBQVUsRUFBRSxDQUFDLE9BQU8sQ0FBQztJQUNyQixxQkFBcUIsRUFBRSxjQUFjO0lBQ3JDLHlCQUF5QixFQUFFLGtCQUFrQjtJQUM3QyxTQUFTLEVBQUUsYUFBYSxDQUFDLFNBQVM7Q0FDbkMsQ0FBQyxDQUFDO0FBRUgsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLG1DQUFnQixDQUMzQyxHQUFHLEVBQ0gsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksbUJBQW1CLEVBQzlDO0lBQ0UsR0FBRyxPQUFPO0lBQ1YsaUJBQWlCLEVBQUUsU0FBUyxDQUFDLGlCQUFpQjtJQUM5QyxtQkFBbUIsRUFBRSxTQUFTLENBQUMsbUJBQW1CO0lBQ2xELGNBQWMsRUFBRSxDQUFDLHVCQUF1QixDQUFDO0NBQzFDLENBQ0YsQ0FBQztBQUVGLE1BQU0sUUFBUSxHQUFHLElBQUksbUJBQVEsQ0FBQyxHQUFHLEVBQUUsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksZUFBZSxFQUFFO0lBQzdFLEdBQUcsT0FBTztJQUNWLFFBQVEsRUFBRSxTQUFTLENBQUMsUUFBUTtJQUM1QixTQUFTLEVBQUUsYUFBYSxDQUFDLFNBQVM7SUFDbEMsWUFBWSxFQUFFLGFBQWEsQ0FBQyxZQUFZO0lBQ3hDLFNBQVMsRUFBRSxhQUFhLENBQUMsU0FBUztJQUNsQyxtQkFBbUIsRUFBRSxTQUFTLENBQUMsbUJBQW1CO0NBQ25ELENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcbmltcG9ydCBcInNvdXJjZS1tYXAtc3VwcG9ydC9yZWdpc3RlclwiO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gXCJhd3MtY2RrLWxpYlwiO1xuaW1wb3J0IHsgQXV0aFN0YWNrIH0gZnJvbSBcIi4uL2xpYi9hdXRoU3RhY2tcIjtcbmltcG9ydCB7IEZpbGVTdG9yYWdlU3RhY2sgfSBmcm9tIFwiLi4vbGliL2ZpbGVTdG9yYWdlU3RhY2tcIjtcbmltcG9ydCB7IERhdGFiYXNlU3RhY2sgfSBmcm9tIFwiLi4vbGliL2RhdGFiYXNlU3RhY2tcIjtcbmltcG9ydCB7IEFQSVN0YWNrIH0gZnJvbSBcIi4uL2xpYi9hcGlTdGFja1wiO1xuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuXG5jb25zdCBvcHRpb25zID0ge1xuICBlbnY6IHtcbiAgICBhY2NvdW50OiBwcm9jZXNzLmVudi5DREtfREVQTE9ZX0FDQ09VTlQsXG4gICAgcmVnaW9uOiBwcm9jZXNzLmVudi5DREtfREVQTE9ZX1JFR0lPTixcbiAgfSxcbn07XG5cbmNvbnN0IGRhdGFiYXNlU3RhY2sgPSBuZXcgRGF0YWJhc2VTdGFjayhcbiAgYXBwLFxuICBgJHtwcm9jZXNzLmVudi5QUk9KRUNUX05BTUV9LURhdGFiYXNlU3RhY2tgLFxuICB7XG4gICAgLi4ub3B0aW9ucyxcbiAgfVxuKTtcblxuY29uc3QgYXV0aFN0YWNrID0gbmV3IEF1dGhTdGFjayhhcHAsIGAke3Byb2Nlc3MuZW52LlBST0pFQ1RfTkFNRX0tQXV0aHN0YWNrYCwge1xuICAuLi5vcHRpb25zLFxuICBzdGFnZTogXCJkZXZcIixcbiAgaGFzQ29nbml0b0dyb3VwczogdHJ1ZSxcbiAgZ3JvdXBOYW1lczogW1wiYWRtaW5cIl0sXG4gIHVzZXJwb29sQ29uc3RydWN0TmFtZTogXCJDaGF0VXNlclBvb2xcIixcbiAgaWRlbnRpdHlwb29sQ29uc3RydWN0TmFtZTogXCJDaGF0SWRlbnRpdHlQb29sXCIsXG4gIHVzZXJUYWJsZTogZGF0YWJhc2VTdGFjay51c2VyVGFibGUsXG59KTtcblxuY29uc3QgZmlsZVN0b3JhZ2VTdGFjayA9IG5ldyBGaWxlU3RvcmFnZVN0YWNrKFxuICBhcHAsXG4gIGAke3Byb2Nlc3MuZW52LlBST0pFQ1RfTkFNRX0tRmlsZVN0b3JhZ2VTdGFja2AsXG4gIHtcbiAgICAuLi5vcHRpb25zLFxuICAgIGF1dGhlbnRpY2F0ZWRSb2xlOiBhdXRoU3RhY2suYXV0aGVudGljYXRlZFJvbGUsXG4gICAgdW5hdXRoZW50aWNhdGVkUm9sZTogYXV0aFN0YWNrLnVuYXV0aGVudGljYXRlZFJvbGUsXG4gICAgYWxsb3dlZE9yaWdpbnM6IFtcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMFwiXSxcbiAgfVxuKTtcblxuY29uc3QgYXBpU3RhY2sgPSBuZXcgQVBJU3RhY2soYXBwLCBgJHtwcm9jZXNzLmVudi5QUk9KRUNUX05BTUV9LUFwcFN5bmNTdGFja2AsIHtcbiAgLi4ub3B0aW9ucyxcbiAgdXNlcnBvb2w6IGF1dGhTdGFjay51c2VycG9vbCxcbiAgcm9vbVRhYmxlOiBkYXRhYmFzZVN0YWNrLnJvb21UYWJsZSxcbiAgbWVzc2FnZVRhYmxlOiBkYXRhYmFzZVN0YWNrLm1lc3NhZ2VUYWJsZSxcbiAgdXNlclRhYmxlOiBkYXRhYmFzZVN0YWNrLnVzZXJUYWJsZSxcbiAgdW5hdXRoZW50aWNhdGVkUm9sZTogYXV0aFN0YWNrLnVuYXV0aGVudGljYXRlZFJvbGUsXG59KTtcbiJdfQ==