# Stage 1: Build the React application
FROM node:20-alpine AS build

WORKDIR /app

# 1. Install dependencies first (cached unless package.json changes)
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# 2. Copy ONLY the necessary source files afterward
COPY . .

# 3. Build the application
RUN npm run build

# Stage 2: Serve the built files
FROM node:20-alpine AS production

WORKDIR /app

# 4. Install a minimal HTTP server (only needed in final image)
RUN npm install -g serve

# 5. Copy built files from build stage
COPY --from=build /app/dist ./dist

EXPOSE 8080

CMD ["serve", "-s", "dist", "-l", "8080"]
