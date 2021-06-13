#! /bin/bash

npm install --silent --no-progress -g npm
npm install -g --silent --no-progress serverless
npm install --silent --no-progress serverless-offline
echo $CODEBUILD_SRC_DIR/target/$env
serverless deploy --stage $env --package \
$CODEBUILD_SRC_DIR/target/$env --region ap-northeast-2