# Build stage
FROM node:20 AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application files
COPY . .

# Build the application
ENV NEXT_BUILDER=webpack
RUN npm run build

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

