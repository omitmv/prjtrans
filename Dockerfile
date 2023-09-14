FROM oraclelinux:7-slim
RUN yum -y update && \
  yum -y install oracle-nodejs-release-el7 && \
  yum -y install nodejs && \
  yum -y install oracle-instantclient-release-el7 && \
  yum -y install oracle-instantclient-basic && \
  yum -y install vim && \
  yum -y install git && \
  rm -rf /var/cache/yum
WORKDIR /home/rafael/prjtrans
RUN npm install --production --silent
EXPOSE 4300
CMD node /home/rafael/prjtrans/index.js
#Command for creation of the docker image
#sudo docker build -t image-api .
#Command for creation of the container
#sudo docker run --name api -p 4300:4300 -d image-api
