Okay, here is the frontend development documentation based on the provided PRD supplement, formatted for guiding AI code generation.

---

## 前端开发文档 (v1.0)

**目标:** 本文档旨在详细描述 AI 工具套件的前端功能、交互和技术要求，作为 AI 代码生成的主要依据。

### I. AI 文本改写 (Paraphraser)

1.  **功能概述:**
    提供文本输入区域，允许用户输入文本。用户可以选择不同的改写模式（例如标准、流畅）和调整同义词强度，系统调用后端 AI 服务对文本进行改写，并在输出区域展示结果，同时提供原文和改写后文本的对比视图。

2.  **详细功能描述:**
    *   **UI 展示:**
        *   包含一个富文本编辑器 (RTE) 作为文本输入区域。
        *   包含一个只读的富文本编辑器 (RTE) 或类似区域作为文本输出区域。
        *   提供模式选择器（建议使用 Radio Button Group 或 Select Dropdown），用于切换改写模式。MVP 阶段至少包含“标准 (Standard)”和“流畅 (Fluency)”模式。
        *   提供一个滑块 (Slider) 组件，用于调整“同义词强度 (Synonym Intensity)”，范围 0 到 1。
        *   在输出区域加载新内容时，显示加载指示器（例如，覆盖在输出区域的骨架屏效果，或在区域内显示一个旋转图标 Spinner）。模式选择器本身应立即更新视觉状态。
        *   提供一个结果对比视图，MVP 阶段采用左右两栏布局（Side-by-Side），左侧为“原文 (Original)”，右侧为“改写后 (Paraphrased)”。改写后的文本块需要有视觉区分（例如轻微背景色或边框）。
        *   (Post-MVP) 在输入/输出 RTE 中支持对特定单词点击或选中时，弹出同义词建议列表 (Popover/Tooltip)。
        *   (Post-MVP) 支持句子级或单词级的差异高亮 (Diff Highlighting)。
        *   (Post-MVP) 文件上传区域，包含一个文件选择按钮和进度指示器。
    *   **交互流程:**
        *   用户在输入 RTE 中输入或粘贴文本。
        *   用户选择一个改写模式。如果输入区有文本且已有输出结果，切换模式会触发一次新的后端 API 请求。模式选择器状态立即更新，输出区显示加载状态。
        *   用户拖动“同义词强度”滑块。在滑块释放 (mouse up) 时，或在用户拖动暂停超过 500 毫秒 (debounce) 时，触发一次新的后端 API 请求，携带当前输入文本、选定模式和新的强度值。输出区显示加载状态。
        *   后端 API 返回结果后，更新输出区域的内容和结果对比视图的右侧内容。移除加载状态。
        *   如果 API 请求失败，显示错误提示（例如使用 Toast 通知）。
        *   (Post-MVP) 用户在输入/输出 RTE 中点击或选择一个单词。触发一次获取同义词的 API 请求。
        *   (Post-MVP) 显示同义词列表。用户点击其中一个同义词。该词替换 RTE 中的原词。此操作**不**自动触发改写，用户需通过模式切换或滑块调整再次触发。
        *   (Post-MVP) 用户选择文件（MVP 仅 .txt），点击上传。显示上传进度。上传完成后，显示解析和改写状态。最终结果更新到输出区。如果文件大小超限，在选择后、上传前显示警告。
    *   **逻辑功能:**
        *   维护输入文本、选定模式、同义词强度值的状态。
        *   在触发改写操作（模式切换、滑块释放/debounce）时，构建请求体，包含 `inputText`, `selectedMode`, `synonymIntensity`。
        *   调用后端 `/api/paraphrase` 接口 (POST)。
        *   管理输出区的加载状态。
        *   处理 API 成功响应，更新输出区和对比视图。
        *   处理 API 错误响应，显示用户友好的错误信息。
        *   (Post-MVP) 调用后端 `/api/synonyms?word={word}&context={sentence_optional}` 接口 (GET) 获取同义词。
        *   (Post-MVP) 实现富文本编辑器内的文本替换逻辑。
        *   (Post-MVP) 处理文件上传逻辑，与 Supabase Storage 集成（通过后端代理上传和解析）。前端需处理文件选择、大小预检、进度显示。
        *   (Post-MVP) 实现差异高亮逻辑（优先依赖后端返回的 diff 信息，若无则考虑前端库 diff-match-patch）。

