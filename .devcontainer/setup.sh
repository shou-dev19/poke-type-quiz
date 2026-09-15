#!/bin/bash
set -ex

echo "Starting Dev Container setup..."

# ---------------------------------------------------------
# 1. マウントしたボリュームの権限を node ユーザーに修正
# devcontainer.json の mounts で作成されたディレクトリは
# root 所有になることがあるため、ここで node に変更します
# ---------------------------------------------------------
echo "Fixing volume permissions..."

# 事前に必要なディレクトリを作成
sudo mkdir -p /home/node/.config/gh \
              /home/node/.config/gcloud \
              /home/node/.cache/antigravity

# マウント対象およびホームディレクトリ配下の所有権を node ユーザーに一元変更
sudo chown -R node:node /home/node/.gemini \
                        /home/node/.claude \
                        /home/node/.codex \
                        /home/node/.config \
                        /home/node/.cache

sudo apt-get update

# ---------------------------------------------------------
# 2. Git config
# ---------------------------------------------------------
if [ -z "$(git config --global user.email)" ]; then
    if [ -n "$GIT_USER_EMAIL" ]; then
        echo "Configuring global git user.email from environment..."
        git config --global user.email "$GIT_USER_EMAIL"
    else
        echo "GIT_USER_EMAIL not set, skipping git config user.email..."
    fi
fi

if [ -z "$(git config --global user.name)" ]; then
    if [ -n "$GIT_USER_NAME" ]; then
        echo "Configuring global git user.name from environment..."
        git config --global user.name "$GIT_USER_NAME"
    else
        echo "GIT_USER_NAME not set, skipping git config user.name..."
    fi
fi

# ---------------------------------------------------------
# 3. CLI ツールのインストール
# ---------------------------------------------------------
echo "Installing Antigravity CLI..."
curl -fsSL https://antigravity.google/cli/install.sh | bash

echo "Installing Claude CLI..."
if command -v claude &> /dev/null; then
    echo "Claude CLI already installed, skipping to preserve auth."
else
    curl -fsSL https://claude.ai/install.sh | bash
fi

echo "Installing Codex CLI..."
if command -v codex &> /dev/null; then
    echo "Codex CLI already installed, skipping to preserve auth."
else
    curl -fsSL https://chatgpt.com/codex/install.sh | CODEX_NON_INTERACTIVE=1 sh
fi

# ---------------------------------------------------------
# 4. シェルエイリアスの設定
# ---------------------------------------------------------
echo "alias agyyolo='agy --dangerously-skip-permissions'" >> /home/node/.bashrc
source ~/.bashrc

echo "Dev Container setup complete!"
