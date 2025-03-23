# URL Shortener

## Overview
This is a URL shortening service built with Node.js, Express, and MongoDB. It allows users to shorten long URLs and redirect to the original URL using the shortened link. The backend is fully functional and has been tested locally, but there were issues with deploying on Railway due to environment variable problems.

## Features
- Shorten long URLs into compact links.
- Redirect from shortened URLs to the original URLs.
- Track the number of clicks on each shortened URL.
- API endpoints for creating and accessing shortened URLs.

## Tech Stack
- **Backend**: Node.js, Express
- **Database**: MongoDB (hosted on MongoDB Atlas)
- **Frontend**: (Not specified, assuming minimal or none for this project)
- **Deployment Attempted**: Railway (failed due to environment variable issues)




## Deployment Issues on Railway
The backend works perfectly on my local machine, as tested with the above steps. However, I encountered persistent issues when deploying on Railway (`https://url-shortner-production-3e7c.up.railway.app`):
- **Problem**: Railway failed to load environment variables (`DATABASE_URL`, `BASE_URL`, `PORT`), resulting in the app crashing with the error:DATABASE_URL: undefined
Error: DATABASE_URL is not defined. Please set the environment variable.

**Attempts to Fix**:
- Added variables in Railway’s “Service Variables” and “Raw Editor.”
- Redeployed multiple times.
- Updated `server.js` to log environment variables and increase MongoDB connection timeouts.
- **Outcome**: Despite these efforts, Railway still failed to apply the variables, causing the deployment to crash.