3.  **数据模型（API 相关）:**
    *   请求 `/api/paraphrase` (POST):
        *   `inputText: string`
        *   `mode: string` (e.g., "standard", "fluency")
        *   `synonymIntensity: number` (0-1)
    *   响应 `/api/paraphrase`:
        *   `paraphrasedText: string`
        *   (Post-MVP) `diffInfo: object | null` (具体结构待定)
    *   (Post-MVP) 请求 `/api/synonyms` (GET):
        *   `word: string`
        *   `context?: string`
    *   (Post-MVP) 响应 `/api/synonyms`:
        *   `synonyms: string[]`

4.  **不确定的技术细节:**
    *   富文本编辑器库的具体选择 (TipTap 或 Lexical 推荐，需最终确认)。
    *   加载指示器的具体视觉样式 (骨架屏 vs Spinner)。
    *   (Post-MVP) 后端是否能提供 diff 信息及其具体格式 (不确定)。
    *   (Post-MVP) 文档解析的具体后端实现 (不确定)。

### II. AI 语法检查器 (Grammar Checker)

1.  **功能概述:**
    用户输入文本后，手动触发检查。系统调用后端 AI 服务识别文本中的拼写、语法（及未来可能的风格）错误，并在编辑器中高亮显示错误，同时提供修改建议。

2.  **详细功能描述:**
    *   **UI 展示:**
        *   包含一个富文本编辑器 (RTE) 作为文本输入区域。
        *   提供一个明确的 "检查语法 (Check Grammar)" 按钮。
        *   在 RTE 中，使用不同颜色的波浪下划线高亮识别出的错误：红色 (Spelling - MVP), 蓝色 (Grammar - MVP), 黄色 (Style/Clarity - Post-MVP)。
        *   当用户鼠标悬停 (hover) 或点击 (click) 高亮的错误时，显示一个 Tooltip 或 Popover 组件。
        *   Popover/Tooltip 中显示错误解释和修改建议（可能有一个或多个建议）。
        *   每个建议旁边提供一个 "采纳 (Accept)" 按钮。
        *   提供一个全局的 "采纳所有建议 (Accept All Suggestions)" 按钮，可能按类型分组（例如 "采纳所有拼写修改"），放置在编辑器上方或侧边栏 (Post-MVP)。
        *   (Post-MVP) 一个专门的侧边栏，列出所有检测到的错误。
    *   **交互流程:**
        *   用户在输入 RTE 中输入或粘贴文本。
        *   用户点击 "检查语法" 按钮。按钮应显示加载状态（例如禁用并显示 Spinner）。
        *   API 调用完成后，RTE 中相应的文本段被高亮。移除按钮加载状态。
        *   用户将鼠标悬停或点击某个高亮错误。显示对应的 Popover/Tooltip，包含解释和建议。
        *   用户在 Popover 中点击某个建议的 "采纳" 按钮。RTE 中的对应文本被替换为建议内容，该处高亮消失。
        *   用户点击 "采纳所有建议" 按钮。所有对应类型的错误根据其首选建议被修正，相关高亮消失。
        *   如果 API 请求失败，显示错误提示。
    *   **逻辑功能:**
        *   维护输入文本的状态。
        *   在 "检查语法" 按钮点击时，获取 RTE 的当前文本内容。
        *   调用后端语法检查 API（例如 `/api/grammar/check` - (不确定具体 endpoint name)，POST），发送文本。
        *   管理按钮的加载状态。
        *   处理 API 成功响应：接收错误列表（包含位置、类型、消息、建议）。
        *   根据返回的错误位置和类型，在 RTE 中应用相应的波浪线高亮样式。将错误信息和建议与高亮区域关联存储。
        *   实现 Popover/Tooltip 的显示逻辑，根据关联数据显示内容。
        *   实现 "采纳" 按钮逻辑：获取对应建议，使用 RTE 的 API 更新文本内容，移除该处高亮。
        *   实现 "采纳所有" 按钮逻辑：遍历存储的同类型错误，应用首选建议并更新 RTE，移除高亮。
        *   处理 API 错误响应。

3.  **数据模型（API 相关）:**
    *   请求 `/api/grammar/check` (POST - (不确定具体 endpoint name)):
        *   `text: string`
    *   响应 `/api/grammar/check`:
        *   `errors: Array<{ position_start: number, position_end: number, type: 'spelling' | 'grammar' | 'style', message: string, suggestions: string[] }>`

