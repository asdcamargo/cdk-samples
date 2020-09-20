# Examples of CDK scripts and usage of AWS services

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template

## Example details

- 1. stepFunctionInitializer: Lambda function that starts an execution of a StepFunctions pipeline
  - Deployment: step-function-initializer-stack.ts
  - Code: lambdas/stepFunctionInitializer/index.js
  - IAM: Lambda function has the AWS Managed 'ExecutionRole' to write logs to CloudWatch as well as permission to run 'startExecution' on StepFunction.
