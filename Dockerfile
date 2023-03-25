FROM node:14-bullseye-slim as builder

ENV JUPITERONE_INTEGRATION_DIR=/opt/jupiterone/integration

COPY package.json yarn.lock tsconfig.dist.json tsconfig.json LICENSE ${JUPITERONE_INTEGRATION_DIR}/
COPY src/ ${JUPITERONE_INTEGRATION_DIR}/src
WORKDIR  ${JUPITERONE_INTEGRATION_DIR}
RUN yarn install
RUN yarn build:docker


FROM node:14-bullseye-slim
ENV JUPITERONE_INTEGRATION_DIR=/opt/jupiterone/integration
COPY --from=builder ${JUPITERONE_INTEGRATION_DIR}/dist ${JUPITERONE_INTEGRATION_DIR}
COPY --from=builder ${JUPITERONE_INTEGRATION_DIR}/yarn.lock ${JUPITERONE_INTEGRATION_DIR}
COPY scripts/ ${JUPITERONE_INTEGRATION_DIR}/scripts
WORKDIR ${JUPITERONE_INTEGRATION_DIR}
RUN yarn install --production --fronzen-lockfile --cache-folder ./ycache; yarn global add --cache-folder ./ycache @jupiterone/integration-sdk-cli; rm -rf ./ycache
RUN export PATH="$(yarn global bin):$PATH"


CMD ["sh", "scripts/execute.sh"]