4.  **不确定的技术细节:**
    *   后端语法检查 API 的确切 endpoint 名称和契约。
    *   在选定 RTE 库中实现自定义波浪线高亮和关联 Popover 的具体技术方案。
    *   实时检查的实现细节 (Post-MVP，涉及 API 调用策略和性能考量)。
    *   "采纳所有建议" 按钮的具体位置和分组逻辑。

### III. AI 文本摘要器 (Summarizer)

**(优先级 Post-MVP P1/P2)**

1.  **功能概述:**
    接收用户输入的较长文本，根据用户选择的摘要模式（关键句子或段落）和长度偏好，生成文本摘要。

2.  **详细功能描述:**
    *   **UI 展示:**
        *   包含一个文本输入区域（可以是普通 `textarea` 或 RTE）。
        *   包含一个文本输出区域。
        *   提供一个滑块 (Slider) 或类似控件，用于控制摘要的长度（例如，百分比 `lengthRatio` 0.1-0.9，或目标句子数 `targetSentences`）。
        *   提供模式选择器（Tabs 或 Radio Buttons），用于切换输出模式：“关键句子 (Key Sentences)” 和 “段落 (Paragraph)”。
        *   输出区域根据选定模式调整显示格式：关键句子模式下显示为无序列表 (`<ul><li>...</li></ul>`)；段落模式下显示为普通段落 (`<p>...</p>`)。
        *   输出区域在加载时显示加载指示器。
    *   **交互流程:**
        *   用户在输入区输入或粘贴文本。
        *   用户选择摘要模式。输出区域的预期格式随之调整。
        *   用户调整长度控制滑块。在滑块释放时或拖动暂停超过 300 毫秒 (debounce) 时，触发一次新的后端 API 请求。输出区显示加载状态。
        *   API 返回结果后，根据当前选择的模式格式化并更新输出区域内容。移除加载状态。
        *   如果 API 请求失败，显示错误提示。
    *   **逻辑功能:**
        *   维护输入文本、选定模式、长度参数的状态。
        *   在触发摘要操作（滑块释放/debounce）时，构建请求体，包含 `inputText`, `outputMode` (`key_sentences` 或 `paragraph`) 以及长度参数（如 `lengthRatio` 或 `targetSentences`）。
        *   调用后端 `/api/summarize` 接口 (POST)。
        *   管理输出区的加载状态。
        *   处理 API 成功响应：根据 `outputMode` 渲染结果（如果是字符串数组则渲染为列表，如果是单字符串则渲染为段落）。
        *   处理 API 错误响应。

3.  **数据模型（API 相关）:**
    *   请求 `/api/summarize` (POST):
        *   `inputText: string`
        *   `outputMode: 'key_sentences' | 'paragraph'`
        *   `lengthParameter: number | { type: 'ratio', value: number } | { type: 'sentences', value: number }` (具体结构待定)
    *   响应 `/api/summarize`:
        *   `summary: string | string[]` (根据请求的 `outputMode` 决定类型)

4.  **不确定的技术细节:**
    *   长度控制参数的确切名称、类型和传递方式 (`lengthRatio` vs `targetSentences` vs 结构化对象)。
    *   后端 API 的确切 endpoint 和契约。

### IV. AI 引文生成器 (Citation Generator)

**(优先级 Post-MVP P2)**

1.  **功能概述:**
    允许用户通过输入 URL、DOI 等标识符自动查找文献元数据，或手动输入信息，然后生成指定格式的引文。提供文献库管理功能。

