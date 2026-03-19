# Your Personal AWS Lambda Deployment Action Plan

## ✅ What's Already Done
- Express.js backend configured
- serverless.yml ready
- Lambda handler exported (server.handler)
- MongoDB connection is Lambda-safe
- package.json has deploy/remove scripts

## 🎯 What YOU Need to Do (Step-by-Step)

### STEP 1: Create Your AWS Account (15 minutes)
**Action**: Go to https://aws.amazon.com → Click "Create AWS Account"
- [ ] Sign up with your email
- [ ] Verify email
- [ ] Add payment method (card required, free tier covers deployment)
- [ ] Complete account setup
- [ ] Save your AWS Account ID (12-digit number)

**Verify**: You can log into AWS Console

---

### STEP 2: Create IAM User for Deployment (10 minutes)
**Action**: In AWS Console
1. Search for "IAM" → Click on IAM service
2. Left sidebar → Click "Users"
3. Click "Create user"
   - [ ] User name: `aaryaa-lambda-deployer`
   - [ ] Do NOT check "Provide access to Management Console"
   - [ ] Click "Next"
4. Attach permissions:
   - [ ] Search for and select: `AWSLambdaFullAccess`
   - [ ] Search for and select: `AmazonAPIGatewayFullAccess`
   - [ ] Search for and select: `CloudFormationFullAccess`
   - [ ] Search for and select: `AmazonS3FullAccess`
   - [ ] Search for and select: `CloudWatchLogsFullAccess`
   - [ ] Search for and select: `IAMFullAccess`
   - [ ] Click "Next" → "Create user"
5. Click on the user you just created
6. Go to "Security credentials" tab
7. Click "Create access key"
8. Select "Command Line Interface (CLI)" → Accept
9. Click "Create access key"

**IMPORTANT**: Copy these two values somewhere SAFE (password manager, encrypted file, etc.):
```
Access Key ID: _______________________
Secret Access Key: ____________________
```

**Verify**: You have BOTH values copied safely

---

### STEP 3: Configure AWS Credentials Locally (5 minutes)
**Action**: In PowerShell, run:
```powershell
aws configure
```

You will be prompted for:
```
AWS Access Key ID [None]: [PASTE YOUR ACCESS KEY ID]
AWS Secret Access Key [None]: [PASTE YOUR SECRET ACCESS KEY]
Default region name [None]: ap-south-1
Default output format [None]: json
```

**Verify**: Run this command and you should see your account info:
```powershell
aws sts get-caller-identity
```

Example output:
```json
{
    "UserId": "AIDAI...",
    "Account": "123456789012",
    "Arn": "arn:aws:iam::123456789012:user/aaryaa-lambda-deployer"
}
```

---

### STEP 4: Prepare Environment Variables (5 minutes)
**Action**: Make sure your `Backend/.env` has:
```
MONGO_URI=mongodb+srv://[your-user]:[your-pass]@[cluster].mongodb.net/?retryWrites=true
JWT_SECRET=your-super-secret-key-here
CLIENT_URL=https://aaryaanetwork.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
RECEIVER_EMAIL=receiver@gmail.com
ALLOW_PUBLIC_ADMIN_REGISTER=false
```

**Verify**: All variables are set
- [ ] MONGO_URI is valid
- [ ] JWT_SECRET is strong
- [ ] CLIENT_URL is your production domain
- [ ] EMAIL credentials work

---

### STEP 5: Deploy to AWS Lambda (10 minutes)
**Action**: In PowerShell, navigate to backend folder:
```powershell
Set-Location "d:\Admin\OneDrive\Desktop\AaryaaNetwork\Backend"
npm run deploy
```

**What happens**:
1. Serverless Framework reads serverless.yml
2. Bundles your code
3. Uploads to AWS S3
4. Creates CloudFormation stack (infrastructure as code)
5. Provisions Lambda function
6. Sets up API Gateway
7. Outputs your live API URL

