const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

const SYSTEM_PROMPT = `You are a compassionate mental health support assistant for MindCheck, a mental wellness platform in Sri Lanka. Your role is to:

1. Provide empathetic, non-judgmental support
2. Listen actively and validate feelings
3. Offer coping strategies and wellness tips
4. Guide users to appropriate resources
5. Detect crisis situations and provide emergency contacts

IMPORTANT GUIDELINES:
- You are NOT a therapist or medical professional
- Always recommend professional help for serious issues
- Keep responses concise (2-3 paragraphs max)
- Use simple, clear language
- Respect cultural context (Sri Lankan users)
- Be warm and supportive

CRISIS KEYWORDS: If user mentions suicide, self-harm, "kill myself", "end it all", or similar:
- Immediately express concern
- Provide emergency contacts:
  * National Mental Health Helpline: 1926 (24/7, Free)
  * CCCline: 1333 (24/7, Toll-free)
  * Emergency Services: 110
- Encourage them to reach out for immediate help

Remember: You're here to support, not diagnose or treat.`;

const CRISIS_KEYWORDS = [
    'suicide', 'kill myself', 'end my life', 'want to die',
    'self harm', 'hurt myself', 'end it all', 'no reason to live'
];

export function detectCrisis(message) {
    const lowerMessage = message.toLowerCase();
    return CRISIS_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
}

export async function sendChatMessage(userMessage, conversationHistory = []) {
    if (!GEMINI_API_KEY) {
        throw new Error('Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your .env file.');
    }

    try {
        // Build conversation context
        const messages = [
            { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
            { role: 'model', parts: [{ text: 'I understand. I will be a compassionate mental health support assistant, following all the guidelines you provided.' }] },
            ...conversationHistory.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            })),
            { role: 'user', parts: [{ text: userMessage }] }
        ];

        const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: messages,
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 500,
                }
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Failed to get response from AI');
        }

        const data = await response.json();
        const aiResponse = data.candidates[0]?.content?.parts[0]?.text;

        if (!aiResponse) {
            throw new Error('No response from AI');
        }

        return aiResponse;
    } catch (error) {
        console.error('Chatbot API error:', error);
        throw error;
    }
}

export function getQuickActions() {
    return [
        {
            id: 'crisis',
            label: "I'm in crisis",
            icon: '🆘',
            response: `I'm really concerned about you. Please reach out for immediate help:

📞 **National Mental Health Helpline: 1926** (24/7, Free)
📞 **CCCline: 1333** (24/7, Toll-free)
🚨 **Emergency Services: 110**

You don't have to face this alone. These trained professionals are ready to help you right now.`
        },
        {
            id: 'anxious',
            label: 'Feeling anxious',
            icon: '😰',
            response: `I hear you. Anxiety can be really overwhelming. Let's try a quick breathing exercise:

**4-7-8 Breathing:**
1. Breathe in through your nose for 4 counts
2. Hold for 7 counts
3. Exhale slowly through your mouth for 8 counts
4. Repeat 3-4 times

This can help calm your nervous system. Would you like to talk about what's making you anxious?`
        },
        {
            id: 'resources',
            label: 'Need resources',
            icon: '📚',
            response: `I can help you find resources! MindCheck offers:

🧠 **Mental Health Assessment** - Understand your current state
📊 **Progress Tracker** - Monitor your wellness journey
📚 **Resources** - Professional mental health resources for Sri Lanka

What kind of support are you looking for?`
        },
        {
            id: 'assessment',
            label: 'Take assessment',
            icon: '📝',
            response: `Taking a mental health assessment is a great step! Our quiz can help you understand your current mental wellness.

It takes about 5-10 minutes and covers areas like mood, anxiety, and stress. Your responses are completely private and stored only on your device.

Would you like me to guide you to the assessment?`
        }
    ];
}
