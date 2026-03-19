# Understanding AWS Lambda Deployment - Concepts

## The Big Picture: How Your App Becomes Serverless

### Traditional Server Hosting (What You Probably Know)
```
Your Code
    ↓
Runs on a Virtual Machine (EC2, Linode, DigitalOcean, etc.)
    ↓
You pay per hour, whether it's used or not
    ↓
You manage OS updates, security patches, scaling
```

### AWS Lambda Hosting (Serverless)
```
Your Code (just the functions)
    ↓
AWS Manages: OS, Runtime, Scaling, Updates
    ↓
You only pay when code ACTUALLY RUNS
    ↓
Auto-scales: 1 request or 1 million = handled automatically
```

### Cost Difference
- Traditional: Server running 24/7 × 30 days = $30-300/month
- Lambda: Code runs only when requests come in = $1-5/month (or FREE in free tier)

---

## The 3 Main Components You're Deploying

### 1️⃣ AWS Lambda (The Compute)
**What**: Serverless function runtime
**Where**: Your Express.js app runs here
**Cost**: $0.0000002 per request (approximately)
**Magic**: AWS spins up your code when request comes, scales to millions

### 2️⃣ API Gateway (The Router)
**What**: HTTP endpoint that receives requests
**Where**: Sits in front of Lambda
**Cost**: ~$0.035 per million requests
**Magic**: Routes `/api/ping` to your Lambda function, handles HTTPS/CORS

### 3️⃣ CloudFormation (The Blueprint)
**What**: Infrastructure as Code (IaC)
**Where**: defines what resources to create in AWS
**File**: `serverless.yml` (your blueprint)
**Magic**: Repeatable, versionable, multi-env deployments

---

## Why You Need Each Tool

### AWS Account
- **Purpose**: Your isolated space in AWS cloud
- **Cost**: Free (until you use paid services)
- **Billing**: Charged per service usage
- **Security**: Everything in your account is private

### IAM User (Identity & Access Management)
- **Purpose**: Control who can do what in your account
- **Why**: You DON'T give AWS Master Key to applications
- **Principle**: Least privilege (give only the permissions needed)
- **Example**: Deployer user only needs Lambda + API Gateway + etc., not billing or IAM deletion

### Access Keys (Access Key ID + Secret Access Key)
- **Purpose**: Programmatic authentication (for CLI/tools)
- **Like**: Username + password for machines (not people)
- **Security**: Should be rotated every 90 days
- **Danger**: If leaked, someone can deploy to YOUR AWS account on YOUR dime

### AWS CLI (Command Line Interface)
- **Purpose**: Talk to AWS from your computer
- **Commands**: `aws configure`, `aws sts get-caller-identity`
- **Storage**: Stores credentials in `~/.aws/credentials`
- **Usage**: Used by Serverless Framework behind the scenes

### Serverless Framework
- **Purpose**: Developer-friendly deployment tool
- **Instead of**: Manual AWS Console clicking 50 times
- **Reads**: serverless.yml (your infrastructure blueprint)
- **Does**: Package code + Upload to S3 + Create CloudFormation stack
- **Language**: Framework version 4 is latest (you have it)

---

## The Deployment Flow (What Happens When You Run `npm run deploy`)

### 1. Package Phase (Local)
```
Serverless Framework reads serverless.yml
    ↓
Bundles your entire backend folder
    ↓
Excludes: node_modules (too big), .env, uploads folder
    ↓
Creates a ZIP file (~28MB in your case)
    ↓
Uploads ZIP to AWS S3 bucket
```

### 2. Infrastructure Setup Phase (AWS Side)
```
CloudFormation reads the resources you defined
    ↓
Creates Lambda function resource
    ↓
Creates API Gateway HTTP API endpoint
    ↓
Creates IAM role for Lambda to use
    ↓
Sets environment variables (from serverless.yml)
    ↓
Configures routes:
    ANY / → Lambda
    ANY /{proxy+} → Lambda (catches all sub-paths)
```

### 3. Deployment Phase
```
Lambda receives the ZIP code
    ↓
Extracts and installs dependencies (node_modules)
    ↓
Creates immutable version
    ↓
Associates with API Gateway endpoint
    ↓
Health check: sends test request
    ↓
✅ Live! URL is ready
```

### 4. Output
```
✓ Service deployed to stack aaryaa-network-backend-prod
endpoints:
  ANY - https://75coudkgfj.execute-api.ap-south-1.amazonaws.com/
  ANY - https://75coudkgfj.execute-api.ap-south-1.amazonaws.com/{proxy+}
```

---

## The Handler Function (How Lambda Runs Your App)

### What is a handler?
```javascript
// server.js
module.exports.handler = async (event, context) => {
  // AWS Lambda invokes this function every request
  // event = HTTP request data
  // context = Lambda metadata
  return response;
};
```

### How it works
```
HTTP Request comes to API Gateway
    ↓
API Gateway forwards to Lambda
    ↓
Lambda invokes your handler() function
    ↓
Handler uses serverless-http to convert Lambda event → Express request
    ↓
Express processes request normally
    ↓
Response sent back via API Gateway
    ↓
Client receives HTTP response
```

### Why serverless-http?
- Lambda uses event/context (AWS format)
- Express expects Request/Response (Node.js format)
- serverless-http bridges the gap

---

## Environment Variables in Serverless

### serverless.yml defines:
```yaml
environment:
  NODE_ENV: production
  MONGO_URI: ${env:MONGO_URI}  # reads from .env
```

