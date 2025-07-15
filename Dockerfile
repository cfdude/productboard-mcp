# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate manifest and build
RUN npm run generate-manifest && \
    npm run build

# Runtime stage
FROM node:20-alpine

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 mcp && \
    adduser -D -u 1001 -G mcp mcp

# Copy built application
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/build ./build
COPY --from=builder /app/generated ./generated

# Install production dependencies only
RUN npm ci --production && \
    npm cache clean --force

# Change ownership
RUN chown -R mcp:mcp /app

# Switch to non-root user
USER mcp

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Default command
CMD ["node", "build/index.js"]

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "console.log('OK')" || exit 1

# Labels
LABEL org.opencontainers.image.source="https://github.com/cfdude/productboard-mcp"
LABEL org.opencontainers.image.description="Productboard MCP Server with dynamic tool loading"
LABEL org.opencontainers.image.licenses="MIT"