FROM node:18-alpine

WORKDIR /app

COPY . /app/

RUN npm install

EXPOSE 3000

ENV NAME receiptprocessor

CMD ["npm", "start"]
