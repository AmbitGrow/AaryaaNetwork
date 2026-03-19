# AWS Lambda Deployment - Quick Reference Card

## Essential Commands

### Configure AWS Credentials (One-time)
```powershell
aws configure
# Enter: Access Key, Secret Key, ap-south-1, json
```

### Verify Setup
```powershell
aws sts get-caller-identity
# Should return your AWS account info
```

### Deploy Backend
```powershell
cd "d:\Admin\OneDrive\Desktop\AaryaaNetwork\Backend"
npm run deploy
# Wait ~1-2 minutes
# Copy the API URL from output
```

### View Logs
```powershell
serverless logs -f api --tail
# Ctrl+C to stop
```

### Get Stack Info
```powershell
serverless info
# Shows endpoint URL, stack name, AWS account
```

### Remove Deployment (Cleanup)
```powershell
npm run remove
# Deletes everything (Lambda, API Gateway, S3 bucket)
```

### Test Endpoint
```powershell
curl https://your-api-id.execute-api.ap-south-1.amazonaws.com/api/ping
# Should return: OK
```

---

## Files You Need to Know

### Backend Configuration
```
serverless.yml          ← Deployment blueprint
package.json           ← npm scripts (deploy, remove)
Backend/.env           ← Your secrets (NOT in Git)
server.js              ← Express app with handler export
```

### Environment Variables You Need (in Backend/.env)
```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/?retryWrites=true
JWT_SECRET=YourSuperSecretKeyHere123
CLIENT_URL=https://aaryaanetwork.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
RECEIVER_EMAIL=receiver@gmail.com
ALLOW_PUBLIC_ADMIN_REGISTER=false
```

---

## AWS Console Navigation

### Find Your Lambda Function
1. Go to https://console.aws.amazon.com
2. Search for "Lambda"
3. Look for function: `aaryaa-network-backend-prod-api`
4. Tabs: Code, Configuration, Monitoring, Logs

### Find Your API Endpoint
1. Search for "API Gateway"
2. Click on: `aaryaa-network-backend`
3. Look for "Endpoints" section
4. Copy the HTTP API endpoint URL

### Check CloudWatch Logs
1. Search for "CloudWatch"
2. Click "Logs"
3. Look for: `/aws/lambda/aaryaa-network-backend-prod-api`
4. Click to see all log streams

### Monitor Costs
1. Search for "Billing"
2. "Billing Dashboard" → See usage and costs
3. Set "Billing Alerts" under "Preferences"

---

## Troubleshooting 5-Minute Fixes

| Problem | Solution |
|---------|----------|
| `Cannot read properties of undefined` | Rerun `aws configure` with fresh access keys |
| Deployment times out | Check MongoDB connection string in `.env` |
| CORS error from frontend | Update `CLIENT_URL` in `.env` and redeploy |
| Lambda timeout (504) | Increase `timeout: 29` in serverless.yml, redeploy |
| 403 Forbidden on endpoint | Check IAM user has `AWSLambdaFullAccess` |
| Can't find logs | Invoke endpoint first, wait 10sec, check logs again |
| Credentials expired | Create new access key in IAM, run `aws configure` |

---

## Security Checklist

Before going live, ensure:
- [ ] `.env` is in `.gitignore` (not committed)
- [ ] `AWS_ACCESS_KEY_ID` not stored in code
- [ ] `JWT_SECRET` is strong (>32 characters)
- [ ] Email password is app-specific (not personal password)
- [ ] `CLIENT_URL` is correct production domain
- [ ] `ALLOW_PUBLIC_ADMIN_REGISTER=false`

---

## Cost Estimation

| Service | Free Tier | After Free | Your App ~20 users/day |
|---------|-----------|-----------|----------------------|
| Lambda | 1M/month | $0.0000002/req | Free |
| API Gateway | 1M/month | $0.035 per million | Free |
| S3 | Depends | ~$0.023/GB | Free |
| **Total** | **All 1st year** | **~$1-2/month** | **Free** |

---

## Typical Errors & Meanings

```
"Cannot read properties of undefined (reading 'code')"
→ Credentials missing or invalid. Run: aws configure

"TypeError: ECONNREFUSED"
→ Can't connect to MongoDB. Check MONGO_URI in .env

"403 Forbidden"
→ API Gateway route not configured or IAM permission missing

"Task timed out"
→ Lambda function took >29 seconds. Increase timeout in serverless.yml

"ValidationError: One or more parameter values were invalid"
→ serverless.yml has syntax error. Check YAML formatting

"Stack already exists in another state"
→ Previous deployment failed. Run: serverless remove --force
```

---

## Performance Tips

### Cold Start Reduction
```yaml
# In serverless.yml
memorySize: 512    # More memory = faster CPU (higher cost)
ephemeralSize: 1024  # Temp storage for uploads
timeout: 29        # Keep high for slow operations
```

### Connection Pooling
- MongoDB connection is reused (done ✓)
- Reduces latency on subsequent requests

### Remove Unnecessary Packages
```
serverless.yml
patterns:
  - "!node_modules/.bin/**"  # Exclude binary files
  - "!uploads/**"             # Exclude user uploads
```

---

## AWS Resources

| Resource | Link |
|----------|------|
| AWS Documentation | https://docs.aws.amazon.com |
| Lambda Pricing | https://aws.amazon.com/lambda/pricing |
| Serverless Framework Docs | https://www.serverless.com/framework/docs |
| API Gateway + Lambda | https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api.html |
| CloudFormation Docs | https://docs.aws.amazon.com/cloudformation |

---

## One-Liner Commands

```powershell
# Test your endpoint
curl https://your-api-id.execute-api.ap-south-1.amazonaws.com/api/ping; Write-Host ""

# Get API endpoint
serverless info | findstr "HttpApiUrl"

# Count requests in logs
serverless logs -f api | Measure-Object -Line

# Package without deploying
npm run package

# Deploy with debugging
npm run deploy -- --verbose

# Remove everything and delete
npm run remove -- --force
```

---

## Remember

✅ **You've got this!** Follow the 10-step checklist
✅ **Backend is ready** - All code is production-ready
✅ **This is repeatable** - After this, deploying any Node.js app is the same
✅ **You own the knowledge** - Not dependent on anyone's credentials

---

**Start here**: Read `AWS_LAMBDA_DEPLOYMENT_GUIDE.md` first
**Then follow**: `YOUR_DEPLOYMENT_CHECKLIST.md` step by step
**Reference**: This quick card when you need fast answers

Good luck! 🚀
