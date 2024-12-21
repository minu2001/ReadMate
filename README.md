# ReadMate
"NAVER_API" 와 "OPENAI_API"를 사용해 만든 사용자 맞춤형 북 서칭 웹사이트

### 개발 목적
1. 독서는 숏폼과 같은 온라인 콘텐츠에 비해 독서는 시간과 집중력이 많이 요구되고 즉각적인 보상이나 자극을 느끼기 어렵기 때문에 부담을 가지게 되는 현실입니다. 저희는 독서시간을 어쩔 수 없다면 독서를 하기까지 걸리는 시간을 단축하고자 하는 목표를 잡았습니다.

### 프로젝트 개요
1. “ReadMate”는 네이버 북 API를 사용하여 Google API보다 한국어 검색에 더 최적화된 결과를 제공하는 것을 바탕으로 한국인 사용자를 타겟으로 제작되었습니다.
2. 또한, OpenAI API와 접목시켜 단순한 책 검색 기능을 넘어 사용자의 취향과 관심사를 반영한 맞춤형 책 추천 기능을 제공합니다. 이를 통해 사용자들은 책 선택에 소요되는 시간과 고민을 줄일 수 있으며, 더욱 만족도 높은 독서 경험을 누릴 수 있습니다.

### 기대효과
1. 한국어 기반 최적화된 책 검색
2. 맞춤형 AI 추천을 통한 독서 경험 향상
3. 독서에 대한 흥미와 접근성 증가
4. 시간과 비용 절약
5. 개인화된 데이터 활용의 가능성

## 사용기술 스택
1. FrontEnd
   - HTML ![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
   - CSS ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
   - JavaScript ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

2. BackEnd
   - Python ![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
   - Flask ![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white)

3. 사용 API
   - Naver Book API
   - OpenAI API ![ChatGPT](https://img.shields.io/badge/chatGPT-74aa9c?style=for-the-badge&logo=openai&logoColor=white)
  
# 실행화면
![alt text](.DemoScreen/MainPage1.png)

#소스코드
## Flask서버를 사용한 Backend APP.py
### CORS에러를 우회하기 위해 flask서버 활용.
### MainPage에 필요한 정보를 불러오는 소스코드드(NaverAPI)
```python
    headers = {
        "X-Naver-Client-Id": CLIENT_ID,
        "X-Naver-Client-Secret": CLIENT_SECRET
    }
    params = {
        "query": query,
        "display": 21
    }

    response = requests.get(NAVER_BOOK_API_URL, headers=headers, params=params)
    if response.status_code == 200:
        data = response.json()

        # 필요한 데이터만 추출 (저자, 출판사, 링크, 이미지 등)
        for item in data.get('items', []):
            item['author'] = item.get('author', '저자 정보 없음')
            item['publisher'] = item.get('publisher', '출판사 정보 없음')
            item['description'] = item.get('description', '').replace('<b>', '').replace('</b>', '')
        return jsonify(data)
    else:
        return jsonify({'error': '네이버 API 호출 실패', 'status_code': response.status_code}), 500

@app.route('/detail', methods=['GET'])
def book_detail():
    link = request.args.get('link')  # 네이버 링크를 쿼리 파라미터로 전달
    if link:
        return redirect(link)  # 네이버 링크로 리다이렉트
    else:
        return "잘못된 요청입니다. 링크가 없습니다.", 400
```
## AI책 추천부분(OpenAI API)
#### assistant에 지침을 주고 사용자의 입력에 기본 입력값을 설정
```python
    if not query:
        return jsonify({'error': '검색어를 입력해주세요.'}), 400

    try:
        # OpenAI 최신 API 호출
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant for recommending books."},
                {"role": "user", "content": f"책 추천: {query}"}
            ],
            max_tokens=1000,
            temperature=0.7,
        )
```
## NaverAPI
### 한국인을 타깃하여 사용한 책 검색 API<br>

- 책 검색결과를 나타내게 만든 JavaScript 부분.
```javascript
        const gridContainer = document.createElement('div');
        gridContainer.classList.add('results-grid');

        data.items.slice(1).forEach((book) => {
            const bookDiv = document.createElement('div');
            bookDiv.classList.add('book');

            const img = document.createElement('img');
            img.src = book.image || '/static/img/NoPhoto.avif';
            img.alt = book.title || '이미지 없음';
            img.style.cursor = 'pointer';
            img.onclick = () => {
                window.location.href = book.link; // 이미지 클릭 시 상세 링크로 이동
            };

            const title = document.createElement('h3');
            title.textContent = book.title || '제목 없음';

            const author = document.createElement('p');
            author.textContent = `저자: ${book.author}`;
            const publisher = document.createElement('p');
            publisher.textContent = `출판: ${book.publisher}`;

            bookDiv.appendChild(img);
            bookDiv.appendChild(title);
            bookDiv.appendChild(author);
            bookDiv.appendChild(publisher);
            gridContainer.appendChild(bookDiv);
        });

        resultsContainer.appendChild(gridContainer);
    }
});
```
# OPEN AI 
## OPEN AI 를 사용해 사용자 맞춤형 질문에 응답.<br>

- 사용자의 입력부분을 OpenAi API를 사용해 텍스트 형태의 출력값을 가져옴
```javascript
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
```

### 개발과정중 문제
#### app.py(동적 파일) 파일의 역할은 아래와 같다.
- Flask 서버 실행: 클라이언트 요청을 처리하는 웹 서버를 실행.(cors문제로 인해서 사용)
- 책 검색 기능: 네이버 북 API를 호출해 검색 결과를 반환.
- AI 추천 기능: OpenAI API를 호출해 사용자 취향에 맞는 책 추천 결과를 반환.

#### CORS란?
CORS (Cross-Origin Resource Sharing)
보안상의 이유로 다른 출처의 리소스 요청을 제한하는 브라우저 정책 입니다.

클라이언트(프론트엔드)가 localhost:3000에서 실행 중인데,
외부 서버(API)로 바로 요청을 보내면 브라우저가 이를 차단함.
- 예를 들어, 네이버 API는 https://openapi.naver.com이라는 도메인에 있을 때, 너의 웹 애플리케이션이 실행되는 도메인이 http://localhost:5000이라면, 브라우저는 서로 다른 도메인 간 요청을 "의심스러운 행동"으로 간주합니다.

#### Flask 서버를 도입해서 문제를 해결
중간 서버(Proxy) 역할을 수행.
클라이언트(브라우저)가 Flask 서버로 요청 → Flask 서버가 외부 API에 요청 → 응답을 받아 클라이언트에 전달.
이를 통해 CORS 문제를 우회할 수 있음.


