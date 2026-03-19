# AWS Lambda Deployment - Visual Flowchart

## The Complete Journey: From Code to Live API

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                       │
│                   YOUR LOCAL COMPUTER                                │
│                   ═══════════════════                                │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ STEP 1: Setup AWS Credentials Locally                        │  │
│  │                                                              │  │
│  │  • Create AWS Account (aws.amazon.com)                      │  │
│  │  • Create IAM User with Access Key + Secret Key            │  │
│  │  • Run: aws configure                                      │  │
│  │  • Saved locally in ~/.aws/credentials                     │  │
│  │                                                              │  │
│  │  Result: ✅ Can authenticate with AWS                       │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                           │                                          │
│                           ▼                                          │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ STEP 2: Prepare Backend Code                                │  │
│  │                                                              │  │
│  │  • Verify server.js has Lambda handler export              │  │
│  │  • Check serverless.yml has correct config                 │  │
│  │  • Verify Backend/.env has all secrets                     │  │
│  │  • npm install (already done ✓)                            │  │
│  │                                                              │  │
│  │  Result: ✅ Backend ready to deploy                         │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                           │                                          │
│                           ▼                                          │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ STEP 3: Package & Deploy (npm run deploy)                   │  │
│  │                                                              │  │
│  │  Serverless Framework does:                                │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │ 1. Read serverless.yml                              │  │  │
│  │  │ 2. Bundle Backend folder into ZIP                  │  │  │
│  │  │ 3. Upload ZIP to temporary S3 bucket               │  │  │
│  │  │ 4. Create CloudFormation stack                     │  │  │
│  │  │ 5. Launch Lambda function                          │  │  │
│  │  │ 6. Create API Gateway endpoint                     │  │  │
│  │  │ 7. Configure routes (/ and /{proxy+})             │  │  │
│  │  │ 8. Set environment variables                       │  │  │
│  │  │ 9. Health check                                    │  │  │
│  │  │ 10. Output API endpoint URL                        │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                                                              │  │
│  │  Result: ✅ Backend LIVE on AWS!                            │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
                           │
                           │ (Copy API endpoint URL)
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                                                                       │
│                      AWS CLOUD                                       │
│                      ═══════════                                     │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Lambda Function (aaryaa-network-backend-prod-api)           │  │
│  │                                                              │  │
│  │  • Your Express.js app running                             │  │
│  │  • Handles requests via API Gateway                        │  │
│  │  • Connects to MongoDB                                     │  │
│  │  • Responds with JSON/HTML                                │  │
│  │  • Auto-scales on demand                                  │  │
│  │  • Charges only per request (not per hour)               │  │
│  └──────────────────────────────────────────────────────────────┘  │
│      │                    │                    │                    │
│      ▼                    ▼                    ▼                    │
│  ┌────────────┐      ┌────────────┐      ┌────────────┐           │
│  │ API Gateway│      │ S3 Bucket  │      │CloudFormation       │  │
│  │            │      │            │      │   Stack            │   │
│  │ Routes:    │      │ Stores:    │      │            │       │   │
│  │ / → Lambda │      │ - Code     │      │ (IaC)      │       │   │
│  │ /{...}→Lmb │      │ - Versions │      │ Blueprint  │       │   │
│  │ CORS       │      │ - Config   │      │            │       │   │
│  │ HTTPS      │      │ - Rollback │      │ Enables:   │       │   │
│  │            │      │            │      │ - Reuse    │       │   │
│  └────────────┘      └────────────┘      │ - Multi-env│       │   │
│      │                                   │ - Cleanup  │       │   │
│      │                                   └────────────┘       │   │
│      │                                                         │   │
│      ▼                                                         │   │
│  ┌────────────────────────────────────────────────────────┐   │   │
│  │ CloudWatch Logs (ALL console.log goes here)           │   │   │
│  │                                                        │   │   │
│  │ Monitors:                                             │   │   │
│  │ • Errors                                              │   │   │
│  │ • Performance                                         │   │   │
│  │ • Database queries                                   │   │   │
│  │ • Request/response times                             │   │   │
│  └────────────────────────────────────────────────────────┘   │   │
│                                                                 │   │
└─────────────────────────────────────────────────────────────────────┘
                           │
                           │ (Update Frontend)
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                                                                       │
│            FRONTEND (Render / Your Domain)                          │
│            ═════════════════════════════════════                    │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Update Frontend/.env:                                        │  │
│  │ VITE_SERVER_URI = https://your-api-id.execute-api...       │  │
│  │                                                              │  │
│  │ Run: npm run build                                          │  │
│  │ Deploy to Render                                            │  │
│  │                                                              │  │
│  │ When user accesses frontend:                               │  │
│  │  Frontend (HTTPS) → API Gateway (HTTPS)                    │  │
│  │        ↓                           ↓                        │  │
│  │   Browser              CORS Check & Route                  │  │
│  │        ↓                           ↓                        │  │
│  │   React App            Lambda Function                     │  │
│  │        ↓                           ↓                        │  │
│  │   Axios Calls          Express Routes                      │  │
│  │        ↓                           ↓                        │  │
│  │   User sees            Database Query                      │  │
│  │   Data on screen       Response sent back                  │  │
│  │                                                              │  │
│  │  Result: ✅ Full app working end-to-end                    │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Request Flow (What Happens When Frontend Calls Backend)

