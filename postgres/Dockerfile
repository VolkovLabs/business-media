FROM node
WORKDIR /app

# Install depenencies
RUN yarn add pg

# Copy
COPY ./load.ts .
COPY ./postgresql-14-US.pdf .
COPY ./image-panel.png .

# Run
CMD [ "node", "./load.ts" ]