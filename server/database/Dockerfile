ARG BASE_IMAGE=node:18
FROM ${BASE_IMAGE}

WORKDIR /app

COPY package.json ./
COPY app.js ./
COPY review.js ./
COPY dealership.js ./
COPY data/dealerships.json ./
COPY data/reviews.json ./
RUN npm install

EXPOSE 3030

CMD [ "node", "app.js" ]
