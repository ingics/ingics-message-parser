FROM node:10-alpine

WORKDIR /libsrc/message-parser
COPY . /libsrc/message-parser
RUN npm install
RUN npm link

