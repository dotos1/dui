#!/usr/bin/env bash
# 发布前 / CI 密钥扫描（计划书第 1 周门禁：结果必须为 0）
#
# 用法：scan-secrets.sh [--allow FILE] [--no-gitleaks] [目录 ...]      默认扫描发布相关目录
#   --allow FILE    白名单文件（可多次给，路径相对各扫描目录）。另外 .scan-secrets-allow 自动生效：
#                   先找扫描目录根下的，没有就找它所在 git 仓库根下的（路径相对该文件所在目录）。
#   --no-gitleaks   装了 gitleaks 也只用内置正则（CI 用：结果与白名单不随机器上装没装 gitleaks 变化）
# 退出码：0 = 未发现（或全部在白名单里）/ 1 = 发现疑似密钥 / 2 = 用法错误
#
# 白名单一行一条：  <路径 glob>|<规则名 或 *>|<该行必须匹配的 ERE（可省）>      # 注释
#   路径相对白名单文件所在目录（--allow 给的相对各扫描目录），glob 里的 * 可跨目录；规则名与下面 RULES 的说明一字不差。
#   第三段让白名单只放过「长得像占位符」的那一行：同一文件里以后真写进一个口令，照样报。
#   只登记确认过的误报；真泄露不进白名单——轮换密钥、从代码里拿掉。
#
# 输出只有「文件:行」与规则名，不打印命中的内容（扫描日志本身不能成为泄露源）。
#
# 装了 gitleaks 且没给 --no-gitleaks 时用 gitleaks（规则更全；白名单用它自己的 .gitleaksignore）。
# 注意：本脚本刻意不内嵌任何真实密钥字符串，以免脚本本身成为泄露源。

set -uo pipefail

TARGETS=(); ALLOW_FILES=(); USE_GITLEAKS=1
while [ $# -gt 0 ]; do
  case "$1" in
    --allow) [ $# -ge 2 ] || { echo "--allow 需要一个文件" >&2; exit 2; }
             [ -f "$2" ] || { echo "白名单文件不存在：$2" >&2; exit 2; }
             ALLOW_FILES+=("$2"); shift ;;
    --no-gitleaks) USE_GITLEAKS=0 ;;
    -h|--help) awk 'NR>1 && /^#/ { sub(/^# ?/, ""); print; next } NR>1 { exit }' "$0"; exit 0 ;;
    -*) echo "未知选项：$1" >&2; exit 2 ;;
    *) TARGETS+=("$1") ;;
  esac
  shift
