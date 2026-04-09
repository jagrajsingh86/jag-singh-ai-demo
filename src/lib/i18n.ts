import type { Language } from "@/lib/types";

export interface I18nBundle {
  tabs: { portfolio: string; loadUrl: string; compare: string; leadInbox: string };
  header: { tagline: string; live: string };
  portfolio: { title: string; subtitle: string };
  chat: {
    placeholder: string;
    suggested: string[];
    welcome: (address: string) => string;
    bookedTitle: string;
    bookedSubtitle: string;
    poweredBy: string;
    thinking: string;
    errorRetry: string;
    conciergeLabel: string;
  };
  compare: {
    title: string;
    subtitle: string;
    selectPrompt: string;
    startCompare: string;
    exit: string;
    sharedPlaceholder: string;
    suggested: string[];
  };
  leadInbox: {
    title: string;
    subtitle: string;
    refresh: string;
    empty: string;
    banner: string;
    cols: { capturedAt: string; name: string; mobile: string; email: string; property: string };
  };
  loadUrl: {
    title: string;
    subtitle: string;
  };
  language: { label: string };
}

const en: I18nBundle = {
  tabs: { portfolio: "Portfolio", loadUrl: "Load from URL", compare: "Compare", leadInbox: "Lead Inbox" },
  header: { tagline: "PRIVATE REAL ESTATE INTELLIGENCE", live: "LIVE" },
  portfolio: {
    title: "Property Portfolio",
    subtitle:
      "Each tile is a private AI concierge trained on its property — click any to start a conversation. In production this connects to your CRM or MLS database.",
  },
  chat: {
    placeholder: "Ask about the property...",
    suggested: [
      "Does the kitchen have gas cooking?",
      "What schools are nearby?",
      "Tell me about the outdoor area",
      "What's the price guide?",
    ],
    welcome: (address) =>
      `G'day! I'm the AI Property Concierge for **${address}**. Ask me anything — schools, features, the kitchen, the outdoor area — I know this property inside out.`,
    bookedTitle: "Inspection Booked",
    bookedSubtitle: "Jag will be in touch to confirm your priority viewing",
    poweredBy: "Powered by Jag Singh AI — Private Real Estate Intelligence",
    thinking: "Reviewing property details...",
    errorRetry: "I apologise — I'm having a moment. Could you try that question again?",
    conciergeLabel: "Property Concierge",
  },
  compare: {
    title: "Compare Properties",
    subtitle: "Select two properties and ask one question to see side-by-side answers from both AI concierges.",
    selectPrompt: "Select 2 properties to begin",
    startCompare: "Start Comparison",
    exit: "Exit comparison",
    sharedPlaceholder: "Ask both properties at once...",
    suggested: [
      "Which is better for a family with young kids?",
      "Compare the outdoor space",
      "Which has better schools nearby?",
      "Which is better value?",
    ],
  },
  leadInbox: {
    title: "Lead Inbox",
    subtitle: "Leads captured by every property concierge in this demo.",
    refresh: "Refresh",
    empty: "No leads captured yet. Book an inspection from any property chat to see one appear here.",
    banner:
      "Demo only — leads are stored in memory and reset on server restart. In production this connects to your CRM (HubSpot, Salesforce, etc).",
    cols: { capturedAt: "Captured", name: "Name", mobile: "Mobile", email: "Email", property: "Property" },
  },
  loadUrl: {
    title: "Load from URL",
    subtitle:
      "Paste a property listing URL — we'll attempt to extract details and let you chat with the AI about it. In production this is replaced with a direct CRM/MLS API call.",
  },
  language: { label: "Language" },
};

const zh: I18nBundle = {
  tabs: { portfolio: "房源组合", loadUrl: "从链接加载", compare: "对比", leadInbox: "潜在客户" },
  header: { tagline: "私有房地产智能", live: "在线" },
  portfolio: {
    title: "房源组合",
    subtitle: "每个卡片都是一个为该房源训练的私有 AI 顾问 — 点击任意房源即可开始对话。生产环境中将直接连接您的 CRM 或 MLS 数据库。",
  },
  chat: {
    placeholder: "询问该房源的任何问题...",
    suggested: ["厨房有燃气灶吗？", "附近有哪些学校？", "介绍一下户外空间", "价格指导是多少？"],
    welcome: (address) =>
      `你好！我是 **${address}** 的 AI 房产顾问。无论是学校、设施、厨房还是户外区域，请尽管问我，我对这套房子了如指掌。`,
    bookedTitle: "看房已预约",
    bookedSubtitle: "Jag 将与您联系确认优先看房时间",
    poweredBy: "由 Jag Singh AI 提供 — 私有房地产智能",
    thinking: "正在查阅房源资料...",
    errorRetry: "抱歉 — 我刚才走神了，能再问一次吗？",
    conciergeLabel: "房产顾问",
  },
  compare: {
    title: "房源对比",
    subtitle: "选择两套房源并提出一个问题，即可看到两位 AI 顾问的并列回答。",
    selectPrompt: "请选择 2 套房源开始对比",
    startCompare: "开始对比",
    exit: "退出对比",
    sharedPlaceholder: "向两套房源同时提问...",
    suggested: ["哪一套更适合有小孩的家庭？", "对比一下户外空间", "哪一套附近的学校更好？", "哪一套更超值？"],
  },
  leadInbox: {
    title: "潜在客户",
    subtitle: "本演示中所有房产顾问捕获的潜在客户。",
    refresh: "刷新",
    empty: "暂无潜在客户。从任意房源对话中预约看房后，将在此显示。",
    banner: "仅限演示 — 客户数据存于内存中，服务器重启后会重置。生产环境中将连接您的 CRM（HubSpot、Salesforce 等）。",
    cols: { capturedAt: "时间", name: "姓名", mobile: "手机", email: "邮箱", property: "房源" },
  },
  loadUrl: {
    title: "从链接加载",
    subtitle: "粘贴一个房源链接 — 我们将尝试提取详情并让您与 AI 对话。生产环境中将替换为直接的 CRM/MLS API 调用。",
  },
  language: { label: "语言" },
};

