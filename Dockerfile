# Build stage
FROM node:20 AS builder

WORKDIR /app

# Accept build argument for API URL (can be overridden at build time)
ARG NEXT_PUBLIC_API_URL=https://api.pexifly.com/api

# Set environment variables FIRST, before copying any files
# This ensures they're available during the entire build process
ENV NEXT_BUILDER=webpack
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy application files - .dockerignore will exclude .env files
# But we'll verify and remove any that might slip through
COPY . .

# CRITICAL: Remove ALL .env files immediately after copy
# This is a safety measure in case .dockerignore doesn't catch everything
RUN find . -name ".env*" -type f -delete 2>/dev/null || true
RUN rm -f .env .env.local .env.development .env.production .env.*.local *.env 2>/dev/null || true

# CRITICAL: Verify NO .env files exist anywhere - BUILD WILL FAIL if any are found
RUN echo "=== Environment Check ===" && \
    echo "NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}" && \
    echo "=== Checking for ANY .env files in entire directory tree ===" && \
    ENV_FILES=$(find . -name ".env*" -type f 2>/dev/null) && \
    if [ -n "$ENV_FILES" ]; then \
        echo "ERROR: .env files found! Build will fail."; \
        echo "Found files:"; \
        echo "$ENV_FILES"; \
        exit 1; \
    else \
        echo "✓ No .env files found - safe to build"; \
    fi && \
    echo "=== End Check ==="

# Build the application
# Explicitly pass the environment variable to ensure it's used
# Next.js will embed NEXT_PUBLIC_API_URL in the client bundle at build time
RUN NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} npm run build

# Verify the built bundle contains the correct API URL
# This helps debug if the environment variable was embedded correctly
RUN echo "=== Verifying built bundle ===" && \
    (grep -r "api.pexifly.com" .next/static/chunks/ 2>/dev/null | head -3 || echo "Could not verify in chunks") && \
    echo "=== Build verification complete ==="

# Production stage
FROM node:20 AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev && npm cache clean --force

# Copy built application from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/tsconfig.json ./

# Create non-root user
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 nextjs

# Change ownership
RUN chown -R nextjs:nodejs /app

# Set environment variables
ENV DB_USER=postgres
ENV DB_HOST=localhost
ENV DB_NAME=productmanagement
ENV DB_PASSWORD=sky.1765
ENV DB_PORT=5432
ENV NEXT_PUBLIC_API_URL=https://api.pexifly.com/api

USER nextjs

EXPOSE 80

ENV PORT=80
ENV HOSTNAME="0.0.0.0"
CMD ["npm", "run", "start"]

