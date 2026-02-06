import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
    AIConfig,
    AIMessage,
    AIResponse,
    AIProvider,
} from './ai.d';

/**
 * AI 客户端 - 统一的 AI 调用接口
 * 支持 OpenAI、Anthropic 和 Gemini
 */
export class AIClient {
    private config: AIConfig;

    constructor(config: AIConfig) {
        this.config = config;
    }

    /**
     * 发送聊天消息
     * @param messages 消息列表
     * @param onStream 流式响应回调
     * @returns AI 响应
     */
    async chat(
        messages: AIMessage[],
        onStream?: (chunk: string) => void
    ): Promise<AIResponse> {
        try {
            switch (this.config.provider) {
                case AIProvider.OPENAI:
                    return await this.chatWithOpenAI(messages, onStream);
                case AIProvider.ANTHROPIC:
                    return await this.chatWithAnthropic(messages, onStream);
                case AIProvider.GEMINI:
                    return await this.chatWithGemini(messages, onStream);
                default:
                    return {
                        success: false,
                        content: '',
                        error: '未知的 AI 提供商',
                    };
            }
        } catch (error: any) {
            console.error('AI 调用失败:', error);
            return {
                success: false,
                content: '',
                error: error.message || '调用 AI 服务失败',
            };
        }
    }

    /**
     * 使用 OpenAI API
     */
    private async chatWithOpenAI(
        messages: AIMessage[],
        onStream?: (chunk: string) => void
    ): Promise<AIResponse> {
        const client = new OpenAI({
            apiKey: this.config.apiKey,
            baseURL: this.config.baseURL,
            dangerouslyAllowBrowser: true, // 允许在浏览器中使用
        });

        if (onStream) {
            // 流式响应
            const stream = await client.chat.completions.create({
                model: this.config.model,
                messages: messages.map((msg) => ({
                    role: msg.role,
                    content: msg.content,
                })),
                stream: true,
            });

            let fullContent = '';
            for await (const chunk of stream) {
                const content = chunk.choices[0]?.delta?.content || '';
                if (content) {
                    fullContent += content;
                    onStream(content);
                }
            }

            return {
                success: true,
                content: fullContent,
            };
        } else {
            // 非流式响应
            const response = await client.chat.completions.create({
                model: this.config.model,
                messages: messages.map((msg) => ({
                    role: msg.role,
                    content: msg.content,
                })),
            });

            return {
                success: true,
                content: response.choices[0]?.message?.content || '',
            };
        }
    }

    /**
     * 使用 Anthropic API
     */
    private async chatWithAnthropic(
        messages: AIMessage[],
        onStream?: (chunk: string) => void
    ): Promise<AIResponse> {
        const client = new Anthropic({
            apiKey: this.config.apiKey,
            baseURL: this.config.baseURL,
            dangerouslyAllowBrowser: true,
        });

        // 提取系统消息
        const systemMessage = messages.find((msg) => msg.role === 'system');
        const userMessages = messages.filter((msg) => msg.role !== 'system');

        if (onStream) {
            // 流式响应
            const stream = await client.messages.create({
                model: this.config.model,
                max_tokens: 4096,
                system: systemMessage?.content,
                messages: userMessages.map((msg) => ({
                    role: msg.role as 'user' | 'assistant',
                    content: msg.content,
                })),
                stream: true,
            });

            let fullContent = '';
            for await (const event of stream) {
                if (
                    event.type === 'content_block_delta' &&
                    event.delta.type === 'text_delta'
                ) {
                    const content = event.delta.text;
                    fullContent += content;
                    onStream(content);
                }
            }

            return {
                success: true,
                content: fullContent,
            };
        } else {
            // 非流式响应
            const response = await client.messages.create({
                model: this.config.model,
                max_tokens: 4096,
                system: systemMessage?.content,
                messages: userMessages.map((msg) => ({
                    role: msg.role as 'user' | 'assistant',
                    content: msg.content,
                })),
            });

            const content =
                response.content[0]?.type === 'text' ? response.content[0].text : '';

            return {
                success: true,
                content,
            };
        }
    }

    /**
     * 使用 Gemini API
     */
    private async chatWithGemini(
        messages: AIMessage[],
        onStream?: (chunk: string) => void
    ): Promise<AIResponse> {
        const genAI = new GoogleGenerativeAI(this.config.apiKey);
        const model = genAI.getGenerativeModel({ model: this.config.model });

        // Gemini 需要特殊的消息格式
        const systemMessage = messages.find((msg) => msg.role === 'system');
        const chatMessages = messages.filter((msg) => msg.role !== 'system');

        // 转换消息格式
        const history = chatMessages.slice(0, -1).map((msg) => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }],
        }));

        const lastMessage = chatMessages[chatMessages.length - 1];

        const chat = model.startChat({
            history,
            systemInstruction: systemMessage?.content,
        });

        if (onStream) {
            // 流式响应
            const result = await chat.sendMessageStream(lastMessage.content);

            let fullContent = '';
            for await (const chunk of result.stream) {
                const content = chunk.text();
                fullContent += content;
                onStream(content);
            }

            return {
                success: true,
                content: fullContent,
            };
        } else {
            // 非流式响应
            const result = await chat.sendMessage(lastMessage.content);
            const response = await result.response;

            return {
                success: true,
                content: response.text(),
            };
        }
    }

    /**
     * 获取可用模型列表
     */
    async getModels(): Promise<string[]> {
        try {
            switch (this.config.provider) {
                case AIProvider.OPENAI:
                    const client = new OpenAI({
                        apiKey: this.config.apiKey,
                        baseURL: this.config.baseURL,
                        dangerouslyAllowBrowser: true,
                    });
                    const response = await client.models.list();
                    return response.data.map(m => m.id);
                default:
                    return [];
            }
        } catch (error) {
            console.error('获取模型列表失败:', error);
            // 失败时返回空数组，UI层可以使用默认列表
            return [];
        }
    }

    /**
     * 测试连接
     */
    async testConnection(): Promise<AIResponse> {
        return await this.chat([
            {
                role: 'user',
                content: '你好，请回复"连接成功"',
            },
        ]);
    }
}

/**
 * 创建 AI 客户端实例
 */
export function createAIClient(config: AIConfig): AIClient {
    return new AIClient(config);
}