```
Browser (https://aaryaanetwork.com) sends HTTP request
        │
        ▼
GET /api/plans
        │
        ▼
API Gateway (CORS check)
        │
        ├─ Check: Is origin allowed? (CLIENT_URL)
        │
        ▼ (If allowed)
Lambda Function Invoked
        │
        ├─ Loads: server.js, node_modules
        ├─ Environment: NODE_ENV, MONGO_URI, etc.
        │
        ▼
Express.js Receives Request
        │
        ├─ Route: /api/plans → InternetPlansController
        ├─ Middleware: CORS headers, auth check
        │
        ▼
Database Query (MongoDB)
        │
        ├─ Find all plans
        ├─ Format response
        │
        ▼
Express Sends Response (JSON)
        │
        ▼
API Gateway Adds CORS Headers
        │
        ├─ Access-Control-Allow-Origin: https://aaryaanetwork.com
        ├─ Content-Type: application/json
        │
        ▼
Browser Receives Response
        │
        ├─ ✅ CORS check passes (same origin in whitelist)
        ├─ ✅ Data displayed in UI
        │
        ▼
User Sees Plans on Screen ✅
        │
        │ Entire flow: ~200-500ms
```

---

## Deployment Checklist Visualization

```
YOUR TASKS (What you do)          AUTOMATED (What Framework does)
═════════════════════════════════ ═════════════════════════════════

1. Create AWS Account      →   AWS creates isolated space for you
                               with billing

2. Create IAM User         →   AWS assigns security permissions

3. Get Access Keys         →   AWS generates credentials

4. aws configure           →   LocallyStores credentials in ~/.aws/

5. Check .env              →   Secrets ready to pass to AWS

6. npm run deploy          →   ┌─────────────────────────────────┐
                               │ Serverless Framework:            │
                               │ ✓ Reads serverless.yml           │
                               │ ✓ Bundles code                   │
                               │ ✓ Uploads to S3                  │
                               │ ✓ Uses your credentials          │
                               │ ✓ Authenticated with AWS         │
                               │ ✓ Creates CloudFormation stack   │
                               │ ✓ Provisions Lambda              │
                               │ ✓ Sets up API Gateway            │
                               │ ✓ Configures environment vars    │
                               │ ✓ Tests endpoint                 │
                               │ ✓ Outputs URL                    │
                               └─────────────────────────────────┘

7. Copy API URL            →   Frontend uses this endpoint

8. Update Frontend/.env    →   Frontend knows where backend is

9. npm run build           →   Frontend bundled with new API URL

10. Deploy to Render       →   Frontend now calls YOUR Lambda API

11. Test in browser        →   Everything works end-to-end ✅


RESULT: Your app is live!
Backend: AWS Lambda
Frontend: Render
Database: MongoDB
All connected over HTTPS ✅
```

---

## Cost Flow

