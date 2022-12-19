"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIStack = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const path = require("path");
const aws_appsync_alpha_1 = require("@aws-cdk/aws-appsync-alpha");
class APIStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const api = new aws_appsync_alpha_1.GraphqlApi(this, `${process.env.PROJECT_NAME}-graphql-api`, {
            name: "ChatApp",
            schema: aws_appsync_alpha_1.Schema.fromAsset(path.join(__dirname, "graphql/schema.graphql")),
            authorizationConfig: {
                defaultAuthorization: {
                    authorizationType: aws_appsync_alpha_1.AuthorizationType.USER_POOL,
                    userPoolConfig: {
                        userPool: props.userpool,
                    },
                },
            },
            logConfig: {
                fieldLogLevel: aws_appsync_alpha_1.FieldLogLevel.ALL,
            },
            xrayEnabled: true,
        });
        const roomTableDataSource = api.addDynamoDbDataSource("RoomTableDataSource", props.roomTable);
        const messageTableDataSource = api.addDynamoDbDataSource("MessageTableDataSource", props.messageTable);
        roomTableDataSource.createResolver({
            typeName: "Mutation",
            fieldName: "createRoom",
            requestMappingTemplate: aws_appsync_alpha_1.MappingTemplate.fromFile(path.join(__dirname, "graphql/mappingTemplates/Mutation.createRoom.req.vtl")),
            responseMappingTemplate: aws_appsync_alpha_1.MappingTemplate.dynamoDbResultItem(),
        });
        roomTableDataSource.createResolver({
            typeName: "Query",
            fieldName: "listRooms",
            requestMappingTemplate: aws_appsync_alpha_1.MappingTemplate.fromFile(path.join(__dirname, "graphql/mappingTemplates/Query.listRooms.req.vtl")),
            responseMappingTemplate: aws_appsync_alpha_1.MappingTemplate.fromFile(path.join(__dirname, "graphql/mappingTemplates/Query.listRooms.res.vtl")),
        });
        messageTableDataSource.createResolver({
            typeName: "Mutation",
            fieldName: "createMessage",
            requestMappingTemplate: aws_appsync_alpha_1.MappingTemplate.fromFile(path.join(__dirname, "graphql/mappingTemplates/Mutation.createMessage.req.vtl")),
            responseMappingTemplate: aws_appsync_alpha_1.MappingTemplate.dynamoDbResultItem(),
        });
        messageTableDataSource.createResolver({
            typeName: "Query",
            fieldName: "listMessagesForRoom",
            requestMappingTemplate: aws_appsync_alpha_1.MappingTemplate.fromFile(path.join(__dirname, "graphql/mappingTemplates/Query.listMessagesForRoom.req.vtl")),
            responseMappingTemplate: aws_appsync_alpha_1.MappingTemplate.fromFile(path.join(__dirname, "graphql/mappingTemplates/Query.listMessagesForRoom.res.vtl")),
        });
        messageTableDataSource.createResolver({
            typeName: "Mutation",
            fieldName: "updateMessage",
            requestMappingTemplate: aws_appsync_alpha_1.MappingTemplate.fromFile(path.join(__dirname, "graphql/mappingTemplates/Mutation.updateMessage.req.vtl")),
            responseMappingTemplate: aws_appsync_alpha_1.MappingTemplate.dynamoDbResultItem(),
        });
        new aws_cdk_lib_1.CfnOutput(this, "GraphQLAPIURL", {
            value: api.graphqlUrl,
        });
        new aws_cdk_lib_1.CfnOutput(this, "GraphQLAPIID", {
            value: api.apiId,
        });
    }
}
exports.APIStack = APIStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpU3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhcGlTdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2Q0FBMkQ7QUFHM0QsNkJBQTZCO0FBQzdCLGtFQU1vQztBQVlwQyxNQUFhLFFBQVMsU0FBUSxtQkFBSztJQUNqQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQW9CO1FBQzVELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sR0FBRyxHQUFHLElBQUksOEJBQVUsQ0FDeEIsSUFBSSxFQUNKLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLGNBQWMsRUFDekM7WUFDRSxJQUFJLEVBQUUsU0FBUztZQUNmLE1BQU0sRUFBRSwwQkFBTSxDQUFDLFNBQVMsQ0FDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsd0JBQXdCLENBQUMsQ0FDL0M7WUFDRCxtQkFBbUIsRUFBRTtnQkFDbkIsb0JBQW9CLEVBQUU7b0JBQ3BCLGlCQUFpQixFQUFFLHFDQUFpQixDQUFDLFNBQVM7b0JBQzlDLGNBQWMsRUFBRTt3QkFDZCxRQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVE7cUJBQ3pCO2lCQUNGO2FBQ0Y7WUFDRCxTQUFTLEVBQUU7Z0JBQ1QsYUFBYSxFQUFFLGlDQUFhLENBQUMsR0FBRzthQUNqQztZQUNELFdBQVcsRUFBRSxJQUFJO1NBQ2xCLENBQ0YsQ0FBQztRQUVGLE1BQU0sbUJBQW1CLEdBQUcsR0FBRyxDQUFDLHFCQUFxQixDQUNuRCxxQkFBcUIsRUFDckIsS0FBSyxDQUFDLFNBQVMsQ0FDaEIsQ0FBQztRQUNGLE1BQU0sc0JBQXNCLEdBQUcsR0FBRyxDQUFDLHFCQUFxQixDQUN0RCx3QkFBd0IsRUFDeEIsS0FBSyxDQUFDLFlBQVksQ0FDbkIsQ0FBQztRQUVGLG1CQUFtQixDQUFDLGNBQWMsQ0FBQztZQUNqQyxRQUFRLEVBQUUsVUFBVTtZQUNwQixTQUFTLEVBQUUsWUFBWTtZQUN2QixzQkFBc0IsRUFBRSxtQ0FBZSxDQUFDLFFBQVEsQ0FDOUMsSUFBSSxDQUFDLElBQUksQ0FDUCxTQUFTLEVBQ1Qsc0RBQXNELENBQ3ZELENBQ0Y7WUFDRCx1QkFBdUIsRUFBRSxtQ0FBZSxDQUFDLGtCQUFrQixFQUFFO1NBQzlELENBQUMsQ0FBQztRQUVILG1CQUFtQixDQUFDLGNBQWMsQ0FBQztZQUNqQyxRQUFRLEVBQUUsT0FBTztZQUNqQixTQUFTLEVBQUUsV0FBVztZQUN0QixzQkFBc0IsRUFBRSxtQ0FBZSxDQUFDLFFBQVEsQ0FDOUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsa0RBQWtELENBQUMsQ0FDekU7WUFDRCx1QkFBdUIsRUFBRSxtQ0FBZSxDQUFDLFFBQVEsQ0FDL0MsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsa0RBQWtELENBQUMsQ0FDekU7U0FDRixDQUFDLENBQUM7UUFFSCxzQkFBc0IsQ0FBQyxjQUFjLENBQUM7WUFDcEMsUUFBUSxFQUFFLFVBQVU7WUFDcEIsU0FBUyxFQUFFLGVBQWU7WUFDMUIsc0JBQXNCLEVBQUUsbUNBQWUsQ0FBQyxRQUFRLENBQzlDLElBQUksQ0FBQyxJQUFJLENBQ1AsU0FBUyxFQUNULHlEQUF5RCxDQUMxRCxDQUNGO1lBQ0QsdUJBQXVCLEVBQUUsbUNBQWUsQ0FBQyxrQkFBa0IsRUFBRTtTQUM5RCxDQUFDLENBQUM7UUFDSCxzQkFBc0IsQ0FBQyxjQUFjLENBQUM7WUFDcEMsUUFBUSxFQUFFLE9BQU87WUFDakIsU0FBUyxFQUFFLHFCQUFxQjtZQUNoQyxzQkFBc0IsRUFBRSxtQ0FBZSxDQUFDLFFBQVEsQ0FDOUMsSUFBSSxDQUFDLElBQUksQ0FDUCxTQUFTLEVBQ1QsNERBQTRELENBQzdELENBQ0Y7WUFDRCx1QkFBdUIsRUFBRSxtQ0FBZSxDQUFDLFFBQVEsQ0FDL0MsSUFBSSxDQUFDLElBQUksQ0FDUCxTQUFTLEVBQ1QsNERBQTRELENBQzdELENBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxzQkFBc0IsQ0FBQyxjQUFjLENBQUM7WUFDcEMsUUFBUSxFQUFFLFVBQVU7WUFDcEIsU0FBUyxFQUFFLGVBQWU7WUFDMUIsc0JBQXNCLEVBQUUsbUNBQWUsQ0FBQyxRQUFRLENBQzlDLElBQUksQ0FBQyxJQUFJLENBQ1AsU0FBUyxFQUNULHlEQUF5RCxDQUMxRCxDQUNGO1lBQ0QsdUJBQXVCLEVBQUUsbUNBQWUsQ0FBQyxrQkFBa0IsRUFBRTtTQUM5RCxDQUFDLENBQUM7UUFFSCxJQUFJLHVCQUFTLENBQUMsSUFBSSxFQUFFLGVBQWUsRUFBRTtZQUNuQyxLQUFLLEVBQUUsR0FBRyxDQUFDLFVBQVU7U0FDdEIsQ0FBQyxDQUFDO1FBRUgsSUFBSSx1QkFBUyxDQUFDLElBQUksRUFBRSxjQUFjLEVBQUU7WUFDbEMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxLQUFLO1NBQ2pCLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQTNHRCw0QkEyR0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDZm5PdXRwdXQsIFN0YWNrLCBTdGFja1Byb3BzIH0gZnJvbSBcImF3cy1jZGstbGliXCI7XG5pbXBvcnQgeyBUYWJsZSB9IGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtZHluYW1vZGJcIjtcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gXCJjb25zdHJ1Y3RzXCI7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQge1xuICBHcmFwaHFsQXBpLFxuICBTY2hlbWEsXG4gIEF1dGhvcml6YXRpb25UeXBlLFxuICBGaWVsZExvZ0xldmVsLFxuICBNYXBwaW5nVGVtcGxhdGUsXG59IGZyb20gXCJAYXdzLWNkay9hd3MtYXBwc3luYy1hbHBoYVwiO1xuaW1wb3J0IHsgVXNlclBvb2wgfSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWNvZ25pdG9cIjtcbmltcG9ydCB7IElSb2xlIH0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1pYW1cIjtcblxuaW50ZXJmYWNlIEFQSVN0YWNrUHJvcHMgZXh0ZW5kcyBTdGFja1Byb3BzIHtcbiAgdXNlcnBvb2w6IFVzZXJQb29sO1xuICByb29tVGFibGU6IFRhYmxlO1xuICB1c2VyVGFibGU6IFRhYmxlO1xuICBtZXNzYWdlVGFibGU6IFRhYmxlO1xuICB1bmF1dGhlbnRpY2F0ZWRSb2xlOiBJUm9sZTtcbn1cblxuZXhwb3J0IGNsYXNzIEFQSVN0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQVBJU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3QgYXBpID0gbmV3IEdyYXBocWxBcGkoXG4gICAgICB0aGlzLFxuICAgICAgYCR7cHJvY2Vzcy5lbnYuUFJPSkVDVF9OQU1FfS1ncmFwaHFsLWFwaWAsXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwiQ2hhdEFwcFwiLFxuICAgICAgICBzY2hlbWE6IFNjaGVtYS5mcm9tQXNzZXQoXG4gICAgICAgICAgcGF0aC5qb2luKF9fZGlybmFtZSwgXCJncmFwaHFsL3NjaGVtYS5ncmFwaHFsXCIpXG4gICAgICAgICksXG4gICAgICAgIGF1dGhvcml6YXRpb25Db25maWc6IHtcbiAgICAgICAgICBkZWZhdWx0QXV0aG9yaXphdGlvbjoge1xuICAgICAgICAgICAgYXV0aG9yaXphdGlvblR5cGU6IEF1dGhvcml6YXRpb25UeXBlLlVTRVJfUE9PTCxcbiAgICAgICAgICAgIHVzZXJQb29sQ29uZmlnOiB7XG4gICAgICAgICAgICAgIHVzZXJQb29sOiBwcm9wcy51c2VycG9vbCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgbG9nQ29uZmlnOiB7XG4gICAgICAgICAgZmllbGRMb2dMZXZlbDogRmllbGRMb2dMZXZlbC5BTEwsXG4gICAgICAgIH0sXG4gICAgICAgIHhyYXlFbmFibGVkOiB0cnVlLFxuICAgICAgfVxuICAgICk7XG5cbiAgICBjb25zdCByb29tVGFibGVEYXRhU291cmNlID0gYXBpLmFkZER5bmFtb0RiRGF0YVNvdXJjZShcbiAgICAgIFwiUm9vbVRhYmxlRGF0YVNvdXJjZVwiLFxuICAgICAgcHJvcHMucm9vbVRhYmxlXG4gICAgKTtcbiAgICBjb25zdCBtZXNzYWdlVGFibGVEYXRhU291cmNlID0gYXBpLmFkZER5bmFtb0RiRGF0YVNvdXJjZShcbiAgICAgIFwiTWVzc2FnZVRhYmxlRGF0YVNvdXJjZVwiLFxuICAgICAgcHJvcHMubWVzc2FnZVRhYmxlXG4gICAgKTtcblxuICAgIHJvb21UYWJsZURhdGFTb3VyY2UuY3JlYXRlUmVzb2x2ZXIoe1xuICAgICAgdHlwZU5hbWU6IFwiTXV0YXRpb25cIixcbiAgICAgIGZpZWxkTmFtZTogXCJjcmVhdGVSb29tXCIsXG4gICAgICByZXF1ZXN0TWFwcGluZ1RlbXBsYXRlOiBNYXBwaW5nVGVtcGxhdGUuZnJvbUZpbGUoXG4gICAgICAgIHBhdGguam9pbihcbiAgICAgICAgICBfX2Rpcm5hbWUsXG4gICAgICAgICAgXCJncmFwaHFsL21hcHBpbmdUZW1wbGF0ZXMvTXV0YXRpb24uY3JlYXRlUm9vbS5yZXEudnRsXCJcbiAgICAgICAgKVxuICAgICAgKSxcbiAgICAgIHJlc3BvbnNlTWFwcGluZ1RlbXBsYXRlOiBNYXBwaW5nVGVtcGxhdGUuZHluYW1vRGJSZXN1bHRJdGVtKCksXG4gICAgfSk7XG5cbiAgICByb29tVGFibGVEYXRhU291cmNlLmNyZWF0ZVJlc29sdmVyKHtcbiAgICAgIHR5cGVOYW1lOiBcIlF1ZXJ5XCIsXG4gICAgICBmaWVsZE5hbWU6IFwibGlzdFJvb21zXCIsXG4gICAgICByZXF1ZXN0TWFwcGluZ1RlbXBsYXRlOiBNYXBwaW5nVGVtcGxhdGUuZnJvbUZpbGUoXG4gICAgICAgIHBhdGguam9pbihfX2Rpcm5hbWUsIFwiZ3JhcGhxbC9tYXBwaW5nVGVtcGxhdGVzL1F1ZXJ5Lmxpc3RSb29tcy5yZXEudnRsXCIpXG4gICAgICApLFxuICAgICAgcmVzcG9uc2VNYXBwaW5nVGVtcGxhdGU6IE1hcHBpbmdUZW1wbGF0ZS5mcm9tRmlsZShcbiAgICAgICAgcGF0aC5qb2luKF9fZGlybmFtZSwgXCJncmFwaHFsL21hcHBpbmdUZW1wbGF0ZXMvUXVlcnkubGlzdFJvb21zLnJlcy52dGxcIilcbiAgICAgICksXG4gICAgfSk7XG5cbiAgICBtZXNzYWdlVGFibGVEYXRhU291cmNlLmNyZWF0ZVJlc29sdmVyKHtcbiAgICAgIHR5cGVOYW1lOiBcIk11dGF0aW9uXCIsXG4gICAgICBmaWVsZE5hbWU6IFwiY3JlYXRlTWVzc2FnZVwiLFxuICAgICAgcmVxdWVzdE1hcHBpbmdUZW1wbGF0ZTogTWFwcGluZ1RlbXBsYXRlLmZyb21GaWxlKFxuICAgICAgICBwYXRoLmpvaW4oXG4gICAgICAgICAgX19kaXJuYW1lLFxuICAgICAgICAgIFwiZ3JhcGhxbC9tYXBwaW5nVGVtcGxhdGVzL011dGF0aW9uLmNyZWF0ZU1lc3NhZ2UucmVxLnZ0bFwiXG4gICAgICAgIClcbiAgICAgICksXG4gICAgICByZXNwb25zZU1hcHBpbmdUZW1wbGF0ZTogTWFwcGluZ1RlbXBsYXRlLmR5bmFtb0RiUmVzdWx0SXRlbSgpLFxuICAgIH0pO1xuICAgIG1lc3NhZ2VUYWJsZURhdGFTb3VyY2UuY3JlYXRlUmVzb2x2ZXIoe1xuICAgICAgdHlwZU5hbWU6IFwiUXVlcnlcIixcbiAgICAgIGZpZWxkTmFtZTogXCJsaXN0TWVzc2FnZXNGb3JSb29tXCIsXG4gICAgICByZXF1ZXN0TWFwcGluZ1RlbXBsYXRlOiBNYXBwaW5nVGVtcGxhdGUuZnJvbUZpbGUoXG4gICAgICAgIHBhdGguam9pbihcbiAgICAgICAgICBfX2Rpcm5hbWUsXG4gICAgICAgICAgXCJncmFwaHFsL21hcHBpbmdUZW1wbGF0ZXMvUXVlcnkubGlzdE1lc3NhZ2VzRm9yUm9vbS5yZXEudnRsXCJcbiAgICAgICAgKVxuICAgICAgKSxcbiAgICAgIHJlc3BvbnNlTWFwcGluZ1RlbXBsYXRlOiBNYXBwaW5nVGVtcGxhdGUuZnJvbUZpbGUoXG4gICAgICAgIHBhdGguam9pbihcbiAgICAgICAgICBfX2Rpcm5hbWUsXG4gICAgICAgICAgXCJncmFwaHFsL21hcHBpbmdUZW1wbGF0ZXMvUXVlcnkubGlzdE1lc3NhZ2VzRm9yUm9vbS5yZXMudnRsXCJcbiAgICAgICAgKVxuICAgICAgKSxcbiAgICB9KTtcblxuICAgIG1lc3NhZ2VUYWJsZURhdGFTb3VyY2UuY3JlYXRlUmVzb2x2ZXIoe1xuICAgICAgdHlwZU5hbWU6IFwiTXV0YXRpb25cIixcbiAgICAgIGZpZWxkTmFtZTogXCJ1cGRhdGVNZXNzYWdlXCIsXG4gICAgICByZXF1ZXN0TWFwcGluZ1RlbXBsYXRlOiBNYXBwaW5nVGVtcGxhdGUuZnJvbUZpbGUoXG4gICAgICAgIHBhdGguam9pbihcbiAgICAgICAgICBfX2Rpcm5hbWUsXG4gICAgICAgICAgXCJncmFwaHFsL21hcHBpbmdUZW1wbGF0ZXMvTXV0YXRpb24udXBkYXRlTWVzc2FnZS5yZXEudnRsXCJcbiAgICAgICAgKVxuICAgICAgKSxcbiAgICAgIHJlc3BvbnNlTWFwcGluZ1RlbXBsYXRlOiBNYXBwaW5nVGVtcGxhdGUuZHluYW1vRGJSZXN1bHRJdGVtKCksXG4gICAgfSk7XG5cbiAgICBuZXcgQ2ZuT3V0cHV0KHRoaXMsIFwiR3JhcGhRTEFQSVVSTFwiLCB7XG4gICAgICB2YWx1ZTogYXBpLmdyYXBocWxVcmwsXG4gICAgfSk7XG5cbiAgICBuZXcgQ2ZuT3V0cHV0KHRoaXMsIFwiR3JhcGhRTEFQSUlEXCIsIHtcbiAgICAgIHZhbHVlOiBhcGkuYXBpSWQsXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==