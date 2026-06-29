#!/bin/bash

# Read current version (remove quotes and v. prefix)
current_version=$(grep REACT_APP_VERSION .env | cut -d '"' -f2 | sed 's/v\.//')

# Split version into components
IFS='.' read -r major minor patch <<< "$current_version"

# Increment patch version
new_patch=$((patch + 1))
new_version="v.$major.$minor.$new_patch"

# Update .env file (Mac/BSD sed)
if [[ "$OSTYPE" == "darwin"* ]]; then
  sed -i '' "s/REACT_APP_VERSION=\"v\.[0-9]*\.[0-9]*\.[0-9]*\"/REACT_APP_VERSION=\"$new_version\"/" .env
else
  # Linux sed
  sed -i "s/REACT_APP_VERSION=\"v\.[0-9]*\.[0-9]*\.[0-9]*\"/REACT_APP_VERSION=\"$new_version\"/" .env
fi

echo "✓ Version incremented to $new_version"

# Run yarn build
echo "Running yarn build..."
yarn build

echo "✓ Build complete!"