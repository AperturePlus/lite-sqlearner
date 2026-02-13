export type AppLocale = "zh-CN" | "en-US";
export type LanguagePreference = "auto" | AppLocale;

type MessageNode = {
  [key: string]: string | MessageNode;
};

const messages: Record<AppLocale, MessageNode> = {
  "zh-CN": {
    app: {
      menu: {
        learn: "学习",
        levels: "关卡",
        playground: "广场",
      },
      theme: {
        dark: "深色",
        light: "浅色",
      },
      language: {
        auto: "自动",
        zhCN: "简体中文",
        enUS: "English",
      },
      footer: "Lite-SQLearner - SQL 自学网站 ©{year}",
      levelType: {
        main: "主线",
        custom: "实战",
      },
    },
    common: {
      levelUnit: "关",
    },
    index: {
      sidebar: {
        title: "题目列表",
        mainGroup: "主线关卡",
        customGroup: "自定义关卡",
      },
      collapse: {
        result: "查看执行结果",
        hint: "查看提示",
        ddl: "查看建表语句",
        answer: "查看答案",
      },
    },
    levels: {
      page: {
        title: "关卡登峰图",
        description: "主线沿山脊攀登，支线如营地分布。选好下一站，继续冲顶。",
      },
      section: {
        main: "主线攀登路线",
        mainSubtitle: "从山脚到峰顶，按路线逐步提升 SQL 能力",
        custom: "自定义支线",
        customSubtitle: "根据题材选择实战营地，补齐你的技能树",
      },
      meta: {
        altitude: "海拔 {value}m",
      },
      marker: {
        peak: "峰顶 · Level {level}",
        base: "山脚 · Level 1",
      },
      difficulty: {
        easy: "简单",
        medium: "中等",
        hard: "困难",
        mixed: "综合",
      },
    },
    playground: {
      title: "请输入任意 SQL 语句，尽情玩耍~",
      history: "执行历史",
      emptyHistory: "暂无执行历史",
    },
    question: {
      prev: "上一关",
      next: "下一关",
      win: "恭喜通关",
      loadFailed: "关卡加载失败",
      winAlert: "恭喜通关！",
    },
    editor: {
      run: "运行",
      format: "格式化",
      reset: "重置",
      placeholder: "-- 请在此处输入 SQL",
      error: "语句错误，{message}",
    },
    result: {
      title: "执行结果",
      errorPrefix: "❌ 语句错误:",
      status: {
        default: "未执行",
        error: "❌ 错误",
        success: "✅ 正确",
        executionDefault: "未执行",
        executionError: "❌ 执行失败",
        executionSuccess: "✅ 执行成功",
      },
    },
    ai: {
      sidebar: {
        trigger: "AI助手",
        title: "🤖 AI 助手",
        settings: "设置",
        noConfigTitle: "未配置 AI 助手",
        noConfigDescription: "需要配置 API Key 才能使用 AI 助手功能",
        configNow: "立即配置",
        emptyTitle: "有什么 SQL 问题需要帮助吗？",
        emptyHint: "点击下方快捷按钮或直接输入问题",
        applySql: "✨ 应用此 SQL",
        thinking: "思考中...",
        quickExplainQuestion: "📖 解释题目",
        quickAnalyzeSql: "🔍 分析SQL",
        quickGetHint: "💡 获取提示",
        quickFixSql: "🔧 修正我的SQL",
        quickAnalyzeError: "⚠️ 分析错误",
        quickClear: "🗑️ 清空",
        inputPlaceholder: "输入你的问题...",
        send: "发送",
        sendHint: "按 Ctrl+Enter 发送",
        appliedSql: "已应用 SQL 到编辑器",
        configFirst: "请先配置 AI 助手",
        callFailed: "AI 调用失败",
        sendFailed: "发送失败：{message}",
      },
      prompts: {
        explainQuestion: "请解释一下当前题目的要求",
        analyzeSql: "请帮我分析一下这个 SQL 语句：\n```sql\n{sql}\n```",
        getHint: "这个题目应该怎么写 SQL？请给我一些提示，不要直接给出答案",
        fixSql: "我的 SQL 查询结果不正确，请帮我分析原因并给出修正建议",
        analyzeError: "我的 SQL 执行出错了，请帮我分析错误原因：{error}",
      },
      systemPrompt: {
        role: "你是一个 SQL 学习助手，专门帮助用户学习和理解 SQL。使用简洁明了的语言回答问题，适当使用代码示例。",
        question: "当前题目内容：",
        schema: "数据库表结构（建表语句）：",
        userSql: "用户当前编写的 SQL：",
        userResult: "用户 SQL 的执行结果：",
        answerResult: "正确答案的执行结果：",
        error: "执行错误信息：",
        mismatch: "注意：用户的查询结果与正确答案不一致，请帮助分析差异。",
      },
      config: {
        title: "AI 助手配置",
        provider: "API 格式",
        baseUrl: "Base URL",
        baseUrlPlaceholder: "可选，用于自定义 API 端点",
        apiKey: "API Key",
        apiKeyPlaceholder: "请输入 API Key",
        model: "模型",
        modelPlaceholder: "选择或输入模型名称",
        fetchModels: "获取模型列表",
        testConnection: "测试连接",
        inputApiKeyFirst: "请先输入 API Key",
        fetchModelsSuccess: "成功获取 {count} 个模型",
        noModelsFetched: "未获取到模型列表，请检查配置或手动输入",
        fetchModelsFailed: "获取模型列表失败，请手动输入",
        connectionSuccess: "连接成功！",
        testSuccess: "连接测试成功！",
        connectionFailed: "连接失败",
        testFailed: "连接测试失败",
        unknownError: "未知错误",
        saveApiKeyFirst: "请输入 API Key",
        saved: "AI 配置已保存！",
      },
    },
    level: {
      englishFallbackTitle: "英文关卡内容准备中",
      englishFallbackBody:
        "该关卡暂未提供完整英文说明。你仍可结合建表语句、执行结果和提示完成练习。",
      challengeGoal: "目标",
      challengeHint: "提示",
      challengeNotes: "说明",
      challengeNotesBody:
        "使用右侧的运行结果、建表语句和答案校验来迭代你的 SQL。",
    },
  },
  "en-US": {
    app: {
      menu: {
        learn: "Learn",
        levels: "Levels",
        playground: "Playground",
      },
      theme: {
        dark: "Dark",
        light: "Light",
      },
      language: {
        auto: "Auto",
        zhCN: "Simplified Chinese",
        enUS: "English",
      },
      footer: "Lite-SQLearner - SQL self-learning app ©{year}",
      levelType: {
        main: "Main",
        custom: "Practice",
      },
    },
    common: {
      levelUnit: "levels",
    },
    index: {
      sidebar: {
        title: "Challenge List",
        mainGroup: "Main Levels",
        customGroup: "Custom Levels",
      },
      collapse: {
        result: "View Execution Result",
        hint: "View Hint",
        ddl: "View Schema SQL",
        answer: "View Answer",
      },
    },
    levels: {
      page: {
        title: "SQL Climbing Map",
        description:
          "Climb the main ridge level by level, and use side routes as practice camps.",
      },
      section: {
        main: "Main Route",
        mainSubtitle:
          "Move from basecamp to summit and build SQL skills step by step",
        custom: "Custom Branches",
        customSubtitle:
          "Pick a scenario-focused camp to strengthen your SQL skill tree",
      },
      meta: {
        altitude: "Altitude {value}m",
      },
      marker: {
        peak: "Peak · Level {level}",
        base: "Basecamp · Level 1",
      },
      difficulty: {
        easy: "Easy",
        medium: "Medium",
        hard: "Hard",
        mixed: "Mixed",
      },
    },
    playground: {
      title: "Run any SQL you want and explore freely.",
      history: "Execution History",
      emptyHistory: "No execution history yet",
    },
    question: {
      prev: "Previous",
      next: "Next",
      win: "Finish",
      loadFailed: "Failed to load level",
      winAlert: "Congratulations! You finished all main levels.",
    },
    editor: {
      run: "Run",
      format: "Format",
      reset: "Reset",
      placeholder: "-- Write your SQL here",
      error: "SQL error: {message}",
    },
    result: {
      title: "Execution Result",
      errorPrefix: "❌ SQL error: ",
      status: {
        default: "Not Run",
        error: "❌ Incorrect",
        success: "✅ Correct",
        executionDefault: "Not Run",
        executionError: "❌ Execution Failed",
        executionSuccess: "✅ Execution Succeeded",
      },
    },
    ai: {
      sidebar: {
        trigger: "AI Helper",
        title: "🤖 AI Assistant",
        settings: "Settings",
        noConfigTitle: "AI Assistant Not Configured",
        noConfigDescription: "Configure an API key before using AI features",
        configNow: "Configure Now",
        emptyTitle: "Need help with your SQL?",
        emptyHint: "Use a quick action below or type your question",
        applySql: "✨ Apply this SQL",
        thinking: "Thinking...",
        quickExplainQuestion: "📖 Explain Task",
        quickAnalyzeSql: "🔍 Analyze SQL",
        quickGetHint: "💡 Get Hints",
        quickFixSql: "🔧 Fix My SQL",
        quickAnalyzeError: "⚠️ Analyze Error",
        quickClear: "🗑️ Clear",
        inputPlaceholder: "Type your question...",
        send: "Send",
        sendHint: "Press Ctrl+Enter to send",
        appliedSql: "Applied SQL to editor",
        configFirst: "Please configure AI assistant first",
        callFailed: "AI call failed",
        sendFailed: "Send failed: {message}",
      },
      prompts: {
        explainQuestion: "Please explain the current challenge requirements.",
        analyzeSql: "Please analyze this SQL query:\n```sql\n{sql}\n```",
        getHint:
          "How should I solve this challenge with SQL? Give hints without revealing the final answer.",
        fixSql:
          "My SQL result is incorrect. Please analyze why and suggest corrections.",
        analyzeError:
          "My SQL execution failed. Please analyze this error: {error}",
      },
      systemPrompt: {
        role: "You are an SQL learning assistant. Help users understand and improve SQL with concise explanations and practical examples.",
        question: "Current challenge content:",
        schema: "Database schema (DDL):",
        userSql: "User SQL:",
        userResult: "Execution result of user SQL:",
        answerResult: "Execution result of reference answer:",
        error: "Execution error:",
        mismatch:
          "Note: The user query result does not match the reference result. Please explain the differences.",
      },
      config: {
        title: "AI Assistant Configuration",
        provider: "API Format",
        baseUrl: "Base URL",
        baseUrlPlaceholder: "Optional. Use for custom API endpoint",
        apiKey: "API Key",
        apiKeyPlaceholder: "Enter API Key",
        model: "Model",
        modelPlaceholder: "Select or type a model name",
        fetchModels: "Fetch model list",
        testConnection: "Test Connection",
        inputApiKeyFirst: "Please enter API key first",
        fetchModelsSuccess: "Fetched {count} models successfully",
        noModelsFetched:
          "No models fetched. Check configuration or input model manually",
        fetchModelsFailed: "Failed to fetch model list, please input manually",
        connectionSuccess: "Connection successful!",
        testSuccess: "Connection test passed!",
        connectionFailed: "Connection failed",
        testFailed: "Connection test failed",
        unknownError: "Unknown error",
        saveApiKeyFirst: "Please enter API key",
        saved: "AI configuration saved",
      },
    },
    level: {
      englishFallbackTitle: "English content in progress",
      englishFallbackBody:
        "This level does not yet have a full English walkthrough. You can still solve it using schema SQL, hints, and result comparison.",
      challengeGoal: "Goal",
      challengeHint: "Hint",
      challengeNotes: "Notes",
      challengeNotesBody:
        "Use execution result, schema SQL, and answer checking to iterate your query.",
    },
  },
};

const getByPath = (node: MessageNode, key: string): string | undefined => {
  const parts = key.split(".");
  let current: string | MessageNode = node;
  for (const part of parts) {
    if (typeof current === "string") {
      return undefined;
    }
    current = current[part] as string | MessageNode;
    if (current == null) {
      return undefined;
    }
  }
  return typeof current === "string" ? current : undefined;
};

export const normalizeLocale = (locale?: string | null): AppLocale => {
  if (!locale) {
    return "zh-CN";
  }
  const lowerLocale = locale.toLowerCase();
  if (lowerLocale.startsWith("zh")) {
    return "zh-CN";
  }
  return "en-US";
};

export const t = (
  locale: AppLocale,
  key: string,
  params?: Record<string, string | number>
): string => {
  const template =
    getByPath(messages[locale], key) ??
    getByPath(messages["zh-CN"], key) ??
    key;
  if (!params) {
    return template;
  }
  return template.replace(/\{(\w+)\}/g, (_, token: string) => {
    const value = params[token];
    return value == null ? `{${token}}` : String(value);
  });
};
