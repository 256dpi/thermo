#!/usr/bin/env bash
set -eo pipefail

if [[ -z "$1" ]]
  then
    echo "missing version"
    exit
fi

CUR_DIR=$(pwd)
echo "==> Current Directory: $CUR_DIR"

GIT_DIR=$(git rev-parse --show-toplevel)
echo "==> Repository Directory: $GIT_DIR"

SUB_DIR=${CUR_DIR/$GIT_DIR/}
SUB_DIR=${SUB_DIR:1}
echo "==> Sub Directory: $SUB_DIR"

TMP_DIR=$(mktemp -d)
echo "==> Temporary Directory: $TMP_DIR"

echo "==> Copying files..."
rsync -rv --exclude=.git --exclude=node_modules --exclude=tmp --exclude=dist --exclude=build ./ "$TMP_DIR"

echo "==> Initializing repository..."
cd "$TMP_DIR"
git init
git add .
git commit -m "init"

echo "==> Applying update..."
ember-cli-update --to "$1"
git add .

echo "==> Create patch..."
git diff --cached > diff.patch

echo "==> Applying patch..."
cd "$CUR_DIR"
git apply --directory "$SUB_DIR" --apply --stat "$TMP_DIR/diff.patch"

echo "Cleaning up..."
rm -rf "$TMP_DIR"
