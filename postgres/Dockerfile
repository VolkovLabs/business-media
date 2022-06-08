FROM node
WORKDIR /app

# Install depenencies
RUN yarn add pg

# Copy
COPY ./load.ts .
COPY ./postgresql-14-US.pdf .
COPY ./image-panel.png .
COPY ./9.mp4 .

# Run
CMD [ "node", "./load.ts" ]