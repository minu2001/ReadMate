document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendMessageBtn = document.getElementById('sendMessageBtn');

    // 메시지 추가 함수
    function addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message', sender);
        messageDiv.innerText = content; // innerText로 줄바꿈 포함
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight; // 스크롤 하단으로 이동
    }

    // 메시지 전송 함수
    async function sendMessage() {
        const userMessage = chatInput.value.trim();
        if (!userMessage) return;

        addMessage(userMessage, 'user'); // 사용자 메시지 추가
        chatInput.value = ''; // 입력창 초기화

        try {
            const response = await fetch('/openai-search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: userMessage }),
            });

            if (!response.ok) throw new Error(`서버 오류: ${response.status}`);
            const data = await response.json();

            if (data.response) {
                addMessage(data.response, 'assistant'); // OpenAI 응답 추가
            } else {
                throw new Error('OpenAI 응답 없음');
            }
        } catch (error) {
            console.error('오류:', error);
            addMessage('오류가 발생했습니다. 다시 시도해주세요.', 'assistant');
        }
    }

    // 버튼 클릭 및 엔터 키 이벤트 추가
    sendMessageBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });
});