2.  **详细功能描述:**
    *   **UI 展示:**
        *   输入区域，包含一个输入框用于输入 URL/DOI/ISBN 等，以及一个 "查找 (Lookup)" 按钮。
        *   一个下拉选择器，用于选择文献来源类型（例如 Book, Journal Article, Website）。
        *   一组表单输入字段，用于手动输入文献信息（作者、标题、年份、期刊名、卷、期、页码、URL、DOI、ISBN、出版社、访问日期等）。这些字段根据所选的来源类型动态显示/隐藏。
        *   一个下拉选择器，用于选择引文格式（例如 APA, MLA, Chicago - (不确定具体支持列表)）。
        *   一个文本区域，用于显示生成的引文。
        *   一个 "保存到文献库 (Save to Library)" 按钮。
        *   查找过程中的加载指示器。
        *   查找失败或发生错误时的清晰提示信息（例如 "未找到源", "无效的 DOI/URL", "查找失败", "需要手动输入"）。
        *   (用户中心 Dashboard 内) 文献库管理界面，以表格或列表形式展示已保存的引文。提供排序（按添加日期/标题）、删除功能。 (Post-MVP) 可能包含搜索、按类型筛选、编辑功能。
    *   **交互流程:**
        *   用户选择来源类型或直接在输入框输入标识符。
        *   用户点击 "查找"。显示加载状态。
        *   如果查找成功，自动填充相关的元数据字段，并可能生成一个默认格式的引文。移除加载状态。
        *   如果查找失败或需要手动输入，显示相应提示。用户根据选择的来源类型，手动填写表单字段。
        *   表单字段应有基础的前端验证（例如必填项、年份格式、URL 格式）。
        *   用户选择一个引文格式。输出区域的引文内容随之更新（可能需要再次调用 API 或在前端处理）。
        *   用户点击 "保存到文献库"。显示保存成功的确认信息（例如 Toast）。引文被添加到用户的文献库中。
        *   在用户中心的文献库页面，用户可以查看列表，点击表头排序，点击删除按钮删除条目。
    *   **逻辑功能:**
        *   维护当前来源类型、输入的标识符、手动填写的字段值、选定的引文格式、生成的引文的状态。
        *   "查找" 逻辑：
            *   调用后端查找 API（例如 `/api/citations/lookup?type=url&value=...` 或 `?type=doi&value=...` - GET）。
            *   管理加载状态。
            *   处理成功响应：解析返回的元数据，更新表单字段状态。可能触发一次引文生成。
            *   处理失败/错误响应：显示用户友好的错误信息。
        *   手动输入逻辑：
            *   根据来源类型动态渲染表单字段。
            *   实现基础的前端输入验证。
            *   当所有必填字段满足条件后，可能触发引文生成。
        *   引文生成/更新逻辑：
            *   收集当前的元数据（来自查找或手动输入）和选定的引文格式。
            *   调用后端生成引文 API（例如 `/api/citations/generate` - POST (不确定)）。
            *   更新显示引文的区域。
            *   (不确定) 某些格式转换是否可以在前端完成，如果后端提供了足够结构化的元数据和模板。
        *   "保存到文献库" 逻辑：
            *   收集当前引文的相关数据（源元数据、生成的不同格式引文）。
            *   调用后端保存 API（例如 `/api/citations/save` - POST），关联 `user_id`。
            *   处理保存成功/失败的反馈。
        *   文献库管理逻辑 (Dashboard):
            *   调用后端 API 获取当前用户的文献列表。
            *   实现前端排序（如果 API 不直接支持）。
            *   调用后端 API 删除指定 ID 的文献条目，并在成功后更新列表 UI。

3.  **数据模型（API 相关 & 内部状态）:**
    *   内部状态: `sourceType: string`, `lookupValue: string`, `manualFields: object`, `selectedStyle: string`, `generatedCitation: string`, `metadata: object | null`
    *   请求 `/api/citations/lookup` (GET): `type: string`, `value: string`
    *   响应 `/api/citations/lookup`: (成功) `metadata: object` (包含作者、标题、年份等), (失败) `error: string`
    *   请求 `/api/citations/generate` (POST - (不确定)): `metadata: object`, `style: string`
    *   响应 `/api/citations/generate`: `formattedCitation: string`
    *   请求 `/api/citations/save` (POST): `sourceData: object`, `style: string`, `citation: string` (可能需要更完整的结构)
    *   请求 获取文献库 (GET /api/citations/library): 返回 `Array<{ id: string, title: string, sourceData: object, createdAt: timestamp, ... }>`
    *   请求 删除文献 (DELETE /api/citations/library/{id})

4.  **不确定的技术细节:**
    *   支持的引文格式的具体列表。
    *   后端 API 的确切 endpoints 和请求/响应结构（特别是 generate 和 save）。
    *   引文格式切换时，是在前端基于元数据重新格式化，还是每次都请求后端 (不确定)。
    *   手动输入时，每个来源类型的具体字段列表。
    *   文献库中存储的数据结构（是否包含预生成的各种格式引文）。

### V. AI 写作助手/联合创作者 (Co-Writer/AI Writer)

**(优先级 Post-MVP P2/P3)**

1.  **功能概述:**
    在富文本编辑器环境中，提供 AI 驱动的写作辅助功能，如句子补全、想法生成、文本改写等，以及基于模板的内容创建。

