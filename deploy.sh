#!/bin/bash

printf -- 'Building the ZIP file for upload\n\n';

mkdir -p build
zip -r build/src.zip src

aws lambda update-function-code --function-name "$1" --zip-file fileb://build/src.zip

printf -- '\n\033[32mFinished \033[0m\n';
