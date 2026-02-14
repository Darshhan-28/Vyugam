#!/bin/bash
# Helper script to run Vyugam 2k26 with the correct Node.js version

# Get the directory of the script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Set the path to include the portable node
export PATH="$SCRIPT_DIR/node_bin/bin:$PATH"

# Run the development server
echo "Starting Vyugam 2k26 with Node $(node -v)..."
npm run dev