2.  **详细功能描述:**
    *   **UI 展示:**
        *   一个功能完善的富文本编辑器 (RTE) (强烈推荐 TipTap 或 Lexical)。
        *   编辑器的工具栏中包含明确的 AI 功能触发按钮（例如 "补全句子 Complete Sentence", "生成想法 Generate Ideas", "改写选中部分 Rephrase Selection"）。
        *   (Post-MVP) 支持通过输入斜杠 `/` 触发的命令菜单 (Slash Commands)。
        *   (Post-MVP) 支持在选中文本上右键显示上下文菜单，包含相关 AI 功能。
        *   提供基于模板/用例的触发器（例如，工具栏下拉菜单或单独按钮），可能伴随额外的输入框（例如 "生成关于 [输入主题] 的博客引言"）。
        *   AI 生成内容时的加载指示（例如，按钮禁用、编辑器内临时占位符）。
    *   **交互流程:**
        *   用户在 RTE 中正常写作。
        *   用户点击工具栏中的某个 AI 按钮，或选中部分文本后点击相应按钮。
        *   (Post-MVP) 用户输入 `/` 触发命令菜单，选择一个 AI 命令。
        *   (Post-MVP) 用户选中文本，右键选择一个 AI 动作。
        *   如果所选功能需要额外输入（例如博客主题），则显示一个输入框或模态框让用户输入。
        *   触发 AI 请求，显示加载状态。
        *   AI 返回生成的文本。
        *   MVP: 默认将生成的内容插入到当前光标位置。
        *   Post-MVP: 提供选项，如 "替换选中文本" 或在光标旁以内联建议形式显示，待用户接受。
    *   **逻辑功能:**
        *   初始化并配置选定的 RTE 库。
        *   为工具栏按钮（及 Post-MVP 的其他触发器）绑定事件处理器。
        *   在触发 AI 功能时：
            *   获取当前编辑器的内容、光标位置、选中的文本（如果适用）。
            *   获取触发的 AI 功能类型/命令。
            *   如果需要，获取用户的额外输入。
            *   构建请求体，发送到后端 Co-Writer API (例如 `/api/cowriter/generate` - POST)。
            *   管理加载状态。
            *   处理 API 成功响应：接收生成的文本。
            *   使用 RTE 的 API 将生成的文本插入到编辑器中（在光标处、替换选中区或作为建议）。
            *   (Post-MVP) 处理可能的流式响应 (Streaming)，逐步将内容插入编辑器。
            *   处理 API 错误响应。
        *   实现模板/用例功能：前端负责展示触发器、收集输入，并将预定义的提示和用户输入发送给后端。

3.  **数据模型（API 相关）:**
    *   请求 `/api/cowriter/generate` (POST):
        *   `contextText: string` (光标前的部分文本，或全部文本)
        *   `selection: string | null` (用户选中的文本)
        *   `command: string` (e.g., "complete_sentence", "generate_ideas", "rephrase", "blog_intro")
        *   `userInput?: object` (特定命令所需的额外输入，如 `topic: "..."`)
        *   `cursorPosition?: number`
    *   响应 `/api/cowriter/generate`:
        *   `generatedContent: string`
        *   (Post-MVP Streaming) 可能是 Event Stream。

4.  **不确定的技术细节:**
    *   MVP 阶段支持的具体 AI 功能按钮和模板列表。
    *   (Post-MVP) Slash commands 和上下文菜单的具体实现方式和交互细节。
    *   (Post-MVP) 流式响应的处理机制和后端支持情况 (不确定)。
    *   后端 API 的确切 endpoint 和请求/响应结构。

### VI. 查重器 (Plagiarism Checker)

**(优先级 Post-MVP P3)**

1.  **功能概述:**
    用户提交文本后，系统调用后端服务进行查重，并在完成后显示一份报告，包括相似度分数和可能的来源链接，同时在原文中高亮显示相似片段。

