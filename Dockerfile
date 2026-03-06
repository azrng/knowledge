FROM node:latest

RUN mkdir -p /home/nodeApp
COPY . /home/nodeApp
WORKDIR /home/nodeApp
RUN npm config set registry https://registry.npmmirror.com/ && \
    npm install -g pnpm && \
    pnpm install
    
ENV HOST 0.0.0.0
ENV PORT 8080
EXPOSE 8080
CMD ["pnpm", "run", "docs:dev"]
