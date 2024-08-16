#!/bin/bash

# バックアップ先ディレクトリ
backup_dir="backup"

# バックアップリストファイル
backup_list="backup_list.txt"

# バックアップ先ディレクトリがなければ作成
mkdir -p "$backup_dir"

# バックアップリストに従ってファイルをバックアップ
while IFS= read -r file; do
    # ワイルドカードを展開してファイルをコピー
    for matched_file in $file; do
        if [ -e "$matched_file" ]; then
            mkdir -p "$backup_dir/$(dirname "$matched_file")"
            cp --parents "$matched_file" "$backup_dir/"
        fi
    done
done < "$backup_list"

tar czf "${backup_dir}.tar.gz" "$backup_dir"
rm -fr "$backup_dir"
