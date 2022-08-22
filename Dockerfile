FROM node:lts-buster

RUN git clone https://github.com/DrkBotBase/MyBot_V2

RUN apt-get update && \
  apt-get install -y \
  ffmpeg \
  imagemagick \
  webp && \
  apt-get upgrade -y && \
  rm -rf /var/lib/apt/lists/*

COPY package.json .

RUN npm install -g npm@8.17.0
RUN npm install supervisor -g

COPY . .

CMD ["node", "."]