2.  **详细功能描述:**
    *   **UI 展示:**
        *   包含一个文本输入区域。
        *   提供一个 "检查查重 (Check Plagiarism)" 按钮。
        *   在检查进行时，显示明确且持续的等待状态反馈：
            *   一个进度条（即使是非线性的，表示阶段，如 "提交中", "比对中", "生成报告"）。
            *   伴随的文本说明，例如 "正在进行查重检查（可能需要几分钟）..."。
        *   检查完成后，结果显示在主界面内的一个专门区域（例如，一个新的 Tab 或面板），而不是新窗口。
        *   在原文输入区域，使用背景高亮标记检测到的相似文本片段。
        *   当用户鼠标悬停或点击高亮片段时，显示一个 Popover/Tooltip，包含匹配百分比和检测到的来源 URL（如果后端提供）。URL 应可点击，在新标签页打开。
        *   (可选) 如果检查时间较长（例如 > 30秒），提供一个选项让用户允许在检查完成时接收浏览器通知 (需要 Notification API 权限)。
    *   **交互流程:**
        *   用户在输入区输入或粘贴文本。
        *   用户点击 "检查查重" 按钮。按钮进入加载状态，进度条和状态文本开始显示。
        *   系统开始后台处理（通过 API 调用）。
        *   前端通过轮询 (Polling) 或 实时订阅 (Realtime Subscription) 机制更新进度状态。
        *   (可选) 如果用户启用了通知，在完成后触发浏览器通知。
        *   检查完成后：
            *   进度条达到 100% 或显示完成状态。
            *   结果报告区域变为可见，并填充内容。
            *   原文区域的相应片段被高亮。
            *   按钮恢复可用状态。
        *   用户将鼠标悬停或点击高亮片段，查看来源详情 Popover。
        *   用户点击来源 URL，在新标签页打开。
    *   **逻辑功能:**
        *   维护输入文本状态。
        *   "检查查重" 按钮点击逻辑：
            *   获取输入文本。
            *   调用后端启动查重任务的 API（例如 `/api/plagiarism/check` - POST），发送文本。
            *   API 应立即返回一个 `jobId`。
            *   进入等待状态，显示进度条和状态文本。
        *   状态监控逻辑（选择其一）：
            *   **轮询 (Polling):** 使用 `jobId` 定期（例如每 5-10 秒）调用后端状态检查 API（例如 `/api/plagiarism/results/{jobId}` - GET）。根据响应更新进度 UI。
            *   **实时订阅 (Realtime - Preferred):** 使用 `jobId` 通过 Supabase Realtime 订阅与该任务相关的更新。后端任务完成或更新进度时，会推送消息给前端，前端据此更新进度 UI。
        *   结果处理逻辑：
            *   当监控到任务状态为 'completed' 时，从状态检查 API 获取最终结果（包含相似度分数、片段位置、来源 URL 等）。
            *   解析结果数据。
            *   根据片段位置信息，在原文输入区域应用背景高亮样式。
            *   将结果数据填充到报告显示区域。
            *   将来源信息与高亮区域关联，用于 Popover 显示。
        *   (可选) 实现浏览器通知逻辑，检查权限并在获得权限且任务完成时触发通知。
        *   处理 API 调用过程中的错误。

3.  **数据模型（API 相关）:**
    *   请求 `/api/plagiarism/check` (POST):
        *   `text: string`
    *   响应 `/api/plagiarism/check`:
        *   `jobId: string`
    *   请求 `/api/plagiarism/results/{jobId}` (GET): (用于轮询或获取最终结果)
    *   响应 `/api/plagiarism/results/{jobId}`:
        *   `status: 'pending' | 'processing' | 'completed' | 'failed'`
        *   `progress?: number` (0-100)
        *   `stage?: string` (e.g., "submitting", "comparing", "reporting")
        *   `results?: { overallScore: number, segments: Array<{ start: number, end: number, matchPercentage: number, sourceUrl: string | null }> }` (仅在 status 为 completed 时)
        *   `error?: string` (仅在 status 为 failed 时)
    *   (Realtime) Supabase Realtime 消息结构 (待定，应类似 GET 响应)

4.  **不确定的技术细节:**
    *   后端 API 的确切 endpoints 和响应结构，特别是 `results` 对象的详细字段。
    *   进度条是模拟的（基于阶段）还是后端能提供精确百分比 (不确定)。
    *   实时订阅的具体实现细节（Supabase Channel/Event 命名等）。
    *   浏览器通知的具体触发条件和用户体验。

### VII. 通用 UI/UX 要求

