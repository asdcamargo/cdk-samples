import { Stack, App, Duration } from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import { Role, ManagedPolicy } from "@aws-cdk/aws-iam";
const path = require("path");
import { PolicyStatement, ServicePrincipal, Effect } from "@aws-cdk/aws-iam";
import * as sfn from "@aws-cdk/aws-stepfunctions";
import { Globals } from "./util/consts";

const STEP_FUNCTION_NAME = "PipelineJob";

export class StepFunctionInitializerLambda extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);

    const lambdaRole = this.createLambdaRole();
    this.createStepFunctionInitializerLambda(lambdaRole);
    this.createPipelineStepFunction();
  }

  private createLambdaRole(): Role {
    const lambdaRole = new Role(this, "LambdaRole", {
      assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
      roleName: "LambdaExecutionRoleAndStartPipeline",
    });
    lambdaRole.addToPrincipalPolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["states:StartExecution"],
        resources: [
          `arn:aws:states:${Globals.region}:${Globals.accountId}:stateMachine:${STEP_FUNCTION_NAME}`,
        ],
      })
    );
    lambdaRole.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName(
        "service-role/AWSLambdaBasicExecutionRole"
      )
    );
    return lambdaRole;
  }

  private createStepFunctionInitializerLambda(lambdaRole: Role): void {
    new lambda.Function(this, "StepFunctionInitializerLambda", {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("lambdas/stepFunctionInitializer/"),
      timeout: Duration.seconds(10),
      role: lambdaRole,
      functionName: "StepFunctionInitializerLambda",
      environment: {
        pipelineArn: `arn:aws:states:${Globals.region}:${Globals.accountId}:stateMachine:${STEP_FUNCTION_NAME}`,
      },
    });
  }

  private createPipelineStepFunction(): void {
    const definition = new sfn.Pass(this, "Done!");

    new sfn.StateMachine(this, STEP_FUNCTION_NAME, {
      definition,
      timeout: Duration.minutes(5),
      stateMachineName: STEP_FUNCTION_NAME,
    });
  }
}