const hi: I18nBundle = {
  tabs: { portfolio: "पोर्टफ़ोलियो", loadUrl: "URL से लोड करें", compare: "तुलना", leadInbox: "लीड इनबॉक्स" },
  header: { tagline: "प्राइवेट रियल एस्टेट इंटेलिजेंस", live: "लाइव" },
  portfolio: {
    title: "प्रॉपर्टी पोर्टफ़ोलियो",
    subtitle:
      "हर टाइल एक प्राइवेट AI कंसीयज है जो उस प्रॉपर्टी पर ट्रेन्ड है — किसी पर भी क्लिक करें और बातचीत शुरू करें। प्रोडक्शन में यह आपके CRM या MLS डेटाबेस से जुड़ता है।",
  },
  chat: {
    placeholder: "प्रॉपर्टी के बारे में पूछें...",
    suggested: [
      "क्या किचन में गैस कुकिंग है?",
      "आसपास कौन से स्कूल हैं?",
      "बाहर के एरिया के बारे में बताइए",
      "प्राइस गाइड क्या है?",
    ],
    welcome: (address) =>
      `नमस्ते! मैं **${address}** का AI प्रॉपर्टी कंसीयज हूँ। स्कूल, सुविधाएँ, किचन, बाहरी क्षेत्र — कुछ भी पूछें, मुझे यह प्रॉपर्टी अच्छी तरह से पता है।`,
    bookedTitle: "इंस्पेक्शन बुक हो गया",
    bookedSubtitle: "Jag आपकी प्राथमिकता विज़िट कन्फ़र्म करने के लिए संपर्क करेंगे",
    poweredBy: "Jag Singh AI द्वारा संचालित — प्राइवेट रियल एस्टेट इंटेलिजेंस",
    thinking: "प्रॉपर्टी की जानकारी देख रहा हूँ...",
    errorRetry: "माफ़ कीजिए — एक पल के लिए रुकावट आई। क्या आप वही सवाल फिर से पूछ सकते हैं?",
    conciergeLabel: "प्रॉपर्टी कंसीयज",
  },
  compare: {
    title: "प्रॉपर्टीज़ की तुलना",
    subtitle: "दो प्रॉपर्टीज़ चुनें और एक सवाल पूछें — दोनों AI कंसीयज से साथ-साथ जवाब देखें।",
    selectPrompt: "तुलना शुरू करने के लिए 2 प्रॉपर्टीज़ चुनें",
    startCompare: "तुलना शुरू करें",
    exit: "तुलना से बाहर निकलें",
    sharedPlaceholder: "दोनों प्रॉपर्टीज़ से एक साथ पूछें...",
    suggested: [
      "छोटे बच्चों वाले परिवार के लिए कौन सी बेहतर है?",
      "बाहरी जगह की तुलना करें",
      "किसके पास बेहतर स्कूल हैं?",
      "कौन सी ज़्यादा वैल्यू देती है?",
    ],
  },
  leadInbox: {
    title: "लीड इनबॉक्स",
    subtitle: "इस डेमो में हर प्रॉपर्टी कंसीयज द्वारा कैप्चर किए गए लीड्स।",
    refresh: "रिफ़्रेश",
    empty: "अभी तक कोई लीड कैप्चर नहीं हुआ। किसी भी प्रॉपर्टी चैट से इंस्पेक्शन बुक करें।",
    banner:
      "केवल डेमो — लीड्स मेमोरी में स्टोर हैं और सर्वर रीस्टार्ट पर रीसेट हो जाते हैं। प्रोडक्शन में यह आपके CRM से जुड़ेगा।",
    cols: { capturedAt: "कब", name: "नाम", mobile: "मोबाइल", email: "ईमेल", property: "प्रॉपर्टी" },
  },
  loadUrl: {
    title: "URL से लोड करें",
    subtitle:
      "एक प्रॉपर्टी लिस्टिंग URL पेस्ट करें — हम विवरण निकालने का प्रयास करेंगे। प्रोडक्शन में इसे सीधे CRM/MLS API कॉल से बदला जाएगा।",
  },
  language: { label: "भाषा" },
};

export const STRINGS: Record<Language, I18nBundle> = { en, zh, hi };

export function t(language: Language): I18nBundle {
  return STRINGS[language] ?? STRINGS.en;
}