### Why split?
- **serverless.yml**: Public (in Git) - defines structure
- **.env**: Private (NOT in Git) - contains secrets
- Benefit: Same code + different configs for dev/prod/staging

### What happens during deploy
1. Serverless Framework reads serverless.yml
2. Sees `${env:MONGO_URI}`
3. Looks in your local .env file
4. Takes the value
5. Passes to CloudFormation
6. CloudFormation sets it in Lambda environment
7. Your code accesses via `process.env.MONGO_URI`

---

## Regions Explained

### What is a region?
- **Definition**: Geographic location where AWS data center is
- **Your choice**: `ap-south-1` (Mumbai, India)
- **Latency**: Users closer to region = faster
- **Cost**: Varies slightly by region
- **Compliance**: Some regions for specific countries

### Why ap-south-1?
- Closest to India (low latency for Indian users)
- Good pricing
- Good availability

---

## CloudFormation Stack Explained

### What is a stack?
- **Definition**: Collection of AWS resources created together
- **Your stack name**: `aaryaa-network-backend-prod`
- **Contains**: Lambda function + API Gateway + IAM roles + S3 bucket

### Advantages
1. **Version control**: Save entire infrastructure in serverless.yml
2. **Repeatability**: Deploy same stack to multiple environments
3. **Rollback**: If deploy fails, revert to previous version
4. **Audit trail**: See exactly what changed when
5. **Cleanup**: One command removes everything (easy cleanup)

### Example stacks
```
Dev environment: aaryaa-network-backend-dev
Prod environment: aaryaa-network-backend-prod
Staging: aaryaa-network-backend-staging
```

---

## How CORS Works with API Gateway

### Scenario
```
Frontend at https://aaryaanetwork.com
Requests Lambda API at https://75coudkgfj.execute-api.ap-south-1.amazonaws.com
```

### Browser's Security Issue
```
Different domain → CORS check
"Hey, is 75coudkgfj.execute-api.ap-south-1.amazonaws.com 
 allowed to serve responses to my site?"
```

### Your Express app solves it
```javascript
const allowedOrigins = ['https://aaryaanetwork.com', 'http://localhost:5173'];
cors({
  origin(origin, callback) {
    if (allowedOrigins.includes(origin)) {
      callback(null, true);  // ✅ Allowed
    } else {
      callback(new Error('CORS restricted'));  // ❌ Blocked
    }
  },
  credentials: true  // Allows cookies
})
```

### When you deploy
1. Frontend requests go to your Lambda API
2. Lambda checks if origin is in CLIENT_URL list
3. Adds header: `Access-Control-Allow-Origin: https://aaryaanetwork.com`
4. Browser allows response ✅

---

## Common Mistakes to Avoid

### ❌ Committing .env to Git
```
git add Backend/.env  # DON'T DO THIS
```
- Exposes database password, JWT secrets, email credentials
- Anyone with access to repo can hack your app
- Solution: `.gitignore` already excludes .env

### ❌ Hardcoding config in serverless.yml
```yaml
environment:
  MONGO_URI: mongodb://user:pass@db.com  # WRONG!
```
- Secrets in version control = bad idea
- Solution: Use `${env:MONGO_URI}` to read from .env

### ❌ Using AWS Master Key for deployment
```
AWS_ACCESS_KEY_ID = [master key]  # WRONG!
```
- Master key can create/delete/modify everything
- Solution: Use IAM user with limited permissions

### ❌ Not rotating access keys
- Every 90 days: Create new access key pair
- Delete old one after apps switch over
- Limits damage if key is leaked

### ❌ Leaving old deployments running
- AWS still charges for running Lambda
- Solution: `npm run remove` after testing

---

## Monitoring & Logs

### CloudWatch Logs
- **Automatic**: Lambda sends all console.log() to CloudWatch
- **Access**: `serverless logs -f api --tail`
- **Cost**: $0.50 per GB stored

### Metrics
- Number of invocations
- Success vs. errors
- Latency (cold starts vs. warm invocations)

### Cold Start
```
First request after deploy: Lambda boots → slow (~1s)
Subsequent requests: Already running → fast (~10ms)
```

---

## Scaling Magic

### What happens when traffic spikes

**Traditional Server**
```
40 users hit your server at once
    ↓
Server runs out of connections
    ↓
Request queue fills up
    ↓
New users get "Server too busy" error
    ↓
You manually provision more servers (takes hours)
```

**AWS Lambda**
```
40 users hit your endpoint at once
    ↓
AWS automatically spins up 40 Lambda copies
    ↓
Each handles one request in parallel
    ↓
All respond within milliseconds
    ↓
No code changes needed!
```

**Cost impact**: You only pay for 40 executions, not per hour of running servers.

---

## Your Learning Path

### ✅ You Already Know
- Express.js servers
- Databases (MongoDB)
- Environment variables
- Package management (npm)

### 📚 You're Learning
- AWS account structure
- IAM permissions model
- Serverless architecture
- Infrastructure as Code (CloudFormation)
- CLI tools (AWS CLI, Serverless Framework)

### 🚀 You'll Know After Deployment
- How to deploy any Node.js app to Lambda
- How CORS works in practice
- How to monitor Lambda functions
- How to think about serverless costs
- How to manage infrastructure as code

---

## Next: Ready to Deploy?

Go to `YOUR_DEPLOYMENT_CHECKLIST.md` and follow Step 1-10 to:
1. Create your AWS account
2. Set up IAM user with proper permissions
3. Configure local CLI
4. Deploy your backend
5. Test live endpoint
6. Connect frontend
7. Run end-to-end tests

---
