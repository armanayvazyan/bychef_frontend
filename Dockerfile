FROM node:18-alpine AS build

WORKDIR /app

ARG VITE_BASE_API_URL
ARG VITE_YMAP_KEY
ARG VITE_YMAP_SEARCH_RESULTS_COUNT

ENV VITE_BASE_API_URL=$VITE_BASE_API_URL
ENV VITE_YMAP_KEY=$VITE_YMAP_KEY
ENV VITE_YMAP_SEARCH_RESULTS_COUNT=$VITE_YMAP_SEARCH_RESULTS_COUNT

COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