**Example output**:
```
✓ Service deployed to stack aaryaa-network-backend-prod (80s)
endpoints:
  ANY - https://abc123.execute-api.ap-south-1.amazonaws.com/
  ANY - https://abc123.execute-api.ap-south-1.amazonaws.com/{proxy+}
```

**Verify**: Note down your API URL starting with `https://abc123...`

---

### STEP 6: Test Your Live Backend (5 minutes)
**Action**: Test these endpoints:
```powershell
# Health check
curl https://your-api-id.execute-api.ap-south-1.amazonaws.com/api/ping

# Get plans
curl https://your-api-id.execute-api.ap-south-1.amazonaws.com/api/plans

# This should show not authenticated (expected for no login)
curl https://your-api-id.execute-api.ap-south-1.amazonaws.com/api/check-auth
```

**Verify**: All endpoints return 200 status codes

---

### STEP 7: Connect Frontend to Your Backend (5 minutes)
**Action**: Update frontend environment:
```
Frontend/.env
VITE_SERVER_URI=https://your-api-id.execute-api.ap-south-1.amazonaws.com
```

Rebuild frontend:
```powershell
Set-Location "d:\Admin\OneDrive\Desktop\AaryaaNetwork\Frontend"
npm run build
```

**Verify**: Build succeeds with no errors

---

### STEP 8: Deploy Frontend to Render (5 minutes)
**Action**: In Render dashboard
1. Go to your AaryaaNetwork project
2. Click "Environment" (under MANAGE)
3. Update: `VITE_SERVER_URI=https://your-api-id.execute-api.ap-south-1.amazonaws.com`
4. Save → Render auto-redeploys

**Verify**: Frontend loads and can call backend API

---

### STEP 9: Test Complete Flow (10 minutes)
**Action**: On production frontend (https://aaryaanetwork.com or your Render URL):
- [ ] Click "Contact Us" → Submit message → Should appear in backend
- [ ] Visit "Plans" page → Should load plans from your Lambda API
- [ ] Go to admin login → Try login → Should work (if credentials correct)

**Verify**: All flows work end-to-end

---

### STEP 10: Monitor & Maintain (Ongoing)
**Action**: Regular checks
```powershell
# View Lambda logs
serverless logs -f api --tail

# Check deployment status
serverless info

# List all functions
serverless function list
```

**Monthly tasks**:
- [ ] Check AWS Billing Dashboard
- [ ] Review CloudWatch logs
- [ ] Rotate access keys (every 90 days)
- [ ] Test critical endpoints

---

## 🔐 Security Reminders
1. **Never commit .env to Git** ✓ (already in .gitignore)
2. **Don't share access keys** ✓ (save securely, rotate every 90 days)
3. **Use IAM roles in production** → Plan for later
4. **Enable AWS CloudTrail** → Optional but recommended
5. **Set CloudWatch alarms** → Optional for cost limits

---

## 💰 Cost Management
**AWS Free Tier** (first 12 months):
- 1M Lambda requests/month ✓
- 400,000 GB-seconds compute
- 1 GB data transfer/month
- DynamoDB & S3 also included

**What to expect** (rough estimates):
- Your app: ~$1-5/month after free tier
- If viral: could scale to $100+/month

**Monitor**: AWS Console → Billing Dashboard

---

## 📞 Troubleshooting Commands

### If credentials not working:
```powershell
aws sts get-caller-identity
# Should show your account info
```

### If deployment fails:
```powershell
npm run deploy -- --verbose
# Shows detailed error messages
```

### If can't connect to database:
```powershell
serverless logs -f api --tail
# Shows Lambda function logs in real-time
```

### To remove deployment (cleanup):
```powershell
npm run remove
# Deletes CloudFormation stack + Lambda + API Gateway
```

---

## ✨ Congratulations!
You now have:
- ✅ Your own AWS account
- ✅ IAM user with proper permissions
- ✅ Backend deployed to Lambda
- ✅ Live API endpoint
- ✅ Full end-to-end app
- ✅ Knowledge to deploy ANY future project to Lambda


**Next Projects**: You can now deploy any Node.js app to Lambda using this exact flow!

---
