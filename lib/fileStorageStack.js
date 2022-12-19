"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileStorageStack = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const s3 = require("aws-cdk-lib/aws-s3");
const iam = require("aws-cdk-lib/aws-iam");
class FileStorageStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const fileStorageBucket = new s3.Bucket(this, `${process.env.PROJECT_NAME}-bucket`, {
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
            cors: [
                {
                    allowedMethods: [
                        s3.HttpMethods.GET,
                        s3.HttpMethods.POST,
                        s3.HttpMethods.PUT,
                        s3.HttpMethods.DELETE,
                    ],
                    allowedOrigins: props.allowedOrigins,
                    allowedHeaders: ["*"],
                },
            ],
        });
        // allow guests read access to the bucket.
        // fileStorageBucket.addToResourcePolicy(
        // 	new iam.PolicyStatement({
        // 		effect: iam.Effect.ALLOW,
        // 		actions: ['s3:GetObject'],
        // 		principals: [new iam.AnyPrincipal()],
        // 		resources: [`arn:aws:s3:::${fileStorageBucket.bucketName}/public/*`],
        // 	})
        // )
        const mangedPolicyForAmplifyUnauth = new iam.ManagedPolicy(this, `${process.env.PROJECT_NAME}-mangedPolicyForAmplifyUnauth`, {
            description: "managed policy to allow usage of Storage Library for unauth",
            statements: [
                new iam.PolicyStatement({
                    effect: iam.Effect.ALLOW,
                    actions: ["s3:GetObject"],
                    resources: [
                        `arn:aws:s3:::${fileStorageBucket.bucketName}/public/*`,
                    ],
                }),
                new iam.PolicyStatement({
                    effect: iam.Effect.ALLOW,
                    actions: ["s3:GetObject"],
                    resources: [
                        `arn:aws:s3:::${fileStorageBucket.bucketName}/protected/*`,
                    ],
                }),
                new iam.PolicyStatement({
                    effect: iam.Effect.ALLOW,
                    actions: ["s3:ListBucket"],
                    resources: [`arn:aws:s3:::${fileStorageBucket.bucketName}`],
                    conditions: {
                        StringLike: {
                            "s3:prefix": [
                                "public/",
                                "public/*",
                                "protected/",
                                "protected/*",
                            ],
                        },
                    },
                }),
            ],
            roles: [props.unauthenticatedRole],
        });
        const mangedPolicyForAmplifyAuth = new iam.ManagedPolicy(this, `${process.env.PROJECT_NAME}-mangedPolicyForAmplifyAuth`, {
            description: "managed Policy to allow usage of storage library for auth",
            statements: [
                new iam.PolicyStatement({
                    effect: iam.Effect.ALLOW,
                    actions: ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"],
                    resources: [
                        `arn:aws:s3:::${fileStorageBucket.bucketName}/public/*`,
                    ],
                }),
                new iam.PolicyStatement({
                    effect: iam.Effect.ALLOW,
                    actions: ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"],
                    resources: [
                        `arn:aws:s3:::${fileStorageBucket.bucketName}/protected/\${cognito-identity.amazonaws.com:sub}/*`,
                    ],
                }),
                new iam.PolicyStatement({
                    effect: iam.Effect.ALLOW,
                    actions: ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"],
                    resources: [
                        `arn:aws:s3:::${fileStorageBucket.bucketName}/private/\${cognito-identity.amazonaws.com:sub}/*`,
                    ],
                }),
                new iam.PolicyStatement({
                    effect: iam.Effect.ALLOW,
                    actions: ["s3:GetObject"],
                    resources: [
                        `arn:aws:s3:::${fileStorageBucket.bucketName}/protected/*`,
                    ],
                }),
                new iam.PolicyStatement({
                    effect: iam.Effect.ALLOW,
                    actions: ["s3:ListBucket"],
                    resources: [`arn:aws:s3:::${fileStorageBucket.bucketName}`],
                    conditions: {
                        StringLike: {
                            "s3:prefix": [
                                "public/",
                                "public/*",
                                "protected/",
                                "protected/*",
                                "private/${cognito-identity.amazonaws.com:sub}/",
                                "private/${cognito-identity.amazonaws.com:sub}/*",
                            ],
                        },
                    },
                }),
            ],
            roles: [props.authenticatedRole],
        });
        new aws_cdk_lib_1.CfnOutput(this, "BucketName", {
            value: fileStorageBucket.bucketName,
        });
        new aws_cdk_lib_1.CfnOutput(this, "BucketRegion", {
            value: this.region,
        });
    }
}
exports.FileStorageStack = FileStorageStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZVN0b3JhZ2VTdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZpbGVTdG9yYWdlU3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkNBQTBFO0FBRTFFLHlDQUF5QztBQUN6QywyQ0FBMkM7QUFRM0MsTUFBYSxnQkFBaUIsU0FBUSxtQkFBSztJQUN6QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQTRCO1FBQ3BFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0saUJBQWlCLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUNyQyxJQUFJLEVBQ0osR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksU0FBUyxFQUNwQztZQUNFLGFBQWEsRUFBRSwyQkFBYSxDQUFDLE9BQU87WUFDcEMsaUJBQWlCLEVBQUUsSUFBSTtZQUN2QixJQUFJLEVBQUU7Z0JBQ0o7b0JBQ0UsY0FBYyxFQUFFO3dCQUNkLEVBQUUsQ0FBQyxXQUFXLENBQUMsR0FBRzt3QkFDbEIsRUFBRSxDQUFDLFdBQVcsQ0FBQyxJQUFJO3dCQUNuQixFQUFFLENBQUMsV0FBVyxDQUFDLEdBQUc7d0JBQ2xCLEVBQUUsQ0FBQyxXQUFXLENBQUMsTUFBTTtxQkFDdEI7b0JBQ0QsY0FBYyxFQUFFLEtBQUssQ0FBQyxjQUFjO29CQUNwQyxjQUFjLEVBQUUsQ0FBQyxHQUFHLENBQUM7aUJBQ3RCO2FBQ0Y7U0FDRixDQUNGLENBQUM7UUFFRiwwQ0FBMEM7UUFDMUMseUNBQXlDO1FBQ3pDLDZCQUE2QjtRQUM3Qiw4QkFBOEI7UUFDOUIsK0JBQStCO1FBQy9CLDBDQUEwQztRQUMxQywwRUFBMEU7UUFDMUUsTUFBTTtRQUNOLElBQUk7UUFFSixNQUFNLDRCQUE0QixHQUFHLElBQUksR0FBRyxDQUFDLGFBQWEsQ0FDeEQsSUFBSSxFQUNKLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLCtCQUErQixFQUMx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LENBQUM7b0JBQzNELFVBQVUsRUFBRTt3QkFDVixVQUFVLEVBQUU7NEJBQ1YsV0FBVyxFQUFFO2dDQUNYLFNBQVM7Z0NBQ1QsVUFBVTtnQ0FDVixZQUFZO2dDQUNaLGFBQWE7Z0NBQ2IsZ0RBQWdEO2dDQUNoRCxpREFBaUQ7NkJBQ2xEO3lCQUNGO3FCQUNGO2lCQUNGLENBQUM7YUFDSDtZQUNELEtBQUssRUFBRSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQztTQUNqQyxDQUNGLENBQUM7UUFFRixJQUFJLHVCQUFTLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtZQUNoQyxLQUFLLEVBQUUsaUJBQWlCLENBQUMsVUFBVTtTQUNwQyxDQUFDLENBQUM7UUFFSCxJQUFJLHVCQUFTLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRTtZQUNsQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU07U0FDbkIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBN0lELDRDQTZJQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENmbk91dHB1dCwgUmVtb3ZhbFBvbGljeSwgU3RhY2ssIFN0YWNrUHJvcHMgfSBmcm9tIFwiYXdzLWNkay1saWJcIjtcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gXCJjb25zdHJ1Y3RzXCI7XG5pbXBvcnQgKiBhcyBzMyBmcm9tIFwiYXdzLWNkay1saWIvYXdzLXMzXCI7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1pYW1cIjtcblxuaW50ZXJmYWNlIEZpbGVTdG9yYWdlU3RhY2tQcm9wcyBleHRlbmRzIFN0YWNrUHJvcHMge1xuICBhdXRoZW50aWNhdGVkUm9sZTogaWFtLklSb2xlO1xuICB1bmF1dGhlbnRpY2F0ZWRSb2xlOiBpYW0uSVJvbGU7XG4gIGFsbG93ZWRPcmlnaW5zOiBzdHJpbmdbXTtcbn1cblxuZXhwb3J0IGNsYXNzIEZpbGVTdG9yYWdlU3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBGaWxlU3RvcmFnZVN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IGZpbGVTdG9yYWdlQnVja2V0ID0gbmV3IHMzLkJ1Y2tldChcbiAgICAgIHRoaXMsXG4gICAgICBgJHtwcm9jZXNzLmVudi5QUk9KRUNUX05BTUV9LWJ1Y2tldGAsXG4gICAgICB7XG4gICAgICAgIHJlbW92YWxQb2xpY3k6IFJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICAgICAgYXV0b0RlbGV0ZU9iamVjdHM6IHRydWUsXG4gICAgICAgIGNvcnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBhbGxvd2VkTWV0aG9kczogW1xuICAgICAgICAgICAgICBzMy5IdHRwTWV0aG9kcy5HRVQsXG4gICAgICAgICAgICAgIHMzLkh0dHBNZXRob2RzLlBPU1QsXG4gICAgICAgICAgICAgIHMzLkh0dHBNZXRob2RzLlBVVCxcbiAgICAgICAgICAgICAgczMuSHR0cE1ldGhvZHMuREVMRVRFLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIGFsbG93ZWRPcmlnaW5zOiBwcm9wcy5hbGxvd2VkT3JpZ2lucyxcbiAgICAgICAgICAgIGFsbG93ZWRIZWFkZXJzOiBbXCIqXCJdLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9XG4gICAgKTtcblxuICAgIC8vIGFsbG93IGd1ZXN0cyByZWFkIGFjY2VzcyB0byB0aGUgYnVja2V0LlxuICAgIC8vIGZpbGVTdG9yYWdlQnVja2V0LmFkZFRvUmVzb3VyY2VQb2xpY3koXG4gICAgLy8gXHRuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgLy8gXHRcdGVmZmVjdDogaWFtLkVmZmVjdC5BTExPVyxcbiAgICAvLyBcdFx0YWN0aW9uczogWydzMzpHZXRPYmplY3QnXSxcbiAgICAvLyBcdFx0cHJpbmNpcGFsczogW25ldyBpYW0uQW55UHJpbmNpcGFsKCldLFxuICAgIC8vIFx0XHRyZXNvdXJjZXM6IFtgYXJuOmF3czpzMzo6OiR7ZmlsZVN0b3JhZ2VCdWNrZXQuYnVja2V0TmFtZX0vcHVibGljLypgXSxcbiAgICAvLyBcdH0pXG4gICAgLy8gKVxuXG4gICAgY29uc3QgbWFuZ2VkUG9saWN5Rm9yQW1wbGlmeVVuYXV0aCA9IG5ldyBpYW0uTWFuYWdlZFBvbGljeShcbiAgICAgIHRoaXMsXG4gICAgICBgJHtwcm9jZXNzLmVudi5QUk9KRUNUX05BTUV9LW1hbmdlZFBvbGljeUZvckFtcGxpZnlVbmF1dGhgLFxuICAgICAge1xuICAgICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgICBcIm1hbmFnZWQgcG9saWN5IHRvIGFsbG93IHVzYWdlIG9mIFN0b3JhZ2UgTGlicmFyeSBmb3IgdW5hdXRoXCIsXG4gICAgICAgIHN0YXRlbWVudHM6IFtcbiAgICAgICAgICBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgICAgICBlZmZlY3Q6IGlhbS5FZmZlY3QuQUxMT1csXG4gICAgICAgICAgICBhY3Rpb25zOiBbXCJzMzpHZXRPYmplY3RcIl0sXG4gICAgICAgICAgICByZXNvdXJjZXM6IFtcbiAgICAgICAgICAgICAgYGFybjphd3M6czM6Ojoke2ZpbGVTdG9yYWdlQnVja2V0LmJ1Y2tldE5hbWV9L3B1YmxpYy8qYCxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSksXG4gICAgICAgICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICAgICAgZWZmZWN0OiBpYW0uRWZmZWN0LkFMTE9XLFxuICAgICAgICAgICAgYWN0aW9uczogW1wiczM6R2V0T2JqZWN0XCJdLFxuICAgICAgICAgICAgcmVzb3VyY2VzOiBbXG4gICAgICAgICAgICAgIGBhcm46YXdzOnMzOjo6JHtmaWxlU3RvcmFnZUJ1Y2tldC5idWNrZXROYW1lfS9wcm90ZWN0ZWQvKmAsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0pLFxuICAgICAgICAgIG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgICAgIGVmZmVjdDogaWFtLkVmZmVjdC5BTExPVyxcbiAgICAgICAgICAgIGFjdGlvbnM6IFtcInMzOkxpc3RCdWNrZXRcIl0sXG4gICAgICAgICAgICByZXNvdXJjZXM6IFtgYXJuOmF3czpzMzo6OiR7ZmlsZVN0b3JhZ2VCdWNrZXQuYnVja2V0TmFtZX1gXSxcbiAgICAgICAgICAgIGNvbmRpdGlvbnM6IHtcbiAgICAgICAgICAgICAgU3RyaW5nTGlrZToge1xuICAgICAgICAgICAgICAgIFwiczM6cHJlZml4XCI6IFtcbiAgICAgICAgICAgICAgICAgIFwicHVibGljL1wiLFxuICAgICAgICAgICAgICAgICAgXCJwdWJsaWMvKlwiLFxuICAgICAgICAgICAgICAgICAgXCJwcm90ZWN0ZWQvXCIsXG4gICAgICAgICAgICAgICAgICBcInByb3RlY3RlZC8qXCIsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSksXG4gICAgICAgIF0sXG4gICAgICAgIHJvbGVzOiBbcHJvcHMudW5hdXRoZW50aWNhdGVkUm9sZV0sXG4gICAgICB9XG4gICAgKTtcblxuICAgIGNvbnN0IG1hbmdlZFBvbGljeUZvckFtcGxpZnlBdXRoID0gbmV3IGlhbS5NYW5hZ2VkUG9saWN5KFxuICAgICAgdGhpcyxcbiAgICAgIGAke3Byb2Nlc3MuZW52LlBST0pFQ1RfTkFNRX0tbWFuZ2VkUG9saWN5Rm9yQW1wbGlmeUF1dGhgLFxuICAgICAge1xuICAgICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgICBcIm1hbmFnZWQgUG9saWN5IHRvIGFsbG93IHVzYWdlIG9mIHN0b3JhZ2UgbGlicmFyeSBmb3IgYXV0aFwiLFxuICAgICAgICBzdGF0ZW1lbnRzOiBbXG4gICAgICAgICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICAgICAgZWZmZWN0OiBpYW0uRWZmZWN0LkFMTE9XLFxuICAgICAgICAgICAgYWN0aW9uczogW1wiczM6UHV0T2JqZWN0XCIsIFwiczM6R2V0T2JqZWN0XCIsIFwiczM6RGVsZXRlT2JqZWN0XCJdLFxuICAgICAgICAgICAgcmVzb3VyY2VzOiBbXG4gICAgICAgICAgICAgIGBhcm46YXdzOnMzOjo6JHtmaWxlU3RvcmFnZUJ1Y2tldC5idWNrZXROYW1lfS9wdWJsaWMvKmAsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0pLFxuICAgICAgICAgIG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgICAgIGVmZmVjdDogaWFtLkVmZmVjdC5BTExPVyxcbiAgICAgICAgICAgIGFjdGlvbnM6IFtcInMzOlB1dE9iamVjdFwiLCBcInMzOkdldE9iamVjdFwiLCBcInMzOkRlbGV0ZU9iamVjdFwiXSxcbiAgICAgICAgICAgIHJlc291cmNlczogW1xuICAgICAgICAgICAgICBgYXJuOmF3czpzMzo6OiR7ZmlsZVN0b3JhZ2VCdWNrZXQuYnVja2V0TmFtZX0vcHJvdGVjdGVkL1xcJHtjb2duaXRvLWlkZW50aXR5LmFtYXpvbmF3cy5jb206c3VifS8qYCxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSksXG4gICAgICAgICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICAgICAgZWZmZWN0OiBpYW0uRWZmZWN0LkFMTE9XLFxuICAgICAgICAgICAgYWN0aW9uczogW1wiczM6UHV0T2JqZWN0XCIsIFwiczM6R2V0T2JqZWN0XCIsIFwiczM6RGVsZXRlT2JqZWN0XCJdLFxuICAgICAgICAgICAgcmVzb3VyY2VzOiBbXG4gICAgICAgICAgICAgIGBhcm46YXdzOnMzOjo6JHtmaWxlU3RvcmFnZUJ1Y2tldC5idWNrZXROYW1lfS9wcml2YXRlL1xcJHtjb2duaXRvLWlkZW50aXR5LmFtYXpvbmF3cy5jb206c3VifS8qYCxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSksXG4gICAgICAgICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICAgICAgZWZmZWN0OiBpYW0uRWZmZWN0LkFMTE9XLFxuICAgICAgICAgICAgYWN0aW9uczogW1wiczM6R2V0T2JqZWN0XCJdLFxuICAgICAgICAgICAgcmVzb3VyY2VzOiBbXG4gICAgICAgICAgICAgIGBhcm46YXdzOnMzOjo6JHtmaWxlU3RvcmFnZUJ1Y2tldC5idWNrZXROYW1lfS9wcm90ZWN0ZWQvKmAsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0pLFxuICAgICAgICAgIG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgICAgIGVmZmVjdDogaWFtLkVmZmVjdC5BTExPVyxcbiAgICAgICAgICAgIGFjdGlvbnM6IFtcInMzOkxpc3RCdWNrZXRcIl0sXG4gICAgICAgICAgICByZXNvdXJjZXM6IFtgYXJuOmF3czpzMzo6OiR7ZmlsZVN0b3JhZ2VCdWNrZXQuYnVja2V0TmFtZX1gXSxcbiAgICAgICAgICAgIGNvbmRpdGlvbnM6IHtcbiAgICAgICAgICAgICAgU3RyaW5nTGlrZToge1xuICAgICAgICAgICAgICAgIFwiczM6cHJlZml4XCI6IFtcbiAgICAgICAgICAgICAgICAgIFwicHVibGljL1wiLFxuICAgICAgICAgICAgICAgICAgXCJwdWJsaWMvKlwiLFxuICAgICAgICAgICAgICAgICAgXCJwcm90ZWN0ZWQvXCIsXG4gICAgICAgICAgICAgICAgICBcInByb3RlY3RlZC8qXCIsXG4gICAgICAgICAgICAgICAgICBcInByaXZhdGUvJHtjb2duaXRvLWlkZW50aXR5LmFtYXpvbmF3cy5jb206c3VifS9cIixcbiAgICAgICAgICAgICAgICAgIFwicHJpdmF0ZS8ke2NvZ25pdG8taWRlbnRpdHkuYW1hem9uYXdzLmNvbTpzdWJ9LypcIixcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgXSxcbiAgICAgICAgcm9sZXM6IFtwcm9wcy5hdXRoZW50aWNhdGVkUm9sZV0sXG4gICAgICB9XG4gICAgKTtcblxuICAgIG5ldyBDZm5PdXRwdXQodGhpcywgXCJCdWNrZXROYW1lXCIsIHtcbiAgICAgIHZhbHVlOiBmaWxlU3RvcmFnZUJ1Y2tldC5idWNrZXROYW1lLFxuICAgIH0pO1xuXG4gICAgbmV3IENmbk91dHB1dCh0aGlzLCBcIkJ1Y2tldFJlZ2lvblwiLCB7XG4gICAgICB2YWx1ZTogdGhpcy5yZWdpb24sXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==