#!/bin/bash
echo "Fixing Openspace"
mkdir node_modules/@types/openspace-api-js;echo "declare module 'openspace-api-js'" >>node_modules/@types/openspace-api-js/index.d.ts
echo "Openspace Fixed!"