# AWS Lambda Deployment Learning Guide

## Phase 1: Understanding AWS Lambda Deployment Requirements

### What You Need
1. **AWS Account** (with billing enabled)
2. **IAM User** with programmatic access (AWS Access Key ID + Secret Access Key)
3. **IAM Permissions** for the user (Lambda, API Gateway, CloudFormation, S3, CloudWatch, IAM)
4. **Local Tools** (AWS CLI, Serverless Framework, Node.js)

### Architecture Overview
```
Your Node.js/Express App
    ↓
Serverless Framework (package & deploy)
    ↓
AWS Lambda (serverless compute)
    ↓
API Gateway (HTTP routing)
    ↓
CloudFormation (infrastructure as code)
```

---

## Phase 2: Step-by-Step Setup

### Step 1: Create AWS Account
- Go to https://aws.amazon.com
- Click "Create AWS Account"
- Fill in email, password, account name
- Add payment method (card required, but free tier covers most)
- Verify email
- Complete sign-up

### Step 2: Create IAM User with Programmatic Access
1. Log in to AWS Console
2. Navigate to **IAM** (Identity & Access Management)
3. Click **Users** → **Create user**
   - Name: `aaryaa-lambda-deployer` (or your choice)
   - Uncheck "Provide user access to AWS Management Console" (we only need API)
4. Click **Next**
5. Select **Attach policies directly**
6. Search and attach these policies:
   - `AWSLambdaFullAccess`
   - `AmazonAPIGatewayFullAccess`
   - `CloudFormationFullAccess`
   - `AmazonS3FullAccess`
   - `CloudWatchLogsFullAccess`
   - `IAMFullAccess`
7. Click **Create user**
8. Click on the user → **Security credentials** tab
9. Click **Create access key** → Select **Command Line Interface (CLI)**
10. Accept and create
11. **IMPORTANT**: Copy and save both values:
    - Access Key ID
    - Secret Access Key
    - (Save in a secure location, NOT in Git!)

### Step 3: Configure AWS Credentials Locally
Open PowerShell and run:
```powershell
aws configure
```

Then enter:
- AWS Access Key ID: `[paste from Step 2]`
- AWS Secret Access Key: `[paste from Step 2]`
- Default region: `ap-south-1` (Asia Mumbai)
- Default output format: `json`

This creates `~/.aws/credentials` and `~/.aws/config`

### Step 4: Verify Setup
```powershell
aws sts get-caller-identity
```

You should see your AWS account info.

---

## Phase 3: Prepare Your Backend for Lambda

### Key Requirements
1. **serverless.yml** - Deployment configuration
2. **Handler function** in server.js
3. **Lambda-compatible database** connection (MongoDB is fine)
4. **Environment variables** in .env (not serverless.yml directly)

### Configuration Files Needed
See examples in the backend directory.

---

## Phase 4: Deploy Process

### Command 1: Package
```powershell
npm run deploy
```
This uses Serverless Framework to:
- Read serverless.yml
- Bundle your code
- Upload to AWS S3
- Create CloudFormation stack
- Provision Lambda + API Gateway

### Command 2: Monitor Deployment
```powershell
serverless logs -f api --tail
```

### Command 3: Test Live Endpoint
```powershell
curl https://your-api-id.execute-api.ap-south-1.amazonaws.com/api/ping
```

### Command 4: Remove (Cleanup)
```powershell
npm run remove
```

---

## Phase 5: Cost Management

### Free Tier Includes
- 1M Lambda requests/month
- 400,000 GB-seconds/month
- 1GB data transfer

### Monitor Costs
- AWS Console → Billing Dashboard
- Set up billing alerts in AWS

---

## Phase 6: Security Best Practices

1. **Never commit .env to Git**
2. **Rotate access keys** every 90 days
3. **Use IAM roles** instead of hardcoded keys in production
4. **Enable CloudTrail** for audit logs
5. **Set resource limits** in Lambda (timeout, memory)

---

## Troubleshooting

### "Cannot read properties of undefined"
- Credentials might be expired or invalid
- Run `aws configure` again with fresh keys

### Lambda timeout
- Increase `timeout` in serverless.yml
- Check database connection pooling

### CORS errors
- Set `CLIENT_URL` env var correctly
- Verify `cors` middleware in Express

---

## Next Steps
1. Create AWS account
2. Create IAM user with access keys
3. Configure AWS CLI locally
4. Test with `aws sts get-caller-identity`
5. Deploy using `npm run deploy`

---
