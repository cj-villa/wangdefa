#!/usr/bin/env bash

set -e

From="auto-global"
To=$1

FirstUpperFrom=$(echo "$From" | awk -F- '{for(i=1;i<=NF;i++){printf toupper(substr($i,1,1)) tolower(substr($i,2))}} END{print ""}')
FirstUpperTo=$(echo "$To" | awk -F- '{for(i=1;i<=NF;i++){printf toupper(substr($i,1,1)) tolower(substr($i,2))}} END{print ""}')

AllUpperFrom=$(echo "$From" | awk -F- '{for(i=1;i<=NF;i++){printf toupper(substr($i,1))}} END{print ""}')
AllUpperTo=$(echo "$To" | awk -F- '{for(i=1;i<=NF;i++){printf toupper(substr($i,1))}} END{print ""}')

AllDownUpperFrom=$(echo "$From" | awk -F- '{
  for (i=1; i<=NF; i++) {
    printf "%s%s", toupper(substr($i,1)), (i<NF ? "_" : "")
  }
  print ""
}')
AllDownUpperTo=$(echo "$To" | awk -F- '{
  for (i=1; i<=NF; i++) {
    printf "%s%s", toupper(substr($i,1)), (i<NF ? "_" : "")
  }
  print ""
}')

DownUpperFrom=$(echo "$From" | awk -F- '{
  for (i=1; i<=NF; i++) {
    printf "%s%s", toupper(substr($i,1,1)) tolower(substr($i,2)), (i<NF ? "_" : "")
  }
  print ""
}')
DownUpperTo=$(echo "$To" | awk -F- '{
  for (i=1; i<=NF; i++) {
    printf "%s%s", toupper(substr($i,1,1)) tolower(substr($i,2)), (i<NF ? "_" : "")
  }
  print ""
}')

if [ -z "$To" ]; then
  echo "没有模块名称"
  exit 1
fi

echo "拷贝源文件至 $To..."
rsync -a ./$From/ ./$To

echo "修改文件名..."
find ./$To -name '*auto-global*' -depth -print0 | while IFS= read -r -d '' f; do
  echo "mv $f to ${f/$From/$To}"
  mv $f ${f/$From/$To}
done

echo "修改文件内容..."
find ./$To -name '*' -type f -depth -print0 | while IFS= read -r -d '' f; do
  sed -i '' "s/$From/$To/g" $f
  sed -i '' "s/$FirstUpperFrom/$FirstUpperTo/g" $f
  sed -i '' "s/$AllUpperFrom/$AllUpperTo/g" $f
  sed -i '' "s/$AllDownUpperFrom/$AllDownUpperTo/g" $f
  sed -i '' "s/$DownUpperFrom/$DownUpperTo/g" $f
done

echo "处理完成..."