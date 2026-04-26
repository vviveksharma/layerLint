#!/bin/sh
set -e

# LayerLint installer script
# Usage: curl -sSL https://raw.githubusercontent.com/vviveksharma/layerLint/main/install.sh | sh

REPO="vviveksharma/layerLint"
BINARY_NAME="layerlint"

# Detect OS and architecture
OS=$(uname -s)
ARCH=$(uname -m)

case "$OS" in
  Linux*)
    OS="Linux"
    ;;
  Darwin*)
    OS="Darwin"
    ;;
  MINGW* | MSYS* | CYGWIN*)
    OS="Windows"
    ;;
  *)
    echo "Unsupported operating system: $OS"
    exit 1
    ;;
esac

case "$ARCH" in
  x86_64 | amd64)
    ARCH="x86_64"
    ;;
  aarch64 | arm64)
    ARCH="arm64"
    ;;
  *)
    echo "Unsupported architecture: $ARCH"
    exit 1
    ;;
esac

# Construct download URL
RELEASE_URL="https://github.com/${REPO}/releases/latest/download/${BINARY_NAME}_${OS}_${ARCH}"

if [ "$OS" = "Windows" ]; then
  RELEASE_URL="${RELEASE_URL}.zip"
  ARCHIVE_EXT="zip"
else
  RELEASE_URL="${RELEASE_URL}.tar.gz"
  ARCHIVE_EXT="tar.gz"
fi

echo "Downloading LayerLint for ${OS} ${ARCH}..."
echo "URL: ${RELEASE_URL}"

# Create temporary directory
TMP_DIR=$(mktemp -d)
cd "$TMP_DIR"

# Download and extract
if command -v curl > /dev/null 2>&1; then
  curl -sSLO "$RELEASE_URL"
elif command -v wget > /dev/null 2>&1; then
  wget -q "$RELEASE_URL"
else
  echo "Error: curl or wget is required"
  exit 1
fi

# Extract archive
if [ "$ARCHIVE_EXT" = "tar.gz" ]; then
  tar xzf "${BINARY_NAME}_${OS}_${ARCH}.tar.gz"
else
  unzip -q "${BINARY_NAME}_${OS}_${ARCH}.zip"
fi

# Determine install location
if [ -w "/usr/local/bin" ]; then
  INSTALL_DIR="/usr/local/bin"
elif [ -w "$HOME/.local/bin" ]; then
  INSTALL_DIR="$HOME/.local/bin"
  mkdir -p "$INSTALL_DIR"
else
  INSTALL_DIR="$HOME/bin"
  mkdir -p "$INSTALL_DIR"
fi

# Install binary
if [ "$OS" = "Windows" ]; then
  BINARY="${BINARY_NAME}.exe"
else
  BINARY="${BINARY_NAME}"
fi

echo "Installing ${BINARY} to ${INSTALL_DIR}..."

if [ -w "$INSTALL_DIR" ]; then
  mv "$BINARY" "$INSTALL_DIR/"
  chmod +x "$INSTALL_DIR/$BINARY"
else
  echo "Installing to ${INSTALL_DIR} requires sudo permissions..."
  sudo mv "$BINARY" "$INSTALL_DIR/"
  sudo chmod +x "$INSTALL_DIR/$BINARY"
fi

# Cleanup
cd - > /dev/null
rm -rf "$TMP_DIR"

echo ""
echo "✓ LayerLint installed successfully!"
echo ""
echo "Run 'layerlint --help' to get started."

# Check if install dir is in PATH
case ":${PATH}:" in
  *:${INSTALL_DIR}:*)
    ;;
  *)
    echo ""
    echo "Note: ${INSTALL_DIR} is not in your PATH."
    echo "Add it to your PATH by adding this line to your shell profile:"
    echo "  export PATH=\"\$PATH:${INSTALL_DIR}\""
    ;;
esac
