FROM oven/bun:1

WORKDIR /app

# Copy package.json
COPY package.json ./

# Install dependencies
RUN bun install

# Copy the rest of the application code
COPY . .

EXPOSE 3000

CMD ["bun", "run", "src/server.ts"]