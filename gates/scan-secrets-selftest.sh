#!/usr/bin/env bash
# scan-secrets.sh 的区分力自检：埋几处假密钥必须判红、几处已知误报形状必须放过、白名单只放过登记的那一行、
# 输出里不出现密钥本身。CI 每次先跑它再扫仓库 —— 防止有人把正则 / 白名单改得「永远绿」而没人发现。
#
# 假密钥在运行时拼出来，本文件里不出现任何能被规则命中的完整字符串（否则它自己就成了命中项）。
# 用法：gates/scan-secrets-selftest.sh      退出码 0 = 自检通过
set -uo pipefail

SCAN="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/scan-secrets.sh"
T="$(mktemp -d)"; trap 'rm -rf "$T"' EXIT
fails=0
rep() { printf "%${2}s" "" | tr ' ' "$1"; }   # rep 字符 个数
check() {   # check 说明 期望退出码 目录 [scan 额外参数...]
  local desc="$1" want="$2" dir="$3"; shift 3
  local out rc
  out="$(bash "$SCAN" --no-gitleaks "$@" "$dir" 2>&1)"; rc=$?
  if [ "$rc" -ne "$want" ]; then
    echo "✗ $desc：退出码 $rc，应为 $want"; echo "$out" | sed 's/^/    /'; fails=$((fails + 1))
  elif grep -qF -e "$SECRET_SK" -e "$SECRET_PW" <<< "$out"; then
    echo "✗ $desc：输出里出现了密钥本身"; fails=$((fails + 1))
  else
    echo "✓ $desc"
  fi
}

SECRET_SK="sk""-$(rep Q 32)"
SECRET_PW="Zq7$(rep x 13)"

mkdir -p "$T/sk" "$T/prop" "$T/xml" "$T/code" "$T/ph" "$T/bak/x.bak.1" "$T/allow" "$T/allow2"
echo "key = \"$SECRET_SK\"" > "$T/sk/a.java"
echo "pass""word=$SECRET_PW" > "$T/prop/a.properties"
printf '<init-param name="pass''word" value="%s"/>\n' "short7x" > "$T/xml/a.xml"
cat > "$T/code/A.java" <<'EOF'
cloned.password = secretValueProvider.expandValue(cloned.password, lookupContext);
String password = decryptPasswordFromStore(password);
EOF
printf '<init-param name="pass''word" value="\\${DOTOS_PG_PASSWORD}"/>\n' > "$T/ph/a.sh"
echo "pass""word=$SECRET_PW" > "$T/bak/x.bak.1/old.properties"

check "OpenAI 风格 key 判红" 1 "$T/sk"
check "properties 明文口令判红" 1 "$T/prop"
check "XML 短口令判红" 1 "$T/xml"
check "代码里的 password = 标识符.方法(…) 放过" 0 "$T/code"
check "\\\${…} 占位符放过" 0 "$T/ph"
check "*.bak* 目录不扫（只提示）" 0 "$T/bak"
# compose 默认值：*_SK / *_SK_* 判红；_SKIP 之类只是前缀相同的变量放过（2026-10-14 CI 误报 tools/gpu-test）
mkdir -p "$T/cmp" "$T/skip"
V="DEEPSEEK""_SK"; echo "  - $V=\${$V:-$SECRET_PW}" > "$T/cmp/docker-compose.yml"
echo 'if [ "${E8_SKIP_FACIES:-0}" = 1 ]; then :; fi' > "$T/skip/a.sh"
check "compose 里 *_SK 带默认值判红" 1 "$T/cmp"
check "_SKIP_* 带默认值放过" 0 "$T/skip"

# 连接串里夹带的口令（2026-10-28：smartfield plates/src、测试类就是这么漏的）：埋点判红，取环境变量的写法放过
mkdir -p "$T/ora" "$T/jdbc" "$T/url" "$T/connok"
echo "con = cx_Oracle.connect('paleo_gis/$SECRET_PW@192.0.2.10/oramap')" > "$T/ora/a.py"
Q='"'; echo "return DriverManager.getConnection(URL, ${Q}smartfield${Q}, ${Q}$SECRET_PW${Q});" > "$T/jdbc/A.java"
echo "DSN=\"postgresql://smartfield:$SECRET_PW@192.0.2.10:5432/gpra\"" > "$T/url/a.sh"
cat > "$T/connok/a.py" <<'EOF'
con = cx_Oracle.connect(user, os.environ["DOTOS_PG_PASSWORD"], dsn)
con2 = cx_Oracle.connect(f"{user}/{pw}@{dsn}")
c = DriverManager.getConnection(url, user, System.getenv("DOTOS_PG_PASSWORD"));
c = DriverManager.getConnection(URL, "smartfield", "${DOTOS_PG_PASSWORD}");
u = "postgresql://smartfield:${DOTOS_PG_PASSWORD}@host:5432/gpra"
r = "git@github.com:dotos1/conf.git"; s = "https://github.com/dotos1/conf"
psql "postgresql://ucos:***@192.0.2.25:5432/ucos"; psql "postgresql://ucos:<口令>@192.0.2.25/ucos"
EOF
mkdir -p "$T/xmlpre" "$T/xmlpreok"
printf '<init-param name="sms_pass''word" value="%s"/>\n' "$SECRET_PW" > "$T/xmlpre/system.xml"
printf '<init-param name="sms_pass''word" value="${DOTOS_SMS_PASSWORD}"/>\n' > "$T/xmlpreok/system.xml"
check "XML xxx_password 参数判红" 1 "$T/xmlpre"
check "XML xxx_password 占位符放过" 0 "$T/xmlpreok"
check "cx_Oracle 用户/口令@主机 判红" 1 "$T/ora"
check "getConnection 写死口令 判红" 1 "$T/jdbc"
check "scheme://用户:口令@ 判红" 1 "$T/url"
check "连接串取变量 / 占位符 / git 地址放过" 0 "$T/connok"

# 白名单：带 ERE 的条目只放过匹配那一行；同一文件另一行真口令照样红
printf '<init-param name="pass''word" value="__LEGACY_PW__"/>\n' > "$T/allow/p.py"
echo 'p.py|XML 口令属性(任意长度)|"__[A-Z_]+__"' > "$T/allow/.scan-secrets-allow"
check "白名单（目录根 .scan-secrets-allow）放过占位符行" 0 "$T/allow"
printf '<init-param name="pass''word" value="realpw9"/>\n' >> "$T/allow/p.py"
check "白名单 ERE 不匹配的新口令行照样判红" 1 "$T/allow"
cp "$T/sk/a.java" "$T/allow2/a.java"
echo '*.java|Google API Key' > "$T/wrong-rule.allow"
check "白名单规则名不对不放过" 1 "$T/allow2" --allow "$T/wrong-rule.allow"
echo '*.java|*' > "$T/any-rule.allow"
check "--allow 文件 + 规则 * 放过" 0 "$T/allow2" --allow "$T/any-rule.allow"

if [ $fails -gt 0 ]; then echo "scan-secrets 自检失败 $fails 项"; exit 1; fi
echo "scan-secrets 自检通过"
