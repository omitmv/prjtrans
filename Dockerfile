FROM oraclelinux:7-slim
ENV NODE_ENV=production
# Installing Node.js
RUN  yum -y install oracle-nodejs-release-el7 && \
  yum -y install nodejs && \
  # Installing oracle-instantclient
  yum -y install oracle-instantclient-release-el7 && \
  yum -y install oracle-instantclient-basic && \
  yum -y install git && \
  rm -rf /var/cache/yum
WORKDIR /usr/src/prjtrans
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]
#Command for creation of the docker image
#docker build -t ptfapi .
#Command for creation of the container
#docker run --name ptfapi -p 3000:3000 -d ptfapi
