#! /bin/bash

npm install --silent --no-progress -g npm
npm install -g --silent --no-progress serverless
npm install --silent --no-progress serverless-offline
echo $CODEBUILD_SRC_DIR/target/$env
ls -al
cd target
ls -al
cd dev
ls -al
cd ../..
serverless deploy --stage $env --package target/dev --region ap-northeast-2 -v