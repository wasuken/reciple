#!/bin/bash

# バックアップ元ディレクトリ
backup_dir="backup"

# バックアップファイルを元の場所に復元
cp -r "$backup_dir/"* .