1.  **详细功能描述:**
    *   **UI 展示:**
        *   遵循提供的 Figma 设计稿或样式指南。确保颜色（主色、辅色）、字体（Inter, Lato 或指定）、图标集（Feather, Material Symbols 或指定）、边框圆角、插画风格等符合 "简洁、现代、可信赖" 的品牌形象。
        *   应用 Tailwind CSS 进行样式开发。
        *   使用 Headless UI 或 Radix UI 构建基础组件（下拉菜单、模态框、滑块、Popover 等），然后使用 Tailwind 定制样式。
        *   在所有需要等待 AI 响应（预计 > 200ms）的操作处，立即显示加载状态（文本区域使用骨架屏，按钮使用 Spinner 并禁用）。
        *   实现响应式设计，适配标准 Tailwind 断点 (sm, md, lg, xl, 2xl)。提供移动端视图下的特定布局调整（例如，Paraphraser 模式按钮收起到下拉菜单，主导航变为汉堡菜单或底部栏，Dashboard 元素垂直堆叠）。
        *   输入框附近实时显示字数/字符数统计和限制（例如 "120 / 500 words"）。
    *   **交互流程:**
        *   确保所有交互元素（按钮、链接、输入框、滑块、自定义组件）都可通过键盘访问（Tab 导航、Enter/Space 激活）并具有清晰的焦点状态 (focus ring)。
        *   AI 功能的整体响应时间（从用户触发到显示结果）目标为 3-5 秒，前端加载状态需覆盖此等待时间。
        *   实现统一的错误提示机制：使用 Toast 通知库 (如 react-hot-toast) 处理非阻塞性 API 错误或操作成功反馈；在表单字段旁显示具体的验证错误信息；为严重错误（如页面数据加载失败）提供专门的错误状态展示。
        *   当用户操作达到其账户等级的限制时（基于前端计数或后端错误响应），在相关功能区域（如下方 Banner 或 Modal）显示清晰的提示信息，解释限制并提供指向 `/pricing` 或 `/upgrade` 页面的升级按钮 (CTA)。
    *   **逻辑功能:**
        *   采用 Next.js 框架。利用其特性优化性能：自动代码分割、`next/image` 优化图片、适当使用 ISR/SSR/SSG。
        *   确保选择的 RTE 库及其插件按需加载，避免影响初始页面加载性能。
        *   遵循 WCAG 2.1 AA 可访问性标准：使用语义化 HTML 标签 (`<button>`, `<nav>`, `<main>` 等)；在必要时使用 ARIA 属性增强自定义组件的可访问性；确保足够的颜色对比度。
        *   实现客户端字数/字符数实时计数逻辑。
        *   实现统一的错误处理函数或 Context，用于捕获和显示来自 API 或客户端逻辑的错误。
        *   使用 i18n 库（如 `next-intl` 或 `react-i18next`）管理所有面向用户的字符串，即使 MVP 仅支持英文。将字符串存储在 locale 文件（如 `en.json`）中。

2.  **不确定的技术细节:**
    *   Figma 设计稿或详细样式指南的具体内容 (需尽快提供)。
    *   最终确认使用的 Headless UI 库 (Headless UI vs Radix UI) 或完整组件库 (MUI, Chakra UI)。
    *   具体使用的 Toast 通知库。
    *   具体使用的 i18n 库。

### VIII. 用户账户与订阅系统

1.  **功能概述:**
    提供用户注册、登录、密码重置功能。集成支付系统处理订阅升级，并根据用户订阅状态控制功能访问权限和使用限制。提供用户中心管理账户和订阅信息。

2.  **详细功能描述:**
    *   **UI 展示:**
        *   标准的登录、注册页面（邮箱/密码）。
        *   密码重置请求页面和密码重置页面。
        *   用户中心 (Dashboard) 页面，显示用户邮箱、当前订阅计划（Free/Premium）、用量信息（如果适用）、订阅到期日期（如果适用）。
        *   提供修改密码的功能入口。
        *   提供管理订阅的按钮（例如 "升级到 Premium", "管理账单" - 指向 Stripe 客户门户）。
        *   在 `/pricing` 或 `/upgrade` 页面，嵌入 Stripe Elements 提供的安全支付表单，用于输入信用卡信息。
        *   支付过程中的加载和反馈信息（成功、失败）。
    *   **交互流程:**
        *   用户通过邮箱密码注册或登录。通过 Supabase Auth 处理流程。
        *   用户请求密码重置，通过邮件链接完成重置。
        *   用户访问用户中心查看信息。
        *   用户点击升级按钮，被引导至包含 Stripe 支付表单的页面。
        *   用户在 Stripe Elements 表单中输入支付信息并提交。前端将获得的 token 或 intent ID 发送给后端处理。
        *   支付成功后，用户可能被重定向回应用，或者前端轮询/监听状态更新。前端需要重新获取用户的最新订阅状态。
        *   用户的 Premium 功能被解锁，用量限制更新。
        *   用户点击 "管理账单" 按钮，被重定向到 Stripe 客户门户 (由后端配置生成链接)。
    *   **逻辑功能:**
        *   集成 Supabase Auth UI 组件或使用 Supabase Auth JavaScript 库实现自定义的登录/注册/密码重置流程。
        *   在需要身份验证的页面或 API 请求中，使用 Supabase 管理的用户会话 (JWT)。
        *   集成 `@stripe/react-stripe-js` 和 Stripe Elements，安全地收集支付信息。
        *   在提交支付时，调用后端 API（例如 `/api/payments/create-subscription` 或 `/api/payments/create-payment-intent`）来处理与 Stripe 的交互。
        *   支付完成后，通过某种机制（例如，Stripe 重定向后检查 URL 参数，或监听 Webhook 触发的数据库更新后刷新状态）确认支付成功，并从 Supabase 获取用户最新的订阅状态（例如，检查用户表中的 `premium_status` 字段）。
        *   根据用户的订阅状态，在前端：
            *   显示/隐藏 Premium 功能的 UI 元素。
            *   更新显示的用量限制数字。
            *   在执行操作前检查是否超出限制（主要依赖后端强制执行，前端为辅助）。
        *   调用后端 API 获取 Stripe 客户门户的链接。

