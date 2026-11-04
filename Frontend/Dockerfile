FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --include=dev
COPY . .
ENV PORT=3124
EXPOSE 3124
CMD ["npm","start"]
