"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthStack = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_cognito_1 = require("aws-cdk-lib/aws-cognito");
const aws_cognito_identitypool_alpha_1 = require("@aws-cdk/aws-cognito-identitypool-alpha");
const aws_lambda_1 = require("aws-cdk-lib/aws-lambda");
const path = require("path");
const handler = "handler";
const runtime = aws_lambda_1.Runtime.NODEJS_16_X;
class AuthStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        var _a;
        super(scope, id, props);
        const addUserFunc = new aws_lambda_1.Function(this, `${process.env.PROJECT_NAME}-postConfirmTriggerFunc`, {
            runtime,
            handler: "confirm.handler",
            code: aws_lambda_1.Code.fromAsset(path.join(__dirname, "./functions/postConfirmTrigger")),
            environment: {
                TABLENAME: props.userTable.tableName,
                REGION: process.env.CDK_DEPLOY_REGION,
            },
        });
        const preSignUp = new aws_lambda_1.Function(this, `${process.env.PROJECT_NAME}-triggers-presignup`, {
            runtime,
            handler: "addUserToDb.handler",
            code: aws_lambda_1.Code.fromAsset(path.join(__dirname, "./functions/preSignUp")),
        });
        const userPool = new aws_cognito_1.UserPool(this, `${process.env.PROJECT_NAME}_user_pool`, {
            userPoolName: `${process.env.PROJECT_NAME}_user_pool`,
            selfSignUpEnabled: true,
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
            accountRecovery: aws_cognito_1.AccountRecovery.EMAIL_ONLY,
            enableSmsRole: false,
            userVerification: {
                emailStyle: aws_cognito_1.VerificationEmailStyle.CODE,
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
                tempPasswordValidity: aws_cdk_lib_1.Duration.days(14),
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
        });
        props.userTable.grantWriteData(addUserFunc);
        if (props.hasCognitoGroups) {
            (_a = props.groupNames) === null || _a === void 0 ? void 0 : _a.forEach((groupName) => new aws_cognito_1.CfnUserPoolGroup(this, `${props.userpoolConstructName}${groupName}Group`, {
                userPoolId: userPool.userPoolId,
                groupName: groupName,
            }));
        }
        const userPoolClient = new aws_cognito_1.UserPoolClient(this, `${process.env.PROJECT_NAME}-user-pool-client`, {
            userPool,
        });
        const identityPool = new aws_cognito_identitypool_alpha_1.IdentityPool(this, `${process.env.PROJECT_NAME}_identity`, {
            identityPoolName: `${process.env.PROJECT_NAME}_identity`,
            allowUnauthenticatedIdentities: true,
            authenticationProviders: {
                userPools: [
                    new aws_cognito_identitypool_alpha_1.UserPoolAuthenticationProvider({ userPool, userPoolClient }),
                ],
            },
        });
        this.authenticatedRole = identityPool.authenticatedRole;
        this.unauthenticatedRole = identityPool.unauthenticatedRole;
        this.userpool = userPool;
        this.identityPoolId = new aws_cdk_lib_1.CfnOutput(this, "IdentityPoolId", {
            value: identityPool.identityPoolId,
        });
        new aws_cdk_lib_1.CfnOutput(this, "UserPoolId", {
            value: userPool.userPoolId,
        });
        new aws_cdk_lib_1.CfnOutput(this, "UserPoolClientId", {
            value: userPoolClient.userPoolClientId,
        });
    }
}
exports.AuthStack = AuthStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aFN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXV0aFN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZDQU9xQjtBQUNyQix5REFPaUM7QUFFakMsNEZBR2lEO0FBRWpELHVEQUFpRTtBQUNqRSw2QkFBNkI7QUFZN0IsTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDO0FBQzFCLE1BQU0sT0FBTyxHQUFHLG9CQUFPLENBQUMsV0FBVyxDQUFDO0FBQ3BDLE1BQWEsU0FBVSxTQUFRLG1CQUFLO0lBTWxDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBcUI7O1FBQzdELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sV0FBVyxHQUFHLElBQUkscUJBQVEsQ0FDOUIsSUFBSSxFQUNKLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLHlCQUF5QixFQUNwRDtZQUNFLE9BQU87WUFDUCxPQUFPLEVBQUUsaUJBQWlCO1lBQzFCLElBQUksRUFBRSxpQkFBSSxDQUFDLFNBQVMsQ0FDbEIsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsZ0NBQWdDLENBQUMsQ0FDdkQ7WUFDRCxXQUFXLEVBQUU7Z0JBQ1gsU0FBUyxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsU0FBUztnQkFDcEMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWtCO2FBQ3ZDO1NBQ0YsQ0FDRixDQUFDO1FBRUYsTUFBTSxTQUFTLEdBQUcsSUFBSSxxQkFBUSxDQUM1QixJQUFJLEVBQ0osR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVkscUJBQXFCLEVBQ2hEO1lBQ0UsT0FBTztZQUNQLE9BQU8sRUFBRSxxQkFBcUI7WUFDOUIsSUFBSSxFQUFFLGlCQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLHVCQUF1QixDQUFDLENBQUM7U0FDcEUsQ0FDRixDQUFDO1FBRUYsTUFBTSxRQUFRLEdBQUcsSUFBSSxzQkFBUSxDQUMzQixJQUFJLEVBQ0osR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksWUFBWSxFQUN2QztZQUNFLFlBQVksRUFBRSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxZQUFZO1lBQ3JELGlCQUFpQixFQUFFLElBQUk7WUFDdkIsYUFBYSxFQUFFLDJCQUFhLENBQUMsT0FBTztZQUNwQyxlQUFlLEVBQUUsNkJBQWUsQ0FBQyxVQUFVO1lBQzNDLGFBQWEsRUFBRSxLQUFLO1lBQ3BCLGdCQUFnQixFQUFFO2dCQUNoQixVQUFVLEVBQUUsb0NBQXNCLENBQUMsSUFBSTthQUN4QztZQUNELFVBQVUsRUFBRTtnQkFDVixLQUFLLEVBQUUsSUFBSTthQUNaO1lBQ0QsY0FBYyxFQUFFO2dCQUNkLFNBQVMsRUFBRSxDQUFDO2dCQUNaLGFBQWEsRUFBRSxLQUFLO2dCQUNwQixnQkFBZ0IsRUFBRSxLQUFLO2dCQUN2QixnQkFBZ0IsRUFBRSxLQUFLO2dCQUN2QixjQUFjLEVBQUUsS0FBSztnQkFDckIsb0JBQW9CLEVBQUUsc0JBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO2FBQ3hDO1lBQ0QsYUFBYSxFQUFFO2dCQUNiLEtBQUssRUFBRSxJQUFJO2FBQ1o7WUFDRCxtQkFBbUIsRUFBRSxLQUFLO1lBQzFCLGtCQUFrQixFQUFFO2dCQUNsQixLQUFLLEVBQUU7b0JBQ0wsT0FBTyxFQUFFLElBQUk7b0JBQ2IsUUFBUSxFQUFFLElBQUk7aUJBQ2Y7Z0JBQ0QsU0FBUyxFQUFFO29CQUNULFFBQVEsRUFBRSxLQUFLO29CQUNmLE9BQU8sRUFBRSxJQUFJO2lCQUNkO2dCQUNELFVBQVUsRUFBRTtvQkFDVixRQUFRLEVBQUUsS0FBSztvQkFDZixPQUFPLEVBQUUsSUFBSTtpQkFDZDtnQkFDRCxXQUFXLEVBQUU7b0JBQ1gsUUFBUSxFQUFFLEtBQUs7b0JBQ2YsT0FBTyxFQUFFLElBQUk7aUJBQ2Q7YUFDRjtZQUNELGNBQWMsRUFBRTtnQkFDZCxnQkFBZ0IsRUFBRSxXQUFXO2dCQUM3QixTQUFTO2FBQ1Y7U0FDRixDQUNGLENBQUM7UUFFRixLQUFLLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUU1QyxJQUFJLEtBQUssQ0FBQyxnQkFBZ0IsRUFBRTtZQUMxQixNQUFBLEtBQUssQ0FBQyxVQUFVLDBDQUFFLE9BQU8sQ0FDdkIsQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUNaLElBQUksOEJBQWdCLENBQ2xCLElBQUksRUFDSixHQUFHLEtBQUssQ0FBQyxxQkFBcUIsR0FBRyxTQUFTLE9BQU8sRUFDakQ7Z0JBQ0UsVUFBVSxFQUFFLFFBQVEsQ0FBQyxVQUFVO2dCQUMvQixTQUFTLEVBQUUsU0FBUzthQUNyQixDQUNGLEVBQ0g7U0FDSDtRQUVELE1BQU0sY0FBYyxHQUFHLElBQUksNEJBQWMsQ0FDdkMsSUFBSSxFQUNKLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLG1CQUFtQixFQUM5QztZQUNFLFFBQVE7U0FDVCxDQUNGLENBQUM7UUFFRixNQUFNLFlBQVksR0FBRyxJQUFJLDZDQUFZLENBQ25DLElBQUksRUFDSixHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxXQUFXLEVBQ3RDO1lBQ0UsZ0JBQWdCLEVBQUUsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksV0FBVztZQUN4RCw4QkFBOEIsRUFBRSxJQUFJO1lBQ3BDLHVCQUF1QixFQUFFO2dCQUN2QixTQUFTLEVBQUU7b0JBQ1QsSUFBSSwrREFBOEIsQ0FBQyxFQUFFLFFBQVEsRUFBRSxjQUFjLEVBQUUsQ0FBQztpQkFDakU7YUFDRjtTQUNGLENBQ0YsQ0FBQztRQUVGLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxZQUFZLENBQUMsaUJBQWlCLENBQUM7UUFDeEQsSUFBSSxDQUFDLG1CQUFtQixHQUFHLFlBQVksQ0FBQyxtQkFBbUIsQ0FBQztRQUM1RCxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUV6QixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksdUJBQVMsQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7WUFDMUQsS0FBSyxFQUFFLFlBQVksQ0FBQyxjQUFjO1NBQ25DLENBQUMsQ0FBQztRQUVILElBQUksdUJBQVMsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO1lBQ2hDLEtBQUssRUFBRSxRQUFRLENBQUMsVUFBVTtTQUMzQixDQUFDLENBQUM7UUFFSCxJQUFJLHVCQUFTLENBQUMsSUFBSSxFQUFFLGtCQUFrQixFQUFFO1lBQ3RDLEtBQUssRUFBRSxjQUFjLENBQUMsZ0JBQWdCO1NBQ3ZDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQTdJRCw4QkE2SUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDZm5PdXRwdXQsXG4gIER1cmF0aW9uLFxuICBFeHBpcmF0aW9uLFxuICBSZW1vdmFsUG9saWN5LFxuICBTdGFjayxcbiAgU3RhY2tQcm9wcyxcbn0gZnJvbSBcImF3cy1jZGstbGliXCI7XG5pbXBvcnQge1xuICBBY2NvdW50UmVjb3ZlcnksXG4gIENmblVzZXJQb29sR3JvdXAsXG4gIFVzZXJQb29sLFxuICBVc2VyUG9vbENsaWVudCxcbiAgVXNlclBvb2xPcGVyYXRpb24sXG4gIFZlcmlmaWNhdGlvbkVtYWlsU3R5bGUsXG59IGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtY29nbml0b1wiO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSBcImNvbnN0cnVjdHNcIjtcbmltcG9ydCB7XG4gIElkZW50aXR5UG9vbCxcbiAgVXNlclBvb2xBdXRoZW50aWNhdGlvblByb3ZpZGVyLFxufSBmcm9tIFwiQGF3cy1jZGsvYXdzLWNvZ25pdG8taWRlbnRpdHlwb29sLWFscGhhXCI7XG5pbXBvcnQgeyBJUm9sZSB9IGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtaWFtXCI7XG5pbXBvcnQgeyBDb2RlLCBSdW50aW1lLCBGdW5jdGlvbiB9IGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtbGFtYmRhXCI7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBUYWJsZSB9IGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtZHluYW1vZGJcIjtcblxuaW50ZXJmYWNlIEF1dGhTdGFja1Byb3BzIGV4dGVuZHMgU3RhY2tQcm9wcyB7XG4gIHJlYWRvbmx5IHN0YWdlOiBzdHJpbmc7XG4gIHJlYWRvbmx5IHVzZXJwb29sQ29uc3RydWN0TmFtZTogc3RyaW5nO1xuICByZWFkb25seSBoYXNDb2duaXRvR3JvdXBzOiBib29sZWFuO1xuICByZWFkb25seSBncm91cE5hbWVzPzogc3RyaW5nW107XG4gIHJlYWRvbmx5IGlkZW50aXR5cG9vbENvbnN0cnVjdE5hbWU6IHN0cmluZztcbiAgcmVhZG9ubHkgdXNlclRhYmxlOiBUYWJsZTtcbn1cblxuY29uc3QgaGFuZGxlciA9IFwiaGFuZGxlclwiO1xuY29uc3QgcnVudGltZSA9IFJ1bnRpbWUuTk9ERUpTXzE2X1g7XG5leHBvcnQgY2xhc3MgQXV0aFN0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBwdWJsaWMgcmVhZG9ubHkgaWRlbnRpdHlQb29sSWQ6IENmbk91dHB1dDtcbiAgcHVibGljIHJlYWRvbmx5IGF1dGhlbnRpY2F0ZWRSb2xlOiBJUm9sZTtcbiAgcHVibGljIHJlYWRvbmx5IHVuYXV0aGVudGljYXRlZFJvbGU6IElSb2xlO1xuICBwdWJsaWMgcmVhZG9ubHkgdXNlcnBvb2w6IFVzZXJQb29sO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBBdXRoU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3QgYWRkVXNlckZ1bmMgPSBuZXcgRnVuY3Rpb24oXG4gICAgICB0aGlzLFxuICAgICAgYCR7cHJvY2Vzcy5lbnYuUFJPSkVDVF9OQU1FfS1wb3N0Q29uZmlybVRyaWdnZXJGdW5jYCxcbiAgICAgIHtcbiAgICAgICAgcnVudGltZSxcbiAgICAgICAgaGFuZGxlcjogXCJjb25maXJtLmhhbmRsZXJcIixcbiAgICAgICAgY29kZTogQ29kZS5mcm9tQXNzZXQoXG4gICAgICAgICAgcGF0aC5qb2luKF9fZGlybmFtZSwgXCIuL2Z1bmN0aW9ucy9wb3N0Q29uZmlybVRyaWdnZXJcIilcbiAgICAgICAgKSxcbiAgICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgICBUQUJMRU5BTUU6IHByb3BzLnVzZXJUYWJsZS50YWJsZU5hbWUsXG4gICAgICAgICAgUkVHSU9OOiBwcm9jZXNzLmVudi5DREtfREVQTE9ZX1JFR0lPTiEsXG4gICAgICAgIH0sXG4gICAgICB9XG4gICAgKTtcblxuICAgIGNvbnN0IHByZVNpZ25VcCA9IG5ldyBGdW5jdGlvbihcbiAgICAgIHRoaXMsXG4gICAgICBgJHtwcm9jZXNzLmVudi5QUk9KRUNUX05BTUV9LXRyaWdnZXJzLXByZXNpZ251cGAsXG4gICAgICB7XG4gICAgICAgIHJ1bnRpbWUsXG4gICAgICAgIGhhbmRsZXI6IFwiYWRkVXNlclRvRGIuaGFuZGxlclwiLFxuICAgICAgICBjb2RlOiBDb2RlLmZyb21Bc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCBcIi4vZnVuY3Rpb25zL3ByZVNpZ25VcFwiKSksXG4gICAgICB9XG4gICAgKTtcblxuICAgIGNvbnN0IHVzZXJQb29sID0gbmV3IFVzZXJQb29sKFxuICAgICAgdGhpcyxcbiAgICAgIGAke3Byb2Nlc3MuZW52LlBST0pFQ1RfTkFNRX1fdXNlcl9wb29sYCxcbiAgICAgIHtcbiAgICAgICAgdXNlclBvb2xOYW1lOiBgJHtwcm9jZXNzLmVudi5QUk9KRUNUX05BTUV9X3VzZXJfcG9vbGAsXG4gICAgICAgIHNlbGZTaWduVXBFbmFibGVkOiB0cnVlLFxuICAgICAgICByZW1vdmFsUG9saWN5OiBSZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gICAgICAgIGFjY291bnRSZWNvdmVyeTogQWNjb3VudFJlY292ZXJ5LkVNQUlMX09OTFksXG4gICAgICAgIGVuYWJsZVNtc1JvbGU6IGZhbHNlLFxuICAgICAgICB1c2VyVmVyaWZpY2F0aW9uOiB7XG4gICAgICAgICAgZW1haWxTdHlsZTogVmVyaWZpY2F0aW9uRW1haWxTdHlsZS5DT0RFLFxuICAgICAgICB9LFxuICAgICAgICBhdXRvVmVyaWZ5OiB7XG4gICAgICAgICAgZW1haWw6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICAgIHBhc3N3b3JkUG9saWN5OiB7XG4gICAgICAgICAgbWluTGVuZ3RoOiA2LFxuICAgICAgICAgIHJlcXVpcmVEaWdpdHM6IGZhbHNlLFxuICAgICAgICAgIHJlcXVpcmVMb3dlcmNhc2U6IGZhbHNlLFxuICAgICAgICAgIHJlcXVpcmVVcHBlcmNhc2U6IGZhbHNlLFxuICAgICAgICAgIHJlcXVpcmVTeW1ib2xzOiBmYWxzZSxcbiAgICAgICAgICB0ZW1wUGFzc3dvcmRWYWxpZGl0eTogRHVyYXRpb24uZGF5cygxNCksXG4gICAgICAgIH0sXG4gICAgICAgIHNpZ25JbkFsaWFzZXM6IHtcbiAgICAgICAgICBlbWFpbDogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgc2lnbkluQ2FzZVNlbnNpdGl2ZTogZmFsc2UsXG4gICAgICAgIHN0YW5kYXJkQXR0cmlidXRlczoge1xuICAgICAgICAgIGVtYWlsOiB7XG4gICAgICAgICAgICBtdXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBnaXZlbk5hbWU6IHtcbiAgICAgICAgICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICAgICAgICAgIG11dGFibGU6IHRydWUsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBmYW1pbHlOYW1lOiB7XG4gICAgICAgICAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgICAgICAgICBtdXRhYmxlOiB0cnVlLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgcGhvbmVOdW1iZXI6IHtcbiAgICAgICAgICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICAgICAgICAgIG11dGFibGU6IHRydWUsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgbGFtYmRhVHJpZ2dlcnM6IHtcbiAgICAgICAgICBwb3N0Q29uZmlybWF0aW9uOiBhZGRVc2VyRnVuYyxcbiAgICAgICAgICBwcmVTaWduVXAsXG4gICAgICAgIH0sXG4gICAgICB9XG4gICAgKTtcblxuICAgIHByb3BzLnVzZXJUYWJsZS5ncmFudFdyaXRlRGF0YShhZGRVc2VyRnVuYyk7XG5cbiAgICBpZiAocHJvcHMuaGFzQ29nbml0b0dyb3Vwcykge1xuICAgICAgcHJvcHMuZ3JvdXBOYW1lcz8uZm9yRWFjaChcbiAgICAgICAgKGdyb3VwTmFtZSkgPT5cbiAgICAgICAgICBuZXcgQ2ZuVXNlclBvb2xHcm91cChcbiAgICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgICBgJHtwcm9wcy51c2VycG9vbENvbnN0cnVjdE5hbWV9JHtncm91cE5hbWV9R3JvdXBgLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB1c2VyUG9vbElkOiB1c2VyUG9vbC51c2VyUG9vbElkLFxuICAgICAgICAgICAgICBncm91cE5hbWU6IGdyb3VwTmFtZSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICApXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IHVzZXJQb29sQ2xpZW50ID0gbmV3IFVzZXJQb29sQ2xpZW50KFxuICAgICAgdGhpcyxcbiAgICAgIGAke3Byb2Nlc3MuZW52LlBST0pFQ1RfTkFNRX0tdXNlci1wb29sLWNsaWVudGAsXG4gICAgICB7XG4gICAgICAgIHVzZXJQb29sLFxuICAgICAgfVxuICAgICk7XG5cbiAgICBjb25zdCBpZGVudGl0eVBvb2wgPSBuZXcgSWRlbnRpdHlQb29sKFxuICAgICAgdGhpcyxcbiAgICAgIGAke3Byb2Nlc3MuZW52LlBST0pFQ1RfTkFNRX1faWRlbnRpdHlgLFxuICAgICAge1xuICAgICAgICBpZGVudGl0eVBvb2xOYW1lOiBgJHtwcm9jZXNzLmVudi5QUk9KRUNUX05BTUV9X2lkZW50aXR5YCxcbiAgICAgICAgYWxsb3dVbmF1dGhlbnRpY2F0ZWRJZGVudGl0aWVzOiB0cnVlLFxuICAgICAgICBhdXRoZW50aWNhdGlvblByb3ZpZGVyczoge1xuICAgICAgICAgIHVzZXJQb29sczogW1xuICAgICAgICAgICAgbmV3IFVzZXJQb29sQXV0aGVudGljYXRpb25Qcm92aWRlcih7IHVzZXJQb29sLCB1c2VyUG9vbENsaWVudCB9KSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfVxuICAgICk7XG5cbiAgICB0aGlzLmF1dGhlbnRpY2F0ZWRSb2xlID0gaWRlbnRpdHlQb29sLmF1dGhlbnRpY2F0ZWRSb2xlO1xuICAgIHRoaXMudW5hdXRoZW50aWNhdGVkUm9sZSA9IGlkZW50aXR5UG9vbC51bmF1dGhlbnRpY2F0ZWRSb2xlO1xuICAgIHRoaXMudXNlcnBvb2wgPSB1c2VyUG9vbDtcblxuICAgIHRoaXMuaWRlbnRpdHlQb29sSWQgPSBuZXcgQ2ZuT3V0cHV0KHRoaXMsIFwiSWRlbnRpdHlQb29sSWRcIiwge1xuICAgICAgdmFsdWU6IGlkZW50aXR5UG9vbC5pZGVudGl0eVBvb2xJZCxcbiAgICB9KTtcblxuICAgIG5ldyBDZm5PdXRwdXQodGhpcywgXCJVc2VyUG9vbElkXCIsIHtcbiAgICAgIHZhbHVlOiB1c2VyUG9vbC51c2VyUG9vbElkLFxuICAgIH0pO1xuXG4gICAgbmV3IENmbk91dHB1dCh0aGlzLCBcIlVzZXJQb29sQ2xpZW50SWRcIiwge1xuICAgICAgdmFsdWU6IHVzZXJQb29sQ2xpZW50LnVzZXJQb29sQ2xpZW50SWQsXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==