```
User visits frontend
        │
        ▼ (Page loads)
        │
        ├─ First-time: ~200ms (cold start)
        └─ Subsequent: ~50ms (warm)
        │
        ▼
Frontend makes API call
        │
        ├─ Your Lambda invoked +1 invocation (you pay $0.0000002)
        ├─ Typical request: 100ms execution time
        ├─ Memory: 512MB (charged at $0.00001667/GB-second)
        │   → 512MB × 0.1sec = 0.00005 GB-sec → $0.00000083
        │
        ├─ Total per request: ~$0.0000028 (way less than $0.01)
        │
        ├─ 10 users/day × 365 days = 3650 requests/year
        ├─ Cost: 3650 × $0.0000028 = ~$0.01/year
        │
        │ BUT: AWS Free Tier includes 1M requests/month FREE
        │ So for a small app: $0/month first 12 months ✅
        │
        ▼
Monthly bill breakdown:
├─ Lambda: $0 (within free tier)
├─ API Gateway: $0 (within free tier)
├─ S3: $0 (minimal storage)
├─ CloudWatch: $0 (free tier)
│
├─ 12+ months: ~$1-5/month typically
├─ (Much cheaper than $20-50/month for renting a server)
│
└─ Scales automatically if viral (no manual intervention)
```

---

## Timeline: From Now to Live

```
Now
│
├─ 0 min    ↓ Read this document
│
├─ 10 min   ↓ Read AWS_LAMBDA_DEPLOYMENT_GUIDE.md
│
├─ 30 min   ↓ Read LAMBDA_CONCEPTS_EXPLAINED.md (optional but recommended)
│
├─ 45 min   ↓ Create AWS Account (Step 1 of checklist)
│
├─ 65 min   ↓ Create IAM User & Access Keys (Step 2)
│
├─ 75 min   ↓ Configure aws CLI (Step 3)
│           ↓ Verify credentials work
│
├─ 85 min   ↓ Deploy Backend: npm run deploy (Step 4)
│           ↓ ⏳ Wait ~90 seconds for deployment
│
├─ 88 min   ↓ Copy API endpoint URL
│
├─ 90 min   ↓ Update Frontend (Step 5)
│           ↓ npm run build
│
├─ 100 min  ↓ Deploy Frontend to Render (Step 6)
│
├─ 105 min  ↓ Run Smoke Tests (Step 7)
│           ↓ curl endpoint checks
│
├─ 115 min  ↓ Test in browser (Step 8)
│           ↓ Contact form, plans page, login
│
└─ 120 min  ✅ LIVE in PRODUCTION!

Estimated time: 1.5 - 2 hours from start to finish
(Most time is setup, actual deployment is ~10 minutes)
```

---

## What You'll See at Each Step

### After aws configure ✓
```
You've just entered credentials. They're now stored locally.

Next: Verify with
  $ aws sts get-caller-identity
  
Expected output:
{
  "UserId": "AIDAI...",
  "Account": "123456789012",
  "Arn": "arn:aws:iam::123456789012:user/aaryaa-..."
}
```

### After npm run deploy ✓
```
Serverless Framework uploads + deploys

You'll see:
 ✓ Service deployed to stack aaryaa-network-backend-prod
 
 endpoints:
   ANY - https://75coudkgfj.execute-api.ap-south-1.amazonaws.com/
   ANY - https://75coudkgfj.execute-api.ap-south-1.amazonaws.com/{proxy+}

 functions:
   api: aaryaa-network-backend-prod-api (28 MB)
```

### After Frontend Update ✓
```
npm run build completes without errors.
You now have:
  dist/
    ├─ index.html
    ├─ assets/
    │  ├─ [bunch of JS files with new API URL baked in]
```

### After Browser Test ✓
```
You visit https://aaryaanetwork.com

Frontend loads ✅
You see the homepage

Click "Plans" → API call to Lambda ✅
Plans load from database

Click "Contact Us" → Form submission ✅
Message saved to database

Try login → Auth works ✅
You see admin dashboard

Everything working end-to-end ✅✅✅
```

---

## Emergency Rollback (If Something Goes Wrong)

```
If deployment fails:

1. Check logs:
   serverless logs -f api --tail

2. Fix issue (code/config)

3. Redeploy:
   npm run deploy

4. Or completely remove and start over:
   npm run remove  (deletes everything)
   npm run deploy  (fresh start)

All data is in MongoDB (safe), 
AWS resources are temporary (easy to recreate)
→ Nothing is lost, just redeploy!
```

---

## Celebrating Success

When you see your endpoint working:
```powershell
$ curl https://your-api.execute-api.ap-south-1.amazonaws.com/api/ping

OK  ← Success! 🎉
```

You've officially:
✅ Set up AWS infrastructure
✅ Deployed a serverless backend
✅ Integrated with a frontend
✅ Gained DevOps knowledge
✅ Can deploy any Node.js app to Lambda

**That's a professional-level skill!** 🚀

---