3.  **数据模型（涉及用户状态）:**
    *   用户状态 (可能通过 Supabase Auth 获取并存储在 Context/State): `userId: string`, `email: string`, `subscriptionTier: 'free' | 'premium'`, `subscriptionExpiry?: timestamp`, `usageLimits: { paraphraseWords: number, grammarChecks: number, ... }` (具体限制待定)。

4.  **不确定的技术细节:**
    *   后端用于处理支付和生成 Stripe 客户门户链接的具体 API endpoints 和契约。
    *   支付成功后，前端更新用户状态的具体机制（Webhook + Realtime vs. Redirect + Check）。
    *   Free/Premium 各自包含的具体功能和量化限制 (需在 Supabase DB 定义清楚)。
    *   MVP 阶段是否包含真实的 Stripe 集成，或仅为手动切换用户状态 (根据 PRD 补充，MVP 无支付集成)。

### IX. 技术栈与非功能性要求

1.  **概述:**
    明确前端使用的核心技术、开发规范和非功能性目标。

2.  **详细描述:**
    *   **技术栈:**
        *   框架: Next.js (App Router 或 Pages Router - (需确认))
        *   样式: Tailwind CSS
        *   组件库: Headless UI 或 Radix UI (首选) + Tailwind, 或备选 MUI/Chakra UI (需评估团队熟悉度)。
        *   状态管理: React Context API + useState/useReducer (起步), Zustand 或 Redux Toolkit (备选，视复杂度增长)。
        *   RTE: TipTap 或 Lexical (需最终确认)。
        *   表单处理: React Hook Form (推荐)。
        *   数据请求: Fetch API 或 SWR/React Query (推荐)。
        *   测试: Vitest/Jest + React Testing Library (单元/集成), Playwright/Cypress (E2E)。
        *   语言: TypeScript (强制)。
    *   **非功能性要求:**
        *   **安全性:**
            *   使用 DOMPurify 清理任何直接插入 DOM 的 AI 生成内容或用户输入（如果必须使用 `dangerouslySetInnerHTML`）。
            *   所有 API 请求使用 HTTPS。
            *   不将敏感用户输入持久化存储在前端 (localStorage)。
            *   依赖 Supabase Auth 进行安全的认证和会话管理。
        *   **可维护性:**
            *   强制使用 ESLint 和 Prettier，共享配置 (例如 airbnb-typescript + prettier)，并通过 pre-commit hooks 强制执行。
            *   所有代码合并请求 (Pull Requests) 必须经过代码审查 (Code Review)。
            *   代码结构清晰，遵循模块化原则。
        *   **性能:**
            *   页面加载性能目标：LCP < 2.5s, FID < 100ms, CLS < 0.1 (Core Web Vitals)。
            *   AI 功能响应时间目标：3-5s (端到端)。
        *   **可访问性:** WCAG 2.1 Level AA。
        *   **测试:**
            *   关键业务逻辑、核心组件、Hooks、工具函数需要有单元/集成测试覆盖。
            *   关键用户流程（如登录、核心改写流程、升级路径 - Post-MVP）需要有 E2E 测试覆盖（MVP 阶段也需要基础 E2E）。

3.  **不确定的技术细节:**
    *   Next.js 使用 App Router 还是 Pages Router。
    *   最终确认的 UI 组件库/方案。
    *   最终确认的 RTE 库。
    *   具体的 ESlint/Prettier 配置规则。

---