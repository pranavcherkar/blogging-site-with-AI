FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

# Create non-root user for security
RUN groupadd -r nodejs && useradd -r -g nodejs nodeuser

# Change ownership of the working directory
RUN chown -R nodeuser:nodejs /app
USER nodeuser

EXPOSE 8086

CMD ["npm", "start"]
