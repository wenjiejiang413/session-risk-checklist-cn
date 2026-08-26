# Session Risk Checklist CN

一份面向中文用户的第三方服务凭证与交付风险核验清单。项目提供结构化规则、离线评分器和命令行工具，帮助用户在付款或授权前识别明显风险。

它不验证商家身份、资金来源或实际履约，也不是任何平台的安全认证。

## 为什么做这个项目

第三方服务常用“免密操作”“远程协助”或“代配置”等表述降低用户警惕，但 Cookie、Session、Token、验证码和恢复码都可能代表登录状态或账号控制能力。

这份清单把风险判断拆成 7 个可以留存、复核的问题：

1. 是否索取密码、验证码、Session、Cookie、Token、恢复码或设备控制权；
2. 最终交付到哪个账号；
3. 价格、收款对象与支付方式是否写清；
4. 交付对象、时间起算点和验收标准是否写清；
5. 失败退款与成功后售后是否分别说明；
6. 是否提供独立订单号和查询入口；
7. 是否使用无法核验的绝对安全承诺。

## 快速使用

环境要求：Node.js 18 或更高版本，无第三方依赖。

```bash
npm test
node src/cli.js examples/lower-risk.json
node src/cli.js examples/critical-risk.json --json
```

输入文件只包含选项值，不需要账号、订单号、联系方式或付款信息：

```json
{
  "credentials": "no",
  "ownership": "own",
  "payment": "clear",
  "delivery": "clear",
  "aftersales": "both",
  "tracking": "yes",
  "claims": "no"
}
```

## 评分边界

| 结果 | 条件 | 含义 |
| --- | --- | --- |
| `STOP` | 命中凭证或设备控制红线 | 立即停止提交凭证或付款 |
| `HIGH_RISK` | 总分不少于 9 | 存在多项重要缺口 |
| `CHECK_FIRST` | 总分 4–8 | 先补齐信息再决定 |
| `LOWER_RISK` | 总分 0–3 | 未命中明显红线，但不等于安全认证 |

规则源文件位于 [`data/checklist.zh-CN.json`](data/checklist.zh-CN.json)，JSON Schema 位于 [`schema/checklist.schema.json`](schema/checklist.schema.json)。评分实现位于 [`src/evaluate.js`](src/evaluate.js)。

## 在线版本

不想运行命令行时，可以打开 [GitHub Pages 在线演示](https://wenjiejiang413.github.io/session-risk-checklist-cn/)。选项只在当前页面计算，不要求输入登录凭证或个人信息。

需要更完整的页面说明时，可查看维护方提供的 [MixLivo 浏览器本地风险核验工具](https://mixlivo.com/tools/gpt-daichong-risk-check?utm_source=github&utm_medium=repository&utm_campaign=session_risk_checklist&utm_content=readme)。

## 安全原则

- 不收集或上传答案；
- 不要求密码、验证码、Cookie、Session、Token 或恢复码；
- 不提供凭证导出、会话转移或绕过平台风控的方法；
- 不因低风险结果推荐某个商家；
- 规则、权重和阈值全部公开，可被审查和修改。

## 参考资料

- [OpenAI: Managing active sessions in ChatGPT](https://help.openai.com/en/articles/20001257-managing-active-sessions-in-chatgpt)
- [OpenAI: How can I keep my OpenAI accounts secure?](https://help.openai.com/en/articles/8304786-how-can-i-keep-my-openai-accounts-secure)
- [OpenAI: Account Sharing Policy](https://help.openai.com/en/articles/10471989)
- [OWASP: Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)

## 维护与披露

本项目由 MixLivo 内容组维护。MixLivo 是独立第三方，与 OpenAI 不存在隶属、代理或官方授权关系。提交 Issue 或 Pull Request 时，请勿包含账号、订单、联系方式或任何登录凭证。

## License

[MIT](LICENSE)
