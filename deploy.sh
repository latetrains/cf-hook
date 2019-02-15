#!/bin/bash

printf -- 'Building the ZIP file for upload\n\n';

mkdir -p build
zip -r build/src.zip src

printf -- '\n\033[32mFinished \033[0m\n';