done
if [ ${#TARGETS[@]} -eq 0 ]; then
  TARGETS=(.)
fi

if [ $USE_GITLEAKS -eq 1 ] && command -v gitleaks >/dev/null 2>&1; then
  rc=0
  for t in "${TARGETS[@]}"; do
    gitleaks detect --no-git --source "$t" --redact || rc=1
  done
  exit $rc
fi

[ $USE_GITLEAKS -eq 1 ] && echo "[提示] 未安装 gitleaks，使用内置正则扫描（覆盖面较窄）"

# 每条规则：说明|正则（grep -E）
RULES=(
  "OpenAI/DashScope 风格 API Key|sk-[A-Za-z0-9]{24,}"
  "Anthropic API Key|sk-ant-[A-Za-z0-9_-]{20,}"
  "Google API Key|AIza[0-9A-Za-z_-]{35}"
  "AWS Access Key|AKIA[0-9A-Z]{16}"
  "私钥文件内容|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----"
  "compose 中带默认值的密码变量|((PASSWORD|SECRET|API_KEY)[A-Z_]*|_SK(_[A-Z_]*)?):-[^}\"' ]+"
  # 2026-10-14:值后面紧跟「(」或「.标识符」的是代码(password = secretValueProvider.expandValue(...)),
  # 不是口令 —— bap 里 30 处全是这种。值后面是引号 / 空白 / 行尾 / 其他符号的照报。
  "XML/properties 中的明文密码|(password|secretKey|accessKey)[\"']?\s*[:=>]\s*[\"']?[A-Za-z0-9/+]{12,}([^A-Za-z0-9/+.(]|\.[^A-Za-z_]|\.?$)"
  # 2026-10-09:上一条只认 12 位以上,库 / Redis 共用的 7 位口令一直漏网。XML 口令属性不论长短,
  # 只要不是 ${...} 占位符(shell heredoc 里转义成 \${...} 的也算)或空值就报。
  "XML 口令属性(任意长度)|(name=\"(password|passWord)\" value=|[^A-Za-z](password|passWord)=)\"[^\"\$\\ ][^\"]{3,}\""
  # 2026-10-28:上一条只认参数名正好是 password,conf/system.xml 的 sms_password、notifier.….sender.password 漏网
  "XML 口令类参数(xxx_password / xxx.secret)|name=\"[A-Za-z0-9_.-]+[._-]([Pp]assword|passWord|[Pp]asswd|[Ss]ecret)\" value=\"[^\"\$\\ ][^\"]{3,}\""
  # 2026-10-28(口令外置收尾):前几条只认「password=」形状,连接串里夹带的口令一直漏网 ——
  # smartfield plates/src 的 cx_Oracle.connect('用户/口令@主机/服务')、测试里的
  # DriverManager.getConnection(URL, "用户", "口令")、以及 scheme://用户:口令@主机 都是这么进的库。
  # 口令位置是 ${…} / $VAR / 变量名(不带引号) / 文档里的 *** / <口令> 的不报。
  "连接串内嵌口令(用户/口令@主机)|(connect|makedsn|create_engine)\(\s*['\"][A-Za-z0-9_.-]+/[^'\"@[:space:]\$]{3,}@"
  "JDBC getConnection 写死口令|getConnection\([^,()]+,\s*\"[^\"]*\",\s*\"[^\"\$][^\"]*\"\s*\)"
  "URL 内嵌口令(scheme://用户:口令@)|[A-Za-z][A-Za-z0-9+.-]*://[A-Za-z0-9_.%-]+:[^@/[:space:]\"'\$<{}*]{3,}@"
)

# 白名单：.scan-secrets-allow（扫描目录根下的；没有就找该目录所在 git 仓库根下的）+ --allow 给的文件
ALLOW=()   # 元素：根（绝对路径）US glob US 规则 US ERE（US = \x1f；--allow 的根为空 = 相对各扫描目录）
US=$'\x1f'   # 不能用 TAB：TAB 是 IFS 空白，read 会吞掉开头的空字段（根为空时整行错位）
load_allow() {   # $1 文件  $2 根（绝对路径，可空）
  local line glob rule re
  while IFS= read -r line || [ -n "$line" ]; do
    line="${line%%#*}"; line="${line%"${line##*[![:space:]]}"}"
    [ -z "$line" ] && continue
    glob="${line%%|*}"; rule=""; re=""
    if [ "$glob" != "$line" ]; then
      rule="${line#*|}"
      if [ "${rule#*|}" != "$rule" ]; then re="${rule#*|}"; rule="${rule%%|*}"; fi
    fi
    ALLOW+=("$2$US$glob$US${rule:-*}$US$re")
  done < "$1"
}
for f in "${ALLOW_FILES[@]+"${ALLOW_FILES[@]}"}"; do load_allow "$f" ""; done
declare -A SEEN_ALLOW=()
for t in "${TARGETS[@]}"; do
  [ -d "$t" ] || continue
  r="$(cd "$t" && pwd -P)"
  [ -f "$r/.scan-secrets-allow" ] || r="$(git -C "$t" rev-parse --show-toplevel 2>/dev/null || true)"
  if [ -n "$r" ] && [ -f "$r/.scan-secrets-allow" ] && [ -z "${SEEN_ALLOW[$r]:-}" ]; then
    SEEN_ALLOW[$r]=1; load_allow "$r/.scan-secrets-allow" "$r"
  fi
done
ABS_TARGETS=()
for t in "${TARGETS[@]}"; do [ -d "$t" ] && ABS_TARGETS+=("$(cd "$t" && pwd -P)"); done

allowed() {   # $1 命中的文件路径（grep 输出的样子） $2 行号 $3 规则说明
  local e root glob rule re rel t content abs
  [ ${#ALLOW[@]} -eq 0 ] && return 1
  abs="$(cd "$(dirname "$1")" && pwd -P)/$(basename "$1")"
  for e in "${ALLOW[@]}"; do
    IFS="$US" read -r root glob rule re <<< "$e"
    [ "$rule" = "*" ] || [ "$rule" = "$3" ] || continue
    rel=""
    if [ -n "$root" ]; then
      [ "${abs#"$root"/}" != "$abs" ] && rel="${abs#"$root"/}"
    else
      for t in "${ABS_TARGETS[@]+"${ABS_TARGETS[@]}"}"; do
        [ "${abs#"$t"/}" != "$abs" ] && { rel="${abs#"$t"/}"; break; }
      done
    fi
    [ -n "$rel" ] || continue
    # shellcheck disable=SC2053  # glob 本来就要按模式匹配
    [[ "$rel" == $glob ]] || continue
    if [ -n "$re" ]; then
      content="$(sed -n "${2}p" "$1")"
      printf '%s\n' "$content" | grep -qE -e "$re" || continue
    fi
    return 0
  done
  return 1
}

found=0; waived=0
for rule in "${RULES[@]}"; do
  desc="${rule%%|*}"
  re="${rule#*|}"
  hits=$(grep -rInE -o \
           --exclude-dir=node_modules --exclude-dir=target --exclude-dir=dist --exclude-dir=.git \
           --exclude-dir='*.bak*' --exclude='*.bak*' --exclude='scan-secrets.sh' \
           -e "$re" "${TARGETS[@]}" 2>/dev/null | cut -d: -f1,2 | sort -u)
  [ -z "$hits" ] && continue
  out=""
  while IFS= read -r h; do
    f="${h%:*}"; l="${h##*:}"
    if allowed "$f" "$l" "$desc"; then waived=$((waived + 1)); continue; fi
    out+="    $h"$'\n'
  done <<< "$hits"
  if [ -n "$out" ]; then
    found=1
    echo "✗ $desc"
    # 只打印文件和行号，不打印密钥本身
    printf '%s' "$out"
  fi
done

# 备份文件 / 目录单独提示：它们往往保留着整改前的密钥，不能进入发布包（不扫描，也不判红）
bak=$(find "${TARGETS[@]}" -name '*.bak*' -not -path '*/node_modules/*' -prune 2>/dev/null)
if [ -n "$bak" ]; then
  echo "⚠ 以下备份文件可能含旧密钥，打包时必须排除："
  echo "$bak" | sed 's/^/    /'
fi

[ $waived -gt 0 ] && echo "（白名单放过 $waived 处）"
if [ $found -eq 0 ]; then
  echo "✓ 未发现疑似密钥"
fi
exit $found
